import {
	CompanionActionDefinition,
	CompanionActionDefinitions,
	CompanionActionEvent,
	CompanionInputFieldNumber,
	SomeCompanionActionInputField,
} from '@companion-module/base'
import { FloatMessage, OscMessage, Reaper, RecordMonitoringMode, StringMessage, Track, TrackFx } from 'reaper-osc'
import { ModuleContext } from './index'
import { BasicTextInput } from './inputs'
import { GetTrack, GetTrackFx } from './helpers'

export enum ActionId {
	// Transport
	Record = 'record',
	Play = 'play',
	Stop = 'stop',
	Pause = 'pause',
	StartRewind = 'start_rewind',
	StopRewind = 'stop_rewind',
	StartForward = 'start_forward',
	StopForward = 'stop_forward',
	ToggleClick = 'click',
	ToggleRepeat = 'repeat',
	GotoMarker = 'goto_marker',
	GotoRegion = 'goto_region',

	// Track
	TrackMute = 'track_mute',
	TrackSolo = 'track_solo',
	TrackArm = 'track_arm',
	TrackUnmute = 'track_unmute',
	TrackUnsolo = 'track_unsolo',
	TrackUnarm = 'track_unarm',
	TrackMuteToggle = 'track_mute_toggle',
	TrackSoloToggle = 'track_solo_toggle',
	TrackArmToggle = 'track_arm_toggle',
	TrackSelect = 'track_select',
	TrackDeselect = 'track_deselect',
	TrackMonitorEnable = 'track_monitor_enable',
	TrackMonitorDisable = 'track_monitor_disable',
	TrackSetVolumeDb = 'track_set_volume_db',
	TrackSetVolumeFaderPosition = 'track_set_volume_fader_position',
	TrackVolumeUp = 'track_volume_up',
	TrackVolumeDown = 'track_volume_down',
	TrackVolumeFade = 'track_volume_fade',
	TrackSetPan = 'track_set_pan',
	TrackSetPan2 = 'track_set_pan2',

	// Track FX
	TrackFxBypass = 'track_fx_bypass',
	TrackFxOpenUi = 'track_fx_openui',
	TrackFxUnbypass = 'track_fx_unbypass',
	TrackFxCloseUi = 'track_fx_closeui',
	TrackFxToggleUi = 'track_fx_toggleui',

	// General
	AutoRecordArm = 'autorecarm',
	SoloReset = 'soloreset',
	CustomAction = 'custom_action',
	RefreshOrc = 'refresh_osc',
	CustomMessage = 'custom_message',
}

export type ActionContext = ModuleContext

