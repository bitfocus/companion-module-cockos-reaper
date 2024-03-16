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

export function GetVariableDefinitions(): ReaperPropertyVariableDefinition[] {
	const variables: ReaperPropertyVariableDefinition[] = []

	variables.push(...LegacyVariableDefinitions())

	return variables
}

function LegacyVariableDefinitions(): ReaperPropertyVariableDefinition[] {
	const variables: ReaperPropertyVariableDefinition[] = [
		{
			...LegacyTransportVariable('playStatus', 'Play Status', 'isPlaying'),
			valueConverter: (value) => (value ? 'Playing' : 'Paused'),
		},
		{
			...LegacyTransportVariable('stopStatus', 'Stopped Status', 'isStopped'),
			valueConverter: (value) => (value ? 'Stopped' : 'Playing'),
		},
		{
			...LegacyTransportVariable('recordStatus', 'Record Status', 'isRecording'),
			valueConverter: (value) => (value ? 'Recording' : 'Not Recording'),
		},
		{
			...LegacyTransportVariable('rewindStatus', 'Rewind Status', 'isRewinding'),
			valueConverter: (value) => (value ? 'Rewinding' : 'Not Rewinding'),
		},
		{
			...LegacyTransportVariable('forwardStatus', 'Fast Forward Status', 'isFastForwarding'),
			valueConverter: (value) => (value ? 'Fast Forwarding' : 'Not Fast Forwarding'),
		},
		{
			...LegacyTransportVariable('repeatStatus', 'Repeat Status', 'isRepeatEnabled'),
			valueConverter: (value) => (value ? 'Active' : 'Inactive'),
		},
		{
			...LegacyTransportVariable('repeatStatus', 'Repeat Status', 'isRepeatEnabled'),
			variableId: 'clickStatus',
			name: 'Click Status',
			getProperty: NotifyPropertySelector<Reaper>((reaper) => reaper, 'isMetronomeEnabled'),
			valueConverter: (value) => (value ? 'Active' : 'Inactive'),
		},
	]

	for (let i = 0; i < 8; i++) {
		const trackVariables = LegacyTrackVariables(i)

		variables.push(...trackVariables)
	}

	return variables
}

function LegacyTrackVariables(trackIndex: number): ReaperPropertyVariableDefinition[] {
	const variables: ReaperPropertyVariableDefinition[] = [
		{
			...LegacyTrackVariable(trackIndex, 'Mute', 'Muted', 'isMuted'),
			valueConverter: (value) => (value ? 'Muted' : 'Not Muted'),
		},
		{
			...LegacyTrackVariable(trackIndex, 'Solo', 'Soloed', 'isSoloed'),
			valueConverter: (value) => (value ? 'Soloed' : 'Not Soloed'),
		},
		{
			...LegacyTrackVariable(trackIndex, 'Recarm', 'Armed for Record', 'isRecordArmed'),
			valueConverter: (value) => (value ? 'Record Armed' : 'Record Disarmed'),
		},
		{
			...LegacyTrackVariable(trackIndex, 'Select', 'Selected', 'isSelected'),
			valueConverter: (value) => (value ? 'Selected' : 'Not Selected'),
		},
		{
			...LegacyTrackVariable(trackIndex, 'Name', 'Name', 'name'),
		},
		{
			...LegacyTrackVariable(trackIndex, 'Monitor', 'Monitoring', 'recordMonitoring'),
			valueConverter: (value) => (value ? 'Monitoring' : 'Not Monitoring'),
		},
	]

	for (let i = 0; i < 8; i++) {
		const fxVariables = LegacyTrackFxVariables(trackIndex, i)

		variables.push(...fxVariables)
	}

	return variables
}

function LegacyTrackFxVariables(trackIndex: number, fxIndex: number): ReaperPropertyVariableDefinition[] {
	return [
		{
			...LegacyTrackFxVariable(trackIndex, fxIndex, 'Bypass', 'Bypassed', 'isBypassed'),
			valueConverter: (value) => (value ? 'Active' : 'Bypassed'),
		},
		{
			...LegacyTrackFxVariable(trackIndex, fxIndex, 'Name', 'Name', 'name'),
		},
		{
			...LegacyTrackFxVariable(trackIndex, fxIndex, 'Openui', 'UI Open', 'isUiOpen'),
			valueConverter: (value) => (value ? 'Open' : 'Closed'),
		},
	]
}

type ReaperPropertyVariable = Omit<ReaperPropertyVariableDefinition, 'valueConverter'>

function LegacyTransportVariable(id: string, name: string, property: keyof Transport & string): ReaperPropertyVariable {
	return {
		variableId: id,
		name: name,
		getProperty: NotifyPropertySelector<Transport>((reaper) => reaper.transport, property),
	}
}

function LegacyTrackVariable(
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

function LegacyTrackFxVariable(
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
