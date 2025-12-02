<script setup lang="ts">
  import LegalEditor from '@/components/organizer/configuration/LegalEditor.vue'
  import MailingEditor from '@/components/organizer/configuration/MailingEditor.vue'
  import Matchmaking from '@/components/organizer/configuration/Matchmaking.vue'
  import Partners from '@/components/organizer/configuration/Partners.vue'
  import PlanningEditor from '@/components/organizer/configuration/PlanningEditor.vue'
  import SocialMedia from '@/components/organizer/configuration/SocialMedia.vue'
  import Texts from '@/components/organizer/configuration/Texts.vue'
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
            texts: t('texts_title'),
            partners: t('partnersSettings.title'),
            dates: t('planningSettings.title'),
            legal: t('legal.title'),
            matchmaking: t('matchmakingSettings.title'),
            mailing: t('mailingSettings.title')
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
      case 'legal':
        return LegalEditor
      case 'mailing':
       return MailingEditor
      default:
        return SocialMedia
    }
  }
</script>
