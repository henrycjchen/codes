<template>
  <div class="slide-container">
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
          :class="{active: index==activeIndex}"
          :key="v.id"
          class="item"
          @click="activeTab(v.id, index)"
          v-html="v.name"
        />
        <div :style="navStyle" class="tab_line"/>
      </div>
    </div>
    <div ref="slide" class="slide">
      <slot />
    </div>
  </div>
</template>

<script>
import { swipe } from '../js/gesture.js';
import { throttle } from '../js/event.js';

export default {
  props: {
    nav: { // 导航数据
      type: Array, // [{name: '', id: ''}] 对应导航名和导航 id
      required: true,
      validator(v) {
        return v.length > 0;
      }
    },
    initIndex: { // 初始导航索引
      type: Number,
      default: 0
    },
    textAlign: { // 导航对齐 css 样式
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeIndex: this.initIndex,
      navStyle: {
        transform: '',
        width: '',
      },
      navBounding: null,
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
    // 初始化手势切换事件
    swipe(this.$refs.slide, direction => {
      let activeIndex = this.activeIndex;
      if (direction < 0) {
        if (activeIndex <= 0) return;
        activeIndex--;
      } else {
        if (activeIndex >= this.nav.length - 1) return;
        activeIndex++;
      }
      this.activeTab(this.nav[activeIndex].id, activeIndex);
    });
    this.$nextTick(() => { // 初始化需要进行 dom 操作，所以等到 nextTick 后再初始化
      this.init();
    });
  },
  methods: {
    init() {
      this.navBounding = this.$refs.nav.getBoundingClientRect();
      this.scrollToActiveTab(false); // 初始化时导航不做滚动动画，直接定位
      let clientHeight = this.$refs.slide.clientHeight;

      this.$refs.slide.onscroll = throttle(() => {
        let scrollHeight = this.$refs.slide.scrollHeight;
        let scrollTop = this.$refs.slide.scrollTop;
        if (scrollTop + clientHeight > scrollHeight - clientHeight) {
          this.$emit('reachBottom', this.nav[this.activeIndex].id, this.activeIndex);
        }
      }, 50);
    },
    activeTab(id, index) {
      this.nav[this.activeIndex].scrollTop = this.$refs.slide.scrollTop;
      this.$emit('activeTab', id, index);
      this.activeIndex = index;
      this.scrollToActiveTab();
      this.$nextTick(() => { // nextTick 导航切换后再滚动
        this.$refs.slide.scrollTop = this.nav[index].scrollTop || 0;
      });
    },
    // tab 切换
    scrollToActiveTab(isAni = true) { // isAni: 是否动画
      const activeTab = this.$refs['nav' + this.activeIndex][0];
      const bounding = activeTab.getBoundingClientRect();

      this.setOffset(bounding, isAni);
      this.scrollAni(bounding, isAni);
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
        let flag = distance > 0; // 标记滚动方向
        let speed = distance / 20; // 数字 20 控制导航滚动速度，越小越快
        let animate = () => {
          distance = distance - speed;
          this.$refs.nav.scrollLeft = this.$refs.nav.scrollLeft - speed;
          if (flag !== (distance > 0)) return; // 标记变化表示到达滚动目标位置
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

<style lang="scss" scoped>
.slide-container {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
          flex-direction: column;
  height: 100%;
  .nav-wrap {
    position: relative;
    &::after {
      content: "";
      width: 100%;
      display: block;
      height: 1px;
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      background: #e6e6e6;
      position: absolute;
      bottom: 0;
      z-index: -1;
    }
  }
  .nav {
    line-height: 40px;
    font-size: 15px;
    color: #737373;
    white-space: nowrap;
    overflow: scroll;
    position: relative;
    -webkit-overflow-scrolling: touch;
    padding: 0 12px;
    .item {
      padding: 0 6px;
      margin-right: 10px;
      &:last-of-type {
        margin: 0;
      }
    }
    .active {
      color: #262626;
      font-size: 15px;

    }
    .tab_line {
      height: 2px;
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 1;
      background-color: #262626;
    }
  }
  .slide {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    height: 100%;
  }
}
</style>
