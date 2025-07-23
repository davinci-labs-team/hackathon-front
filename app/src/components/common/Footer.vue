<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
</script>

<template>
  <v-footer class="pa-4">
    <v-container>
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

      <v-row justify="space-between" align="center">
        <!-- Colonne gauche -->
        <div class="text-caption grey--text text--darken-1">
          {{ t('footer.copyright') }}
        </div>

        <!-- Colonne droite -->
        <div class="d-flex align-center gap-4">
          <a
            href="/terms"
            class="text-caption grey--text text--darken-1 text-decoration-none"
            style="cursor: pointer"
          >
            {{ t('footer.terms') }}
          </a>
          |
          <a
            href="/privacy-policy"
            class="text-caption grey--text text--darken-1 text-decoration-none"
            style="cursor: pointer"
          >
            {{ t('footer.privacyPolicy') }}
          </a>
        </div>
      </v-row>
    </v-container>
  </v-footer>
</template>
