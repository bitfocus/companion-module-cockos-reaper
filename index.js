var instance_skel = require('../../instance_skel');
var OSC           = require('osc');
var actions       = require('./actions');
var feedbacks     = require('./feedback');
var variables     = require('./variables');
var presets       = require('./presets');

var debug;
var log;

function instance(system, id, config) {
	var self = this;
	// super-constructor
	instance_skel.apply(this, arguments);

	Object.assign(this, {...variables, ...actions, ...presets, ...feedbacks});

	self.actions(); // export actions
	return self;
}

instance.prototype.updateConfig = function (config) {
	var self = this;

	self.config = config;
	self.init_presets();
	self.init_variables();
	self.init_feedbacks();
	self.init_osc();
};

instance.prototype.init = function () {
	var self = this;
	self.status(self.STATE_OK); // report status ok!
	self.init_presets();
	self.init_variables();
	self.init_feedbacks();
	self.init_osc();
	debug = self.debug;
	log   = self.log;
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type:  'text',
			id:    'info',
			width: 12,
			label: 'Information',
			value: 'This module controls <a href="https://www.reaper.fm" target="_new">REAPER</a>.'
		},
		{
			type:    'textinput',
			id:      'host',
			label:   'Target IP',
			width:   6,
			tooltip: 'The IP of the computer running REAPER',
			regex:   self.REGEX_IP
		},
		{
			type:    'textinput',
			id:      'port',
			label:   'Target Port',
			width:   3,
			tooltip: 'The port REAPER is listening to OSC on',
			regex:   self.REGEX_SIGNED_NUMBER
		},
		{
			type:    'textinput',
			id:      'feedbackPort',
			label:   'Feedback Port',
			width:   3,
			tooltip: 'The port REAPER is sending OSC to',
			regex:   self.REGEX_SIGNED_NUMBER
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function () {
	var self = this;
	debug("destory", self.id);
};

instance.prototype.init_presets = function () {
	var self    = this;
	var presets = self.getPresets();
	self.setPresetDefinitions(presets);
}

instance.prototype.actions = function (system) {
	var self    = this;
	var actions = self.getActions();

	self.setActions(actions);
}

instance.prototype.action = function (action) {
	var self    = this;
	var cmd, args;
	[cmd, args] = self.getCommand(action)
	if (cmd !== undefined) {
		debug('sending', cmd, args, "to", self.config.host);
		self.oscSend(self.config.host, self.config.port, cmd, args);
	}
};

instance.prototype.init_osc = function () {
	var self   = this;
	self.ready = true;

	if (self.listener) {
		self.listener.close();
	}

	self.listener = new OSC.UDPPort({
		localAddress: '0.0.0.0',
		localPort:    self.config.feedbackPort,
		broadcast:    true,
		metadata:     true
	});

	self.listener.open();

	self.listener.on("ready", function () {
		self.ready = true;
	});
	self.listener.on("error", function (err) {
		if (err.code === "EADDRINUSE") {
			self.log('error', "Error: Selected port in use." + err.message);
		}
	});

	self.listener.on("message", function (message) {
			if (self.customMessageStatus === undefined) {
				self.customMessageStatus = {}
			}
			var customMessageFound = false
			self.customMessages.forEach(function (customMessage, index) {
				if (!customMessageFound &&
					customMessage.address === message.address &&
					customMessage.args.type === message.args[0].type &&
					customMessage.args.value === message.args[0].value
				) {
					self.customMessageStatus[customMessage.id] = message.args[0].value
					self.setVariable('customFeedback' + index, self.customMessageStatus[customMessage.id])
					self.checkFeedbacks('customMessage');
					debug("Custom Feedback " + index + " is", self.customMessageStatus[customMessage.id])
					customMessageFound = true;
				}
			});

			if (message.address === '/play') {
				if (message.args.length >= 0) {
					var togglePlayStatus = message.args[0].value;
					if (typeof togglePlayStatus === "number") {
						if (togglePlayStatus === 1) {
							self.playStatus = "Playing";
						} else {
							self.playStatus = "Paused";
						}
						self.setVariable('playStatus', self.playStatus);
						self.checkFeedbacks('playStatus');
						debug("togglePlayStatus is", togglePlayStatus)
						debug("playStatus is", self.playStatus)
					}
				}
			}
			if (message.address === '/stop') {
				if (message.args.length >= 0) {
					var toggleStopStatus = message.args[0].value;
					if (typeof toggleStopStatus === "number") {
						if (toggleStopStatus === 1) {
							self.stopStatus = "Stopped";
						} else {
							self.stopStatus = "Playing";
						}
						self.setVariable('stopStatus', self.stopStatus);
						self.checkFeedbacks('stopStatus');
						debug("toggleStopStatus is", toggleStopStatus)
						debug("stopStatus is", self.stopStatus)
					}
				}
			}
			if (message.address === '/record') {
				if (message.args.length >= 0) {
					var toggleRecordStatus = message.args[0].value;
					if (typeof toggleRecordStatus === "number") {
						if (toggleRecordStatus === 1) {
							self.recordStatus = "Recording";
						} else {
							self.recordStatus = "Not Recording";
						}
						self.setVariable('recordStatus', self.recordStatus);
						self.checkFeedbacks('recordStatus');
						debug("toggleRecordStatus is", toggleRecordStatus)
						debug("recordStatus is", self.recordStatus)
					}
				}
			}
			if (message.address === '/rewind') {
				if (message.args.length >= 0) {
					var toggleRewindStatus = message.args[0].value;
					if (typeof toggleRewindStatus === "number") {
						if (toggleRewindStatus === 1) {
							self.rewindStatus = "Rewinding";
						} else {
							self.rewindStatus = "Not Rewinding";
						}
						self.setVariable('rewindStatus', self.rewindStatus);
						self.checkFeedbacks('rewindStatus');
						debug("toggleRewindStatus is", toggleRewindStatus)
						debug("rewindStatus is", self.rewindStatus)
					}
				}
			}
			if (message.address === '/forward') {
				if (message.args.length >= 0) {
					var toggleForwardStatus = message.args[0].value;
					if (typeof toggleForwardStatus === "number") {
						if (toggleForwardStatus === 1) {
							self.forwardStatus = "Forwarding";
						} else {
							self.forwardStatus = "Not Forwarding";
						}
						self.setVariable('forwardStatus', self.forwardStatus);
						self.checkFeedbacks('forwardStatus');
						debug("toggleForwardStatus is", toggleForwardStatus)
						debug("forwardStatus is", self.forwardStatus)
					}
				}
			}
			if (message.address === '/click') {
				if (message.args.length >= 0) {
					var toggleClickStatus = message.args[0].value;
					if (typeof toggleClickStatus === "number") {
						if (toggleClickStatus === 1) {
							self.clickStatus = "Active";
						} else {
							self.clickStatus = "Inactive";
						}
						self.setVariable('clickStatus', self.clickStatus);
						self.checkFeedbacks('clickStatus');
						debug("toggleClickStatus is", toggleClickStatus)
						debug("clickStatus is", self.clickStatus)
					}
				}
			}
			if (message.address === '/repeat') {
				if (message.args.length >= 0) {
					var toggleRepeatStatus = message.args[0].value;
					if (typeof toggleRepeatStatus === "number") {
						if (toggleRepeatStatus === 1) {
							self.repeatStatus = "Active";
						} else {
							self.repeatStatus = "Inactive";
						}
						self.setVariable('repeatStatus', self.repeatStatus);
						self.checkFeedbacks('repeatStatus');
						debug("toggleRepeatStatus is", toggleRepeatStatus)
						debug("repeatStatus is", self.repeatStatus)
					}
				}
			}
		}
	)
}

instance.prototype.init_variables = function () {
	var self      = this;
	var variables = self.getVariables();
	self.setVariableDefinitions(variables);
}

instance.prototype.init_feedbacks = function () {
	var self      = this
	var feedbacks = self.getFeedbacks();
	self.setFeedbackDefinitions(feedbacks)
}

instance_skel.extendedBy(instance);
exports = module.exports = instance;