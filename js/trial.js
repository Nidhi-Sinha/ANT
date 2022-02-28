//The entire test runs as a state machine, due to all the callbacks.  Callbacks prevent us from using loops and other nice things, since they would break out of the loops anyway.

var trialResults = [];
var currentBlock;
var currentTrial;
var trialCount=24;
var trialStartTime;

function getOppositeDirection(direction) {
	switch (direction) {
		case 'left':
			return 'right';
		case 'right':
			return 'left'
		case 'Left':
			return 'Right';
		case 'Right':
			return 'Left'
		default:
			return direction;
	}
}

//blockNumber is the current phase of te test.  It will be 0 for the practice phase and then 1 and 2 for the actual test
//inputTrialSet is expected to contain the trials, order doesn't matter (it's randomized internally).  Each trial is run exactly once.  If you need duplicates of trials, they MUST be in here multiple times.
function startTest(blockNumber, inputTrialSet) {
	document.onkeydown = earlyEnd;			//Set the early interrupt
	currentBlock = blockNumber;				//Keep track of the current block
	currentTrial = 0;						//The current data set uses 32 trials/test
	trialCount = inputTrialSet.length;		//Number of trials in each round of test
	trialResults = [];						//We'll keep our results in this array
	practiceFeedbackUP = document.getElementById('practiceFeedbackUP');
	practiceFeedbackDOWN = document.getElementById('practiceFeedbackDOWN');
	iPadLeft = 	document.getElementById('iPadLeft');
	iPadRight = document.getElementById('iPadRight');

	//Setup the test in random order
	for (trialIndex=currentTrial; trialIndex<(trialCount+currentTrial); trialIndex++) {
		sourceTrial = randomNumber(0,(inputTrialSet.length-1));		//Get a random trial
		trialResults[trialIndex] = inputTrialSet[sourceTrial];	//Set up the results to contain the trial info
		inputTrialSet.splice(sourceTrial,1);							//Remove the current trial from the pool, so we don't get it again
	}

	//Go through the test in reverse order and setup the view stack so we can quickly flip through them during testing
	for (reverseTrialIndex=(trialResults.length-1);reverseTrialIndex>=currentTrial;reverseTrialIndex--) {
		targetSpatialDirection = 'Up';
		if (Math.random() >= 0.5) {
			targetSpatialDirection = 'Down';
		}
		cueSpatialDirection = '';
		if (trialResults[reverseTrialIndex][0] == 'spatialCue') {
			cueSpatialDirection = targetSpatialDirection;
		}
		trialResults[reverseTrialIndex][3] = cueSpatialDirection;
		trialResults[reverseTrialIndex][4] = targetSpatialDirection;
		switch (trialResults[reverseTrialIndex][1]) {								//Response
			case 'congruent':
				trialResults[reverseTrialIndex][5] = targetSpatialDirection;
				break;
			case 'incongruent':
				trialResults[reverseTrialIndex][5] = getOppositeDirection(targetSpatialDirection);
				break;
			default:
				trialResults[reverseTrialIndex][5] = 'None';
				break;
		}
		pushView('noCue');
		pushView(trialResults[reverseTrialIndex][1] + targetSpatialDirection + trialResults[reverseTrialIndex][2]);
		pushView('noCue');
		pushView(trialResults[reverseTrialIndex][0] + cueSpatialDirection);
		pushView('noCue');
	}
	pushView('blankView');
	startTrial();							//Start the first trial
}

function startTrial() {
	trialResults[currentTrial][10] = new Date();							//Start time, for accurate inter-trial times
	stage1();														//Move on to the first screen
}

//Initial Fixation
function stage1() {
	stage1Time = randomNumber(400,1600);		//Get a random integer between 400 and 1000
	popView();									//Display the fixation cross
	currentTimer = setTimeout('stage2()',stage1Time);			//Delay for the random period above
	//Risky to do things after the timeout is set, but it keeps us on time
	trialResults[currentTrial][6] = stage1Time;	//Save the time in the output
	practiceFeedbackUP.innerHTML = '';
	practiceFeedbackDOWN.innerHTML = '';
	}

//Cue
function stage2() {
	popView();					//Display the appropriate cue
	currentTimer = setTimeout('stage3()',100);	//Delay 100ms
}

//Second Fixation
function stage3() {
	popView();					//Remove the cue
	currentTimer = setTimeout('stage4()',400);	//Delay 400ms
}

