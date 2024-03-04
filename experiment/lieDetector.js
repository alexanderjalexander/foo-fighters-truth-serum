/******************** 
 * Liedetector *
 ********************/

import { core, data, sound, util, visual, hardware } from './lib/psychojs-2023.2.3.js';
const { PsychoJS } = core;
const { TrialHandler, MultiStairHandler } = data;
const { Scheduler } = util;
//some handy aliases as in the psychopy scripts;
const { abs, sin, cos, PI: pi, sqrt } = Math;
const { round } = util;


// store info about the experiment session:
let expName = 'lieDetector';  // from the Builder filename that created this script
let expInfo = {
    'participant': `${util.pad(Number.parseFloat(util.randint(0, 999999)).toFixed(0), 6)}`,
    'session': '001',
};

// Start code blocks for 'Before Experiment'
// init psychoJS:
const psychoJS = new PsychoJS({
  debug: true
});

// open window:
psychoJS.openWindow({
  fullscr: false,
  color: new util.Color([0,0,0]),
  units: 'height',
  waitBlanking: true,
  backgroundImage: '',
  backgroundFit: 'none',
});
// schedule the experiment:
psychoJS.schedule(psychoJS.gui.DlgFromDict({
  dictionary: expInfo,
  title: expName
}));

const flowScheduler = new Scheduler(psychoJS);
const dialogCancelScheduler = new Scheduler(psychoJS);
psychoJS.scheduleCondition(function() { return (psychoJS.gui.dialogComponent.button === 'OK'); }, flowScheduler, dialogCancelScheduler);

// flowScheduler gets run if the participants presses OK
flowScheduler.add(updateInfo); // add timeStamp
flowScheduler.add(experimentInit);
flowScheduler.add(welcomeScreenRoutineBegin());
flowScheduler.add(welcomeScreenRoutineEachFrame());
flowScheduler.add(welcomeScreenRoutineEnd());
const trialsLoopLoopScheduler = new Scheduler(psychoJS);
flowScheduler.add(trialsLoopLoopBegin(trialsLoopLoopScheduler));
flowScheduler.add(trialsLoopLoopScheduler);
flowScheduler.add(trialsLoopLoopEnd);


flowScheduler.add(goodbyeScreenRoutineBegin());
flowScheduler.add(goodbyeScreenRoutineEachFrame());
flowScheduler.add(goodbyeScreenRoutineEnd());
flowScheduler.add(quitPsychoJS, '', true);

// quit if user presses Cancel in dialog box:
dialogCancelScheduler.add(quitPsychoJS, '', false);

psychoJS.start({
  expName: expName,
  expInfo: expInfo,
  resources: [
    // resources:
    {'name': 'alphanumericCharacters.xlsx', 'path': 'alphanumericCharacters.xlsx'},
  ]
});

psychoJS.experimentLogger.setLevel(core.Logger.ServerLevel.ERROR);


var currentLoop;
var frameDur;
async function updateInfo() {
  currentLoop = psychoJS.experiment;  // right now there are no loops
  expInfo['date'] = util.MonotonicClock.getDateStr();  // add a simple timestamp
  expInfo['expName'] = expName;
  expInfo['psychopyVersion'] = '2023.2.3';
  expInfo['OS'] = window.navigator.platform;


  // store frame rate of monitor if we can measure it successfully
  expInfo['frameRate'] = psychoJS.window.getActualFrameRate();
  if (typeof expInfo['frameRate'] !== 'undefined')
    frameDur = 1.0 / Math.round(expInfo['frameRate']);
  else
    frameDur = 1.0 / 60.0; // couldn't get a reliable measure so guess

  // add info from the URL:
  util.addInfoFromUrl(expInfo);
  

  
  psychoJS.experiment.dataFileName = (("." + "/") + `data/${expInfo["participant"]}_${expName}_${expInfo["date"]}`);
  psychoJS.experiment.field_separator = '\t';


  return Scheduler.Event.NEXT;
}


