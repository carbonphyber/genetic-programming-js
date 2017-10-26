'use strict';

module.exports = {
  seed: function() {
      const _ = require('lodash'),
        NUMBERS = '0123456789'.split(''),
        PARAMS = ['arguments[0]', 'arguments[1]', 'arguments[2]'],
        OPERATORS_BINARY = [';', ',', '||', '&&', '==' , '!=', '===', '!==', '>', '>=', '<', '<=', '+', '-', '/', '*', '%', '**', '&', '|', '^', '<<', '>>', '>>>'],
        OPERATORS_UNARY = ['!', '~', '++', '--', '-', '+'],
        desired_datatype = ['undefined', 'NaN', 'number', 'boolean', 'string', 'object'].map(e => '"' + e + '"'),
        bad_datatype = ['undefined', 'null', 'true', 'false', '[]', '{}'],
        all_elements = _.union(PARAMS, OPERATORS_BINARY, OPERATORS_UNARY, desired_datatype, bad_datatype, NUMBERS),
        rand_of_array = (a) => a[Math.floor(Math.random() * a.length)];
      let a;

      // start with a random assortment of 1-5 expression components
      a = _.map(Array(20), e => ({type: 'expression', value: rand_of_array(all_elements)}));

// console.log('genetic.seed', a.map(e => e.value).join(' '));
      return a;
    },

  mutate: function(entity) {
// console.log('genetic.mutate (before)', entity.map(e => e.value).join(' '));

    const _ = require('lodash'),
      THRESHOLD = {
        DELETE: 0.9999995,
        SHUFFLE: 0.9999990,
        SWAP: 0.999,
        UPDATE: 0.35,
        // INSERT: remainder
      },
      PARAMS = ['arguments[0]', 'arguments[1]', 'arguments[2]'],
      NUMBERS = '0123456789'.split(''),
      STRANGE_NUMBERS = ['+Infinity', '-Infinity', '+0', '-0', ],
      OPERATORS_BINARY = [';', ',', '||', '&&', '==' , '!=', '===', '!==', '>', '>=', '<', '<=', '+', '-', '/', '*', '%', '**', '&', '|', '^', '<<', '>>', '>>>'],
      OPERATORS_UNARY = ['!', '~', '++', '--', '-', '+'],
      desired_datatype = ['undefined', 'number', 'boolean', 'string', 'object'].map(e => '"' + e + '"'),
      bad_datatype = ['undefined', 'NaN', 'null', 'true', 'false', '[]', '{}'],
      ALL_OPERATORS = _.union(OPERATORS_BINARY, OPERATORS_UNARY),
      ALL_LITERALS = _.union(PARAMS, desired_datatype, bad_datatype, NUMBERS, STRANGE_NUMBERS),
      all_elements = _.union(PARAMS, OPERATORS_BINARY, OPERATORS_UNARY, desired_datatype, bad_datatype, NUMBERS, STRANGE_NUMBERS),
      rand_of_array = (a) => a[Math.floor(Math.random() * a.length)],
      NUM_OPTIONS = 3;
    let rand_val = Math.random() * 1,
      pos = Math.floor(Math.random() * entity.length),
      new_elem;

    // generate a random operation
    if(rand_val > THRESHOLD.DELETE) {
      // delete a term
      entity = _.union(entity.slice(0, pos), entity.slice(pos + 1));

    } else if(rand_val > THRESHOLD.SHUFFLE) {
      // shuffle terms
      entity = _.shuffle(entity);

    } else if(rand_val > THRESHOLD.SWAP) {
      // swap 2 terms
      let pos2 = Math.floor(Math.random() * entity.length);
      if (entity.length > 1) {
        if (pos2 < pos) {
          // easier to swap than to handle 2 cases
          let swap = pos;
          pos = pos2;
          pos2 = swap;
        }
        entity = _.union(entity.slice(0, pos), entity.slice(pos + 1, 1), entity.slice(pos + 2, pos2 - (pos + 2)), entity.slice(pos2, 1), entity.slice(pos2 + 1));
      }

    } else if(rand_val > THRESHOLD.UPDATE) {
      // update a term
      // update the element to the same type as previous to update
      entity[pos] = {type: 'expression', value: rand_of_array(all_elements)};

    } else {
      // insert new term(s)
      let num_inserts = Math.random() * 3;
      while(num_inserts-- > 0.0) {
        pos = Math.floor(Math.random() * entity.length);
        // new_elem = _.map(Array(Math.ceil(Math.random() * 4)), ({type: 'expression', value: rand_of_array(all_elements)}));
        new_elem = [{type: 'expression', value: rand_of_array(all_elements)}];
        if (pos === 0) {
          entity = _.union([new_elem], entity);
        } else if (pos === entity.length) {
          entity = _.union(entity, [new_elem]);
        } else {
          entity = _.union(entity.slice(0, pos + 1), [new_elem], entity.slice(pos + 1));
        }
      }
    }

// console.log('genetic.mutate (after)', entity);
    return entity;
  },

  crossover: function(mother, father) {
// console.log('genetic.crossover', [mother.map(e => e.value).join(' '), father.map(e => e.value).join(' ')]);

    const _ = require('lodash');
    // mix and match from components of both mother and father
    let son = (mother || []).map((e, i) => Math.random() >= 0.5 ? father[i] || '' : mother[i] || ''),
      daughter = (father || []).map((e, i) => Math.random() >= 0.5 ? mother[i] || '' : father[i] || '');

    return [son, daughter];
  },

  fitness: function(entity) {
// console.log('genetic.fitness', entity.map(e => e.value).join(' '));

    const tests = this.userData.TESTS;

    let rjs = '"use strict";return ' + entity.map(e => e.value).join(' '),
      f = _ => null,
      actual = null,
      rjso = (code => {
        const FITNESS_FACTOR_LENGTH = -0.2,
          FITNESS_FACTOR_EQUALITY2 = 100,
          FITNESS_FACTOR_EQUALITY3 = 200,
          FITNESS_FACTOR_SYNTAX_ERROR = -1000,
          FITNESS_FACTOR_RUNTIME_ERROR = -100;
        let fitPoints = 0,
          resultMatch2s = 0,
          resultMatch3s = 0;
        fitPoints = code.length * FITNESS_FACTOR_LENGTH;
        try {
          f = new Function(code);
        } catch(err) {
          // if the code throws an exception, only add syntax error points
// console.log('syntax error', err.message);
          fitPoints += FITNESS_FACTOR_SYNTAX_ERROR;
          return fitPoints;
        }
        (tests || []).forEach(test => {
          try {
            actual = f.apply(null, test.params);
            if (actual == test.expected) {
              ++resultMatch2s;
              // if expected == actual
              fitPoints += FITNESS_FACTOR_EQUALITY2;
              if (actual === test.expected) {
// console.log('fitness strict equality', [code, test.params, actual, test.expected]);
                ++resultMatch3s;
                // if expected === actual
                fitPoints += FITNESS_FACTOR_EQUALITY3;
              }
            }
          } catch(err) {
// console.log('runtime error', err.message);
            // if the code throws an exception, only add runtime error points
            fitPoints += FITNESS_FACTOR_RUNTIME_ERROR;
          }
        });
        return fitPoints;
      })(rjs);

    return rjso;
  },

  generation: function(pop, generation, stats) {
// console.log('genetic.generation', [pop, generation, stats]);
    return pop[0].fitness < (this.userData.TESTS.length * 198);
  },

  notification: function(pop, generation, stats, isFinished) {
// console.log('genetic.notification', [pop, generation, stats, isFinished]);
console.log('genetic.notification', [pop[0].fitness, this.userData.TESTS.length * 160, pop[0].entity.map(e => e.value).join(' ')]);
    if(isFinished) {
      console.log('notification stats', stats);
console.log('WINNER', pop[0].entity.map(e => e.value).join(' '));
    }
  },

};