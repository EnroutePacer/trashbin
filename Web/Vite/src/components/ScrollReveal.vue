<!--
  组件说明：ScrollReveal（滚动浮现包装器）
  功能：包裹任意内容，当元素进入视口时自动添加 .visible 触发淡入上浮动效。
  用法：<ScrollReveal class="your-class">...</ScrollReveal>
        <ScrollReveal tag="li">…</ScrollReveal>
-->
<template>
  <component :is="tag" class="scroll-reveal" ref="el">
    <slot />
  </component>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollAnimation } from '../composables/useScrollAnimation.js'

defineProps({ tag: { type: String, default: 'div' } })

const el = ref(null)
const { observeElement } = useScrollAnimation()

onMounted(() => {
  if (el.value) observeElement(el.value)
})
</script>
