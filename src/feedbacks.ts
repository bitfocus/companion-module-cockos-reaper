import {
	CompanionBooleanFeedbackDefinition,
	CompanionButtonStyleProps,
	CompanionFeedbackBooleanEvent,
	CompanionFeedbackDefinitions,
	CompanionFeedbackInfo,
	InputValue,
	combineRgb,
} from '@companion-module/base'
import { ModuleContext } from './index'
import {
	FloatMessageHandler,
	IMessageHandler,
	INotifyPropertyChanged,
	Reaper,
	RecordMonitoringMode,
	StringMessageHandler,
	Track,
	TrackFx,
	Transport,
} from 'reaper-osc'
import { BasicTextInput } from './inputs'
import { GetTrack, GetTrackFx } from './helpers'

export enum FeedbackId {
	PlayStatus = 'playStatus',
	StopStatus = 'stopStatus',
	RecordStatus = 'recordStatus',
	RewindStatus = 'rewindStatus',
	ForwardStatus = 'forwardStatus',
	RepeatStatus = 'repeatStatus',
	ClickStatus = 'clickStatus',
	CustomMessage = 'customMessage',

	// Track
	TrackMute = 'track_mute',
	TrackSolo = 'track_solo',
	TrackRecordArm = 'track_recarm',
	TrackSelected = 'track_select',
	TrackMonitor = 'track_monitor',

	// Track FX
	TrackFxBypass = 'track_fx_bypass',
	TrackFxOpenUi = 'track_fx_openui',
}

export const DefaultFeedbackStyles: { [id in FeedbackId]: Partial<CompanionButtonStyleProps> } = {
	[FeedbackId.PlayStatus]: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 183, 0) },
	[FeedbackId.StopStatus]: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(76, 76, 76) },
	[FeedbackId.RecordStatus]: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(183, 0, 0) },
	[FeedbackId.RewindStatus]: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(249, 199, 0) },
	[FeedbackId.ForwardStatus]: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(249, 199, 0) },
	[FeedbackId.RepeatStatus]: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(153, 0, 153) },
	[FeedbackId.ClickStatus]: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(11, 138, 179) },
	[FeedbackId.CustomMessage]: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 255, 0) },
	[FeedbackId.TrackMute]: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(183, 0, 0) },
	[FeedbackId.TrackSolo]: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(249, 199, 0) },
	[FeedbackId.TrackRecordArm]: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(183, 0, 0) },
	[FeedbackId.TrackSelected]: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 255, 0) },
	[FeedbackId.TrackMonitor]: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 255, 0) },
	[FeedbackId.TrackFxBypass]: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 255, 0) },
	[FeedbackId.TrackFxOpenUi]: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 255, 0) },
}

export type FeedbackBindings = {
	[id: string]: () => void
}

export type CustomMessageFeedback = { handler: IMessageHandler; getState: () => boolean }

export type CustomMessageFeedbacks = {
	[id: string]: CustomMessageFeedback
}

export interface FeedbackContext extends ModuleContext {
	readonly checkFeedback: (id: string) => void
	readonly bindings: FeedbackBindings
	readonly customMessageFeedbacks: CustomMessageFeedbacks
}

