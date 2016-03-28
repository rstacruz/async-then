var test = require('tape')

var chain = require('./chain')
var all = require('./all')

test('chain()', t => {
  t.plan(4)
  chain()
    .then((_, next) => { t.pass('runs'); next() })
    .then((_, next) => { t.pass('runs again'); next() })
    .then((_, next) => { next('oh no') })
    .catch((err, next) => {
      t.equal(err, 'oh no', 'errors are raised')
      next()
    })
    .then((_, next) => {
      t.pass('recovers after errors')
      next()
    })
    .end(function (err, res) {
      if (err) throw err
      t.end()
    })
})

test('chain() sync', t => {
  t.plan(2)
  chain()
    .then(_ => 1)
    .then(_ => _ + 1)
    .end(function (err, res) {
      t.error(err, 'has no errors')
      t.equal(res, 2, 'chains properly')
      t.end()
    })
})

test('chain() thunk', t => {
  t.plan(2)
  chain()
    .then(_ => next => next(null, 1))
    .then(_ => next => next(null, _ + 1))
    .end(function (err, res) {
      t.error(err, 'has no errors')
      t.equal(res, 2, 'chains properly')
      t.end()
    })
})

test('all()', t => {
  t.plan(2)
  all([
    next => { next(null, 'a') },
    next => { next(null, 'b') },
    next => { next(null, 'c') }
  ], (err, res) => {
    t.error(err, 'has no error')
    t.deepEqual(res, ['a', 'b', 'c'], 'has correct output')
    t.end()
  })
})

test('all() with errors', t => {
  t.plan(1)
  all([
    next => { next('oh no') },
    next => { next('other error') }
  ], (err, res) => {
    t.equal(err, 'oh no', 'reports an error')
    t.end()
  })
})
