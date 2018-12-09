## 组件描述
多 tab 内容导航组件
相关 git 地址：https://git.code.oa.com/henrycjchen/slide-container
### 特性
- 支持手势滑动内容切换 `tab`
- 切换 `tab` 时，记录上一个 `tab` 内容的滚动位置
- 切换 `tab` 时，导航栏自动滚动，使当前 `tab` 项位于导航栏中间
- 切换 `tab` 时触发 `active-tab` 事件
- 滚动到底部时触发 `reach-bottom` 事件（一般用于分页加载）

### 效果

![](http://km.oa.com/files/photos/pictures/201812/1544337576_23_w375_h667.gif)

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
</slide-container>
```
**参数**

| name         | default | type                        | required | description                                                  |
| ------------ | ------- | --------------------------- | -------- | ------------------------------------------------------------ |
| nav          | -       | Array([{name: '', id: ''}]) | yes      | 导航数据，其中 name 是 tab 用于显示的名字，id 则是该 tab 的 id|
| init-index   | 0       | Number                      | no       | 初始显示的 tab 索引，表示一开始显示第几个 tab，从 0 开始|
| active-tab   | -       | Function                    | no       | 切换 tab 时触发这个事件，并带有激活 tab 的 `id` 和 `index`   |
| reach-bottom | -       | Function                    | no       | 内容滚动到底部时触发这个事件，并带有当前 tab 的 `id` 和 `index` |

**js 代码**
```
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
        this.activeIndex = index;
      },
      scrollHandler(id, index) {
        // todo
      }
    }
  }
</script>
```

### 注意

组件的父元素需要指定高度，才能实现组件的内部滚动。