export function GetFeedbacksList(getContext: () => FeedbackContext): CompanionFeedbackDefinitions {
	const feedbacks: { [id in FeedbackId]: CompanionBooleanFeedbackDefinition | undefined } = {
		[FeedbackId.PlayStatus]: {
			type: 'boolean',
			name: 'Playing',
			description: 'Change style when Reaper is playing',
			defaultStyle: DefaultFeedbackStyles[FeedbackId.PlayStatus],
			options: [],
			...TransportFeedbackCallbacks(getContext, 'isPlaying'),
		},
		[FeedbackId.StopStatus]: {
			type: 'boolean',
			name: 'Stopped',
			description: 'Change style when Reaper is stopped',
			defaultStyle: DefaultFeedbackStyles[FeedbackId.StopStatus],
			options: [],
			...TransportFeedbackCallbacks(getContext, 'isStopped'),
		},
		[FeedbackId.RecordStatus]: {
			type: 'boolean',
			name: 'Recording',
			description: 'Change style when Reaper is recording',
			defaultStyle: DefaultFeedbackStyles[FeedbackId.RecordStatus],
			options: [],
			...TransportFeedbackCallbacks(getContext, 'isRecording'),
		},
		[FeedbackId.RewindStatus]: {
			type: 'boolean',
			name: 'Rewinding',
			description: 'Change style when Reaper is rewinding',
			defaultStyle: DefaultFeedbackStyles[FeedbackId.RewindStatus],
			options: [],
			...TransportFeedbackCallbacks(getContext, 'isRewinding'),
		},
		[FeedbackId.ForwardStatus]: {
			type: 'boolean',
			name: 'Fast Forwarding',
			description: 'Change style when Reaper is fast-forwarding',
			defaultStyle: DefaultFeedbackStyles[FeedbackId.ForwardStatus],
			options: [],
			...TransportFeedbackCallbacks(getContext, 'isFastForwarding'),
		},
		[FeedbackId.RepeatStatus]: {
			type: 'boolean',
			name: 'Repeat Enabled',
			description: 'Change style when repeat is enabled',
			defaultStyle: DefaultFeedbackStyles[FeedbackId.RepeatStatus],
			options: [],
			...TransportFeedbackCallbacks(getContext, 'isRepeatEnabled'),
		},
		[FeedbackId.ClickStatus]: {
			type: 'boolean',
			name: 'Click Enabled',
			description: 'Change style when click/metronome is enabled',
			defaultStyle: DefaultFeedbackStyles[FeedbackId.ClickStatus],
			options: [],
			...ReaperPropertyFeedbackCallbacks<Reaper>(getContext, (reaper) => reaper, 'isMetronomeEnabled'),
		},

		// Track
		[FeedbackId.TrackMute]: TrackFeedback(
			getContext,
			'Track Muted',
			'Change style when a track is muted',
			DefaultFeedbackStyles[FeedbackId.TrackMute],
			'isMuted'
		),
		[FeedbackId.TrackSolo]: TrackFeedback(
			getContext,
			'Track Soloed',
			'Change style when a track is soloed',
			DefaultFeedbackStyles[FeedbackId.TrackSolo],
			'isSoloed'
		),
		[FeedbackId.TrackRecordArm]: TrackFeedback(
			getContext,
			'Track Armed',
			'Change style when a track is armed for recording',
			DefaultFeedbackStyles[FeedbackId.TrackRecordArm],
			'isRecordArmed'
		),
		[FeedbackId.TrackSelected]: TrackFeedback(
			getContext,
			'Track Selected',
			'Change style when a track is selected',
			DefaultFeedbackStyles[FeedbackId.TrackSelected],
			'isSelected'
		),
		[FeedbackId.TrackMonitor]: TrackFeedback(
			getContext,
			'Track Monitoring On',
			'Change style when monitoring is enabled for a track',
			DefaultFeedbackStyles[FeedbackId.TrackMonitor],
			'recordMonitoring',
			RecordMonitoringMode.ON
		),

		// Track FX
		[FeedbackId.TrackFxBypass]: TrackFxFeedback(
			getContext,
			'Track Fx Active',
			'Change style when an FX is active',
			DefaultFeedbackStyles[FeedbackId.TrackFxBypass],
			'isBypassed'
		),
		[FeedbackId.TrackFxOpenUi]: TrackFxFeedback(
			getContext,
			'Track FX UI Open',
			'Change style when an FX UI window is open',
			DefaultFeedbackStyles[FeedbackId.TrackFxOpenUi],
			'isUiOpen'
		),

		// Custom Message
		[FeedbackId.CustomMessage]: {
			type: 'boolean',
			name: 'Custom OSC Message',
			description: 'Change style based on a custom OSC message',
			defaultStyle: DefaultFeedbackStyles[FeedbackId.CustomMessage],
			options: [
				BasicTextInput('Message', 'msg', '/repeat', true),
				{
					type: 'dropdown',
					label: 'Message Type',
					id: 'type',
					default: 'f',
					choices: [
						{ id: 'f', label: 'Number' },
						{ id: 's', label: 'String' },
					],
				},
				BasicTextInput('Value', 'value', '1', false, true),
			],
			callback: (evt) => {
				const context = getContext()

				const feedback = context.customMessageFeedbacks[evt.id]

				return feedback.getState()
			},
			subscribe: (evt, callbackCtx) => {
				const context = getContext()

				const state = { state: false }
				const callback = (result: boolean) => {
					if (state.state === result) {
						return
					}

					state.state = result
					context.checkFeedback(evt.id)
				}

				let handler: IMessageHandler

				switch (evt.options.type) {
					case 'f':
						handler = CustomFloatFeedbackHandler(
							getContext,
							<string>evt.options.msg,
							<string>evt.options.value,
							callback,
							async (value) => callbackCtx.parseVariablesInString(value)
						)
						break
					case 's':
						handler = CustomStringFeedbackHandler(
							getContext,
							<string>evt.options.msg,
							<string>evt.options.value,
							callback,
							async (value) => callbackCtx.parseVariablesInString(value)
						)
						break
					default:
						context.log('error', `Custom message feedback has invalid value for type: ${evt.options.type}`)
						return
				}

				context.customMessageFeedbacks[evt.id] = { handler: handler, getState: () => state.state }
			},
			unsubscribe: (evt) => {
				const context = getContext()

				delete context.customMessageFeedbacks[evt.id]
			},
		},
	}

	return feedbacks
}

function AddBinding(context: FeedbackContext, feedbackId: string, unsubscribe: () => void) {
	context.bindings[feedbackId] = unsubscribe
}

function Unbind(getContext: () => FeedbackContext, feedbackId: string) {
	const context = getContext()
	context.bindings[feedbackId]()
	delete context.bindings[feedbackId]
}

