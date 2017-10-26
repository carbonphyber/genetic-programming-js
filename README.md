# Genetic Programming #

## Automatic JavaScript code generator ##

This is an experiment in code generation/optimization using only a [genetic algorithm](https://en.wikipedia.org/wiki/Genetic_algorithm).

This genetic code generator builds the JavaScript code to populate a function which matches the requirements defined by a user-supplied unit test set.

This genetic algorithm uses a fitness scoring method which penalizes interpreter errors (eg. invalid syntax) and runtime errors while rewarding code which runs well, passes the most unit tests, and is the most compact.

### Why Do This? ###

Skilled programmers are expensive and machine processor time has become extremely cheap. This started as an experiment to find out how much a non-programmer could be empowered to "write code" without having to know anything about the programming language.

Also, genetic algorithms are simply interesting.

### Why JavaScript? ###

It's a common language. It can be run in a `ndejs` server environment or in a web browser context. Also, it has `eval`, which enables the language to dynamically build code which it can then run, which is extremely beneficial for building code which is likely to fail compilation/interpretation. (*note*: avoid using `eval` like the bubonic plague unless you are experienced enough to avoid the security and performance drawbacks to using eval in most environments).

Also, I found [genetic-js](https://www.npmjs.com/package/genetic-js), a great library for implementing genetic algorithms.

### How do I use this? ###

To run the genetic program generator, run `node index.js` from command line. This script should run fune under `Node 6.x` and newer on a Linux/BSD/Darwin OS. It should be easy/quick to port it to run on Node Windows (pull requests welcome).

To create your own unit test set (which will generate different code), clone `tests/1.js`, alter the tests, and edit the parameter at the bottom of `index.js`, which describes which test should be used.

The default behavior for text feedback is to update stats and the best code after each significant improvement in fitness score.

### FAQs ###

Q: Why doesn't the generated function pass all of the tests?

A: It's difficult to tune a genetic algorithm to *always* find it's way to the perfectly optimal result. A common problem is that a genetic algorithm finds a "local maxima" and can't find a way to improve. This is a side-effect of the fitness scoring function.

Q: Why doesn't the generator stop?

A: It's designed to stop after either (1) an optimal solution is found or (2) a fixed amount of time with no fitness score progress. Use `ctrl+c` to cancel the process if you don't want to wait.

Q: Can it generate more than just a function?

A: It's only tuned to write a trivial function so far. Non-trivial code comes later.

Q: Are you *trying* to make SkyNet happen?

A: We all know it's going to happen eventually -- all of the dystopic science fiction tells us so.