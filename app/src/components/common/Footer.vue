<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import basicImg from '@/assets/images/basic.jpg'
const { t } = useI18n()
</script>

<template>
  <v-footer height="120" class="pa-4" color="grey lighten-4">
    <v-row 
      class="w-full mx-auto" 
      style="max-width: 960px; justify-content: space-between; align-items: center;"
    >
      
      <!-- Colonne gauche : Images en ligne -->
      <v-col cols="auto" class="d-flex flex-row align-center gap-4" style="padding: 0;">
        <v-img :src="basicImg" min-width="150" height="80" contain></v-img>
        <v-img :src="basicImg" min-width="150" height="80" contain></v-img>
        <v-img :src="basicImg" min-width="150" height="80" contain></v-img>
      </v-col>

      <!-- Colonne droite : liens -->
      <v-col cols="auto" class="d-flex flex-column justify-center" style="padding: 0;">
        <div class="grey--text text--darken-1 mb-2">
          {{ t('footer.copyright') }}
        </div>
        <div class="d-flex flex-column gap-2">
          <a
            href="/privacy-policy"
            target="_blank"
            class="grey--text text--darken-1 text-decoration-underline"
            style="cursor: pointer; text-decoration-thickness: 1.5px;"
          >
            {{ t('footer.privacyPolicy') }}
          </a>
          <a
            href="/terms"
            target="_blank"
            class="grey--text text--darken-1 text-decoration-underline"
            style="cursor: pointer; text-decoration-thickness: 1.5px;"
          >
            {{ t('footer.terms') }}
          </a>
          <a
            href="/cookies"
            target="_blank"
            class="grey--text text--darken-1 text-decoration-underline"
            style="cursor: pointer; text-decoration-thickness: 1.5px;"
          >
            {{ t('footer.cookies') }}
          </a>
        </div>
      </v-col>

    </v-row>
  </v-footer>
</template>
