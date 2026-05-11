<template>
  <div>
    <PageTransition />
    <div class="academic-page-spacer"></div>
    <section class="section-dark" style="padding-top: 4rem;">
      <h1 class="section-title visible" style="font-size: 3rem; margin-bottom: 4rem;">
        {{ t('page.knowledge.header') }}
      </h1>
      <div class="module-container" style="max-width: 1000px; margin: 0 auto; flex-direction: column;">
        <div class="long-text-module tide-slide visible">
          <h3>{{ t('page.knowledge.mod1.title') }}</h3>
          <img src="/photos/p_ancientsea.png" alt="Ocean Origin" />
          <p>{{ t('page.knowledge.mod1.p1') }}</p>
          <p>{{ t('page.knowledge.mod1.p2') }}</p>
        </div>
        <div class="long-text-module tide-slide visible">
          <h3>{{ t('page.knowledge.mod2.title') }}</h3>
          <img src="/photos/p_seavolcanael.png" alt="Marine Life" />
          <p>{{ t('page.knowledge.mod2.p1') }}</p>
          <p>{{ t('page.knowledge.mod2.p2') }}</p>
        </div>
        <div class="long-text-module tide-slide visible">
          <h3>{{ t('page.knowledge.mod3.title') }}</h3>
          <img src="/photos/p_emission.jpg" alt="Ocean Crisis" />
          <p>{{ t('page.knowledge.mod3.p1') }}</p>
          <p>{{ t('page.knowledge.mod3.p2') }}</p>
        </div>
      </div>
    </section>
    <FooterSection />
  </div>
</template>

<script setup>
import { useI18n } from '../composables/useI18n.js'
import PageTransition from '../components/PageTransition.vue'
import FooterSection from '../components/FooterSection.vue'

const { t } = useI18n()
</script>
