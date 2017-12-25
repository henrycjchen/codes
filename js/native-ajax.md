```js
var ajax = function (opts) {
    function format(data) {
        var arr = []
        for (var name in data) {
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]))
        }
        return arr.join('&')
    }
    var data = opts.data||{}
    if (opts.dataType == 'jsonp') {
        var callback = ('jsonp_' + new Date().getTime())
        data.callback = callback
        var script = document.createElement('script')
        script.src = opts.url + '?' + format(data)
        script.onerror = function () {
            opts.error && opts.error()
        }
        window[callback] = function (res) {
            document.body.removeChild(script)
            window[callback] = null
            opts.success && opts.success(res)
        }
        document.body.appendChild(script)
    } else {
        var xhr = new XMLHttpRequest()
        data = format(data)
        var method = opts.method ? opts.method.toUpperCase() : 'GET'
        xhr.open(method, opts.url + ((method == 'GET') ? ('?' + data) : ''))
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var _res = {}
                    try {
                        _res = JSON.parse(xhr.responseText)
                    } catch (e) {}
                    opts.success && opts.success(_res)
                } else {
                    opts.error && opts.error(_res)
                }
            }
        }
        xhr.send(data)
    }
}
```