var welcomeScreenClock;
var welcomeText;
var spaceToStart;
var trialClock;
var trialQuestionText;
var trialCharacterText;
var trialPressKey;
var goodbyeScreenClock;
var goodbyeText;
var globalClock;
var routineTimer;
async function experimentInit() {
  // Initialize components for Routine "welcomeScreen"
  welcomeScreenClock = new util.Clock();
  welcomeText = new visual.TextStim({
    win: psychoJS.window,
    name: 'welcomeText',
    text: "Hello! Welcome to our lie detection experiment.\nWhen you see a number or letter appear on your screen, please press that button on your keyboard to move on to the next screen.\nYou may lie or tell the truth, but we'll know...\n\nPress SPACE to start the experiment.",
    font: 'Open Sans',
    units: undefined, 
    pos: [0, 0], height: 0.04,  wrapWidth: undefined, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: 0.0 
  });
  
  spaceToStart = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
  // Initialize components for Routine "trial"
  trialClock = new util.Clock();
  trialQuestionText = new visual.TextStim({
    win: psychoJS.window,
    name: 'trialQuestionText',
    text: 'What number/letter do you see on this screen below?\nPlease press the corresponding button on your keyboard.\nYou may lie or tell the truth.',
    font: 'Open Sans',
    units: undefined, 
    pos: [0, 0.3], height: 0.03,  wrapWidth: undefined, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: 0.0 
  });
  
  trialCharacterText = new visual.TextStim({
    win: psychoJS.window,
    name: 'trialCharacterText',
    text: '',
    font: 'Open Sans',
    units: undefined, 
    pos: [0, 0], height: 0.3,  wrapWidth: undefined, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: -1.0 
  });
  
  trialPressKey = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});
  
  // Initialize components for Routine "goodbyeScreen"
  goodbyeScreenClock = new util.Clock();
  goodbyeText = new visual.TextStim({
    win: psychoJS.window,
    name: 'goodbyeText',
    text: 'Thank you for participating in our experiment!\n\nYour input has been very valuable.\nHave a nice day!\n\nYou may press ESC to close this window.',
    font: 'Open Sans',
    units: undefined, 
    pos: [0, 0], height: 0.05,  wrapWidth: undefined, ori: 0.0,
    languageStyle: 'LTR',
    color: new util.Color('white'),  opacity: undefined,
    depth: 0.0 
  });
  
  // Create some handy timers
  globalClock = new util.Clock();  // to track the time since experiment started
  routineTimer = new util.CountdownTimer();  // to track time remaining of each (non-slip) routine
  
  return Scheduler.Event.NEXT;
}


