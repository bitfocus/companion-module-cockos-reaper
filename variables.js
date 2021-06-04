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
		self.tracks              = {};
		self.valueConverters     = self.getValueConverters();

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

		self.addTrackVariables(variables, 8);

		return variables;

	},

	addTrackVariables(variables, numberOfTracks)
	{
		var self = this;

		for (i = 0; i < 8; i++)
		{
			var trackNumber = i+1;

			var track = {
				mute:    false,
				solo:    false,
				recarm:  false,
				select:  false,
				name:    'Track ' + trackNumber,
				monitor: false
			}

			self.tracks[trackNumber] = track;

			self.addTrackVariable(variables, trackNumber, 'mute', 'Muted', self.valueConverters.trackMute(track.mute));
			self.addTrackVariable(variables, trackNumber, 'solo', 'Soloed', self.valueConverters.trackSolo(track.solo));
			self.addTrackVariable(variables, trackNumber, 'recarm', 'Armed for record', self.valueConverters.trackRecArm(track.recarm));
			self.addTrackVariable(variables, trackNumber, 'select', 'Selected', self.valueConverters.trackSelect(track.select));
			self.addTrackVariable(variables, trackNumber, 'name', 'Name', track.name);
			self.addTrackVariable(variables, trackNumber, 'monitor', 'Monitoring', self.valueConverters.trackMonitor(track.monitor));

			for (j = 0; j  < numberOfTracks; j++)
			{
				var fxNumber = j+1;

				var fx = {
					bypass: false,
					name:   'FX' + fxNumber,
					openui: false
				};

				track['fx' + fxNumber] = fx;

				self.addTrackFxVariable(variables, trackNumber, fxNumber, 'bypass', 'Bypass', self.valueConverters.trackFxBypass(fx.bypass));
				self.addTrackFxVariable(variables, trackNumber, fxNumber, 'name', 'Name', fx.name);
				self.addTrackFxVariable(variables, trackNumber, fxNumber, 'openui', 'UI Open', self.valueConverters.trackFxOpenUi(fx.openui));
			}
		}
	},

	setTrackProperty(trackNumber, propertyName, value, valueConverter)
	{
		var self = this;

		if (self.tracks[trackNumber] === undefined)
		{
			self.tracks[trackNumber] = {};
		}

		self.tracks[trackNumber][propertyName] = value;
		self.debug('track `' + trackNumber + '` property `' + propertyName + '` set to:', value);

		var variableValue = valueConverter !== undefined ? valueConverter(value) : value;

		self.setVariable(self.getTrackVariableName(trackNumber, propertyName), variableValue);
	},

	setTrackFxProperty(trackNumber, fxNumber, propertyName, value, valueConverter)
	{
		var self = this;

		var fxPropertyName = 'fx' + fxNumber;

		if (self.tracks[trackNumber] === undefined)
		{
			self.tracks[trackNumber] = {};
		}

		if (self.tracks[trackNumber][fxPropertyName] === undefined)
		{
			self.tracks[trackNumber][fxPropertyName] = {};
		}

		self.tracks[trackNumber][fxPropertyName][propertyName] = value;
		self.debug('track `' + trackNumber + '` FX `' + fxNumber + '` property `' + propertyName + '` set to:', value);

		var variableValue = valueConverter !== undefined ? valueConverter(value) : value;
		self.setVariable(self.getTrackFxVariableName(trackNumber, fxNumber, propertyName), variableValue);
	},

	addTrackVariable(variables, trackNumber, propertyName, label, defaultValue)
	{
		var self         = this;
		var variableName = self.getTrackVariableName(trackNumber, propertyName);

		variables.push({
			label: 'Track ' + trackNumber + ' ' + label,
			name: variableName
		});

		self.setVariable(variableName, defaultValue);
	},

	addTrackFxVariable(variables, trackNumber, fxNumber, propertyName, label, defaultValue)
	{
		var self         = this;
		var variableName = self.getTrackFxVariableName(trackNumber, fxNumber, propertyName);

		variables.push({
			label: 'Track ' + trackNumber + ' FX' + fxNumber + ' ' + label,
			name: variableName
		});

		self.setVariable(variableName, defaultValue);
	},

	getTrackVariableName(trackNumber, propertyName){
		var propertyCapitalized = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);

		return 'track' + trackNumber + propertyCapitalized;
	},

	getTrackFxVariableName(trackNumber, fxNumber, propertyName)
	{
		var self                = this;
		var propertyCapitalized = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);

		return self.getTrackVariableName(trackNumber, 'Fx' + fxNumber + propertyCapitalized);
	},

	getTrack(trackNumber)
	{
		var self = this;
		return self.tracks[trackNumber];
	},

	getTrackFx(trackNumber, fxNumber)
	{
		var self = this;
		var track = self.getTrack(trackNumber);

		if (track !== undefined)
		{
			return track['fx' + fxNumber];
		}
	},

	getValueConverters() {
		return {
			play:          (value) => value ? "Playing" : "Paused",
		    stop:          (value) => value ? "Stopped" : "Playing",
		    record:        (value) => value ? "Recording" : "Not Recording",
		    rewind:        (value) => value ? "Rewinding" : "Not Rewinding",
		    forward:       (value) => value ? "Forwarding" : "Not Forwarding",
		    click:         (value) => value ? "Active" : "Inactive",
		    repeat:        (value) => value ? "Active" : "Inactive",
		    trackMute:     (value) => value ? "Muted" : "Not Muted",
		    trackSolo:     (value) => value ? "Soloed" : "Not Soloed",
		    trackRecArm:   (value) => value ? "Record Armed" : "Record Disarmed",
		    trackSelect:   (value) => value ? "Selected" : "Not Selected",
		    trackMonitor:  (value) => value ? "Monitoring" : "Not Monitoring",
		    trackFxBypass: (value) => value ? "Active" : "Bypassed", // For some reason Reaper sends a 1 when not bypassed.
			trackFxOpenUi: (value) => value ? "Open" : "Closed"
		}
	}
}