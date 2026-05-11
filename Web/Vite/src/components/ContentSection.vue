<!--
  组件说明：ContentSection (内容分块组件)
  功能：用于渲染页面中的主要内容区块，支持自定义样式的包裹容器，常用于包裹其他业务卡片。
-->
<template>
  <section :id="id" :class="sectionClass">
    <div class="module-container">
      <h2 class="section-title" ref="titleRef">{{ title }}</h2>
      <slot />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollAnimation } from '../composables/useScrollAnimation.js'

const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  variant: { type: String, default: 'dark' } // 'dark' | 'light'
})

const sectionClass = props.variant === 'light' ? 'section-light' : 'section-dark'
const titleRef = ref(null)
const { observeElement } = useScrollAnimation()

onMounted(() => {
  if (titleRef.value) observeElement(titleRef.value)
})
</script>
