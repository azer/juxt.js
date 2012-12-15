  /**
   * Take a set of functions, return a function that is the juxtaposition of those
   * functions. The returned function takes a variable number of arguments and returns
   * a list containing the result of applying each fn to the arguments.
   *
   * usage examples;
   *   juxt(Number, String, Array)(true) => [1, "true", [true]]
   *   juxt({ "num": Number, "str": String, "arr": Array })(true) => { "num": 1, "str": "true", "arr": [true] }
   *
   *   // async:
   *   juxt.async(searchGoogle, searchDDG, searchBing)("hello world", function(error, results){
   *     if(error) throw error;
   *
   *     results[0] // google
   *     results[1] // duck duck go
   *     results[2] // yahoo
   *   });
   */
var juxt = (function(undefined){

  var slice = Array.prototype.slice;

  function juxt(/* functions */){
    var fns = arguments.length > 1 || typeof arguments[0] != 'object' ? slice.call(arguments) : arguments[0];

    return function(){
      var args = arguments;
      return map(function(fn){
        return fn.apply(undefined, args);
      }, fns);
    };
  }

  function juxtAsync(/* functions */){
    var fns = arguments.length > 1 || typeof arguments[0] != 'object' ? slice.call(arguments) : arguments[0];

    return function(/* args, callback */){
      var args     = slice.call(arguments, 0, arguments.length-1),
          callback = arguments[arguments.length-1];

      asyncMap(function(fn, callback){
        fn.apply(undefined, args.concat([callback]));
      }, fns, callback);
    };
  };

  /**
   * Helpers
   */
  function asyncMap(fn, iterable, callback){
    var clone, iter, i, len, key, value,
        list = isArray(iterable);

    iter = list ? slice.call(iterable) : objectKeys(iterable);
    clone = list ? iter : {};

    (function next(i, error, rpl){

      key = list ? i-1 : iter[i-1];
      value = list ? clone[i] : iterable[ iter[i] ];

      arguments.length > 2 && ( clone[key] = rpl );

      if(error || i>=iter.length){
        callback(error, clone);
        return;
      }

      fn(value, next.bind(undefined, i+1));

    })(0);
  };

  function isArray(obj){
    return Object.prototype.toString.call(obj) == '[object Array]';
  }

  function map(fn, iterable){
    var clone, i, len, key;

    if(isArray(iterable)){

      clone = slice.call(iterable, 0);
      i = -1;
      len = clone.length;

      while(++i<len){
        clone[i] = fn(clone[i], i, clone);
      }

    } else if(typeof iterable == 'object') {
      clone = {};

      for(key in iterable){
        clone[key] = fn(iterable[key], key, clone);
      }
    }

    return clone;
  }


  function objectKeys(obj){
    var keys = [], key;
    for(key in obj){
      keys.push( key );
    }
    return keys;
  }

  juxt.async = juxtAsync;

  return juxt;
}());

if(typeof module != 'undefined' && module.exports){
  module.exports = juxt;
}
