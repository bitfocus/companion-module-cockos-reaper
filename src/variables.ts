import { CompanionVariableDefinition } from '@companion-module/base'
import { Reaper, Track, TrackFx, Transport } from 'reaper-osc'
import { INotifyPropertyChanged } from 'reaper-osc'

export type ReaperProperty = {
	item: INotifyPropertyChanged
	property: string
	valueSelector: (item: any) => any
}

export type ReaperPropertyVariableDefinition = {
	getProperty: (reaper: Reaper) => ReaperProperty
	valueConverter?: (value: any) => any
} & CompanionVariableDefinition

export function GetVariableDefinitions(numberOfTracks: number, numberOfFx: number): ReaperPropertyVariableDefinition[] {
	const variables: ReaperPropertyVariableDefinition[] = [
		{
			...TransportVariable('playStatus', 'Play Status', 'isPlaying'),
			valueConverter: (value) => (value ? 'Playing' : 'Paused'),
		},
		{
			...TransportVariable('stopStatus', 'Stopped Status', 'isStopped'),
			valueConverter: (value) => (value ? 'Stopped' : 'Playing'),
		},
		{
			...TransportVariable('recordStatus', 'Record Status', 'isRecording'),
			valueConverter: (value) => (value ? 'Recording' : 'Not Recording'),
		},
		{
			...TransportVariable('rewindStatus', 'Rewind Status', 'isRewinding'),
			valueConverter: (value) => (value ? 'Rewinding' : 'Not Rewinding'),
		},
		{
			...TransportVariable('forwardStatus', 'Fast Forward Status', 'isFastForwarding'),
			valueConverter: (value) => (value ? 'Fast Forwarding' : 'Not Fast Forwarding'),
		},
		{
			...TransportVariable('repeatStatus', 'Repeat Status', 'isRepeatEnabled'),
			valueConverter: (value) => (value ? 'Active' : 'Inactive'),
		},
		{
			...TransportVariable('repeatStatus', 'Repeat Status', 'isRepeatEnabled'),
			variableId: 'clickStatus',
			name: 'Click Status',
			getProperty: NotifyPropertySelector<Reaper>((reaper) => reaper, 'isMetronomeEnabled'),
			valueConverter: (value) => (value ? 'Active' : 'Inactive'),
		},
		{
			...TransportVariable('frames', 'Frames', 'frames'),
			valueConverter: (value) => value,
		},
		{
			...TransportVariable('beat', 'Beat', 'beat'),
			valueConverter: (value) => value,
		},
		{
			...TransportVariable('time', 'Time', 'time'),
			valueConverter: (value) => {
				const hours = Math.floor(value / 3600)
				const minutes = Math.floor((value / 60) % 60)
				const seconds = value % 60
				// build up time string in h:mm:ss.mmm format with optional hours section
				return `${hours > 0 ? hours + ':' + minutes.toString().padStart(2, '0') : minutes}:${seconds
					.toFixed(3)
					.padStart(6, '0')}`
			},
		},
	]

	for (let i = 0; i < numberOfTracks; i++) {
		const trackVariables = TrackVariables(i, numberOfFx)

		variables.push(...trackVariables)
	}

	return variables
}

