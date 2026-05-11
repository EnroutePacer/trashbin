<!--
  组件说明：PageTransition (页面切换动画特效组件)
  功能：封装页面在路由切换过程中的转场动画效果，优化加载体验和视觉交互。
-->
<template>
  <div class="page-transition" :class="{ loaded: isLoaded }"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isLoaded = ref(false)

onMounted(() => {
  setTimeout(() => { isLoaded.value = true }, 100)
})
</script>
