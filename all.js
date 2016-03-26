module.exports = function all (callbacks, next) {
  var results = []
  var complete = 0
  var error

  for (var i = 0, len = callbacks.length; i < len; i++) {
    ;(function (i) {
      callbacks[i](function (err, res) {
        if (error) return
        if (err) {
          error = err
          next(err)
        } else {
          results[i] = res
          complete++
          if (complete === len) next(null, results)
        }
      })
    }(i))
  }
}
