<!--
  组件说明：HeroSection (首屏英雄区组件)
  功能：展示网站欢迎信息、核心主张和重点操作按钮，通常作为页面的顶部主要视觉焦点。
-->
<template>
  <header class="hero no-select">
    <div class="hero-text">
      <h1>{{ t('hero.title') }}</h1>
      <p>{{ t('hero.desc') }}</p>
    </div>
    <img src="/photos/p_light.jpg" class="hero-bg" alt="Ocean Background" />
  </header>
</template>

<script setup>
import { useI18n } from '../composables/useI18n.js'
const { t } = useI18n()
</script>
