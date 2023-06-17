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

	if (self.config.refreshOnInit) {
		debug("Sending control surface refresh action to " + self.config.host);
		self.system.emit('osc_send', self.config.host, self.config.port, '/action/41743');
	}
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
		},
		{
			type:    'checkbox',
			id:      'refreshOnInit',
			label:   'Refresh On Start',
			tooltip: 'If enabled, a "Control surface: Refresh all surfaces" command will be sent to reaper on start.',
			default: false,
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

	self.messageHandlers = self.getMessageHandlers();

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

			var addressParts = message.address.split('/');
			var messageType = addressParts[1];

			if (self.messageHandlers[messageType] !== undefined)
			{
				self.messageHandlers[messageType](addressParts, message.args);
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

instance.prototype.getMessageHandlers = function()
{
	var self = this;

	var trackHandlers = self.getTrackMessageHandlers();

	return {
		play:    (addressParts, args) => self.handleBinaryMessage('playStatus', args, self.valueConverters.play),
		stop:    (addressParts, args) => self.handleBinaryMessage('stopStatus', args, self.valueConverters.stop),
		record:  (addressParts, args) => self.handleBinaryMessage('recordStatus', args, self.valueConverters.record),
		rewind:  (addressParts, args) => self.handleBinaryMessage('rewindStatus', args, self.valueConverters.rewind),
		forward: (addressParts, args) => self.handleBinaryMessage('forwardStatus', args, self.valueConverters.forward),
		click:   (addressParts, args) => self.handleBinaryMessage('clickStatus', args, self.valueConverters.click),
		repeat:  (addressParts, args) => self.handleBinaryMessage('repeatStatus', args, self.valueConverters.repeat),
		track:   (addressParts, args) => self.handleTrackMessage(addressParts, args, trackHandlers)
	}
}

instance.prototype.getTrackMessageHandlers = function() {
	var self = this;

	var trackFxHandlers = self.getTrackFxMessageHandlers();

	return {
		mute:    (trackNumber, addressParts, args) => self.handleBinaryTrackMessage('mute', trackNumber, addressParts, args, self.valueConverters.trackMute),
		solo:    (trackNumber, addressParts, args) => self.handleBinaryTrackMessage('solo', trackNumber, addressParts, args, self.valueConverters.trackSolo),
		recarm:  (trackNumber, addressParts, args) => self.handleBinaryTrackMessage('recarm', trackNumber, addressParts, args, self.valueConverters.trackRecArm),
		select:  (trackNumber, addressParts, args) => self.handleBinaryTrackMessage('select', trackNumber, addressParts, args, self.valueConverters.trackSelect),
		name:    (trackNumber, addressParts, args) => {
			var self = this;

			self.setTrackProperty(trackNumber, 'name', args[0].value);
		},
		monitor: (trackNumber, addressParts, args) => self.handleBinaryTrackMessage('monitor', trackNumber, addressParts, args, self.valueConverters.trackMonitor),
		fx:      (trackNumber, addressParts, args) => self.handleTrackFxMessage(trackNumber, addressParts[4], addressParts, args, trackFxHandlers)
	};
}

instance.prototype.getTrackFxMessageHandlers = function() {
	var self = this;

	return {
		bypass: (trackNumber, fxNumber, addressParts, args) => self.handleBinaryTrackFxMessage('bypass', trackNumber, fxNumber, args, self.valueConverters.trackFxBypass),
		name:   (trackNumber, fxNumber, addressParts, args) => self.setTrackFxProperty(trackNumber, fxNumber, 'name', args[0].value),
		openui: (trackNumber, fxNumber, addressParts, args) => self.handleBinaryTrackFxMessage('openui', trackNumber, fxNumber, args, self.valueConverters.trackFxOpenUi)
	}
}

instance.prototype.handleBinaryMessage = function(variableName, args, valueConverter) {
    var self = this;

	if (args.length >= 0) {
		var value = args[0].value;
		if (typeof value === "number") {
			var textValue = valueConverter !== undefined ? valueConverter(value) : value.toString();

			self[variableName] = textValue
			self.setVariable(variableName, textValue);
			self.checkFeedbacks(variableName);
			self.debug("message " + variableName + " value is", value)
			self.debug(variableName + " is", self[variableName])
		}
	}
}

// TODO: Handle messages regarding selected track  (has no track number)
// /track/[trackNumber]/[messageType]
instance.prototype.handleTrackMessage = function (addressParts, args, handlers) {
	var trackNumber = parseInt(addressParts[2]);
	var messageType = addressParts[3];

	if (handlers[messageType] !== undefined)
	{
		handlers[messageType](trackNumber, addressParts, args);
	}
}

instance.prototype.handleBinaryTrackMessage = function(propertyName, trackNumber, addressParts, args, valueConverter) {
	var self = this;

	// Toggles can be ignored
	if (addressParts[4] === 'toggle')
	{
		return;
	}

	self.setTrackProperty(trackNumber, propertyName, args[0].value === 1, valueConverter);
	self.checkFeedbacks('track_' + propertyName);
}

// /track/[trackNumber]/fx/[fxNumber]/[messageType]
instance.prototype.handleTrackFxMessage = function(trackNumber, fxNumber, addressParts, args, handlers){
	var messageType = addressParts[5];

	if (handlers[messageType] !== undefined)
	{
		handlers[messageType](trackNumber, fxNumber, addressParts, args);
	}
}

instance.prototype.handleBinaryTrackFxMessage = function(propertyName, trackNumber, fxNumber, args, valueConverter)
{
	var self = this;
	
	self.setTrackFxProperty(trackNumber, fxNumber, propertyName, args[0].value === 1, valueConverter);
	self.checkFeedbacks('track_fx_' + propertyName);
}

instance.GetUpgradeScripts = function() {
	return [
		instance_skel.CreateConvertToBooleanFeedbackUpgradeScript({
			'playStatus': true,
			'stopStatus': true,
			'recordStatus': true,
			'rewindStatus': true,
			'forwardStatus': true,
			'repeatStatus': true,
			'clickStatus': true,
			'customMessage': true,
		})
	]
}

instance_skel.extendedBy(instance);
exports = module.exports = instance;