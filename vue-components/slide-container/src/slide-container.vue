<template>
  <div class="slide-container" :style="{height}">
    <div class="nav-wrap">
      <div
        v-show="nav.length>1"
        ref="nav"
        :style="{textAlign}"
        class="nav"
      >
        <span
          v-for="(v, index) in nav"
          :ref="'nav'+index"
          :key="v.id"
          class="item"
          :class="{active: index==activeIndex}"
          :style="itemStyle"
          @click="activeTab(v.id, index)"
          v-text="v.name"
        />
        <div :style="[navStyle, lineStyle]" class="tab-line" />
      </div>
    </div>
    <div ref="slide" :style="{'background-color': slideBgColor}" :class="{slide: isInnerScroll}">
      <slot />
    </div>
  </div>
</template>

<script>
import { swipe } from '../lib/gesture.js';
import { throttle } from '../lib/event.js';
function getActiveIndex(nav, id, index) {
  if (id) {
    for (let i = 0; i < nav.length; i++) {
      if (nav[i].id === id) {
        return i;
      }
    }
  }
  return index;
}
/*
 * 外露事件: reachBottom, 携带参数 nav[activeIndex].id, activeIndex
 * 外露事件: activeTab, 携带参数 nav[activeIndex].id, activeIndex
 */
export default {
  props: {
    nav: {
      // 导航数据
      type: Array, // [{name: '', id: ''}] 对应导航名和导航 id
      required: true,
      validator(v) {
        return v.length > 0;
      }
    },
    initIndex: {
      // 初始导航索引
      type: Number,
      default: 0
    },
    initId: {
      // 初始导航 id
      type: String,
      default: ''
    },
    textAlign: {
      // 导航对齐 css 样式
      type: String,
      default: ''
    },
    isDisable: {
      // 是否屏蔽 tab 切换功能
      type: Boolean,
      default: false
    },
    slideBgColor: {
      // 列表背景颜色
      type: String,
      default: ''
    },
    lineStyle: { // 下划线样式
      type: Object,
      default: () => {
        return {};
      }
    },
    itemStyle: { // nav项样式
      type: Object,
      default: () => {
        return {};
      }
    },
    isInnerScroll: {
      // slide 列表是否需要内置滚动
      type: Boolean,
      default: true
    },
    height: {
      // 组件高度（竖直滚动需要限制高度）
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      activeIndex: getActiveIndex(this.nav, this.initId, this.initIndex),
      navStyle: {
        transform: '',
        width: ''
      },
      navBounding: null
    };
  },
  watch: {
    nav(v) {
      this.$nextTick(() => {
        this.init();
      });
    }
  },
  mounted() {
    this.initSwipeGesture();
    this.initScrollEvent();

    this.$nextTick(() => {
      // 需要进行 dom 操作，所以等到 nextTick 后再操作
      this.initTabPosition();
    });
  },
  methods: {
    initTabPosition() {
      // 定位导航位置
      this.navBounding = this.$refs.nav.getBoundingClientRect();
      this.scrollToActiveTab({ isAnimation: false }); // 初始化时导航不做滚动动画，直接定位
    },
    initSwipeGesture() {
      // 初始化手势切换事件
      swipe(this.$refs.slide, direction => {
        if (this.isDisable) return;

        let activeIndex = this.activeIndex;
        activeIndex += direction;
        if (activeIndex < 0 || activeIndex >= this.nav.length) return;
        this.activeTab(this.nav[activeIndex].id, activeIndex);
      });
    },
    initScrollEvent() {
      let clientHeight = this.$refs.slide.clientHeight;
      this.$refs.slide.onscroll = throttle(() => {
        let scrollHeight = this.$refs.slide.scrollHeight;
        let scrollTop = this.$refs.slide.scrollTop;
        if (scrollTop + clientHeight > scrollHeight - clientHeight) {
          this.$emit(
            'reachBottom',
            this.nav[this.activeIndex].id,
            this.activeIndex
          );
        }
      }, 50);
    },
    activeTab(id, index) {
      if (this.isDisable) return;
      this.nav[this.activeIndex].scrollTop = this.$refs.slide.scrollTop; // 记录当前列表滚动位置
      this.$emit('activeTab', id, index);
      this.activeIndex = index;
      this.scrollToActiveTab({ isAnimation: true });
      this.$nextTick(() => {
        // nextTick 导航切换后再滚动
        this.$refs.slide.scrollTop = this.nav[index].scrollTop || 0;
      });
    },
    // tab 滚动切换
    scrollToActiveTab({ isAnimation }) {
      // isAni: 是否动画
      const activeTab = this.$refs['nav' + this.activeIndex][0];
      const bounding = activeTab.getBoundingClientRect();

      this.setOffset(bounding, isAnimation);
      this.scrollAni(bounding, isAnimation);
    },
    // 切换彩条
    setOffset(bounding, isAni) {
      let x = bounding.left - this.navBounding.left + this.$refs.nav.scrollLeft;
      this.navStyle.transition = isAni ? 'all .3s ease-in-out' : '';
      this.navStyle.transform = `translateX(${x}px)`;
      this.navStyle.width = `${bounding.width}px`;
    },
    // 滚动导航
    scrollAni(bounding, isAni) {
      let middle = (bounding.left + bounding.right) / 2;
      let navMiddle = this.navBounding.width / 2 + this.navBounding.left;
      let distance = navMiddle - middle; // 滚动的距离
      if (isAni) {
        let diration = distance > 0; // 标记滚动方向
        let speed = distance / 20; // 数字 20 控制导航滚动速度，越小越快
        let animate = () => {
          distance = distance - speed;
          this.$refs.nav.scrollLeft = this.$refs.nav.scrollLeft - speed;
          let newDiration = distance > 0;
          if (diration !== newDiration) return; // 标记变化表示到达滚动目标位置
          this.ani = requestAnimationFrame(animate);
        };
        cancelAnimationFrame(this.ani || 0); // 取消原动画并开始新动画
        animate();
      } else {
        this.$refs.nav.scrollLeft = this.$refs.nav.scrollLeft - distance;
      }
    }
  }
};
</script>

<style>
.slide-container {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  height: 100%;
}
.slide-container .nav-wrap {
  position: relative;
}
.slide-container .nav-wrap::after {
  content: "";
  width: 100%;
  display: block;
  height: 1px;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  background: #e6e6e6;
  position: absolute;
  bottom: 0;
  z-index: -1;
}
.slide-container .nav {
  line-height: 40px;
  font-size: 15px;
  color: #737373;
  white-space: nowrap;
  overflow: scroll;
  position: relative;
  -webkit-overflow-scrolling: touch;
  padding: 0 12px;
}
.slide-container .nav .item {
  padding: 0 6px;
  margin-right: 10px;
}
.slide-container .nav .item:last-of-type {
  margin: 0;
}
.slide-container .nav .active {
  color: #262626;
  font-size: 15px;
}
.slide-container .nav .tab-line {
  height: 2px;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1;
  background-color: #262626;
}
.slide-container .slide {
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  height: 100%;
}
</style>