//Target
function stage4() {
	popView();											//Display the target
	stage4Timer = startTimer('stage4Callback()',1700);	//Delay 1700ms unless interrupted.  We use the startTimer() function for an interruptable timer.
	trialResults[currentTrial][11] = new Date();		//Save the current date (for time later)
	document.onkeydown = stage4Interrupted;				//Set up the interrupt
}

//Timeout
function stage4Callback() {
	document.onkeydown = earlyEnd;				//Disable that interrupt so it can't be triggered later
	trialResults[currentTrial][7] = 1700;	//Failed, so max reation time
	trialResults[currentTrial][8] = 0;		//No key pressed
	practiceFeedbackUP.innerHTML = 'Timeout';
	practiceFeedbackDOWN.innerHTML = 'Timeout';
	stage5();								//Proceed to next stage immediately
}

//Interrupt
function stage4Interrupted(e) {
	//Check e (for IE safety)
	if (!e) {
		e = window.event;												//If IE, use window.event instead
	}
	//Check if it was a key we care about (shift key)
	if (e.keyCode == 16) {
		//Check if it was a key we care about (left or right shift key)
		if (e.location == KeyboardEvent.DOM_KEY_LOCATION_LEFT) {
			document.onkeydown = earlyEnd;									//We're in!  Disable interrupt
			trialResults[currentTrial][7] = interruptTimer(stage4Timer);	//Stop the timer and get the reaction time
			trialResults[currentTrial][8] = e.location;						//Save the keycode for later
			if(trialResults[currentTrial][2] == 'Left'){
				practiceFeedbackUP.innerHTML = 'Correct';
				practiceFeedbackDOWN.innerHTML = 'Correct';
			} else {
				practiceFeedbackUP.innerHTML = 'Incorrect';
				practiceFeedbackDOWN.innerHTML = 'Incorrect';
			}
			stage5();														//Proceed to next stage
		} else if (e.location == KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
			document.onkeydown = earlyEnd;									//We're in!  Disable interrupt
			trialResults[currentTrial][7] = interruptTimer(stage4Timer);	//Stop the timer and get the reaction time
			trialResults[currentTrial][8] = e.location;						//Save the keycode for later
			if(trialResults[currentTrial][2] == 'Right'){
				practiceFeedbackUP.innerHTML = 'Correct';
				practiceFeedbackDOWN.innerHTML = 'Correct';
			} else {
				practiceFeedbackUP.innerHTML = 'Incorrect';
				practiceFeedbackDOWN.innerHTML = 'Incorrect';
			}
			stage5();														//Proceed to next stage
		}
	} else if (e.keyCode == 27) {
		earlyEnd(e);
	}
}

//Inter-trial Fixation
function stage5() {
	popView();							//Show the fixation again
	nowDate = new Date().getTime();		//Get the date for use in the timeout
	if (currentTrial<(trialCount-1)){	//If we're not on the last trial, we loop
		currentTrial++;					//Increment the number for the next round
		currentTimer = setTimeout('startTrial()', 3500-(nowDate-trialResults[currentTrial-1][10].getTime()));
		//We set up the timer to use the time delta from the beginning, rather than adding up the stage 1 and 4 times above.  This keeps everything ever-so-slightly more accurate throughout multiple trials
	} else {
		//If we are done, let's wrap it up
		currentTimer = setTimeout('endTest()', 3500-(nowDate-trialResults[currentTrial][10].getTime()));
	}
}

function earlyEnd(e) {
	//Check e (for IE safety)
	if (!e) {
		e = window.event;												//If IE, use window.event instead
	}
	//Check if it was a key we care about (left or right arrow)
	if (e.keyCode == 27) {
		//Kill all timers
		clearTimeout(currentTimer);
		clearTimeout(stage4Timer);
		//Disable keydown event trigger
		document.onkeydown = null;
		//Delete current trial
		trialResults.splice(currentTrial, trialCount-currentTrial);
		if(currentTrialBlock || !confirm('Press OK to skip the practice round or press Cancel to cancel the entire test')) {
			//Turn up the currentBlock so that no more tests will run
			currentTrialBlock = totalTrialBlocks;
		}
		//End test/trial
		endTest();
	}
}

//Finale
function endTest() {
	testCallback(currentBlock,trialResults);		//That's it!  Let's move on to the results.
}
