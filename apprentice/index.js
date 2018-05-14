let genetic = new Genetic();
genetic.generateRandomPopulation();

const savedGeneticRaw = localStorage.getItem('genetic');
const savedGeneticNeatRaw = localStorage.getItem('geneticNeat');
const savedGeneticGenerationRaw = localStorage.getItem('geneticGeneration');
const savedGeneticOpponentNeatRaw = localStorage.getItem('geneticOpponentNeat');
const savedGeneticOpponentGenerationRaw = localStorage.getItem('geneticOpponentGeneration');
const savedEvolutionIteration = localStorage.getItem('geneticEvolutionIteration');

const isSavedDataAvailable = notUndefinedOrNull(savedGeneticRaw) && notUndefinedOrNull(savedGeneticNeatRaw)
&& notUndefinedOrNull(savedGeneticGenerationRaw) && notUndefinedOrNull(savedGeneticOpponentNeatRaw)
&& notUndefinedOrNull(savedGeneticOpponentGenerationRaw) && notUndefinedOrNull(savedEvolutionIteration);

function notUndefinedOrNull(input){
  return typeof input !== "undefined" && input !== null;
}

function loadSavedGeneticData(){
  const savedGenetic = JSON.parse(savedGeneticRaw);
  const savedGeneticNeat = JSON.parse(savedGeneticNeatRaw);
  const savedGeneticOpponentNeat = JSON.parse(savedGeneticOpponentNeatRaw);

  genetic["noOfWins"] = parseInt(savedGenetic["noOfWins"]);
  genetic["noOfLosses"] = parseInt(savedGenetic["noOfLosses"]);
  genetic["noOfGames"] = parseInt(savedGenetic["noOfGames"]);
  genetic["neat"].import(savedGeneticNeat);
  genetic["neat"].generation = parseInt(savedGeneticGenerationRaw);
  genetic["opponentNeat"].import(savedGeneticOpponentNeat);
  genetic["opponentNeat"].generation = parseInt(savedGeneticOpponentGenerationRaw);
  genetic["evolutionIteration"] = parseInt(savedEvolutionIteration);
}

let iteration = 0;
let finalOutcome = {};
let finalPlayer;
let finalOpponent;
let evolutionIterationProcess;
let playProcess;
let movementProcess;

const headerText = ["Gakubot Apprentice", "Rules", "How to play", "Strategy", "Other versions"];
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
If you want to go head to head against bots who practice hours of simulated games in minutes, then check out <a href='../formulate/formulate.html'>Gakubot Formulate</a><br><br>\
And if you want to play against a bot which will attempt to mimic your movements, then have a go at <a href='../mimic/mimic.html'>Gakubot Mimic</a>"];
const buttonText = ["Rules ▶", "Guide ▶", "Strategy ▶", "Versions ▶", "Train"];

let pageNumber = 0;
let pageNumberLimit = 4;

if(isSavedDataAvailable){
  pageNumberLimit = 5;
  headerText.splice(0, 0, "Save Data");
  titleText.splice(0, 0, "Local saved data has been detected");
  contentText.splice(0, 0, "Would you like to load previously saved data?");
  buttonText.splice(0, 0, "No");
  document.getElementById("progress-button-load").classList.remove("d-none");
  $("#canvas-overlay .card-header h2").html(headerText[pageNumber]);
  $("#canvas-overlay .card-title").html(titleText[pageNumber]);
  $("#canvas-overlay .card-text").html(contentText[pageNumber]);
  $("#canvas-overlay #progress-button").html(buttonText[pageNumber]);

  document.getElementById("progress-button-load").addEventListener("click", function(e){
    e.preventDefault();
    document.getElementById("progress-button-load").classList.add("d-none");
    loadSavedGeneticData();
    pageNumber += 1
    $("#canvas-overlay .card-header h2").html(headerText[pageNumber]);
    $("#canvas-overlay .card-title").html(titleText[pageNumber]);
    $("#canvas-overlay .card-text").html(contentText[pageNumber]);
    $("#canvas-overlay #progress-button").html(buttonText[pageNumber]);
  });
}

const nextPage = function(e){
  e.preventDefault();
  if(pageNumber < pageNumberLimit){
    document.getElementById("progress-button-load").classList.add("d-none");
    pageNumber += 1
    $("#canvas-overlay .card-header h2").html(headerText[pageNumber]);
    $("#canvas-overlay .card-title").html(titleText[pageNumber]);
    $("#canvas-overlay .card-text").html(contentText[pageNumber]);
    $("#canvas-overlay #progress-button").html(buttonText[pageNumber]);
  }else{
    document.getElementById("progress-button").removeEventListener("click", nextPage);
    document.getElementById("canvas-overlay").classList.add("d-none");
    trainHumanPlayHuman();
  }
}

