module.exports = {

	/**
	 * INTERNAL: Get the available feedbacks.
	 *
	 * @returns {Object[]} the available feedbacks
	 * @access protected
	 * @since 1.0.0
	 */
	getVariables() {
		var self                 = this
		var playStatus           = 'Paused';
		var stopStatus           = 'Stopped';
		var recordStatus         = 'Not Recording';
		var rewindStatus         = 'Not Rewinding';
		var forwardStatus        = 'Not Forwarding';
		var repeatStatus         = 'Inactive';
		var clickStatus          = 'Inactive';
		self.customMessageStatus = {};

		// Create a variable containing only needed information about the used "custom message" feedbacks
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
		self.setVariable('rewindStatus', rewindStatus);

		variables.push({
			label: 'Fast Forward Status',
			name:  'forwardStatus'
		});
		self.setVariable('forwardStatus', forwardStatus);

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

		return variables;

	}
}