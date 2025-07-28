<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { t } = useI18n()
</script>

<template>
  <v-footer class="pa-4">
    <v-container>
      <!-- Réseaux sociaux -->
      <v-row justify="end" class="mb-2">
        <v-btn icon variant="text" size="small" href="https://facebook.com" target="_blank">
          <v-icon>mdi-facebook</v-icon>
        </v-btn>
        <v-btn icon variant="text" size="small" href="https://instagram.com" target="_blank">
          <v-icon>mdi-instagram</v-icon>
        </v-btn>
        <v-btn icon variant="text" size="small" href="https://twitter.com" target="_blank">
          <v-icon>mdi-twitter</v-icon>
        </v-btn>
        <v-btn icon variant="text" size="small" href="https://linkedin.com" target="_blank">
          <v-icon>mdi-linkedin</v-icon>
        </v-btn>
      </v-row>

      <!-- Mentions légales -->
      <v-row justify="space-between" align="center">
        <!-- Colonne gauche -->
        <div class="text-caption text-grey-darken-1">
          {{ t('footer.copyright') }}
        </div>

        <!-- Colonne droite -->
        <div class="d-flex align-center gap-2">
          <RouterLink
            to="/terms"
            class="text-caption text-grey-darken-1 text-decoration-none"
          >
            {{ t('footer.terms') }}
          </RouterLink>
          |
          <RouterLink
            to="/privacy"
            class="text-caption text-grey-darken-1 text-decoration-none"
          >
            {{ t('footer.privacyPolicy') }}
          </RouterLink>
        </div>
      </v-row>
    </v-container>
  </v-footer>
</template>
