var softwareVersion = '1.2';

var id;
var age;
var gender;
var sessionNumber;
var studyID;
var targetType;
var monitorSize;

var ppi;
var frameWidth;
var frameHeight;
var frameMarginHeight;
var targetWidth;
var targetHeight;
var spacing;

var viewStack = new Array();

var setupData = [];
var resultsData = [];
var currentTrialBlock = 0;
var numberOfPracticeBlocks = 1;
var numberofTrialSetInPracticeBlock = 1;
var totalTrialSetInPracticeBlock = numberOfPracticeBlocks*numberofTrialSetInPracticeBlock;
var numberOfExperimentBlocks = 3;
var numberofTrialSetInExperimentBlock = 4;
var totalTrialSetInExperimentBlock = numberOfExperimentBlocks*numberofTrialSetInExperimentBlock;
var totalTrialBlocks = totalTrialSetInPracticeBlock + totalTrialSetInExperimentBlock;

function getInputData() {
	id = document.getElementById('ID').value;
	targetType = document.getElementById('targetType').value;
	monitorSize = document.getElementById('monitorSize').value;
	ppi = calculatePPI();
	setupData = [id, targetType, new Date(), 'endDate', monitorSize, ppi];
	setupDisplay();
}

function calculatePPI() {
	screenWidth = screen.width;
	screenHeight = screen.height;
	aspectRatio = screenWidth/screenHeight;
	return ((screenWidth/(monitorSize))*(Math.sqrt(1 + (1/(aspectRatio*aspectRatio)))));
}

function submitForm() {
	getInputData();
	pushView('instructionPage1');
}

function pushView(viewID) {
	if (viewStack.length > 0)
		viewStack[viewStack.length - 1].style.visibility = "hidden";
	view = document.getElementById(viewID);
	view.style.visibility = "visible";
	viewStack.push(view);
}

function popView() {
	viewStack.pop().style.visibility = "hidden";
	viewStack[viewStack.length - 1].style.visibility = "visible";
}

function areYouReady() {
	if (currentTrialBlock < totalTrialSetInPracticeBlock) {
		document.getElementById('practiceFeedbackUP').style.visibility='visible';
		document.getElementById('practiceFeedbackDOWN').style.visibility='visible';
		startTest(currentTrialBlock, trialSet());
	} else if (currentTrialBlock < totalTrialBlocks) {
		document.getElementById('practiceFeedbackUP').style.visibility='hidden';
		document.getElementById('practiceFeedbackDOWN').style.visibility='hidden';
		if ((currentTrialBlock-totalTrialSetInPracticeBlock)%numberofTrialSetInExperimentBlock == 0) {
			alert('Are you ready to start Test#' + (((currentTrialBlock-totalTrialSetInPracticeBlock)/numberofTrialSetInExperimentBlock) + 1) + '?');
		}
		startTest(currentTrialBlock, trialSet());
	} else {
		popView();
		pushView('exportPage');
		generateExportLink(resultsData);
		currentTrialBlock = 0;
	}
}

function testCallback(block, data) {
	resultsData[block] = data;
	currentTrialBlock++;
	if (currentTrialBlock < totalTrialSetInPracticeBlock) {
		document.getElementById('practiceFeedbackUP').style.visibility='visible';
		document.getElementById('practiceFeedbackDOWN').style.visibility='visible';
		startTest(currentTrialBlock, trialSet());
	} else if (currentTrialBlock < totalTrialBlocks) {
		document.getElementById('practiceFeedbackUP').style.visibility='hidden';
		document.getElementById('practiceFeedbackDOWN').style.visibility='hidden';
		if ((currentTrialBlock-totalTrialSetInPracticeBlock)%numberofTrialSetInExperimentBlock == 0) {
			alert('Are you ready to start Test#' + (((currentTrialBlock-totalTrialSetInPracticeBlock)/numberofTrialSetInExperimentBlock) + 1) + '?');
		}
		startTest(currentTrialBlock, trialSet());
	} else {
		popView();
		pushView('exportPage');
		generateExportLink(resultsData);
		currentTrialBlock = 0;
	}
}
