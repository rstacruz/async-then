var resolve = require('./resolve')

/**
 * Starts a chain.
 *
 *     function getTitle (fn) {
 *       chain()
 *         .then((_, next) => { request('http://google.com', next) })
 *         .then((_, next) => { next(null, cheerio.load(_)) }
 *         .end(fn)
 *     }
 *
 *     fn((err, $) => {
 *       if (err) throw err
 *       console.log($('h1').text())
 *     })
 */

function chain () {
  return step(function (fn) { resolve(undefined, fn) })
}

/**
 * Internal: produces an object with `then()`, `catch()` and `end()`.
 */

function step (thunk) {
  return { then: then, catch: catch_, end: thunk }

  function catch_ (fn) {
    return step(connectCatch(thunk, fn))
  }

  function then (fn) {
    return step(connectThen(thunk, fn))
  }
}

/**
 * Internal: Return a thunk (a function that takes in a `callback`). This thunk
 * invokes given `thunk`, then passes on its return value to `fn(result,
 * callback)`.
 *
 * `fn` is what is being passed onto .then().
 */

function connectThen (thunk, fn) {
  return function (next) {
    try {
      thunk(function (err, result) {
        if (err) return next(err)
        fn.length === 1 ? next(null, fn(result)) : fn(result, next)
      })
    } catch (err) {
      next(err)
    }
  }
}

/**
 * Internal: Return a thunk (a function that takes in a `callback`). This thunk
 * invokes given `thunk`, then passes on its error to `fn(error, callback)`.
 *
 * Like connectThen(), but handles errors.
 */

function connectCatch (thunk, fn) {
  return function (next) {
    try {
      thunk(function (err, result) {
        if (err) return fn(err, next)
        fn.length === 1 ? next(fn(result)) : fn(null, result)
      })
    } catch (err) {
      fn(err, next)
    }
  }
}

module.exports = chain
