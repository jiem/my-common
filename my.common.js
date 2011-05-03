//Copyright 2011 Jie Meng-Gérard MIT-LICENSE

(function(document, window) {

  //============================================================================
  // @param libUrl:string
  window.require = function(libUrl) {
    var lib = {};
    var pendingScopes = [];
    var libParams = {loaded: false, pendingScopes: pendingScopes};
    var script = document.createElement('script');
    var loadListener = function() {
      var scope;
      if (exports) {
        for (var e in exports)
          lib[e] = exports[e];
        exports = {};
      }
      for (var i = 0, len = pendingScopes.length; i < len; i++) {
        scope = pendingScopes[i];
        scope.waitLoad--;
        if (scope.waitLoad === 0)
          scope.executionContext.apply(null, scope.args);
      }
      HEAD.removeChild(script);      
    }    
    if (script.addEventListener)
      script.addEventListener('load', loadListener, false);
    else
      script.attachEvent('onload', loadListener);
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
    var scope = {executionContext: executionContext, waitLoad: 0};
    var len = LIBS.length;
    var i, j, lib, libParams;
    if (deps === true) {
      scope.args = LIBS;
      for (i = 0; i < len; i++) {
        libParams = LIBS_PARAMS[i];
        if (!libParams.loaded) {
          libParams.pendingScopes.push(scope);
          scope.waitLoad++;
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
              libParams.pendingScopes.push(scope);
              scope.waitLoad++;
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
    if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', readyListener, false);
      document.addEventListener('load', readyListener, false);
    } else {
      document.attachEvent('onreadystatechange', function() {
        if (document.readyState === 'complete')
          readyListener();
      });
      document.attachEvent('onload', readyListener);
    }
  }

  //============================================================================    
  window.exports = {};

})(document, window);