export function GetActionsList(getContext: () => ActionContext): CompanionActionDefinitions {
	const actions: { [id in ActionId]: CompanionActionDefinition | undefined } = {
		// Transport
		[ActionId.Record]: BasicAction('Record', getContext, (reaper) => reaper.transport.record()),
		[ActionId.Play]: BasicAction('Play', getContext, (reaper) => reaper.transport.play()),
		[ActionId.Stop]: BasicAction('Stop', getContext, (reaper) => reaper.transport.stop()),
		[ActionId.Pause]: BasicAction('Pause', getContext, (reaper) => reaper.transport.pause()),
		[ActionId.StartRewind]: BasicAction('Rewind (Start)', getContext, (reaper) => reaper.transport.startRewinding()),
		[ActionId.StopRewind]: BasicAction('Rewind (Stop)', getContext, (reaper) => reaper.transport.stopRewinding()),
		[ActionId.StartForward]: BasicAction('Fast Forward (Start)', getContext, (reaper) =>
			reaper.transport.startFastForwarding()
		),
		[ActionId.StopForward]: BasicAction('Fast Forward (Stop)', getContext, (reaper) =>
			reaper.transport.stopFastForwarding()
		),
		[ActionId.ToggleClick]: BasicAction('Toggle Click/Metronome', getContext, (reaper) => reaper.toggleMetronome()),
		[ActionId.ToggleRepeat]: BasicAction('Toggle Repeat', getContext, (reaper) => reaper.transport.toggleRepeat()),
		[ActionId.GotoMarker]: {
			name: 'Go To Marker',
			options: [
				{
					type: 'number',
					label: 'Marker Number',
					id: 'marker',
					default: 1,
					min: 1,
					max: 1024,
				},
			],
			callback: (evt) => {
				const context = getContext()

				const message = new OscMessage(`/marker/${evt.options.marker}`)

				// TODO: replace with built-in when it is supported
				context.reaper.sendOscMessage(message)
			},
		},
		[ActionId.GotoRegion]: {
			name: 'Go To Region',
			options: [
				{
					type: 'number',
					label: 'Region Number',
					id: 'region',
					default: 1,
					min: 1,
					max: 1024,
				},
			],
			callback: (evt) => {
				const context = getContext()

				const message = new OscMessage(`/region/${evt.options.region}`)

				// TODO: replace with built-in when it is supported
				context.reaper.sendOscMessage(message)
			},
		},

		// Track Actions
		[ActionId.TrackMute]: TrackAction('Mute', getContext, (track) => track.mute()),
		[ActionId.TrackSolo]: TrackAction('Solo', getContext, (track) => track.solo()),
		[ActionId.TrackArm]: TrackAction('Arm', getContext, (track) => track.recordArm()),
		[ActionId.TrackUnmute]: TrackAction('Unmute', getContext, (track) => track.unmute()),
		[ActionId.TrackUnsolo]: TrackAction('Unsolo', getContext, (track) => track.unsolo()),
		[ActionId.TrackUnarm]: TrackAction('Unarm', getContext, (track) => track.recordDisarm()),
		[ActionId.TrackMuteToggle]: TrackAction('Mute Toggle', getContext, (track) => track.toggleMute()),
		[ActionId.TrackSoloToggle]: TrackAction('Solo Toggle', getContext, (track) => track.toggleSolo()),
		[ActionId.TrackArmToggle]: TrackAction('Record Arm Toggle', getContext, (track) => track.toggleRecordArm()),
		[ActionId.TrackSelect]: TrackAction('Select', getContext, (track) => track.select()),
		[ActionId.TrackDeselect]: TrackAction('Deselect', getContext, (track) => track.deselect()),
		[ActionId.TrackMonitorEnable]: TrackAction('Monitoring Enable', getContext, (track) =>
			track.setMonitoringMode(RecordMonitoringMode.ON)
		),
		[ActionId.TrackMonitorDisable]: TrackAction('Monitoring Disable', getContext, (track) =>
			track.setMonitoringMode(RecordMonitoringMode.OFF)
		),
		[ActionId.TrackSetVolumeDb]: TrackSetVolumeDbAction(getContext),
		[ActionId.TrackSetVolumeFaderPosition]: TrackSetVolumeFaderPositionAction(getContext),
		[ActionId.TrackVolumeUp]: TrackVolumeRelativeAction(getContext, 'up'),
		[ActionId.TrackVolumeDown]: TrackVolumeRelativeAction(getContext, 'down'),
		[ActionId.TrackVolumeFade]: TrackVolumeFadeAction(getContext),
		[ActionId.TrackSetPan]: TrackSetPanAction(getContext),
		[ActionId.TrackSetPan2]: TrackSetPan2Action(getContext),

		// Track Fx actions
		[ActionId.TrackFxBypass]: TrackFxAction('Bypass', getContext, (fx) => fx.bypass()),
		[ActionId.TrackFxOpenUi]: TrackFxAction('Open UI', getContext, (fx) => fx.openUi()),
		[ActionId.TrackFxUnbypass]: TrackFxAction('Unbypass', getContext, (fx) => fx.unbypass()),
		[ActionId.TrackFxCloseUi]: TrackFxAction('Close UI', getContext, (fx) => fx.closeUi()),
		[ActionId.TrackFxToggleUi]: TrackFxAction('Toggle UI', getContext, (fx) =>
			fx.isUiOpen ? fx.closeUi() : fx.openUi()
		),

		// General
		[ActionId.AutoRecordArm]: BasicAction('Autoarm Record', getContext, (reaper) => {
			// TODO: replace with built-in when it is supported
			const message = new OscMessage('/autorecarm')

			reaper.sendOscMessage(message)
		}),
		[ActionId.SoloReset]: BasicAction('Reset Solos', getContext, (reaper) => {
			// TODO: replace with built-in when it is supported
			const message = new OscMessage('/soloreset')

			reaper.sendOscMessage(message)
		}),
		[ActionId.CustomAction]: {
			name: 'Custom Action',
			description: 'Execute a Reaper action',
			options: [BasicTextInput('Action Command ID', 'action_cmd_id', undefined, true, true)],
			callback: async (evt, ctx) => {
				const context = getContext()

				let command_id = evt.options.action_cmd_id

				if (typeof command_id !== 'string') {
					return
				}

				command_id = await ctx.parseVariablesInString(command_id)

				context.reaper.triggerAction(command_id)
			},
		},
		[ActionId.CustomMessage]: {
			name: 'Custom OSC Message',
			description: 'Send a custom OSC message',
			options: [
				BasicTextInput('OSC Address', 'address', undefined, true, true),
				{
					type: 'dropdown',
					label: 'Message Type',
					id: 'type',
					default: 'f',
					choices: [
						{ id: 'f', label: 'Number' },
						{ id: 's', label: 'String' },
						{ id: 't', label: 'Toggle' },
					],
				},
				{
					type: 'textinput',
					label: 'Value',
					id: 'value',
					isVisible: (opts) => {
						switch (opts.type) {
							case 'f':
							case 's':
								return true
							default:
								return false
						}
					},
					useVariables: true,
				},
			],
			callback: async (evt, ctx) => {
				const context = getContext()

				let address = evt.options.address
				let value = evt.options.value

				if (typeof address !== 'string') {
					return
				}

				address = await ctx.parseVariablesInString(address)

				if (typeof value === 'string') {
					value = await ctx.parseVariablesInString(value)
				}

				let message: OscMessage

				switch (evt.options.type) {
					case 'f':
						message = new FloatMessage(address, Number(value))
						break
					case 's':
						message = new StringMessage(address, <string>value)
						break
					case 't':
						message = new OscMessage(address)
						break
					default:
						return
				}

				context.reaper.sendOscMessage(message)
			},
		},
		[ActionId.RefreshOrc]: BasicAction('Refresh OSC', getContext, (reaper) => reaper.refreshControlSurfaces()),
	}

	return actions
}

