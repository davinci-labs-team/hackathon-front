<script setup lang="ts">
  import Communication from '@/components/organizer/settings/Communication.vue'
  import LegalEditor from '@/components/organizer/settings/LegalEditor.vue'
  import Matchmaking from '@/components/organizer/settings/Matchmaking.vue'
  import Partners from '@/components/organizer/settings/Partners.vue'
  import PlanningEditor from '@/components/organizer/settings/PlanningEditor.vue'
  import SocialMedia from '@/components/organizer/settings/SocialMedia.vue'
  import Texts from '@/components/organizer/settings/Texts_FAQ.vue'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const currentSection = ref('social')
</script>

<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer app permanent width="300">
      <v-toolbar flat>
        <v-toolbar-title class="text-h6">{{ t('organizer.nav.settings') }}</v-toolbar-title>
      </v-toolbar>
      <v-divider />

      <v-list nav dense>
        <v-list-item
          v-for="(label, key) in {
            media: t('mediaSettings.title'),
            texts: t('texts_faq_title'),
            partners: t('partnersSettings.title'),
            dates: t('planningSettings.title'),
            legal: t('legalEditor.title'),
            matchmaking: t('matchmakingSettings.title'),
            communication: t('communicationSettings.title'),
          }"
          :key="key"
          @click="currentSection = key"
          :active="currentSection === key"
          active-class="bg-primary text-white"
        >
          <v-list-item-title class="text-subtitle-1 py-5 px-2">{{ label }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container class="mt-8">
        <component :is="getComponent(currentSection)" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
  /**
   * Dynamically returns the component based on the current section.
   */
  function getComponent(section: string) {
    switch (section) {
      case 'media':
        return SocialMedia
      case 'texts':
        return Texts
      case 'dates':
        return PlanningEditor
      case 'partners':
        return Partners
      case 'matchmaking':
        return Matchmaking
      case 'communication':
        return Communication
      case 'legal':
        return LegalEditor
      default:
        return SocialMedia
    }
  }
</script>
