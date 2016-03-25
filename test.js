var test = require('tape')

var chain = require('./chain')

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
