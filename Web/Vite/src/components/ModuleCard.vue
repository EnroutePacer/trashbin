<!--
  组件说明：ModuleCard (内容模块卡片组件)
  功能：作为内容的容器，展示结构化的图文信息模块并附有一定的动画效果，适合重复使用。
-->
<template>
  <ScrollReveal :class="['module', animationClass]">
    <div class="module-text">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
    <img :src="image" :alt="title" />
  </ScrollReveal>
</template>

<script setup>
import ScrollReveal from './ScrollReveal.vue'

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  animation: { type: String, default: 'fade-in' }
})

const animationClass = props.animation === 'tide-slide' ? 'tide-slide' : 'fade-in'
</script>

<style scoped>
.fade-in { /* uses .module base styles */ }
</style>
