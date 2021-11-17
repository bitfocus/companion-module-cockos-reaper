module.exports = {

	/**
	 * INTERNAL: Get the available feedbacks.
	 *
	 * @returns {Object[]} the available feedbacks
	 * @access protected
	 * @since 1.0.0
	 */
	getFeedbacks() {
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
			],
			callback: (feedback, bank) => {
				if (this.playStatus === feedback.options.playPause) {
					return {color: feedback.options.fg, bgcolor: feedback.options.bg}
				}
			}
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
			], callback: (feedback, bank) => {
				if (this.stopStatus === feedback.options.stopPlay) {
					return {color: feedback.options.fg, bgcolor: feedback.options.bg}
				}
			}
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
					default: self.rgb(183, 0, 0)
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
			], callback: (feedback, bank) => {
				if (this.recordStatus === feedback.options.recordOrNot) {
					return {color: feedback.options.fg, bgcolor: feedback.options.bg}
				}
			}
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
			], callback: (feedback, bank) => {
				if (this.rewindStatus === feedback.options.rewindOrNot) {
					return {color: feedback.options.fg, bgcolor: feedback.options.bg}
				}
			}
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
			], callback: (feedback, bank) => {
				if (this.forwardStatus === feedback.options.forwardOrNot) {
					return {color: feedback.options.fg, bgcolor: feedback.options.bg}
				}
			}
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
					default: self.rgb(153, 0, 153)
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
			], callback: (feedback, bank) => {
				if (this.repeatStatus === feedback.options.repeatOrNot) {
					return {color: feedback.options.fg, bgcolor: feedback.options.bg}
				}
			}
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
					default: self.rgb(11, 138, 179)
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
			], callback: (feedback, bank) => {
				if (this.clickStatus === feedback.options.clickOrNot) {
					return {color: feedback.options.fg, bgcolor: feedback.options.bg}
				}
			}
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
			], callback: (feedback, bank) => {
				var self = this;
				var foundFeedback;
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
				if (foundFeedback !== undefined) {
					return {color: feedback.options.fg, bgcolor: feedback.options.bg}
				}
			}
		}

		// Track Feedbacks
		feedbacks['track_mute'] = self.createBooleanTrackFeedback('mute', 'Change color when a track is muted', 'Change color when a track is muted');
		feedbacks['track_solo'] = self.createBooleanTrackFeedback('solo', 'Change color when a track is soloed', 'Change color when a track is soloed');
		feedbacks['track_recarm'] = self.createBooleanTrackFeedback('recarm', 'Change color when a track is armed for recording', 'Change color when a track is armed for recording');
		feedbacks['track_select'] = self.createBooleanTrackFeedback('select', 'Change color when a track is selected', 'Change color when a track is selected');
		feedbacks['track_monitor'] = self.createBooleanTrackFeedback('monitor', 'Change color when monitoring is enabled for a track', 'Change color when monitoring is enabled for a track');

		// Track FX Feedbacks
		feedbacks['track_fx_bypass'] = self.createBooleanTrackFxFeedback('bypass', 'Change color when an FX is active', 'Change color when an FX is active');
		feedbacks['track_fx_openui'] = self.createBooleanTrackFxFeedback('openui', 'Change color when an FX UI window is open', 'Change color when an FX UI window is open');
		
		return feedbacks;
	},

	// Condenses feedback options to an object containing id and default value alone for all feedback options
	getFeedbackDefaults(feedbackType) {
		var self = this
		return self.getFeedbacks()[feedbackType].options.map(e => [e.id, e.default]).reduce(function (p, c) {
			p[c[0]] = c[1];
			return p;
		}, {})
	},

	createBooleanTrackFeedback(propertyName, label, description)
	{
		var self = this;

		return {
			type:        'boolean',
			label:       label,
			description: description,
			style:       {
				color:	 self.rgb(255, 255, 255),
				bgcolor: self.rgb(0, 255, 0)
			},
			options:     [
				{
					type:     'number',
					label:    'Track Number',
					id:       'trackNumber',
					default:  1
				}
			], callback: (feedback, bank) => {
				var self = this;

				var track = self.getTrack(feedback.options.trackNumber);

				if (track !== undefined && track[propertyName] === true)
				{
					return true;
				}

				return false;
			}
		}
	},

	createBooleanTrackFxFeedback(propertyName, label, description) {
		var self = this;

		return {
			type:        'boolean',
			label:       label,
			description: description,
			style:       {
				color:	 self.rgb(255, 255, 255),
				bgcolor: self.rgb(0, 255, 0)
			},
			options:     [
				{
					type:     'number',
					label:    'Track Number',
					id:       'trackNumber',
					default:  1
				},
				{
					type:     'number',
					label:    'FX Number',
					id:       'fxNumber',
					default:   1
				}
			], callback: (feedback, bank) => {
				var self = this;

				var fx = self.getTrackFx(feedback.options.trackNumber, feedback.options.fxNumber);

				if (fx !== undefined && fx[propertyName] === true)
				{
					return true;
				}

				return false;
			}
		}
	}
}