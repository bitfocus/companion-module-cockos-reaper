var instance_skel = require('../../instance_skel');
var OSC           = require('osc');
var debug;
var log;

function instance(system, id, config) {
	var self = this;
	// super-constructor
	instance_skel.apply(this, arguments);
	self.actions(); // export actions
	return self;
}

instance.prototype.updateConfig = function (config) {
	var self = this;

	self.config = config;
	self.init_variables();
	self.init_feedbacks();
	self.init_osc();
};

instance.prototype.init = function () {
	var self = this;
	self.status(self.STATE_OK); // report status ok!
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


instance.prototype.actions = function (system) {
	var self = this;
	self.system.emit('instance_actions', self.id, {
		'record':        {label: 'Record'},
		'play':          {label: 'Play'},
		'stop':          {label: 'Stop'},
		'pause':         {label: 'Pause'},
		'autorecarm':    {label: 'Autoarm Record'},
		'soloreset':     {label: 'Reset Solos'},
		'start_rewind':  {label: 'Rewind (Start)'},
		'stop_rewind':   {label: 'Rewind (Stop)'},
		'start_forward': {label: 'Forward (Start)'},
		'stop_forward':  {label: 'Forward (Stop)'},
		'click':         {label: 'Click/Metronome'},

		'goto_marker':   {
			label:   'Go To Marker',
			options: [
				{
					type:    'textinput',
					label:   'Marker Number',
					id:      'marker',
					default: "1"
				}
			]
		},
		'goto_region':   {
			label:   'Go To Region',
			options: [
				{
					type:    'textinput',
					label:   'Region Number',
					id:      'region',
					default: "1"
				}
			]
		},
		'track_mute':    {
			label:   'Track Mute',
			options: [
				{
					type:    'textinput',
					label:   'Track',
					id:      'track',
					default: "1"
				}
			]
		},
		'track_solo':    {
			label:   'Track Solo',
			options: [
				{
					type:    'textinput',
					label:   'Track',
					id:      'track',
					default: "1"
				}
			]
		},
		'track_arm':     {
			label:   'Track Arm',
			options: [
				{
					type:    'textinput',
					label:   'Track',
					id:      'track',
					default: "1"
				}
			]
		},
		'track_unmute':  {
			label:   'Track Unmute',
			options: [
				{
					type:    'textinput',
					label:   'Track',
					id:      'track',
					default: "1"
				}
			]
		},
		'track_unsolo':  {
			label:   'Track Unsolo',
			options: [
				{
					type:    'textinput',
					label:   'Track',
					id:      'track',
					default: "1"
				}
			]
		},
		'track_unarm':   {
			label:   'Track Unarm',
			options: [
				{
					type:    'textinput',
					label:   'Track',
					id:      'track',
					default: "1"
				}
			]
		},
		'custom_action': {
			label:   'Custom Action',
			options: [
				{
					type:    'textinput',
					label:   'Action Command ID',
					id:      'action_cmd_id',
					default: "1007"
				}
			]
		}
	});
}

instance.prototype.action = function (action) {
	var self = this;
	var opt  = action.options;
	var cmd
	var args = [];

	switch (action.action) {

		case 'record':
			cmd = '/record';
			break;

		case 'play':
			cmd = '/play';
			break;

		case 'stop':
			cmd = '/stop';
			break;

		case 'pause':
			cmd = '/pause';
			break;

		case 'autorecarm':
			cmd = '/autorecarm';
			break;

		case 'soloreset':
			cmd = '/soloreset';
			break;

		case 'start_rewind':
			args.push({type: 'i', value: '1'});
			cmd = '/rewind';
			break;

		case 'stop_rewind':
			args.push({type: 'i', value: '0'});
			cmd = '/rewind';
			break;

		case 'start_forward':
			args.push({type: 'i', value: '1'});
			cmd = '/forward';
			break;

		case 'stop_forward':
			args.push({type: 'i', value: '0'});
			cmd = '/forward';
			break;

		case 'click':
			arg = null
			cmd = '/click';
			break;

		case 'goto_marker':
			cmd = '/marker/' + opt.marker;
			break;

		case 'goto_region':
			cmd = '/region/' + opt.region;
			break;

		case 'track_mute':
			args.push({type: 'i', value: '1'});
			cmd = '/track/' + opt.track + '/mute';
			break;

		case 'track_solo':
			args.push({type: 'i', value: '1'});
			cmd = '/track/' + opt.track + '/solo';
			break;

		case 'track_arm':
			args.push({type: 'i', value: '1'});
			cmd = '/track/' + opt.track + '/recarm';
			break;

		case 'track_unmute':
			args.push({type: 'i', value: '0'});
			cmd = '/track/' + opt.track + '/mute';
			break;

		case 'track_unsolo':
			args.push({type: 'i', value: '0'});
			cmd = '/track/' + opt.track + '/solo';
			break;

		case 'track_unarm':
			args.push({type: 'i', value: '0'});
			cmd = '/track/' + opt.track + '/recarm';
			break;

		case 'custom_action':
			// Integer & String commandID's are sent differently...
			if (parseInt(opt.action_cmd_id) > 0) {
				cmd = '/action/' + opt.action_cmd_id;
			} else {
				args.push({type: 's', value: opt.action_cmd_id});
				cmd = '/action/str';
			}
			break;

	}
	if (cmd !== undefined) {
		debug('sending', cmd, args, "to", self.config.host);
		self.system.emit('osc_send', self.config.host, self.config.port, cmd, args);
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
	var self = this;

	self.customMessages = self.getAllFeedbacks().reduce(function (filtered, feedback) {
		if (feedback.type === 'customMessage') {
			var value = feedback.options.value
			if (feedback.options.type === 'f') {
				value = parseFloat(feedback.options.value);
			}
			filtered.push({
				id:      feedback.options.msg + '_' + feedback.options.type,
				address: feedback.options.msg,
				args:    {
					type:  feedback.options.type,
					value: value
				}
			})
		}
		return filtered
	}, [])

	var variables = [];

	var playStatus           = 'Paused';
	var stopStatus           = 'Stopped';
	var recordStatus         = 'Not Recording';
	var rewindStatus         = 'Not Rewinding';
	var forwardStatus        = 'Not Forwarding';
	var repeatStatus         = 'Inactive';
	var clickStatus          = 'Inactive';
	self.customMessageStatus = {};

	variables.push({
		label: 'Play/Pause Status',
		name:  'playStatus'
	});
	self.setVariable('playStatus', playStatus);

	variables.push({
		label: 'Stop Status',
		name:  'stopStatus'
	});
	self.setVariable('stopStatus', stopStatus);

	variables.push({
		label: 'Record Status',
		name:  'recordStatus'
	});
	self.setVariable('recordStatus', recordStatus);

	variables.push({
		label: 'Rewind Status',
		name:  'rewindStatus'
	});
	self.setVariable('recordStatus', rewindStatus);

	variables.push({
		label: 'Fast Forward Status',
		name:  'forwardStatus'
	});
	self.setVariable('recordStatus', forwardStatus);

	variables.push({
		label: 'Repeat Status',
		name:  'repeatStatus'
	});
	self.setVariable('repeatStatus', repeatStatus);

	variables.push({
		label: 'Click Status',
		name:  'clickStatus'
	});
	self.setVariable('clickStatus', clickStatus);

	self.customMessages.forEach(function (cm, index) {
		if (self.customMessageStatus[cm.id] === undefined) {
			self.customMessageStatus[cm.id] = cm.args.value;
		}
		variables.push({
			label: 'Custom Feedback #' + index,
			name:  'customFeedback' + index
		});
		self.setVariable('customFeedback' + index, self.customMessageStatus[cm.id]);
	});

	self.setVariableDefinitions(variables);
}

instance.prototype.init_feedbacks = function () {
	var self      = this
	var feedbacks = {}

	feedbacks['playStatus']    = {
		label:       'Change colors based on Play/Pause status',
		description: 'Change colors based on Play/Pause status',
		options:     [
			{
				type:    'colorpicker',
				label:   'Foreground color',
				id:      'fg',
				default: self.rgb(255, 255, 255)
			},
			{
				type:    'colorpicker',
				label:   'Background color',
				id:      'bg',
				default: self.rgb(0, 183, 0)
			},
			{
				type:    'dropdown',
				label:   'Status',
				id:      'playPause',
				default: 'Playing',
				choices: [
					{id: 'Playing', label: 'Playing'},
					{id: 'Paused', label: 'Paused'}
				]
			}
		]
	}
	feedbacks['stopStatus']    = {
		label:       'Change colors based on Stop status',
		description: 'Change colors based on Stop status',
		options:     [
			{
				type:    'colorpicker',
				label:   'Foreground color',
				id:      'fg',
				default: self.rgb(255, 255, 255)
			},
			{
				type:    'colorpicker',
				label:   'Background color',
				id:      'bg',
				default: self.rgb(76, 76, 76)
			},
			{
				type:    'dropdown',
				label:   'Status',
				id:      'stopPlay',
				default: 'Stopped',
				choices: [
					{id: 'Stopped', label: 'Stopped'},
					{id: 'Playing', label: 'Playing'}
				]
			}
		]
	}
	feedbacks['recordStatus']  = {
		label:       'Change colors based on Record status',
		description: 'Change colors based on Record status',
		options:     [
			{
				type:    'colorpicker',
				label:   'Foreground color',
				id:      'fg',
				default: self.rgb(255, 255, 255)
			},
			{
				type:    'colorpicker',
				label:   'Background color',
				id:      'bg',
				default: self.rgb(0, 255, 0)
			},
			{
				type:    'dropdown',
				label:   'Status',
				id:      'recordOrNot',
				default: 'Recording',
				choices: [
					{id: 'Recording', label: 'Recording'},
					{id: 'Not Recording', label: 'Not Recording'}
				]
			}
		]
	}
	feedbacks['rewindStatus']  = {
		label:       'Change colors based on Rewind status',
		description: 'Change colors based on Rewind status',
		options:     [
			{
				type:    'colorpicker',
				label:   'Foreground color',
				id:      'fg',
				default: self.rgb(255, 255, 255)
			},
			{
				type:    'colorpicker',
				label:   'Background color',
				id:      'bg',
				default: self.rgb(249, 199, 0)
			},
			{
				type:    'dropdown',
				label:   'Status',
				id:      'rewindOrNot',
				default: 'Rewinding',
				choices: [
					{id: 'Rewinding', label: 'Rewinding'},
					{id: 'Not Rewinding', label: 'Not Rewinding'}
				]
			}
		]
	}
	feedbacks['forwardStatus'] = {
		label:       'Change colors based on Fast Forward status',
		description: 'Change colors based on Fast Forward status',
		options:     [
			{
				type:    'colorpicker',
				label:   'Foreground color',
				id:      'fg',
				default: self.rgb(255, 255, 255)
			},
			{
				type:    'colorpicker',
				label:   'Background color',
				id:      'bg',
				default: self.rgb(249, 199, 0)
			},
			{
				type:    'dropdown',
				label:   'Status',
				id:      'forwardOrNot',
				default: 'Forwarding',
				choices: [
					{id: 'Forwarding', label: 'Forwarding'},
					{id: 'Not Forwarding', label: 'Not Forwarding'}
				]
			}
		]
	}

	feedbacks['repeatStatus'] = {
		label:       'Change colors based on Repeat status',
		description: 'Change colors based on Repeat status',
		options:     [
			{
				type:    'colorpicker',
				label:   'Foreground color',
				id:      'fg',
				default: self.rgb(255, 255, 255)
			},
			{
				type:    'colorpicker',
				label:   'Background color',
				id:      'bg',
				default: self.rgb(11, 138, 179)
			},
			{
				type:    'dropdown',
				label:   'Status',
				id:      'repeatOrNot',
				default: 'Active',
				choices: [
					{id: 'Active', label: 'Active'},
					{id: 'Inactive', label: 'Inactive'}
				]
			}
		]
	}

	feedbacks['clickStatus'] = {
		label:       'Change colors based on Click status',
		description: 'Change colors based on Click status',
		options:     [
			{
				type:    'colorpicker',
				label:   'Foreground color',
				id:      'fg',
				default: self.rgb(255, 255, 255)
			},
			{
				type:    'colorpicker',
				label:   'Background color',
				id:      'bg',
				default: self.rgb(0, 255, 0)
			},
			{
				type:    'dropdown',
				label:   'Status',
				id:      'clickOrNot',
				default: 'Active',
				choices: [
					{id: 'Active', label: 'Active'},
					{id: 'Inactive', label: 'Inactive'}
				]
			}
		]
	}

	feedbacks['customMessage'] = {
		label:       'Change colors based on a custom OSC message',
		description: 'Change colors based on a custom OSC message',
		options:     [
			{
				type:    'colorpicker',
				label:   'Foreground color',
				id:      'fg',
				default: self.rgb(255, 255, 255)
			},
			{
				type:    'colorpicker',
				label:   'Background color',
				id:      'bg',
				default: self.rgb(0, 255, 0)
			},
			{
				type:    'textinput',
				label:   'Message',
				id:      'msg',
				default: '/repeat'
			},
			{
				type:    'dropdown',
				label:   'Message Type',
				id:      'type',
				default: 'f',
				choices: [
					{id: 'f', label: 'Number'},
					{id: 's', label: 'String'}
				]
			},
			{
				type:    'textinput',
				label:   'Value',
				id:      'value',
				default: '1'
			}
		]
	}

	self.setFeedbackDefinitions(feedbacks)
}

instance.prototype.feedback = function (feedback, bank) {
	var self = this
	var foundFeedback;

	if (feedback.type === 'playStatus') {
		if (self.playStatus === feedback.options.playPause) {
			return {color: feedback.options.fg, bgcolor: feedback.options.bg}
		}
	}

	if (feedback.type === 'stopStatus') {
		if (self.stopStatus === feedback.options.stopPlay) {
			return {color: feedback.options.fg, bgcolor: feedback.options.bg}
		}
	}

	if (feedback.type === 'recordStatus') {
		if (self.recordStatus === feedback.options.recordOrNot) {
			return {color: feedback.options.fg, bgcolor: feedback.options.bg}
		}
	}

	if (feedback.type === 'rewindStatus') {
		if (self.rewindStatus === feedback.options.rewindOrNot) {
			return {color: feedback.options.fg, bgcolor: feedback.options.bg}
		}
	}

	if (feedback.type === 'forwardStatus') {
		if (self.forwardStatus === feedback.options.forwardOrNot) {
			return {color: feedback.options.fg, bgcolor: feedback.options.bg}
		}
	}

	if (feedback.type === 'repeatStatus') {
		if (self.repeatStatus === feedback.options.repeatOrNot) {
			return {color: feedback.options.fg, bgcolor: feedback.options.bg}
		}
	}

	if (feedback.type === 'clickStatus') {
		if (self.clickStatus === feedback.options.clickOrNot) {
			return {color: feedback.options.fg, bgcolor: feedback.options.bg}
		}
	}

	if (feedback.type === 'customMessage') {
		self.customMessages.forEach(function (customMessage, index) {
			if (self.customMessageStatus[customMessage.id].toString() === feedback.options.value) {
				if (customMessage.address === feedback.options.msg &&
					customMessage.args.type === feedback.options.type &&
					customMessage.args.value.toString() === feedback.options.value
				) {
					foundFeedback = feedback
				}
			}
		});
	}
	if (foundFeedback !== undefined) {
		return {color: feedback.options.fg, bgcolor: feedback.options.bg}
	}
	return {}
}

instance_skel.extendedBy(instance);
exports = module.exports = instance;
