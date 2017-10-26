'use strict';

const Genetic = require('genetic-js'),
  _ = require('lodash'),

  jsfunc = require('./src/jsfunc');


/**
 * 
 */
(function (test_set) {
  const TESTS = require('./tests/' + test_set);

  let genetic = Genetic.create();
  genetic.optimize = Genetic.Optimize.Maximize;
  genetic.select1 = Genetic.Select1.Tournament2;
  genetic.select2 = Genetic.Select2.FittestRandom;

  genetic.seed = jsfunc.seed;
  genetic.mutate = jsfunc.mutate;
  genetic.crossover = jsfunc.crossover;
  genetic.fitness = jsfunc.fitness;
  genetic.generation = jsfunc.generation;
  genetic.notification = jsfunc.notification;

  genetic.evolve({
    'fittestAlwaysSurvives': 1,
    'iterations': 20000,
    'size': 400,
    'crossover': 0.4,
    'mutation': 0.5,
    'skip': 20,
  }, {
    'TESTS': TESTS,
  });
})('2');
