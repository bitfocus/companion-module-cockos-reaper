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
		return feedbacks;

	},

	// Condenses feedback options to an object containing id and default value alone for all feedback options
	getFeedbackDefaults(feedbackType) {
		var self = this
		return self.getFeedbacks()[feedbackType].options.map(e => [e.id, e.default]).reduce(function (p, c) {
			p[c[0]] = c[1];
			return p;
		}, {})
	}
}