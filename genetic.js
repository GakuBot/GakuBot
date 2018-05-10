var Neat    = neataptic.Neat;
var Architect = neataptic.architect; //This might need to be changed to neataptic.Architect (i.e. capital letter) depending on the version of neaptic

function Genetic(){
  return{
  neat: null, // https://wagenaartje.github.io/neataptic/docs/neat/
  opponentNeat: null, // https://wagenaartje.github.io/neataptic/docs/neat/
  startingInput: [],
  startingOpponentInput: [],
  userControlled: false,
  timeSteps: 110,
  maxInitialDistance: 20,
  minDistance: 1.9,
  tagDistance: 1.3,
  cooldownTimer: 20,
  startDelay: 50,
  maxSpeed: 0.2,
  countdown: 5,
  playerCooldown: 0,
  opponentCooldown: 0,
  finishTimer: 0,
  finishTimerDuration: 30,
  evolutionIterationProcess: null,
  movementProcess: null,
  zoomCoefficient: 1.6, // The bigger it is, the smaller the field appears
  screenXOffset: 0.5,
  screenYOffset: 0.8,
  evolutionIteration: 0,
  genomeIndex: 0,
  numberOfEvolutionsEachRound: 250,
  numberOfEvolutionsBeforePlayerOnlyLearning: 250,
  animationTimer: 0,
  timeLimit: 400,
  duelCounter: 0,
  gameResultWin: false,
  gameResultLoss: false,
  noOfLosses: 0,
  noOfWins: 0,
  noOfGames: 0,
  currentPosition: [],
  currentOpponentPosition: [],
  finalOutcome: [],
  finalOpponentOutcome: [],

  //Makes two Neat networks that we will use to train and play with
  generateRandomPopulation: function () {
    this.neat = new Neat(
      6, // number of inputs
      2, // number of outputs
      null, // fitnessFunction - in this example we are calculating fitness inside live method
      {
        elitism: 10, // this sets how many genomes in population will be passed into next generation without mutation https://www.researchgate.net/post/What_is_meant_by_the_term_Elitism_in_the_Genetic_Algorithm
        popsize: 50,
        mutationRate: 0.3, // sets the mutation rate. If set to 0.3, 30% of the new population will be mutated. Default is 0.3
        network: // https://wagenaartje.github.io/neataptic/docs/architecture/network/
          new Architect.Random(
            6,
            26,
            2,
          ),
      },
    )

    this.opponentNeat = new Neat(
      6, // number of inputs
      2, // number of outputs
      null, // fitnessFunction - we are calculating fitness inside live method
      {
        elitism: 10, // this sets how many genomes in population will be passed into next generation without mutation https://www.researchgate.net/post/What_is_meant_by_the_term_Elitism_in_the_Genetic_Algorithm
        popsize: 50,
        mutationRate: 0.3, // sets the mutation rate. If set to 0.3, 30% of the new population will be mutated. Default is 0.3
        network: // https://wagenaartje.github.io/neataptic/docs/architecture/network/
          new Architect.Random(
            6,
            26,
            2,
          ),
      },
    )
  },
  live: function () {
    // increment generation index
    this.iterateGeneration();

    // sets the initial position of the two players in the game
    this.setInitialPositionValue();

    // temporarily saves the userControlled setting. Restores it after computer training
    const isUserControlled = this.userControlled;
    // loop through each genome
    for (let genomeIndex in this.neat.population) {

      this.setGenome(genomeIndex);


      this.userControlled = false;

      for(let repeatCounter = 0; repeatCounter < 1; repeatCounter++){
        this.initializePositionBeforeTimeStep();

        for (let i = 0; i < this.timeSteps; i++){
          this.timeStep()
          if(this.finishLoop){
            break
          }
        }
        this.determineFitness();
      }

      this.userControlled = isUserControlled;
    }
  },
  play: function(){

    this.setInitialPositionValue();

    this.setGenome(0);

    this.initializePositionBeforeTimeStep();

    this.finishLoop = false;

    this.animationTimer = 0;

    this.moveAndDraw();

  },
  prepareDuel: function(){
    if(this.genomeIndex >= 0){
      this.setGenome(this.genomeIndex);

      this.initializePositionBeforeTimeStep();

      this.finishLoop = false;

      this.animationTimer = 0;

      this.userControlled = true;
    }
    this.duel();
  },
  duel: function(){
    const isGenerationFinished = this.genomeIndex < 0;
    const isMatchFinished = this.animationTimer >= this.timeLimit || this.finishLoop;
    const isStart = this.animationTimer <= this.startDelay;

    if(!isGenerationFinished && !isMatchFinished && !isStart){
      this.animationTimer++

      this.timeStep();
      this.drawMovement();

      var thisGenetic = this;
      setTimeout(function(){thisGenetic.duel() }, 30);
    }else if(!isGenerationFinished && !isMatchFinished && isStart){
      this.animationTimer++

      this.drawMovement();
      this.drawPregameOverlay();

      var thisGenetic = this;
      setTimeout(function(){thisGenetic.duel() }, 30);
    } else if(this.finishTimer < this.finishTimerDuration){
      if(this.finishTimer === 0 && this.animationTimer >= this.timeLimit){
          this.gameResultWin = false;
          this.gameResultLoss = this.userControlled === true;
          this.noOfGames += this.userControlled ? 1 : 0;
      }
      this.finishTimer ++;

      this.drawMovement();

      var thisGenetic = this;
      setTimeout(function(){thisGenetic.duel() }, 30);
    }else if(!isGenerationFinished){
      this.finishTimer = 0;
      this.determineFitness();
      this.genomeIndex--;
      this.drawMovement();
      this.prepareDuel();
    }else{
      this.finishTimer = 0;
      this.determineFitness();
      this.evolve();
      roundOver();
    }
  },
  moveAndDraw: function(){
    this.animationTimer++

    if(this.animationTimer < this.startDelay){
      this.drawMovement();
      this.drawPregameOverlay();
      var thisGenetic = this;
      setTimeout(function(){thisGenetic.moveAndDraw() }, 30);
    }else if(!(this.finishLoop || this.animationTimer > this.timeLimit)){
        this.timeStep();
        this.drawMovement();
        var thisGenetic = this;
        setTimeout(function(){thisGenetic.moveAndDraw() }, 30);
    }else if(this.finishTimer < this.finishTimerDuration){
      if(this.finishTimer === 0 && this.animationTimer >= this.timeLimit){
          this.gameResultWin = false;
          this.gameResultLoss = this.userControlled === true;
          this.noOfGames += this.userControlled ? 1 : 0;
      }
      this.finishTimer++;
      this.drawMovement();
      var thisGenetic = this;
      setTimeout(function(){thisGenetic.moveAndDraw() }, 30);
    } else {
      this.finishTimer = 0;
      this.drawMovement();
      this.finishLoop = false;

      touchStarted = false;

      gameFinish();
    }
  },
  iterateGeneration: function(){

    this.neat.generation += 1;
    this.opponentNeat.generation += 1;

    this.neat.sort();
    this.opponentNeat.sort();

    touchStarted = false;
  },
  setInitialPositionValue: function(){
    const playerStartingBearing = 3*Math.PI/2 - (2 * Math.random() * Math.PI/10  - Math.PI/10) * (2 * Math.round(Math.random()) - 1); //- Math.PI/30 + Math.random() * 2 * Math.PI / 15;
    const opponentStartingBearing = playerStartingBearing + (2 * Math.round(Math.random() + 1) - 3) * (Math.PI / 18);

    const playerInitialXCoordinate = this.maxInitialDistance * Math.cos(playerStartingBearing);
    const playerInitialYCoordinate = this.maxInitialDistance * Math.sin(playerStartingBearing);
    const opponentInitialXCoordinate = this.maxInitialDistance * Math.cos(opponentStartingBearing);
    const opponentInitialYCoordinate = this.maxInitialDistance * Math.sin(opponentStartingBearing);

    this.startingInput[0] = playerInitialXCoordinate;
    this.startingInput[1] = playerInitialYCoordinate;
    this.startingOpponentInput[0] = opponentInitialXCoordinate;
    this.startingOpponentInput[1] = opponentInitialYCoordinate;
  },
  initializePositionBeforeTimeStep: function(){
    this.currentPosition = this.startingInput.slice();
    this.currentOpponentPosition = this.startingOpponentInput.slice();

    this.playerCooldown = 0;
    this.opponentCooldown = 0;

    this.playerTagSuccesses = 0;
    this.opponentTagSuccesses = 0;
  },
  determineFitness: function(){
    const finalPlayerDistanceToOrigin = Math.sqrt(Math.pow(this.currentPosition[0], 2) + Math.pow(this.currentPosition[1], 2));
    const finalOpponentDistanceToOrigin = Math.sqrt(Math.pow(this.currentOpponentPosition[0], 2) + Math.pow(this.currentOpponentPosition[1], 2));

    // calculate fitness for each genome
    // We say that fitness is inversely proportional to the distance from the origin, and proportional to the opoonent's distance to the origin
    const playerWinReward = ((1 + Math.pow(finalOpponentDistanceToOrigin, 2)) / (1 + Math.pow(finalPlayerDistanceToOrigin,2)));
    const playerLoseReward = ((1 + finalOpponentDistanceToOrigin) / (1 + finalPlayerDistanceToOrigin));
    const opponentWinReward = 1 / playerWinReward;
    const opponentLoseReward = 1 / playerLoseReward;

    this.genome.score += finalOpponentDistanceToOrigin > finalPlayerDistanceToOrigin ? playerWinReward : playerLoseReward;// * (1 * (this.playerTagSuccesses + 1)) * (1 / (this.opponentTagSuccesses + 1));//(5/(0.01 + finalPlayerDistanceToOrigin)) + (finalPlayerDistanceToOrigin < this.minDistance && finalOpponentDistanceToOrigin > finalPlayerDistanceToOrigin ? 1 : 0);//(1 + finalOpponentDistanceToOrigin) / (1 + finalPlayerDistanceToOrigin);
    this.opponentGenome.score += finalOpponentDistanceToOrigin > finalPlayerDistanceToOrigin ? opponentWinReward : opponentLoseReward;// * (1 * (this.playerTagSuccesses + 1)) * (1 / (this.opponentTagSuccesses + 1));//(5/(0.01 + finalOpponentDistanceToOrigin)) + (finalOpponentDistanceToOrigin < this.minDistance && finalOpponentDistanceToOrigin < finalPlayerDistanceToOrigin ? 1 : 0);//(1 + finalPlayerDistanceToOrigin) / (1 + finalOpponentDistanceToOrigin);
  },
  setGenome: function(genomeIndex){
    this.genome = this.neat.population[genomeIndex]
    this.opponentGenome = this.opponentNeat.population[genomeIndex]

    this.genome.score = 0
    this.opponentGenome.score = 0
  },
  makeRatioASimulationPosition: function(ratio){
    simPosition = [];
    simPosition[0] = (ratio[0] - this.screenXOffset) * (this.zoomCoefficient * this.maxInitialDistance * desiredScreenRatio);
    simPosition[1] = (ratio[1] - this.screenYOffset) * (this.zoomCoefficient * this.maxInitialDistance);
    return simPosition;
  },
  makeSimulationPositionARatio: function(simPosition){
    ratio = [];
    ratio[0] = simPosition[0] / (this.zoomCoefficient * this.maxInitialDistance * desiredScreenRatio);
    ratio[1] = simPosition[1] / (this.zoomCoefficient * this.maxInitialDistance);
    return ratio;
  },
  timeStep: function(){
    //TRIG IN HERE a2 = b2 + c2 - 2bc cos A
    const relativeOpponentPosition = [this.currentOpponentPosition[0] - this.currentPosition[0], this.currentOpponentPosition[1] - this.currentPosition[1]];
    const relativePlayerPosition = [this.currentPosition[0] - this.currentOpponentPosition[0], this.currentPosition[1] - this.currentOpponentPosition[1]];

    let output = [];

    if(this.userControlled){
      let ratioCoords;
      if(userNavigation.length > 0){
        ratioCoords = canvasCoordinatesToCanvasRatio(userNavigation);
        output[0] = this.makeRatioASimulationPosition(ratioCoords)[0] - this.currentPosition[0];
        output[1] = this.makeRatioASimulationPosition(ratioCoords)[1] - this.currentPosition[1];
      }else{
        output = [0,0]
      }
    }else{
      output = this.genome.activate(this.currentPosition, this.currentOpponentPosition, relativeOpponentPosition);
    }
    let opponentMovement = this.opponentGenome.activate(this.currentOpponentPosition, this.currentPosition, relativePlayerPosition)

    output[0] = notNAElseZero(output[0]);
    output[1] = notNAElseZero(output[1]);
    opponentMovement[0] = notNAElseZero(opponentMovement[0]);
    opponentMovement[1] = notNAElseZero(opponentMovement[1]);

    output = limitValue(output, this.maxSpeed);
    opponentMovement = limitValue(opponentMovement, this.maxSpeed);

    const playerAndOpponentXDiff = this.currentPosition[0] - this.currentOpponentPosition[0];
    const playerAndOpponentYDiff = this.currentPosition[1] - this.currentOpponentPosition[1];
    const playerAndOpponentDistance = Math.sqrt(Math.pow(playerAndOpponentXDiff, 2) + Math.pow(playerAndOpponentYDiff, 2));
    const playerDistanceToOrigin = Math.sqrt(Math.pow(this.currentPosition[0], 2) + Math.pow(this.currentPosition[1], 2));
    const opponentDistanceToOrigin = Math.sqrt(Math.pow(this.currentOpponentPosition[0], 2) + Math.pow(this.currentOpponentPosition[1], 2));

    if(playerAndOpponentDistance < this.tagDistance && playerDistanceToOrigin < opponentDistanceToOrigin && this.opponentCooldown < 1){
        this.playerCooldown = this.cooldownTimer
        this.opponentTagSuccesses += 1
    }else if(playerAndOpponentDistance < this.tagDistance && playerDistanceToOrigin > opponentDistanceToOrigin && this.playerCooldown < 1){
        this.opponentCooldown = this.cooldownTimer
        this.playerTagSuccesses += 1
    }

    this.playerCooldown -= 1
    this.opponentCooldown -= 1

    if(this.playerCooldown < 1){
      this.currentPosition[0] = this.currentPosition[0] + output[0];
      this.currentPosition[1] = this.currentPosition[1] + output[1];
    }

    if(this.opponentCooldown < 1){
      this.currentOpponentPosition[0] = this.currentOpponentPosition[0] + opponentMovement[0];
      this.currentOpponentPosition[1] = this.currentOpponentPosition[1] + opponentMovement[1];
    }

    this.finishLoop = false;

    const bothPlayerAndOpponentOffTheScreen = (Math.abs(this.makeSimulationPositionARatio(this.currentPosition)[0]) > (this.screenXOffset + 0.03)
      || this.makeSimulationPositionARatio(this.currentPosition)[1] > (1 - this.screenYOffset + 0.03)
      || this.makeSimulationPositionARatio(this.currentPosition)[1] < -(this.screenYOffset + 0.03))
       && (Math.abs(this.makeSimulationPositionARatio(this.currentOpponentPosition)[0]) > (this.screenXOffset + 0.03)
         || this.makeSimulationPositionARatio(this.currentOpponentPosition)[1] > (1 - this.screenYOffset + 0.03)
         || this.makeSimulationPositionARatio(this.currentOpponentPosition)[1] < -(this.screenYOffset + 0.03));

    if(playerDistanceToOrigin < this.minDistance || opponentDistanceToOrigin < this.minDistance
      || bothPlayerAndOpponentOffTheScreen){
      this.finishLoop = true;

      if(this.userControlled){
        if(opponentDistanceToOrigin < this.minDistance){
          this.gameResultWin = false;
          this.gameResultLoss = true;
          this.noOfLosses += 1;
          this.noOfGames += 1;
        }else if(playerDistanceToOrigin < this.minDistance){
          this.gameResultWin = true;
          this.gameResultLoss = false;
          this.noOfWins += 1;
          this.noOfGames += 1;
        }else{
          this.gameResultWin = false;
          this.gameResultLoss = false;
          this.noOfGames += 1;
        }
      }
    }
  },
  drawMovement: function(){
    const positionThisFrame = this.currentPosition;
    const opponentPositionThisFrame = this.currentOpponentPosition;
    const xPosition = this.makeSimulationPositionARatio(positionThisFrame)[0];
    const yPosition = this.makeSimulationPositionARatio(positionThisFrame)[1];
    const xOpponentPosition = this.makeSimulationPositionARatio(opponentPositionThisFrame)[0];
    const yOpponentPosition = this.makeSimulationPositionARatio(opponentPositionThisFrame)[1];

    if(userNavigation.length === 2 && this.userControlled){
      const userTarget = canvasCoordinatesToCanvasRatio(userNavigation);
      clearCanvas();
      if(this.finishTimer > 0){
        drawFinish(this.screenXOffset, this.screenYOffset, this.finishTimer, this.finishTimerDuration, this.gameResultWin, this.gameResultLoss);
      }
      drawFourCircles(this.screenXOffset, this.screenYOffset, xPosition + this.screenXOffset, yPosition + this.screenYOffset, xOpponentPosition + this.screenXOffset, yOpponentPosition + this.screenYOffset, userTarget[0], userTarget[1], this.playerCooldown, this.opponentCooldown);
      drawGenerationText(this.opponentNeat.generation);
      drawIterationText(this.genomeIndex);
    }else{
      clearCanvas();
      if(this.finishTimer > 0){
        drawFinish(this.screenXOffset, this.screenYOffset, this.finishTimer, this.finishTimerDuration, this.gameResultWin, this.gameResultLoss);
      }
      drawThreeCircles(this.screenXOffset, this.screenYOffset, xPosition + this.screenXOffset, yPosition + this.screenYOffset, xOpponentPosition + this.screenXOffset, yOpponentPosition + this.screenYOffset, this.playerCooldown, this.opponentCooldown);
      drawGenerationText(this.opponentNeat.generation);
      drawIterationText(this.genomeIndex);
    }
  },
  drawPregameOverlay: function(){
    const pregameTimer = 4 - Math.ceil((this.animationTimer / this.startDelay) * 3);
    const pregameTimerRaw = 4 - (this.animationTimer / this.startDelay) * 3;
    drawPregameOverlayText(pregameTimer, 255 - Math.round(255 * (pregameTimerRaw - pregameTimer)));
  },
  evolve: function () {
    const neat = this.neat
    const averageScore = neat.getAverage();
        // sort by genome.score in descending order
    neat.sort()

    // our new population will be here
    let newPopulation = []

    // we want to push neat.elitism number of best genomes into the new population automatically
    let numberOfElitesAdded = 0;
    for (let i = 0; i < neat.elitism; i++) {
      if(!isNaN(neat.population[i].score)){
        newPopulation.push(neat.population[i])
        numberOfElitesAdded += 1
      }
    }

    // we want to get offspring from the current population and push it into the new population
    for (let i = 0; i < neat.popsize - numberOfElitesAdded; i++) {
      newPopulation.push(neat.getOffspring())
    }

    // set new population
    neat.population = newPopulation
    // mutate the population
    neat.mutate()

    //opponent grows too
    const opponentNeat = this.opponentNeat
    opponentNeat.sort()
    newPopulation = []
    numberOfElitesAdded = 0;
    for (let i = 0; i < opponentNeat.elitism; i++) {
      if(!isNaN(opponentNeat.population[i].score)){
        newPopulation.push(opponentNeat.population[i])
        numberOfElitesAdded += 1
      }
    }
    for (let i = 0; i < opponentNeat.popsize - numberOfElitesAdded; i++) {
      newPopulation.push(opponentNeat.getOffspring())
    }
    opponentNeat.population = newPopulation
    opponentNeat.mutate()

    return averageScore;
  },
  }
}

function limitValue(value, limit){
  const magnitude = Math.sqrt(Math.pow(value[0],2) + Math.pow(value[1],2));
  if(magnitude > limit){
      value[0] = value[0] * (limit / magnitude)
      value[1] = value[1] * (limit / magnitude)
  }
  return value
}

function notNAElseZero(value){
  if(isNaN(value)){
    return 0
  }else{
    return value
  }
}
