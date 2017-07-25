## Promise 简单的实现

```javascript
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function Promise(fn) {
    var state = PENDING;
    var value = null;
    var handlers = [];

    doResolve(fn, resolve, reject)

    function fulfill(result) {}
    // state=fulfilled, value=result

    function reject(error) {}
    // state=rejected, value=error

    function resolve(result) {}
    // if then in result(result 是个 promise), 执行 doResolve
    // else 执行 fulfill
    
    function doResolve(fn, onFulfilled, onRejected) {}
    // 给 fn 传入 resolve 和 reject 函数
    // resolve 函数，执行 onFulfilled
    // reject 函数，执行 onRejected
    
    function handle(handler) {}
    // if PENDING, push handler
    // if FULFILLED, 执行 handler 中的 onFulfilled 函数
    // if REJECTED, 执行 handler 中的 onRejected 函数
    
    this.done = function (onFulfilled, onRejected) {}
    // 异步（setTimeout 0）执行 handler({onFulfilled, onRejected})
    
    this.then = function (onFulfilled, onRejected) {
        var self = this
        return new Promise((resolve,reject)=>{
            return self.done(result=>{
                if onFulfilled
                    return resolve(onFulfilled(result))
                else 
                    return resolve(result)
            }, err=>{
                if onRejected
                    return resolve(onRejected(err))
                else
                    return reject(err)
            })
        })
    }
}
```

## author

陈家宾，jiabin.chen@weimob.com