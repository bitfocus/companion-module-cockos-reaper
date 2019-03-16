var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;
	// super-constructor
	instance_skel.apply(this, arguments);
	self.actions(); // export actions
	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;
};

instance.prototype.init = function() {
	var self = this;
	self.status(self.STATE_OK); // report status ok!
	debug = self.debug;
	log = self.log;
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module controls <a href="https://www.reaper.fm" target="_new">REAPER</a>.'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			tooltip: 'The IP of the computer running REAPER',
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			width: 3,
			tooltip: 'The port REAPER is listening to OSC on',
			regex: self.REGEX_SIGNED_NUMBER
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;
	debug("destory", self.id);;
};


instance.prototype.actions = function(system) {
	var self = this;
	self.system.emit('instance_actions', self.id, {
		'record':	        {label: 'Record'},
		'play':	          {label: 'Play'},
		'stop':	          {label: 'Stop'},
		'pause':	        {label: 'Pause'},
		'autorecarm':	    {label: 'Autoarm Record'},
		'soloreset':      {label: 'Reset Solos'},
		'rewind':	        {label: 'Rewind'},
		'forward':	      {label: 'Forward'},
		'click':	        {label: 'Click/Metronome'},

		'goto_marker':	{
			label: 'Go To Marker',
			options: [
				{
					type: 'textinput',
					label: 'Marker Number',
					id: 'marker',
					default: "1"
				}
			]
		},
		'goto_region':	{
			label: 'Go To Region',
			options: [
				{
					type: 'textinput',
					label: 'Region Number',
					id: 'region',
					default: "1"
				}
			]
		},
		'track_mute':	{
			label: 'Track Mute',
			options: [
				{
					type: 'textinput',
					label: 'Track',
					id: 'track',
					default: "1"
				}
			]
		},
		'track_solo':	{
			label: 'Track Solo',
			options: [
				{
					type: 'textinput',
					label: 'Track',
					id: 'track',
					default: "1"
				}
			]
		},
		'track_arm':	{
			label: 'Track Arm',
			options: [
				{
					type: 'textinput',
					label: 'Track',
					id: 'track',
					default: "1"
				}
			]
		},
		'track_unmute':	{
			label: 'Track Unmute',
			options: [
				{
					type: 'textinput',
					label: 'Track',
					id: 'track',
					default: "1"
				}
			]
		},
		'track_unsolo':	{
			label: 'Track Unsolo',
			options: [
				{
					type: 'textinput',
					label: 'Track',
					id: 'track',
					default: "1"
				}
			]
		},
		'track_unarm':	{
			label: 'Track Unarm',
			options: [
				{
					type: 'textinput',
					label: 'Track',
					id: 'track',
					default: "1"
				}
			]
		},
		'custom_action':	{
			label: 'Custom Action',
			options: [
				{
					type: 'textinput',
					label: 'Action Command ID',
					id: 'action_cmd_id',
					default: "1007"
				}
			]
		}
	});
}

instance.prototype.action = function(action) {
	var self = this;
	var opt = action.options;
	var cmd
	var args = [];

	switch (action.action) {

		case 'record':
			arg = null
			cmd = '/record';
			break;

		case 'play':
			arg = null
			cmd = '/play';
			break;

		case 'stop':
			arg = null
			cmd = '/stop';
			break;

		case 'pause':
			arg = null
			cmd = '/pause';
			break;

		case 'autorecarm':
			arg = null
			cmd = '/autorecarm';
			break;

		case 'soloreset':
			arg = null
			cmd = '/soloreset';
			break;

		case 'rewind':
			arg = null
			cmd = '/rewind';
			break;

		case 'forward':
			arg = null
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
			arg = null
			cmd = '/region/' + opt.region;
			break;

		case 'track_mute':
			args.push({ type: 'i', value: '1' });
			cmd = '/track/' + opt.track + '/mute';
			break;

		case 'track_solo':
			args.push({ type: 'i', value: '1' });
			cmd = '/track/' + opt.track + '/solo';
			break;

		case 'track_arm':
			args.push({ type: 'i', value: '1' });
			cmd = '/track/' + opt.track + '/recarm';
			break;

		case 'track_unmute':
			args.push({ type: 'i', value: '0' });
			cmd = '/track/' + opt.track + '/mute';
			break;

		case 'track_unsolo':
			args.push({ type: 'i', value: '0' });
			cmd = '/track/' + opt.track + '/solo';
			break;

		case 'track_unarm':
			args.push({ type: 'i', value: '0' });
			cmd = '/track/' + opt.track + '/recarm';
			break;
		
		case 'custom_action':
			cmd = '/action/' + opt.action_cmd_id;
			break;

	};
	if (cmd !== undefined)  {
		debug('sending',cmd,args,"to",self.config.host);
		self.system.emit('osc_send', self.config.host, self.config.port, cmd, args);
	}
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
