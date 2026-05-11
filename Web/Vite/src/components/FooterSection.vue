<!--
  组件说明：FooterSection (页脚组件)
  功能：提供网站底部的全局信息展示，如版权声明等，作为全局 UI 组件。
-->
<template>
  <footer class="footer">
    <p>{{ t('footer.text') }}</p>
  </footer>
</template>

<script setup>
import { useI18n } from '../composables/useI18n.js'
const { t } = useI18n()
</script>
