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