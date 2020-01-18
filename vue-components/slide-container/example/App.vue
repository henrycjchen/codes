<template>
  <SlideContainer :nav="nav" @activeTab="activeTab" @reachBottom="reachBottom">
    <div v-show="activeId==1">
      <div v-for="item in data1" :key="item.a" v-text="item" />
    </div>
    <div v-show="activeId==2">
      <div v-for="item in data2" :key="item.a" v-text="item" />
    </div>
  </SlideContainer>
</template>

<script>
import SlideContainer from '../src/SlideContainer';
function createData() {
  return Array(50)
    .fill(0)
    .map(() => {
      return { a: Math.random() };
    });
}
export default {
  components: {
    SlideContainer
  },
  data() {
    return {
      nav: [{ name: '1', id: '1' }, { name: '2', id: '2' }],
      data1: createData(),
      data2: createData(),
      activeId: 1
    };
  },
  methods: {
    activeTab(id, index) {
      this.activeId = id;
    },
    reachBottom(id, index) {
      console.log('reachBottom', id, index);
    }
  }
};
</script>

<style>
html {
  height: 100%;
}
body {
  height: 100%;
}
</style>

