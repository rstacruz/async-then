var test = require('tape')

var chain = require('./chain')
var all = require('./all')

test('works', t => {
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

test('all', t => {
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
