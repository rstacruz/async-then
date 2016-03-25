# async-then

> Manipulate asynchronous operations

Work with Node-style callbacks in a safe way. The API is modeled after Promises, while async-then doesn't need (or support) promises.

* __No promises__ - async-then works with Node-style callbacks (`err, result`), and does _not_ support promises. It lets you work these kinds of operations in a way you would with Promises/A+ without actually using promises.

* __No wrappers__ - unlike other solutions like [co][] v3, there's no need to wrap your callback-style functions into thunks or promise-generators.

__NB:__ _This is a proof-of-concept of applying Promise idioms to callbacks. This package won't likely be supported._

[co]: https://github.com/tj/co

## Comparison

Callbacks:

```js

fs.readFile('url.txt', (err, data) => {
  if (err) throw err

  var url = data.trim()
  request(url, (err, result) => {
    if (err) throw err

    console.log(result)
  })
})
```

Chain:

```js
var url

chain()
  .then((_, next) => fs.readFile('url.txt', next))
  .then((data) => { url = data.trim() })
  .then((_, next) => request(url, next))
  .end((err, result) {
    if (err) throw err
    console.log(result)
  })
```

## API

### chain
> `chain()`

Starts a chain. Compare with `Promise.resolve()` or any other promise.

It returns an object with `then`, `catch` and `end`.

```js
function getTitle (fn) {
  chain()
    .then((_, next) => { request('http://google.com', next) })
    .then((data) => cheerio.load(data))
    .then(($) => $('title').text()))
    .end(fn)
}

getTitle((err, title) => {
  if (err) throw err
  console.log(title)
})
```

### chain().then
> `chain().then(fn)`

Continues a chain. The given function `fn` can be given in synchronous or asynchronous forms.

In the asynchronous form, `fn` should accept two parameters: `result`, `next`. The parameter `result` is the result of the previous operation. `next` is a function that should be invoked as a callback.

```js
chain()
  .then((result, next) => { fs.readFile('url.txt', 'utf-8', next) })
  .then((data, next) => { request(data, next) })
  .end((err, res) => { ... })
```

In the synchronous form, `fn` should only accept 1 parameter: `result`. Whatever its return value will be the value passed to the next `then()` in the chain.

```js
chain()
  .then((result, next) => { fs.readFile('url-list.txt', 'utf-8', next) })
  .then((data) => { return data.trim().split('\n') })
  .end((err, urls) => {
    /* work with urls */
  })
```

### chain().catch
> `chain().catch(fn)`

Catches errors.

### chain().end
> `chain().end(fn)`

Runs the chain. Without calling `.end(fn)`, the chain will not be called.

The parameter `fn` is a callback that takes Node-style arguments: `err`, `result`.

```js
chain()
  .then((_, next) => { fs.readFile('data.txt', 'utf-8', next) })
  .end((err, data) => {
  })
```

### all
> `all(callbacks, next)`

Runs multiple async operations in parallel. Compare with `Promise.all()`.

```js
all([
  next => { request('http://facebook.com', next) },
  next => { request('http://instagram.com', next) },
  next => { request('http://pinterest.com', next) }
], (err, results) => {
  // results is an array
})
```

## Thanks

**async-then** © 2016+, Rico Sta. Cruz. Released under the [MIT] License.<br>
Authored and maintained by Rico Sta. Cruz with help from contributors ([list][contributors]).

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/async-then/contributors