function TrackVariables(trackIndex: number, numberOfFx: number): ReaperPropertyVariableDefinition[] {
	const variables: ReaperPropertyVariableDefinition[] = [
		{
			...TrackVariable(trackIndex, 'Mute', 'Muted', 'isMuted'),
			valueConverter: (value) => (value ? 'Muted' : 'Not Muted'),
		},
		{
			...TrackVariable(trackIndex, 'Solo', 'Soloed', 'isSoloed'),
			valueConverter: (value) => (value ? 'Soloed' : 'Not Soloed'),
		},
		{
			...TrackVariable(trackIndex, 'Recarm', 'Armed for Record', 'isRecordArmed'),
			valueConverter: (value) => (value ? 'Record Armed' : 'Record Disarmed'),
		},
		{
			...TrackVariable(trackIndex, 'Select', 'Selected', 'isSelected'),
			valueConverter: (value) => (value ? 'Selected' : 'Not Selected'),
		},
		{
			...TrackVariable(trackIndex, 'Name', 'Name', 'name'),
		},
		{
			...TrackVariable(trackIndex, 'Monitor', 'Monitoring', 'recordMonitoring'),
			valueConverter: (value) => (value ? 'Monitoring' : 'Not Monitoring'),
		},
		{
			...TrackVariable(trackIndex, 'VolumeDb', 'Volume (dB)', 'volumeDb'),
			valueConverter: (value) => `${value > 0 ? '+' : ''}${value.toFixed(2)}dB`,
		},
		{
			...TrackVariable(trackIndex, 'VolumeFaderPos', 'Volume (fader position)', 'volumeFaderPosition'),
		},
		{
			...TrackVariable(trackIndex, 'Pan', 'Pan', 'pan'),
			valueConverter: PanValueConverter,
		},
		{
			...TrackVariable(trackIndex, 'Pan2', 'Pan 2', 'pan2'),
			valueConverter: PanValueConverter,
		},
	]

	for (let i = 0; i < numberOfFx; i++) {
		const fxVariables = TrackFxVariables(trackIndex, i)

		variables.push(...fxVariables)
	}

	return variables
}

function TrackFxVariables(trackIndex: number, fxIndex: number): ReaperPropertyVariableDefinition[] {
	return [
		{
			...TrackFxVariable(trackIndex, fxIndex, 'Bypass', 'Bypassed', 'isBypassed'),
			valueConverter: (value) => (value ? 'Active' : 'Bypassed'),
		},
		{
			...TrackFxVariable(trackIndex, fxIndex, 'Name', 'Name', 'name'),
		},
		{
			...TrackFxVariable(trackIndex, fxIndex, 'Openui', 'UI Open', 'isUiOpen'),
			valueConverter: (value) => (value ? 'Open' : 'Closed'),
		},
	]
}

type ReaperPropertyVariable = Omit<ReaperPropertyVariableDefinition, 'valueConverter'>

function TransportVariable(id: string, name: string, property: keyof Transport & string): ReaperPropertyVariable {
	return {
		variableId: id,
		name: name,
		getProperty: NotifyPropertySelector<Transport>((reaper) => reaper.transport, property),
	}
}

function TrackVariable(
	trackIndex: number,
	id: string,
	name: string,
	property: keyof Track & string
): ReaperPropertyVariable {
	const trackNumber = trackIndex + 1

	return {
		variableId: `track${trackNumber}${id}`,
		name: `Track ${trackNumber} ${name}`,
		getProperty: NotifyPropertySelector<Track>((reaper) => reaper.tracks[trackIndex], property),
	}
}

function TrackFxVariable(
	trackIndex: number,
	fxIndex: number,
	id: string,
	name: string,
	property: keyof TrackFx & string
): ReaperPropertyVariable {
	const trackNumber = trackIndex + 1
	const fxNumber = fxIndex + 1

	return {
		variableId: `track${trackNumber}Fx${fxNumber}${id}`,
		name: `Track ${trackNumber} Fx ${fxNumber} ${name}`,
		getProperty: NotifyPropertySelector<TrackFx>((reaper) => reaper.tracks[trackIndex].fx[fxIndex], property),
	}
}

function NotifyPropertySelector<T extends INotifyPropertyChanged>(
	selector: (reaper: Reaper) => T,
	propertyName: keyof T & string
): (reaper: Reaper) => {
	item: T
	property: keyof T & string
	valueSelector: (item: T) => T[keyof T & string]
} {
	return (reaper: Reaper) => ({
		item: selector(reaper),
		property: propertyName,
		valueSelector: (item: T) => item[propertyName],
	})
}

function PanValueConverter(value: any): string {
	let pan = Math.fround(Number(value))

	// TODO: Add PanStr to reaper-osc and use that instead - these values don't always line up perfectly with
	// what's shown in Reaper due to differences in rounding
	if (pan > 0.5) {
		pan = pan - 0.5

		const pct = Math.round(pan * 2 * 100)

		return `${pct}%R`
	} else if (pan < 0.5) {
		pan = 0.5 - pan

		const pct = Math.round(pan * 2 * 100)

		return `${pct}%L`
	} else {
		return 'C'
	}
}