document.getElementById("progress-button").addEventListener("click", nextPage);

document.getElementById("play-again-button").addEventListener("click", function(e){
  e.preventDefault();
  document.getElementById("continue-canvas-overlay").classList.add("d-none");
  trainHumanPlayHuman();
});

var roundOver = function(){
  const gameResult = genetic.gameResultWin;
  const noOfWins = genetic.noOfWins;
  const noOfLosses = genetic.noOfLosses;
  const noOfGames = genetic.noOfGames;

  localStorage.setItem('genetic', JSON.stringify(genetic));
  localStorage.setItem('geneticNeat', JSON.stringify(genetic.neat.export()));
  localStorage.setItem('geneticGeneration', genetic.neat.generation);
  localStorage.setItem('geneticOpponentNeat', JSON.stringify(genetic.opponentNeat.export()));
  localStorage.setItem('geneticOpponentGeneration', genetic.opponentNeat.generation);
  localStorage.setItem('geneticEvolutionIteration', genetic.evolutionIteration);

  document.getElementById("continue-canvas-overlay").classList.remove("d-none");
  document.getElementById("post-game-message-title").innerHTML = gameResult ? "Congratulations!" : "Unlucky!";
  document.getElementById("post-game-message").innerHTML = gameResult ? "You won! Continue?" : "You lost! Play again?";
  document.getElementById("post-game-results-played").innerHTML =  "Played: " + noOfGames;
  document.getElementById("post-game-results-won").innerHTML =  "Won: " + Math.round((100 * (noOfWins / noOfGames))) + "% (" + noOfWins + "/" + noOfGames + ")";
  document.getElementById("post-game-results-lost").innerHTML = "Lost: " + Math.round((100 * (noOfLosses / noOfGames))) + "% (" + noOfLosses + "/" + noOfGames + ")";
  document.getElementById("post-game-results-won-bar").style.width = Math.round(100 * (noOfWins / noOfGames)) + "%";
  document.getElementById("post-game-results-lost-bar").style.width = Math.round(100 * (noOfLosses / noOfGames)) + "%";
}

const roundReadyHeaderText = "Ready";
const roundReadyTitleText = "Gakubot had trained and is now ready to play you";
const roundReadyButtonText = "Play";

var roundReady = function(){
  document.getElementById("canvas-overlay").classList.remove("d-none");
  $("#canvas-overlay .card-header h2").html(roundReadyHeaderText);
  $("#canvas-overlay .card-title").html(roundReadyTitleText);
  $("#canvas-overlay .card-text").html("Gakubot simulated training time total: <b><br>"  + Math.round((5 * genetic.neat.population.length * genetic.evolutionIteration)/60) + " mins approx</b>");
  $("#canvas-overlay #progress-button").html(roundReadyButtonText);
  genetic.evolutionIteration += 1;

  const startRound = function(e){
    e.preventDefault();
    document.getElementById("progress-button").removeEventListener("click", startRound);
    document.getElementById("canvas-overlay").classList.add("d-none");
    genetic.genomeIndex = genetic.neat.population.length - 1;
    genetic.iterateGeneration();
    genetic.setInitialPositionValue();
    genetic.prepareDuel();
  }

  document.getElementById("progress-button").addEventListener("click", startRound);
}


var trainHumanPlayHuman = function(){

  if(genetic.evolutionIteration < genetic.numberOfEvolutionsBeforePlayerOnlyLearning){
    genetic.live();
    genetic.evolve();
    genetic.evolutionIteration += 1;
    drawProgressText( Math.round(100*(genetic.evolutionIteration / genetic.numberOfEvolutionsBeforePlayerOnlyLearning)));
    let thisGenome = genetic;
    setTimeout(trainHumanPlayHuman, 1);
  }else if(genetic.evolutionIteration === genetic.numberOfEvolutionsBeforePlayerOnlyLearning){
    roundReady();
  }else{
    genetic.evolutionIteration += 1;
    genetic.genomeIndex = genetic.neat.population.length - 1;
    genetic.iterateGeneration();
    genetic.setInitialPositionValue();

    genetic.prepareDuel();

  }
};
