module.exports = {

	/**
	 * INTERNAL: Get the available feedbacks.
	 *
	 * @returns {Object[]} the available feedbacks
	 * @access protected
	 * @since 1.0.0
	 */
	getActions() {
		var self    = this
		var actions = {
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
			'repeat':        {label: 'Toggle Repeat'},
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
			'track_mute_toggle':   {
				label:   'Track Mute Toggle',
				options: [
					{
						type:    'textinput',
						label:   'Track',
						id:      'track',
						default: "1"
					}
				]
			},
			'track_solo_toggle':   {
				label:   'Track Solo Toggle',
				options: [
					{
						type:    'textinput',
						label:   'Track',
						id:      'track',
						default: "1"
					}
				]
			},
			'track_arm_toggle':   {
				label:   'Track Record Arm Toggle',
				options: [
					{
						type:    'textinput',
						label:   'Track',
						id:      'track',
						default: "1"
					}
				]
			},
			'track_select':     {
				label:   'Track Select',
				options: [
					{
						type:    'textinput',
						label:   'Track',
						id:      'track',
						default: "1"
					}
				]
			},
			'track_deselect':     {
				label:   'Track Deselect',
				options: [
					{
						type:    'textinput',
						label:   'Track',
						id:      'track',
						default: "1"
					}
				]
			},
			'track_monitor_enable':     {
				label:   'Track Monitoring Enable',
				options: [
					{
						type:    'textinput',
						label:   'Track',
						id:      'track',
						default: "1"
					}
				]
			},
			'track_monitor_disable':     {
				label:   'Track Monitoring Disable',
				options: [
					{
						type:    'textinput',
						label:   'Track',
						id:      'track',
						default: "1"
					}
				]
			},
			'track_fx_bypass':   {
				label:   'Track Fx Bypass',
				options: [
					{
						type:    'textinput',
						label:   'Track',
						id:      'track',
						default: "1"
					},
					{
						type:    'textinput',
						label:   'Fx',
						id:      'fx',
						default: "1"
					}
				]
			},
			'track_fx_openui':   {
				label:   'Track Fx Open UI',
				options: [
					{
						type:    'textinput',
						label:   'Track',
						id:      'track',
						default: "1"
					},
					{
						type:    'textinput',
						label:   'Fx',
						id:      'fx',
						default: "1"
					}
				]
			},
			'track_fx_unbypass':   {
				label:   'Track Fx Unbypass',
				options: [
					{
						type:    'textinput',
						label:   'Track',
						id:      'track',
						default: "1"
					},
					{
						type:    'textinput',
						label:   'Fx',
						id:      'fx',
						default: "1"
					}
				]
			},
			'track_fx_closeui':   {
				label:   'Track Fx Close UI',
				options: [
					{
						type:    'textinput',
						label:   'Track',
						id:      'track',
						default: "1"
					},
					{
						type:    'textinput',
						label:   'Fx',
						id:      'fx',
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
		}
		return actions;
	},
	getCommand(action) {
		var self = this
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

			case 'repeat':
				cmd = '/repeat';
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

			case 'track_mute_toggle':
				cmd = '/track/' + opt.track + '/mute/toggle';
				break;

			case 'track_solo_toggle':
				cmd = '/track/' + opt.track + '/solo/toggle';
				break;

			case 'track_arm_toggle':
				cmd = '/track/' + opt.track + '/recarm/toggle';
				break;

			case 'track_select':
				args.push({type: 'i', value: '1'});
				cmd = '/track/' + opt.track + '/select';
				break;
		
			case 'track_deselect':
				args.push({type: 'i', value: '0'});
				cmd = '/track/' + opt.track + '/select';
				break;

			case 'track_monitor_enable':
				args.push({type: 'i', value: '1'});
				cmd = '/track/' + opt.track + '/monitor';
				break;

			case 'track_monitor_disable':
				args.push({type: 'i', value: '0'});
				cmd = '/track/' + opt.track + '/monitor';
				break;

			case 'track_fx_bypass':
				args.push({type: 'i', value: '0'});
				cmd = '/track/' + opt.track + '/fx/' + opt.fx + '/bypass';
				break;

			case 'track_fx_openui':
				args.push({type: 'i', value: '1'});
				cmd = '/track/' + opt.track + '/fx/' + opt.fx + '/openui';
				break;

			case 'track_fx_unbypass':
				args.push({type: 'i', value: '1'}); // 1 to unbypass
				cmd = '/track/' + opt.track + '/fx/' + opt.fx + '/bypass';
				break;

			case 'track_fx_closeui':
				args.push({type: 'i', value: '0'});
				cmd = '/track/' + opt.track + '/fx/' + opt.fx + '/openui';
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
		return [cmd, args];
	}
}