function BasicAction(
	name: string,
	getContext: () => ActionContext,
	action: (reaper: Reaper) => void
): CompanionActionDefinition {
	return {
		name: name,
		options: [],
		callback: () => {
			const context = getContext()

			action(context.reaper)
		},
	}
}

function TrackOption(): CompanionInputFieldNumber {
	return {
		type: 'number',
		label: 'Track',
		id: 'track',
		tooltip: 'Use 0 to apply this action to MASTER',
		default: 1,
		min: 0,
		max: 1024,
		required: true,
	}
}

function FxOption(): CompanionInputFieldNumber {
	return {
		type: 'number',
		label: 'Fx',
		id: 'fx',
		default: 1,
		min: 1,
		max: 1024,
		required: true,
	}
}

function TrackAction(
	name: string,
	getContext: () => ActionContext,
	action: (track: Track, evt: CompanionActionEvent) => void,
	additionalOptions: SomeCompanionActionInputField[] = []
): CompanionActionDefinition {
	return {
		name: `Track ${name}`,
		options: [TrackOption(), ...additionalOptions],
		callback: (evt) => {
			const context = getContext()

			const track = GetTrack(context.reaper, Number(evt.options.track))

			if (track === undefined) {
				context.log('warn', `Track ${evt.options.track} not found`)
				return
			}

			action(track, evt)
		},
	}
}

function TrackFxAction(
	name: string,
	getContext: () => ActionContext,
	action: (fx: TrackFx) => void
): CompanionActionDefinition {
	return {
		name: `Track Fx ${name}`,
		options: [TrackOption(), FxOption()],
		callback: (evt) => {
			const context = getContext()

			const fx = GetTrackFx(context.reaper, Number(evt.options.track), Number(evt.options.fx))

			if (fx === undefined) {
				context.log('warn', `Track ${evt.options.track} Fx ${evt.options.fx} not found`)
				return
			}

			action(fx)
		},
	}
}

function TrackSetVolumeDbAction(getContext: () => ActionContext): CompanionActionDefinition {
	const volumeOption: CompanionInputFieldNumber = {
		type: 'number',
		label: 'Volume (dB)',
		id: 'volumeDb',
		default: 0,
		min: -100,
		max: 12,
	}

	return TrackAction(
		'Set Volume (dB)',
		getContext,
		(track, evt) => {
			track.setVolumeDb(Number(evt.options.volumeDb))
		},
		[volumeOption]
	)
}