function TrackFeedback(
	getContext: () => FeedbackContext,
	name: string,
	description: string,
	defaultStyle: Partial<CompanionButtonStyleProps>,
	property: keyof Track & string,
	comparisonValue?: InputValue
): CompanionBooleanFeedbackDefinition {
	return {
		type: 'boolean',
		name: name,
		description: description,
		defaultStyle: defaultStyle,
		options: [
			{
				type: 'number',
				label: 'Track Number',
				id: 'trackNumber',
				default: 1,
				// Unfortunately we cannot **receive** messages for the master track at present and therefore it is not supported for feedback
				// See https://github.com/LykaiosNZ/reaper-osc.js/issues/35 for more info
				min: 1,
				max: 8,
			},
		],
		...ReaperPropertyFeedbackCallbacks<Track>(
			getContext,
			(reaper, evt) => GetTrack(reaper, Number(evt.options.trackNumber)),
			property,
			undefined,
			comparisonValue ?? true
		),
	}
}

function TrackFxFeedback(
	getContext: () => FeedbackContext,
	name: string,
	description: string,
	defaultStyle: Partial<CompanionButtonStyleProps>,
	property: keyof TrackFx & string,
	comparisonValue?: InputValue
): CompanionBooleanFeedbackDefinition {
	return {
		type: 'boolean',
		name: name,
		description: description,
		defaultStyle: defaultStyle,
		options: [
			{
				type: 'number',
				label: 'Track Number',
				id: 'trackNumber',
				default: 1,
				min: 0,
				max: 8,
			},
			{
				type: 'number',
				label: 'Fx Number',
				id: 'fxNumber',
				default: 1,
				min: 0,
				max: 8,
			},
		],
		...ReaperPropertyFeedbackCallbacks<TrackFx>(
			getContext,
			(reaper, evt) => GetTrackFx(reaper, Number(evt.options.trackNumber), Number(evt.options.fxNumber)),
			property,
			undefined,
			comparisonValue
		),
	}
}

function TransportFeedbackCallbacks(
	getContext: () => FeedbackContext,
	property: keyof Transport & string,
	optionId?: string,
	comparisonValue?: string
) {
	return ReaperPropertyFeedbackCallbacks<Transport>(
		getContext,
		(reaper) => reaper.transport,
		property,
		optionId,
		comparisonValue
	)
}

function ReaperPropertyFeedbackCallbacks<T extends INotifyPropertyChanged>(
	getContext: () => FeedbackContext,
	selector: (reaper: Reaper, evt: CompanionFeedbackBooleanEvent) => T | undefined,
	property: keyof T & string,
	comparisonOption?: string,
	comparisonValue?: InputValue
) {
	return {
		callback: (evt: CompanionFeedbackBooleanEvent) => {
			const context = getContext()

			const selected = selector(context.reaper, evt)

			if (selected === undefined) {
				context.log('warn', `Property callback: selector for feedback ${evt.feedbackId} was undefined`)
				return false
			}

			if (comparisonOption !== undefined) {
				return selected[property] === (evt.options[comparisonOption] === comparisonValue)
			}

			return selected[property] === (comparisonValue ?? true)
		},
		subscribe: (evt: CompanionFeedbackInfo) => SubscribeToProperty<T>(evt, getContext, selector, property),
		unsubscribe: (evt: CompanionFeedbackInfo) => Unbind(getContext, evt.id),
	}
}

function SubscribeToProperty<T extends INotifyPropertyChanged>(
	evt: CompanionFeedbackBooleanEvent,
	getContext: () => FeedbackContext,
	selector: (reaper: Reaper, evt: CompanionFeedbackBooleanEvent) => T | undefined,
	property: keyof T & string
) {
	const context = getContext()
	const selected = selector(context.reaper, evt)

	if (selected === undefined) {
		context.log('warn', `Property subscription: selector for feedback ${evt.feedbackId} was undefined`)
		return
	}

	const unsubscribe = selected.onPropertyChanged(property, () => {
		context.checkFeedback(evt.id)
	})

	AddBinding(context, evt.id, unsubscribe)
}

// Custom Message Feedback handlers currently don't support parsing the address, only the value to match on.
function CustomStringFeedbackHandler(
	getContext: () => FeedbackContext,
	address: string,
	matchValue: string,
	callback: (state: boolean) => void,
	parseVariables: (value: string) => Promise<string>
): IMessageHandler {
	return new StringMessageHandler(address, (messageValue) => {
		parseVariables(matchValue).then(
			(expanded) => {
				callback(expanded === messageValue)
			},
			(reason) => {
				getContext().log('error', `error parsing variable for custom message feedback: ${reason}`)
			}
		)
	})
}

function CustomFloatFeedbackHandler(
	getContext: () => FeedbackContext,
	address: string,
	matchValue: string,
	callback: (state: boolean) => void,
	parseVariables: (value: string) => Promise<string>
): IMessageHandler {
	return new FloatMessageHandler(address, (messageValue) => {
		parseVariables(matchValue).then(
			(expanded) => {
				const number = parseFloat(expanded)

				if (isNaN(number)) {
					getContext().log(
						'warn',
						`value was not a float: ${JSON.stringify({
							intitial_value: matchValue,
							expanded: expanded,
							parsed: number.toString(),
						})}`
					)
					return
				}

				callback(number === messageValue)
			},
			(reason) => {
				getContext().log('error', `error parsing variable for custom message feedback: ${reason}`)
			}
		)
	})
}
