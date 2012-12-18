## Install

```bash
$ npm install juxt # or wget https://raw.github.com/azer/juxt.js/master/juxt.js
```

## Manual

Take a set of functions, return a function that is the juxtaposition of those
functions. The returned function takes a variable number of arguments and
returns a list containing the result of applying each fn to the arguments.

```javascript
function inc1(n) { return n+1 };
function inc2(n) { return n+2 };
function inc3(n) { return n+3 };

juxt(inc1, inc2, inc3)(314); // returns [315, 316, 317]
```

#### Async

```javascript
juxt.async(searchGoogle, searchDDG, searchBing)("hello world", function(error,  results){
  if(error) throw error;

  results[0] // google
  results[1] // duck duck go
  results[2] // bing
});
```

Functions can be passed as an object, as well;

```js
function turkish(word, callback){ /* some magic here */ }
function french(word, callback){ /* some magic here */ }
function polish(word, callback){ /* some magic here */ }

juxt.async({ 'tr': turkish, 'fr': french, 'pl': polish })("hello", function(error,  results){
  assert.equal(results.tr, "merhaba");
  assert.equal(results.fr, "bonjour");
  assert.equal(results.pl, "cześć");
});
```
