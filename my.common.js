//Copyright 2011 Jie Meng-Gérard MIT-LICENSE

(function(document, window) {  

  //============================================================================
  // @param libUrl:string
  window.require = function(libUrl) {
    var lib = {};
    var scopes = [];
    var libParams = {loaded: false, scopes: scopes};
    var script = document.createElement('script');
    addEventListener(script, 'load', function() {
      var scope;
      if (exports) {
        for (var e in exports)
          lib[e] = exports[e];
        exports = {};
      }
      for (var i = 0; scope = scopes[i]; i++) {        
        scope.wait--;
        if (scope.wait === 0)
          scope.executionContext.apply(null, scope.args);
      }
      HEAD.removeChild(script);      
    });
    script.src = libUrl;
    LIBS.push(lib);
    LIBS_PARAMS.push(libParams);
    HEAD.appendChild(script);
    return lib;
  };

  var HEAD = document.getElementsByTagName('head')[0];
  var LIBS = [];
  var LIBS_PARAMS = []; 

  //============================================================================  
  // @params executionContext:function, deps:libs...|boolean
  var scope = window.scope = function(executionContext, deps) {
    if (arguments.length === 1) {
      executionContext.apply(null, LIBS);
      return;
    }
    var scope = {executionContext: executionContext, wait: 0};
    var len = LIBS.length;
    var i, j, lib, libParams;
    if (deps === true) {
      scope.args = LIBS;
      for (i = 0; i < len; i++) {
        libParams = LIBS_PARAMS[i];
        if (!libParams.loaded) {
          libParams.scopes.push(scope);
          scope.wait++;
        }
      }
    } else {
      scope.args = [];
      for (i = 1; lib = arguments[i]; i++) {
        scope.args.push(lib);
        for (j = 0; j < len; j++) {
          if (lib === LIBS[j]) {
            libParams = LIBS_PARAMS[j];
            if (!libParams.loaded) {
              libParams.scopes.push(scope);
              scope.wait++;
            }
          }
        }
      }
    }
  };

  //============================================================================
  // @params executionContext:function, deps:libs...|boolean
  scope.ready = function() {
    var args = arguments;
    var readyListenerExecuted = false;    
    var readyListener = function() {
      if (!readyListenerExecuted) {
        scope.apply(null, args);
        readyListenerExecuted = true;
      }
    }
    if (supportsAddEventListener) {
      addEventListener(document, 'DOMContentLoaded', readyListener);
    } else {
      addEventListener('readystatechange', function() {
        if (document.readyState === 'complete')
          readyListener();
      });
    }
    addEventListener(document, 'load', readyListener);
  }

  //============================================================================    
  var supportsAddEventListener = document.addEventListener;
  var addEventListener = function(elt, event, listener) {
    if (supportsAddEventListener)
      elt.addEventListener(event, listener, false);
    else
      elt.attachEvent('on' + event, listener);
  }

  //============================================================================    
  window.exports = {};

})(document, window);
