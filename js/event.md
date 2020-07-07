## 防抖

高频触发的事件，在指定时间内，**只响应最后一次**，如有在指定时间内再次触发，则**重新计时**

常用于修改浏览器视窗大小

实现：

```js
export const debounce = (fn, ms = 0) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};
```



## 节流

高频触发的事件，在指定时间内，只响应第一次

相比防抖，节流更常用到，常见于页面滚动时限制 onScroll 事件

```js
export const throttle = (fn, wait) => {
  let inThrottle;
  let lastFn;
  let lastTime;
  return function() {
    const context = this;
    const args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(function() {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};
```