var t;
var frameN;
var continueRoutine;
var _spaceToStart_allKeys;
var welcomeScreenComponents;
function welcomeScreenRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'welcomeScreen' ---
    t = 0;
    welcomeScreenClock.reset(); // clock
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // update component parameters for each repeat
    psychoJS.experiment.addData('welcomeScreen.started', globalClock.getTime());
    spaceToStart.keys = undefined;
    spaceToStart.rt = undefined;
    _spaceToStart_allKeys = [];
    // keep track of which components have finished
    welcomeScreenComponents = [];
    welcomeScreenComponents.push(welcomeText);
    welcomeScreenComponents.push(spaceToStart);
    
    for (const thisComponent of welcomeScreenComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


function welcomeScreenRoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'welcomeScreen' ---
    // get current time
    t = welcomeScreenClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *welcomeText* updates
    if (t >= 0.0 && welcomeText.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      welcomeText.tStart = t;  // (not accounting for frame time here)
      welcomeText.frameNStart = frameN;  // exact frame index
      
      welcomeText.setAutoDraw(true);
    }
    
    
    // *spaceToStart* updates
    if (t >= 0.0 && spaceToStart.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      spaceToStart.tStart = t;  // (not accounting for frame time here)
      spaceToStart.frameNStart = frameN;  // exact frame index
      
      // keyboard checking is just starting
      spaceToStart.clock.reset();
      spaceToStart.start();
      spaceToStart.clearEvents();
    }
    
    if (spaceToStart.status === PsychoJS.Status.STARTED) {
      let theseKeys = spaceToStart.getKeys({keyList: ['space'], waitRelease: false});
      _spaceToStart_allKeys = _spaceToStart_allKeys.concat(theseKeys);
      if (_spaceToStart_allKeys.length > 0) {
        spaceToStart.keys = _spaceToStart_allKeys[0].name;  // just the first key pressed
        spaceToStart.rt = _spaceToStart_allKeys[0].rt;
        spaceToStart.duration = _spaceToStart_allKeys[0].duration;
        // a response ends the routine
        continueRoutine = false;
      }
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of welcomeScreenComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function welcomeScreenRoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'welcomeScreen' ---
    for (const thisComponent of welcomeScreenComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    psychoJS.experiment.addData('welcomeScreen.stopped', globalClock.getTime());
    // update the trial handler
    if (currentLoop instanceof MultiStairHandler) {
      currentLoop.addResponse(spaceToStart.corr, level);
    }
    psychoJS.experiment.addData('spaceToStart.keys', spaceToStart.keys);
    if (typeof spaceToStart.keys !== 'undefined') {  // we had a response
        psychoJS.experiment.addData('spaceToStart.rt', spaceToStart.rt);
        psychoJS.experiment.addData('spaceToStart.duration', spaceToStart.duration);
        routineTimer.reset();
        }
    
    spaceToStart.stop();
    // the Routine "welcomeScreen" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}


var trialsLoop;
function trialsLoopLoopBegin(trialsLoopLoopScheduler, snapshot) {
  return async function() {
    TrialHandler.fromSnapshot(snapshot); // update internal variables (.thisN etc) of the loop
    
    // set up handler to look after randomisation of conditions etc
    trialsLoop = new TrialHandler({
      psychoJS: psychoJS,
      nReps: 1, method: TrialHandler.Method.FULLRANDOM,
      extraInfo: expInfo, originPath: undefined,
      trialList: 'alphanumericCharacters.xlsx',
      seed: undefined, name: 'trialsLoop'
    });
    psychoJS.experiment.addLoop(trialsLoop); // add the loop to the experiment
    currentLoop = trialsLoop;  // we're now the current loop
    
    // Schedule all the trials in the trialList:
    for (const thisTrialsLoop of trialsLoop) {
      snapshot = trialsLoop.getSnapshot();
      trialsLoopLoopScheduler.add(importConditions(snapshot));
      trialsLoopLoopScheduler.add(trialRoutineBegin(snapshot));
      trialsLoopLoopScheduler.add(trialRoutineEachFrame());
      trialsLoopLoopScheduler.add(trialRoutineEnd(snapshot));
      trialsLoopLoopScheduler.add(trialsLoopLoopEndIteration(trialsLoopLoopScheduler, snapshot));
    }
    
    return Scheduler.Event.NEXT;
  }
}


async function trialsLoopLoopEnd() {
  // terminate loop
  psychoJS.experiment.removeLoop(trialsLoop);
  // update the current loop from the ExperimentHandler
  if (psychoJS.experiment._unfinishedLoops.length>0)
    currentLoop = psychoJS.experiment._unfinishedLoops.at(-1);
  else
    currentLoop = psychoJS.experiment;  // so we use addData from the experiment
  return Scheduler.Event.NEXT;
}


function trialsLoopLoopEndIteration(scheduler, snapshot) {
  // ------Prepare for next entry------
  return async function () {
    if (typeof snapshot !== 'undefined') {
      // ------Check if user ended loop early------
      if (snapshot.finished) {
        // Check for and save orphaned data
        if (psychoJS.experiment.isEntryEmpty()) {
          psychoJS.experiment.nextEntry(snapshot);
        }
        scheduler.stop();
      } else {
        psychoJS.experiment.nextEntry(snapshot);
      }
    return Scheduler.Event.NEXT;
    }
  };
}


var _trialPressKey_allKeys;
var trialComponents;
function trialRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'trial' ---
    t = 0;
    trialClock.reset(); // clock
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // update component parameters for each repeat
    psychoJS.experiment.addData('trial.started', globalClock.getTime());
    trialCharacterText.setText(characterDisplayed);
    trialPressKey.keys = undefined;
    trialPressKey.rt = undefined;
    _trialPressKey_allKeys = [];
    // keep track of which components have finished
    trialComponents = [];
    trialComponents.push(trialQuestionText);
    trialComponents.push(trialCharacterText);
    trialComponents.push(trialPressKey);
    
    for (const thisComponent of trialComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


function trialRoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'trial' ---
    // get current time
    t = trialClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *trialQuestionText* updates
    if (t >= 0.0 && trialQuestionText.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      trialQuestionText.tStart = t;  // (not accounting for frame time here)
      trialQuestionText.frameNStart = frameN;  // exact frame index
      
      trialQuestionText.setAutoDraw(true);
    }
    
    
    // *trialCharacterText* updates
    if (t >= 0.0 && trialCharacterText.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      trialCharacterText.tStart = t;  // (not accounting for frame time here)
      trialCharacterText.frameNStart = frameN;  // exact frame index
      
      trialCharacterText.setAutoDraw(true);
    }
    
    
    // *trialPressKey* updates
    if (t >= 0.0 && trialPressKey.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      trialPressKey.tStart = t;  // (not accounting for frame time here)
      trialPressKey.frameNStart = frameN;  // exact frame index
      
      // keyboard checking is just starting
      psychoJS.window.callOnFlip(function() { trialPressKey.clock.reset(); });  // t=0 on next screen flip
      psychoJS.window.callOnFlip(function() { trialPressKey.start(); }); // start on screen flip
      psychoJS.window.callOnFlip(function() { trialPressKey.clearEvents(); });
    }
    
    if (trialPressKey.status === PsychoJS.Status.STARTED) {
      let theseKeys = trialPressKey.getKeys({keyList: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'], waitRelease: false});
      _trialPressKey_allKeys = _trialPressKey_allKeys.concat(theseKeys);
      if (_trialPressKey_allKeys.length > 0) {
        trialPressKey.keys = _trialPressKey_allKeys[0].name;  // just the first key pressed
        trialPressKey.rt = _trialPressKey_allKeys[0].rt;
        trialPressKey.duration = _trialPressKey_allKeys[0].duration;
        // was this correct?
        if (trialPressKey.keys == characterDisplayed) {
            trialPressKey.corr = 1;
        } else {
            trialPressKey.corr = 0;
        }
        // a response ends the routine
        continueRoutine = false;
      }
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of trialComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function trialRoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'trial' ---
    for (const thisComponent of trialComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    psychoJS.experiment.addData('trial.stopped', globalClock.getTime());
    // was no response the correct answer?!
    if (trialPressKey.keys === undefined) {
      if (['None','none',undefined].includes(characterDisplayed)) {
         trialPressKey.corr = 1;  // correct non-response
      } else {
         trialPressKey.corr = 0;  // failed to respond (incorrectly)
      }
    }
    // store data for current loop
    // update the trial handler
    if (currentLoop instanceof MultiStairHandler) {
      currentLoop.addResponse(trialPressKey.corr, level);
    }
    psychoJS.experiment.addData('trialPressKey.keys', trialPressKey.keys);
    psychoJS.experiment.addData('trialPressKey.corr', trialPressKey.corr);
    if (typeof trialPressKey.keys !== 'undefined') {  // we had a response
        psychoJS.experiment.addData('trialPressKey.rt', trialPressKey.rt);
        psychoJS.experiment.addData('trialPressKey.duration', trialPressKey.duration);
        routineTimer.reset();
        }
    
    trialPressKey.stop();
    // the Routine "trial" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}


var goodbyeScreenComponents;
function goodbyeScreenRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date
    
    //--- Prepare to start Routine 'goodbyeScreen' ---
    t = 0;
    goodbyeScreenClock.reset(); // clock
    frameN = -1;
    continueRoutine = true; // until we're told otherwise
    // update component parameters for each repeat
    psychoJS.experiment.addData('goodbyeScreen.started', globalClock.getTime());
    // keep track of which components have finished
    goodbyeScreenComponents = [];
    goodbyeScreenComponents.push(goodbyeText);
    
    for (const thisComponent of goodbyeScreenComponents)
      if ('status' in thisComponent)
        thisComponent.status = PsychoJS.Status.NOT_STARTED;
    return Scheduler.Event.NEXT;
  }
}


function goodbyeScreenRoutineEachFrame() {
  return async function () {
    //--- Loop for each frame of Routine 'goodbyeScreen' ---
    // get current time
    t = goodbyeScreenClock.getTime();
    frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
    // update/draw components on each frame
    
    // *goodbyeText* updates
    if (t >= 0.0 && goodbyeText.status === PsychoJS.Status.NOT_STARTED) {
      // keep track of start time/frame for later
      goodbyeText.tStart = t;  // (not accounting for frame time here)
      goodbyeText.frameNStart = frameN;  // exact frame index
      
      goodbyeText.setAutoDraw(true);
    }
    
    // check for quit (typically the Esc key)
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList:['escape']}).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }
    
    // check if the Routine should terminate
    if (!continueRoutine) {  // a component has requested a forced-end of Routine
      return Scheduler.Event.NEXT;
    }
    
    continueRoutine = false;  // reverts to True if at least one component still running
    for (const thisComponent of goodbyeScreenComponents)
      if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
        continueRoutine = true;
        break;
      }
    
    // refresh the screen if continuing
    if (continueRoutine) {
      return Scheduler.Event.FLIP_REPEAT;
    } else {
      return Scheduler.Event.NEXT;
    }
  };
}


function goodbyeScreenRoutineEnd(snapshot) {
  return async function () {
    //--- Ending Routine 'goodbyeScreen' ---
    for (const thisComponent of goodbyeScreenComponents) {
      if (typeof thisComponent.setAutoDraw === 'function') {
        thisComponent.setAutoDraw(false);
      }
    }
    psychoJS.experiment.addData('goodbyeScreen.stopped', globalClock.getTime());
    // the Routine "goodbyeScreen" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset();
    
    // Routines running outside a loop should always advance the datafile row
    if (currentLoop === psychoJS.experiment) {
      psychoJS.experiment.nextEntry(snapshot);
    }
    return Scheduler.Event.NEXT;
  }
}


function importConditions(currentLoop) {
  return async function () {
    psychoJS.importAttributes(currentLoop.getCurrentTrial());
    return Scheduler.Event.NEXT;
    };
}


async function quitPsychoJS(message, isCompleted) {
  // Check for and save orphaned data
  if (psychoJS.experiment.isEntryEmpty()) {
    psychoJS.experiment.nextEntry();
  }
  psychoJS.window.close();
  psychoJS.quit({message: message, isCompleted: isCompleted});
  
  return Scheduler.Event.QUIT;
}
