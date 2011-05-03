# my.common.js

A client-side CommonJS module loader

### Load an external module with `require` and `scope`

Use function `require(libUrl)` to load modules
and function `scope(executionContext, deps...)` to handle
asynchronous dependencies and sandboxing.

    //load external modules in the namespaces you want
    var lib1 = require('http://path/to/your/lib1');
    var lib2 = require('http://path/to/your/lib2');
    var lib3 = require('http://path/to/your/lib3');

    //Wait that lib1 & lib3 are loaded (libs are passed as args to be in the local scope)
    scope(function(lib1, lib3) {
      lib1.method();
      lib3.method();
      ....
    }, lib1, lib3);

    // Wait that all libs are loaded
    scope(function(lib1, lib2, lib3) {
      lib1.method();
      lib3.method();
      lib2.method();
      ....
    }, true);

    // Wait that lib1 & lib3 are loaded and DOM is ready
    scope.ready(function(lib1, lib3) {
      lib1.method();
      lib3.method();
      ....
    }, lib1, lib3);

    // Wait that all libs are loaded and DOM is ready
    scope.ready(function(lib1, lib2, lib3) {
      lib1.method();
      lib3.method();
      ....
    }, true);


### Publish a module with `exports`

In the external library, sandbox your code and use `exports` for functions you want to make public:

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