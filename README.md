# my.common.js

A CommonJS-like script/module loader.
See a little [demo] (http://myjs.fr/my-common/example/example.html).

## Load external scripts/modules in your custom variables with `require`

    var lib1 = require('http://path/to/your/lib1');
    var lib2 = require('http://path/to/your/lib2');
    var lib3 = require('http://path/to/your/lib3');


## Handle asynchronous dependencies loading with `scope`

`scope(yourCode, deps...)` waits dependencies `deps` to be ready before executing `yourCode`.


1) Wait for **some required libs** (`lib1, lib3`) to be ready:

    scope(function(lib1, lib3) {
      lib1.method();
      lib3.method();
      ....
    }, lib1, lib3);


2) Wait for **all required libs** to be ready by passing argument `true`:

    scope(function(lib1, lib2, lib3) {
      lib1.method();
      lib3.method();
      lib2.method();
      ....
    }, true);


3) Wait for **DOM and some required libs** (`lib1, lib3`) to be ready:

    scope.ready(function(lib1, lib3) {
      lib1.method();
      lib3.method();
      ....
    }, lib1, lib3);


4) Wait for **DOM and all required libs** to be ready:

    scope.ready(function(lib1, lib2, lib3) {
      lib1.method();
      lib3.method();
      ....
    }, true);


Note: the syntax of `scope` is similar to

    (function(document, window, lib1, lib2) {
      //your code that uses document, window, lib1, lib2
      //...
    )(document, window, lib1, lib2);

except that `scope` also handles dependencies.
Libs are passed as args so that they can be in the local scope (faster access).

## Publish a CommonJS-like script/module with `exports`

To write a library that others can load as a module in their custom variable with `require`,  
just write `exports.foo = foo` in your script, `foo` being whatever your want to make public:

    //file "http://your.domain.com/script.js"
    (function() {

      //Define your library classes & functions as you would do normally
      var method1 = function() {...}
      var method2 = function() {...}
      var Class1 = function() {...}
      var Class2 = function() {...}
      ....

      //Exports what you want to make public
      exports.method1 = method1;
      exports.Class1 = Class1;
      ....

    )();

---
Note1: if the script is not a module, `scope` and `require` still work,
the custom module var will just be empty.

    var jq = require("http://code.jquery.com/jquery-1.6.min.js");

    //wait that DOM & jQuery are ready
    scope.ready(function() {
      $('yourDiv').show();
      ....
    }, jq);

---
Note2: to make your script compatible with `<script>` or other loaders,
just add a test to see if the `exports` object exists:

    (function() {

      //Define your library classes & functions as you would do normally
      var method1 = function() {...}
      var method2 = function() {...}
      var Class1 = function() {...}
      var Class2 = function() {...}
      ....

      //Test the existence of exports for compatibility
      if (exports) {
        exports.method1 = method1;
        exports.Class1 = Class1;
        ....
      }

    )();

