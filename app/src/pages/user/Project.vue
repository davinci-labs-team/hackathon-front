<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getRole, getTPrefix } from '@/utils/user'
import { depositService } from '@/services/depositService'
import { userService } from '@/services/userService'
import { useAuthStore } from '@/stores/auth'
import type { DepositDTO } from '@/types/deposit'
import type { UserDTO } from '@/types/user'

const { t } = useI18n()
const authStore = useAuthStore()

const userInfo = ref<UserDTO | null>(null)
const depositInfo = ref<DepositDTO | null>(null)

onMounted(async () => {
  if (authStore.user?.id) {
    try {
      const userResponse = await userService.getById(authStore.user.id)
      userInfo.value = userResponse
      if (!userResponse.teamId) return
      // Handle possibility that getbyTeamId returns an array of deposits
      const depositResponse = await depositService.getbyTeamId(userResponse.teamId) as DepositDTO | DepositDTO[] | null
      if (Array.isArray(depositResponse)) {
        depositInfo.value = depositResponse.length ? depositResponse[0] : null
      } else {
        depositInfo.value = depositResponse
      }
      if (!depositInfo.value) {
        depositInfo.value = await depositService.create(userResponse.teamId)
      }
    } catch (err) {
      console.error('Error fetching user data:', err)
    }
  }
})

const role = getRole()
const tPrefix = getTPrefix(role, true)

const formattedDueDate = computed(() => {
  if (!depositInfo.value?.dueDate) return '-'
  return new Date(depositInfo.value.dueDate).toLocaleString()
})

const formattedReviewedAt = computed(() => {
  if (!depositInfo.value?.reviewedAt) return '-'
  return new Date(depositInfo.value.reviewedAt).toLocaleString()
})

const timeRemaining = computed(() => {
  if (!depositInfo.value?.dueDate) return '-'
  const diff = new Date(depositInfo.value.dueDate).getTime() - Date.now()
  if (diff <= 0) return 'Délai dépassé'
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours} h ${minutes} min`
})
</script>

<template>
  <v-container class="py-10">
    <h1 class="text-3xl font-bold mb-8">Dépôt de projet</h1>

    <!-- Bloc principal -->
    <v-card class="pa-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Équipe {{ userInfo?.teamName || '-' }}</h2>

      <v-row align="center" class="mb-4">
        <v-col cols="12" md="8">
          <v-text-field
            label="Dépôt GitHub"
            placeholder="https://github.com/nom/repertoire"
            variant="outlined"
            density="comfortable"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-btn color="primary">Déposer</v-btn>
        </v-col>
      </v-row>

      <h3 class="text-base font-semibold mb-2">Autres fichiers</h3>
      <v-row align="center" class="mb-2">
        <v-col cols="12" md="8">
          <v-file-input
            label="Choisir un fichier"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-btn color="primary">Uploader</v-btn>
        </v-col>
      </v-row>

      <v-list v-if="depositInfo?.files?.length">
        <v-list-item
          v-for="(file, i) in depositInfo.files"
          :key="i"
          class="py-1"
        >
          <v-list-item-title>{{ file }}</v-list-item-title>
          <template #append>
            <v-icon color="green">mdi-check</v-icon>
          </template>
        </v-list-item>
      </v-list>

      <v-btn color="success" class="mt-4">Sauvegarder</v-btn>
    </v-card>

    <!-- Statut de remise -->
    <v-card class="pa-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Statut de remise</h2>

      <v-table density="compact">
        <tbody>
          <tr>
            <td><b>Équipe</b></td>
            <td>{{ userInfo?.teamName || '-' }}</td>
          </tr>
          <tr>
            <td><b>Statut des travaux remis</b></td>
            <td>{{ depositInfo?.depositStatus || 'Aucun document rendu' }}</td>
          </tr>
          <tr>
            <td><b>Statut de l’évaluation</b></td>
            <td>{{ depositInfo?.evaluationStatus || '-' }}</td>
          </tr>
          <tr>
            <td><b>Temps restant</b></td>
            <td>{{ timeRemaining }}</td>
          </tr>
          <tr>
            <td><b>Dernière modification</b></td>
            <td>{{ formattedDueDate }}</td>
          </tr>
          <tr>
            <td><b>Commentaires</b></td>
            <td>{{ depositInfo?.comments || '-' }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Feedback -->
    <v-card class="pa-6">
      <h2 class="text-xl font-semibold mb-4">Feedback</h2>

      <v-table density="compact">
        <tbody>
          <tr>
            <td><b>Note</b></td>
            <td>{{ depositInfo?.grade ? depositInfo.grade + '/20' : '-' }}</td>
          </tr>
          <tr>
            <td><b>Évalué le</b></td>
            <td>{{ formattedReviewedAt }}</td>
          </tr>
          <tr>
            <td><b>Évalué par</b></td>
            <td>{{ depositInfo?.feedback || '-' }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<style scoped>
.v-table {
  border: 1px solid #ddd;
  border-radius: 8px;
}
td {
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
}
</style>
