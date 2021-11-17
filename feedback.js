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
			type:        'boolean',
			label:       'Change style based on Play/Pause status',
			description: 'Change style based on Play/Pause status',
			style:       {
				color:	 self.rgb(255, 255, 255),
				bgcolor: self.rgb(0, 183, 0)
			},
			options:     [
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
					return true;
				}

				return false;
			}
		}
		feedbacks['stopStatus']    = {
			type:        'boolean',
			label:       'Change style based on Stop status',
			description: 'Change style based on Stop status',
			style:       {
				color:	 self.rgb(255, 255, 255),
				bgcolor: self.rgb(76, 76, 76)
			},
			options:     [
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
					return true;
				}

				return false;
			}
		}
		feedbacks['recordStatus']  = {
			type:        'boolean',
			label:       'Change style based on Record status',
			description: 'Change style based on Record status',
			style:       {
				color:	 self.rgb(255, 255, 255),
				bgcolor: self.rgb(183, 0, 0)
			},
			options:     [
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
					return true;
				}

				return false;
			}
		}
		feedbacks['rewindStatus']  = {
			type:        'boolean',
			label:       'Change style based on Rewind status',
			description: 'Change style based on Rewind status',
			style:       {
				color:	 self.rgb(255, 255, 255),
				bgcolor: self.rgb(249, 199, 0)
			},
			options:     [
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
					return true;
				}

				return false;
			}
		}
		feedbacks['forwardStatus'] = {
			type:        'boolean',
			label:       'Change style based on Fast Forward status',
			description: 'Change style based on Fast Forward status',
			style:       {
				color:	 self.rgb(255, 255, 255),
				bgcolor: self.rgb(249, 199, 0)
			},
			options:     [
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
					return true;
				}

				return false;
			}
		}

		feedbacks['repeatStatus'] = {
			type:        'boolean',
			label:       'Change style based on Repeat status',
			description: 'Change style based on Repeat status',
			style:       {
				color:	 self.rgb(255, 255, 255),
				bgcolor: self.rgb(153, 0, 153)
			},
			options:     [
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
					return true;
				}

				return false;
			}
		}

		feedbacks['clickStatus'] = {
			type:        'boolean',
			label:       'Change style based on Click status',
			description: 'Change style based on Click status',
			style:       {
				color:	 self.rgb(255, 255, 255),
				bgcolor: self.rgb(11, 138, 179)
			},
			options:     [
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
					return true;
				}

				return false;
			}
		}

		feedbacks['customMessage'] = {
			type:        'boolean',
			label:       'Change style based on a custom OSC message',
			description: 'Change style based on a custom OSC message',
			style:       {
				color:	 self.rgb(255, 255, 255),
				bgcolor: self.rgb(0, 255, 0)
			},
			options:     [
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
					return true;
				}

				return false;
			}
		}

		// Track Feedbacks
		feedbacks['track_mute'] = self.createBooleanTrackFeedback('mute', 'Change style when a track is muted', 'Change style when a track is muted');
		feedbacks['track_solo'] = self.createBooleanTrackFeedback('solo', 'Change style when a track is soloed', 'Change style when a track is soloed');
		feedbacks['track_recarm'] = self.createBooleanTrackFeedback('recarm', 'Change style when a track is armed for recording', 'Change style when a track is armed for recording');
		feedbacks['track_select'] = self.createBooleanTrackFeedback('select', 'Change style when a track is selected', 'Change style when a track is selected');
		feedbacks['track_monitor'] = self.createBooleanTrackFeedback('monitor', 'Change style when monitoring is enabled for a track', 'Change style when monitoring is enabled for a track');

		// Track FX Feedbacks
		feedbacks['track_fx_bypass'] = self.createBooleanTrackFxFeedback('bypass', 'Change style when an FX is active', 'Change style when an FX is active');
		feedbacks['track_fx_openui'] = self.createBooleanTrackFxFeedback('openui', 'Change style when an FX UI window is open', 'Change style when an FX UI window is open');
		
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