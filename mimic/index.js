let mimic = new Mimic();
var Network = synaptic.Network;
mimic.generatePopulation();

const savedMimicRaw = localStorage.getItem('mimic');
const savedMimicOpponentNetworkRaw = localStorage.getItem('mimicOpponentNetwork');
const savedEvolutionIteration = localStorage.getItem('mimicEvolutionIteration');

const isSavedDataAvailable = notUndefinedOrNull(savedMimicRaw)
                            && notUndefinedOrNull(savedMimicOpponentNetworkRaw)
                            && notUndefinedOrNull(savedEvolutionIteration);

function notUndefinedOrNull(input){
  return typeof input !== "undefined" && input !== null;
}


// If a way to save the network is found, uncomment below
// function loadSavedMimicData(){
//   const savedMimic = JSON.parse(savedMimicRaw);
//   const savedMimicOpponentNeat = JSON.parse(savedMimicOpponentNetworkRaw);
//
//   mimic["noOfWins"] = parseInt(savedMimic["noOfWins"]);
//   mimic["noOfLosses"] = parseInt(savedMimic["noOfLosses"]);
//   mimic["opponentNetwork"] = Network.fromJSON(savedMimicOpponentNeat);
//   mimic["evolutionIteration"] = parseInt(savedEvolutionIteration);
// }

let iteration = 0;
let finalOutcome = {};
let finalPlayer;
let finalOpponent;
let evolutionIterationProcess;
let playProcess;
let movementProcess;

const headerText = ["Gakubot Mimic", "Rules", "How to play", "Strategy", "Other versions"];
const titleText = ["This is a machine learning game", "There are three main rules to this game", "Movement", "How will you play?", ""];
const contentText = ["You play against the computer, and the computer (theoretically) gets better as you play",
"<ol>\
  <li>You are a yellow circle. Your aim is to get home to the brown circle in the middle.</li>\
  <li>You need to get home before your opponent, a pink circle. If the pink circle gets home first, you lose.</li>\
  <li>If you touch or 'tag' your opponent, then the one of you who is closest to home when you touch is unable to move for a few seconds.</li>\
</ol>",
"You move via clicking in the direction that you want to move in. A red reticule should appear wherever you click on the screen. Your yellow circle will move (quite slowly) in that direction",
"Will you make a beeline for the target? Will you be agressive and first seek to subdue your opponent by tagging them before going towards the objective? And what will the computer do?",
"If you would like to relax and watch two computers duel it out instead, then please feel free to try <a href='../exhibit/exhibit.html'>Gakubot Exhibit</a><br><br>\
 If you want to teach the bots how you play by playing against them, try <a href='../apprentice/apprentice.html'>Gakubot Apprentice</a><br><br>\
 If you want to go head to head against bots who practice hours of simulated games in minutes, then check out <a href='../formulate/formulate.html'>Gakubot Formulate</a>"];
const buttonText = ["Rules ▶", "Guide ▶", "Strategy ▶", "Versions ▶", "Play"];

let pageNumber = 0;
let pageNumberLimit = 4;

// If a way to save the network is found, uncomment below
// if(isSavedDataAvailable){
//   pageNumberLimit = 5;
//   headerText.splice(0, 0, "Save Data");
//   titleText.splice(0, 0, "Local saved data has been detected");
//   contentText.splice(0, 0, "Would you like to load previously saved data?");
//   buttonText.splice(0, 0, "No");
//   document.getElementById("progress-button-load").classList.remove("d-none");
//   $("#canvas-overlay .card-header h2").html(headerText[pageNumber]);
//   $("#canvas-overlay .card-title").html(titleText[pageNumber]);
//   $("#canvas-overlay .card-text").html(contentText[pageNumber]);
//   $("#canvas-overlay #progress-button").html(buttonText[pageNumber]);
//
//   document.getElementById("progress-button-load").addEventListener("click", function(e){
//     e.preventDefault();
//     document.getElementById("progress-button-load").classList.add("d-none");
//     loadSavedMimicData();
//     pageNumber += 1
//     $("#canvas-overlay .card-header h2").html(headerText[pageNumber]);
//     $("#canvas-overlay .card-title").html(titleText[pageNumber]);
//     $("#canvas-overlay .card-text").html(contentText[pageNumber]);
//     $("#canvas-overlay #progress-button").html(buttonText[pageNumber]);
//   });
// }

var trainDataPlayHuman = function(){
  if(mimic.currentRound < 1){
    mimic.currentRound++;
    mimic.evolve();
    trainDataPlayHuman();
  }else{
    mimic.setInitialPositionValue();
    mimic.prepareDuel();
  }
};

document.getElementById("progress-button").addEventListener("click", function(e){
  e.preventDefault();
  if(pageNumber < pageNumberLimit){
    document.getElementById("progress-button-load").classList.add("d-none");
    pageNumber += 1
    $("#canvas-overlay .card-header h2").html(headerText[pageNumber]);
    $("#canvas-overlay .card-title").html(titleText[pageNumber]);
    $("#canvas-overlay .card-text").html(contentText[pageNumber]);
    $("#canvas-overlay #progress-button").html(buttonText[pageNumber]);
  }else{
    $("#canvas-overlay").hide();
    trainDataPlayHuman();
  }
});

document.getElementById("play-again-button").addEventListener("click", function(e){
  e.preventDefault();
  document.getElementById("continue-canvas-overlay").classList.add("d-none");
  trainDataPlayHuman();
});

var roundOver = function(){
  const gameResult = mimic.gameResultWin;
  const noOfWins = mimic.noOfWins;
  const noOfLosses = mimic.noOfLosses;
  const noOfGames = mimic.noOfGames;

  // If a way to save the network is found, uncomment below
  // localStorage.setItem('mimic', JSON.stringify(mimic));
  // localStorage.setItem('mimicOpponentNetwork', JSON.stringify(mimic.opponentNetwork.toJSON()));
  // localStorage.setItem('mimicEvolutionIteration', mimic.currentGen);

  document.getElementById("continue-canvas-overlay").classList.remove("d-none");
  document.getElementById("post-game-message-title").innerHTML = noOfWins > noOfLosses ? "You're on top!" : "Keep going!";
  document.getElementById("post-game-message").innerHTML = noOfWins > noOfLosses ? "You currently have more wins than losses: that's great! Keep playing to see the AI get better." : "You currently dont have more wins than losses. Keep playing to try and get the better of the AI.";
  document.getElementById("post-game-results-played").innerHTML =  "Played: " + noOfGames;
  document.getElementById("post-game-results-won").innerHTML =  "Won: " + Math.round((100 * (noOfWins / (noOfWins + noOfLosses)))) + "% (" + noOfWins + "/" + (noOfWins + noOfLosses) + ")";
  document.getElementById("post-game-results-lost").innerHTML = "Lost: " + Math.round((100 * (noOfLosses / (noOfWins + noOfLosses)))) + "% (" + noOfLosses + "/" + (noOfWins + noOfLosses) + ")";
  document.getElementById("post-game-results-won-bar").style.width = Math.round(100 * (noOfWins / (noOfWins + noOfLosses))) + "%";
  document.getElementById("post-game-results-lost-bar").style.width = Math.round(100 * (noOfLosses / (noOfWins + noOfLosses))) + "%";
}
