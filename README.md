# my.common.js

A client-side CommonJS module loader.
See a little [demo] (http://myjs.fr/my-common/example/example.html).

### Load an external module/script

Use `require(libUrl)` to load modules
and `scope(executionContext, deps...)` to handle
asynchronous dependencies (and sandbox your code).

load external modules in your custom namespaces

    var lib1 = require('http://path/to/your/lib1');
    var lib2 = require('http://path/to/your/lib2');
    var lib3 = require('http://path/to/your/lib3');

Wait that `lib1` and `lib3` are loaded (libs are passed as args so that they can be in the local scope)

    scope(function(lib1, lib3) {
      lib1.method();
      lib3.method();
      ....
    }, lib1, lib3);


Wait that all libs are loaded by passing arg `true`

    scope(function(lib1, lib2, lib3) {
      lib1.method();
      lib3.method();
      lib2.method();
      ....
    }, true);


Wait that `lib1` and `lib3` are loaded and DOM is ready

    scope.ready(function(lib1, lib3) {
      lib1.method();
      lib3.method();
      ....
    }, lib1, lib3);


Wait that all libs are loaded and DOM is ready

    scope.ready(function(lib1, lib2, lib3) {
      lib1.method();
      lib3.method();
      ....
    }, true);



### Publish a client-side CommonJS module

To write a library that others can load as a module with `require` and a custom namespace,
export what you want to make public with the commonJS `exports` object:

    (function() {

      //Define your library classes & functions as you would do normally
      var method1 = function() {...}
      var method2 = function() {...}
      var Class1 = function() {...}
      var Class2 = function() {...}
      ....

      //Exports what you need
      exports.method1 = method1;
      exports.Class1 = Class1;
      ....

    )();