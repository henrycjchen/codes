## ## 组件的 data 必须是函数？

官方解释：[点我](https://cn.vuejs.org/v2/style-guide/#%E7%BB%84%E4%BB%B6%E6%95%B0%E6%8D%AE-%E5%BF%85%E8%A6%81)
简单的说就是组件是重用的，如果 data 是对象，那组件的一个实例在修改 data 时，将会影响到这个组件的其他实例。



## ## v-for & v-if 为什么不能用在一起

[先记住一个大前提：

> `v-for` 比 `v-if` 具有更高的优先级

用户将 `v-for` 和 `v-if` 写在一起有两种情况
1. 判断这个列表是不是应该显示
2. 对列表进行元素过滤

对情况 1，因为 `v-for` 的优先级更高，所以本应只判断一次，结果判断了很多次（示列表长度而定）。
所以推荐写法应该是把这个判断上移到这个列表外。
```html
<ul v-if="showUsers">
  <li v-for="user in Users"></li>
</ul>
```

对情况 2，每次重新渲染时都需要遍历整个列表，不管这个列表的元素是否有变。
所以官方建议是采用 computed 方法，将列表数据进行事先过滤再绑定到页面上。
```html
<script>
//...
computed: {
  activeUsers: function () {
    return this.list.filter(function (user) {
      return user.isActive
    })
  }
}
//...
</script>

<ul>
  <li v-for="user in activeUsers"></li>
</ul>](https://github.com/henry-CJ/about-frontend/issues/1)
```


## vue 里如何实现 CSS 隔离

[VUE 官方文档介绍了三种方法，[点我](https://cn.vuejs.org/v2/style-guide/#%E4%B8%BA%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F%E8%AE%BE%E7%BD%AE%E4%BD%9C%E7%94%A8%E5%9F%9F-%E5%BF%85%E8%A6%81)

1. scoped: 添加元素标识进行隔离
2. css module：修改 class 类名成 hash 值，使其唯一
3. BEM：按团队规定进行样式命名（block-element-modifier）,如：menu-item-active

官方推荐使用 css module，因为 scoped 的原理是采用【类和特性组合的选择器】，相对类选择器慢。

另外，scoped 中，要避免使用元素选择器，因为【元素+特性组合的选择器】比【类+特性组件的选择器】又来得慢。

```html
// no
<style scoped>
button {
background-color: red;
}
</style>

// yes
<style scoped>
.btn-close {
background-color: red;
}
</style>](https://github.com/henry-CJ/about-frontend/issues/2)
```


## 计算属性 & 方法

官方文档，[点我](https://cn.vuejs.org/v2/guide/computed.html#%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7%E7%BC%93%E5%AD%98-vs-%E6%96%B9%E6%B3%95)

```
<div :html="filtedHtml"></div>
<div :html="filter(html)"></div>
<script>
{
  data: {
    html: ''
  },
  method: {
    filter: function (str) {
      // todo
    }
  },
  computed: {
    filtedHtml: function () {
      // todo
    }
  }
}
</script>
```

当绑定的数据需要进行处理时，应当优先采用计算属性（computed），再考虑方法

为什么？计算属性是**基于它们的依赖进行缓存的**，当依赖改变，才会进行重新计算。而方法则每次都会调用。

从性能优化角度上来说，计算属性更优。



## 复用渲染元素问题

官方文档：[点我](https://cn.vuejs.org/v2/guide/conditional.html#%E7%94%A8-key-%E7%AE%A1%E7%90%86%E5%8F%AF%E5%A4%8D%E7%94%A8%E7%9A%84%E5%85%83%E7%B4%A0)

> Vue 会尽可能高效地渲染元素，通常会复用已有元素而不是从头开始渲染。

```html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>
```

这里当你给第一个 template 的 input 输入内容，并切换到另一个 template 时，此时的 input 里还是第一个 input 的内容。
因为 input 的内容被复用了。

为了处理这种问题，需要给元素添加 key 值，告诉 vue 不要利用这个元素

```html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input">
</template>
```



## 数据修改限制 & 解决方法

> 官方文档，[点我](https://cn.vuejs.org/v2/guide/list.html#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

> 由于 JavaScript 的限制，Vue 不能检测以下变动的数组：
> 1. 当你利用索引直接设置一个项时，例如：vm.items[indexOfItem] = newValue
> 2. 当你修改数组的长度时，例如：vm.items.length = newLength

针对情况 1：
```js
// Vue.set
Vue.set(example1.items, indexOfItem, newValue)
// Array.prototype.splice
example1.items.splice(indexOfItem, 1, newValue)
```

针对情况 2：
```js
example1.items.splice(newLength)
```