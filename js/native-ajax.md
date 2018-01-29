```js
function sendAJAX(opts) {
    function format(data) {
        var arr = []
        for (var name in data) {
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]))
        }
        return arr.join('&')
    }
    var data = opts.data || {}
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
        if (opts.contentType=='application/json') {
            data = JSON.stringify(data)
        } else {
            data = format(data)
        }
        var method = opts.method ? opts.method.toUpperCase() : 'GET'
        xhr.open(method, opts.url + ((method == 'GET') ? ('?' + data) : ''))
        if (method!='GET'&&opts.contentType) {
            // 需要放在 xhr.open 后，否则会报错
            xhr.setRequestHeader('Content-Type',opts.contentType)
        }
        xhr.onload = function () {
            if (opts.success) {
                var _res = {}
                try {
                    _res = JSON.parse(xhr.responseText)
                } catch (e) {}
                opts.success(_res)
            }
        }
        xhr.onerror = function () {
            opts.error && opts.error(xhr)
        }
        xhr.send(data)
    }
}
```
