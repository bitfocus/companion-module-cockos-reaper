import { Reaper, Track, TrackFx } from 'reaper-osc'

export function GetTrack(reaper: Reaper, trackNumber: number): Track | undefined {
	return trackNumber === 0 ? reaper.master : reaper.tracks[trackNumber - 1]
}

export function GetTrackFx(reaper: Reaper, trackNumber: number, fxNumber: number): TrackFx | undefined {
	const track = GetTrack(reaper, trackNumber)

	if (track === undefined) {
		return undefined
	}

	return track.fx[fxNumber - 1]
}
