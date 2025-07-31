<script setup lang="ts">
  import Communication from '@/components/organizer/settings/Communication.vue'
  import FAQ from '@/components/organizer/settings/FAQ.vue'
  import LegalEditor from '@/components/organizer/settings/LegalEditor.vue'
  import Matchmaking from '@/components/organizer/settings/Matchmaking.vue'
  import Partners from '@/components/organizer/settings/Partners.vue'
  import SocialMedia from '@/components/organizer/settings/SocialMedia.vue'
  import Texts from '@/components/organizer/settings/Texts.vue'
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
        <v-toolbar-title>{{ t('organizer.nav.settings') }}</v-toolbar-title>
      </v-toolbar>
      <v-divider />

      <v-list nav dense>
        <v-list-item
          v-for="(label, key) in {
            social: 'Images et Réseaux Sociaux',
            texts: 'Textes',
            partners: 'Partenaires',
            legal: 'Pages Légales',
            matchmaking: 'Matchmaking',
            communication: 'Plateforme de communication',
            faq: 'FAQ',
          }"
          :key="key"
          @click="currentSection = key"
          :active="currentSection === key"
          active-class="bg-primary text-white"
        >
          <v-list-item-title>{{ label }}</v-list-item-title>
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
      case 'social':
        return SocialMedia
      case 'texts':
        return Texts
      case 'partners':
        return Partners
      case 'matchmaking':
        return Matchmaking
      case 'communication':
        return Communication
      case 'legal':
        return LegalEditor
      case 'faq':
        return FAQ
      default:
        return FAQ
    }
  }
</script>
