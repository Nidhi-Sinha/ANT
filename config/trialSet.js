//This is the data to be used in each trial.  These settings are selected at random as the test runs (in trial.js), but in here they can be in order.
function trialSet() {
//	These are set now -> 0-CueType, 1-TargetType, 2-TargetDirection
//  These will be set later -> 3-CuePosition, 4-TargetPosition, 5-FlankDirection

	return [
		['noCue','congruent','Left'],
		['noCue','congruent','Right'],
		['noCue','incongruent','Left'],
		['noCue','incongruent','Right'],
		['noCue','neutral','Left'],
		['noCue','neutral','Right'],
		['centerCue','congruent','Left'],
		['centerCue','congruent','Right'],
		['centerCue','incongruent','Left'],
		['centerCue','incongruent','Right'],
		['centerCue','neutral','Left'],
		['centerCue','neutral','Right'],
		['doubleCue','congruent','Left'],
		['doubleCue','congruent','Right'],
		['doubleCue','incongruent','Left'],
		['doubleCue','incongruent','Right'],
		['doubleCue','neutral','Left'],
		['doubleCue','neutral','Right'],
		['spatialCue','congruent','Left'],
		['spatialCue','congruent','Right'],
		['spatialCue','incongruent','Left'],
		['spatialCue','incongruent','Right'],
		['spatialCue','neutral','Left'],
		['spatialCue','neutral','Right'],
	];
}
