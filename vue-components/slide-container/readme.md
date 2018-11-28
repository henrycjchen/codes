## 组件描述
多 tab 内容导航组件
### 特性
- 支持手势滑动内容切换 `tab`
- 切换 `tab` 时，记录上一个 `tab` 内容的滚动位置
- 切换 `tab` 时，导航栏自动滚动，使当前 `tab` 项位于导航栏中间
- 切换 `tab` 时触发 `active-tab` 事件
- 滚动到底部时触发 `reach-bottom` 事件（一般用于分页加载）

### 效果

![](./1.gif)

## 使用方法
```html
<slide-container
  :nav="nav"
  :init-index="activeIndex"
  @active-tab="activeTab"
  @reach-bottom="scrollHandler"
>
  <div v-show="activeIndex==0"></div>
  <div v-show="activeIndex==1"></div>
  </div>
</slide-container>

<script>
  {
    data() {
      return {
        activeIndex: 0,
        nav: [
          {
            name: 'nav1',
            id: '0'
          },
          {
            name: 'nav2',
            id: '1'
          }
        ]
      }
    }
    ...
    methods: {
      activeTab(id, index) {
        // todo
      },
      scrollHandler(id, index) {
        // todo
      }
    }
  }
</script>
```



### 参数

| name         | default | type                        | required | description                                                  |
| ------------ | ------- | --------------------------- | -------- | ------------------------------------------------------------ |
| nav          | -       | Array([{name: '', id: ''}]) | yes      | 导航数据                                                     |
| init-index   | 0       | Number                      | no       | 初始激活 tab 索引，表示第一次显示第几个 tab，从 0            |
| active-tab   | -       | Function                    | no       | 切换 tab 时触发这个事件，并带有激活 tab 的 `id` 和 `index`   |
| reach-bottom | -       | Function                    | no       | 内容滚动到底部时触发这个事件，并带有当前 tab 的 `id` 和 `index` |



### 注意

组件的父元素需要指定高度，才能实现组件的内部滚动。
