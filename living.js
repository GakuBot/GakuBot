
var trainComPlayCom = function(){
  genetic.live();
  genetic.evolve();

  if(genetic.evolutionIteration % (genetic.numberOfEvolutionsEachRound + 5) < genetic.numberOfEvolutionsEachRound){
    genetic.evolutionIteration += 1;
    drawProgressText(Math.round(100*(genetic.evolutionIteration % (genetic.numberOfEvolutionsEachRound + 5)) / (genetic.numberOfEvolutionsEachRound)));
    setTimeout(trainComPlayCom, 1);
  }else{
    genetic.evolutionIteration += 1;

    genetic.play();
  }
};


var trainComPlayHuman = function(){

  if(genetic.evolutionIteration % (genetic.numberOfEvolutionsEachRound + 5) < genetic.numberOfEvolutionsEachRound){
    genetic.live();
    genetic.evolve();
    genetic.evolutionIteration += 1;
    drawProgressText(Math.round(100*(genetic.evolutionIteration % (genetic.numberOfEvolutionsEachRound + 5)) / (genetic.numberOfEvolutionsEachRound)));
    let thisGenome = genetic;
    setTimeout(trainComPlayHuman, 1);
  }else if(genetic.evolutionIteration % (genetic.numberOfEvolutionsEachRound + 5) === genetic.numberOfEvolutionsEachRound){
    roundReady();
  }else{
    genetic.evolutionIteration += 1;
    genetic.userControlled = true;
    genetic.play();
  }
};


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


var trainDataPlayHuman = function(){
  if(mimic.evolutionIteration < 1){
    mimic.evolutionIteration++;
    mimic.evolve();
  }else{
    mimic.evolve();
    mimic.setInitialPositionValue();
    mimic.prepareDuel();
  }
};