function TrackSetVolumeFaderPositionAction(getContext: () => ActionContext): CompanionActionDefinition {
	const volumeOption: CompanionInputFieldNumber = {
		type: 'number',
		label: 'Volume (fader position)',
		id: 'volumeFaderPos',
		default: 0,
		min: 0,
		max: 1,
	}

	return TrackAction(
		'Set Volume (fader position)',
		getContext,
		(track, evt) => {
			track.setVolumeFaderPosition(Number(evt.options.volumeFaderPos))
		},
		[volumeOption]
	)
}

function TrackVolumeRelativeAction(getContext: () => ActionContext, direction: 'up' | 'down') {
	const stepSizeOption: CompanionInputFieldNumber = {
		type: 'number',
		label: 'Step Size',
		id: 'stepSize',
		default: 0.01,
		min: 0.001,
		max: 1,
		step: 0.01,
	}

	return TrackAction(
		`Volume ${direction === 'up' ? 'Up' : 'Down'}`,
		getContext,
		(track, evt) => {
			const step = Number(evt.options.stepSize) * (direction === 'up' ? 1 : -1)

			const newPosition =
				direction === 'up'
					? Math.min(track.volumeFaderPosition + step, 1)
					: Math.max(track.volumeFaderPosition + step, 0)

			track.setVolumeFaderPosition(newPosition)
		},
		[stepSizeOption]
	)
}

function TrackSetPanAction(getContext: () => ActionContext): CompanionActionDefinition {
	const panOption: CompanionInputFieldNumber = {
		type: 'number',
		label: 'Pan',
		id: 'pan',
		default: 0,
		min: 0,
		max: 1,
		step: 0.1,
	}

	return TrackAction(
		'Set Pan',
		getContext,
		(track, evt) => {
			track.setPan(Number(evt.options.pan))
		},
		[panOption]
	)
}

function TrackSetPan2Action(getContext: () => ActionContext): CompanionActionDefinition {
	const panOption: CompanionInputFieldNumber = {
		type: 'number',
		label: 'Pan',
		id: 'pan2',
		default: 0,
		min: 0,
		max: 1,
		step: 0.1,
	}

	return TrackAction(
		'Set Pan 2',
		getContext,
		(track, evt) => {
			track.setPan2(Number(evt.options.pan2))
		},
		[panOption]
	)
}

function TrackVolumeFadeAction(getContext: () => ActionContext): CompanionActionDefinition {
	const timeOption: CompanionInputFieldNumber = {
		type: 'number',
		label: 'Fade Duration (ms)',
		id: 'duration',
		default: 5000,
		min: 50,
		max: 30000,
	}

	const volumeOption: CompanionInputFieldNumber = {
		type: 'number',
		label: 'Target Volume (dB)',
		id: 'volumeDb',
		default: 0,
		min: -100,
		max: 12,
	}

	return TrackAction(
		'Volume Fade',
		getContext,
		(track, evt) => FadeVolume(getContext, track, Number(evt.options.duration), Number(evt.options.volumeDb)),
		[timeOption, volumeOption]
	)
}

function FadeVolume(getContext: () => ActionContext, track: Track, duration: number, targetVolumeDb: number) {
	// Audio fades are complicated due to the logarithmic nature of dB, and I am bad at math, so I have kept this
	// simple with a linear fade.
	const stepDuration = 50
	const steps = Math.ceil(duration / stepDuration)
	const initialVolume = track.volumeDb
	const currentVolumeDifference = targetVolumeDb - initialVolume

	if (currentVolumeDifference === 0) {
		return
	}

	const stepSize = currentVolumeDifference / steps
	let currentStep = 0

	getContext().log(
		'debug',
		`Beginning volume fade for track ${track.trackNumber} ${JSON.stringify({
			duration,
			stepDuration,
			steps,
			targetVolumeDb,
			initialVolume,
			stepSize,
		})}`
	)

	const intervalId = setInterval(() => {
		if (currentStep === steps || track.volumeDb === targetVolumeDb) {
			clearInterval(intervalId)

			// Just in case...
			if (track.volumeDb != targetVolumeDb) {
				track.setVolumeDb(targetVolumeDb)
			}

			return
		}

		currentStep++
		track.setVolumeDb(initialVolume + currentStep * stepSize)
	}, stepDuration)
}
