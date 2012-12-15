var assert = require('assert'),
    juxt   = require('./juxt');

function cube(x){ return x*x*x; };
function sum(x){ return x+x; };
function div(x){ return x/2; };
function mul(x){return x*3; };

function cubeAsync(x,callback){ callback(undefined,x*x*x); };
function sumAsync(x,callback){ callback(undefined,x+x); };
function divAsync(x,callback){ callback(undefined,x/2); };
function mulAsync(x,callback){ callback(undefined,x*3); };

function assertSync(callback){

  function inc(serial){
    return function(val){
      return val+serial;
    };
  }

  var unaltered = Math.floor(Math.random()*100);

  var result = juxt(inc(1), inc(2), inc(3) )(unaltered);

  assert.equal(result[0], unaltered+1);
  assert.equal(result[1], unaltered+2);
  assert.equal(result[2], unaltered+3);

  result = juxt(cube, sum, div, mul)(2);
  assert.equal(result[0], 8);
  assert.equal(result[1], 4);
  assert.equal(result[2], 1);
  assert.equal(result[3], 6);

  result = juxt({ 'cube': cube, 'sum': sum, 'div': div, 'mul': mul })(2);
  assert.equal(result.cube, 8);
  assert.equal(result.sum, 4);
  assert.equal(result.div, 1);
  assert.equal(result.mul, 6);
}

function assertAsync(callback){
  var unaltered = Math.floor(Math.random()*100);

  function inc(serial){
    return function(val, callback){
      callback(undefined, val+serial);
    };
  };

  juxt.async( inc(1), inc(2), inc(3) )(unaltered,function(error,result){

    if(error){
      callback(error);
      return;
    }

    assert.equal(result[0], unaltered+1);
    assert.equal(result[1], unaltered+2);
    assert.equal(result[2], unaltered+3);

    juxt.async(cubeAsync, sumAsync, divAsync, mulAsync)(2,function(error, result){

      if(error){
        callback(error);
        return;
      }

      assert.equal(result[0], 8);
      assert.equal(result[1], 4);
      assert.equal(result[2], 1);
      assert.equal(result[3], 6);


      juxt.async({ 'cube':cubeAsync, 'sum':sumAsync, 'div':divAsync, 'mul':mulAsync })(2,function(error, result){

        if(error){
          callback(error);
          return;
        }

        assert.equal(result.cube, 8);
        assert.equal(result.sum, 4);
        assert.equal(result.div, 1);
        assert.equal(result.mul, 6);

      });

    });

  });

}

assertSync();
assertAsync();
