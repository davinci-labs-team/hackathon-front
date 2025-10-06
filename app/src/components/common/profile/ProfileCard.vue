<script setup lang="ts">
import { defineProps } from 'vue'
import type { UserDTO } from '@/types/user'
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const props = defineProps<{
  user: UserDTO
  profilePicture: string
  editMode: boolean
}>()

const role = props.user.role ? props.user.role.toLowerCase() : 'participant'
</script>

<template>
  <v-card class="pa-6 mb-6" outlined>
    <v-row justify="space-between">
      <v-col cols="10" md="4" class="d-flex align-center ml-4 gap-4">
        <v-avatar size="200" class="mr-4 elevation-1">
          <v-img :src="profilePicture" />
        </v-avatar>
        <div>
          <div class="user-name">{{ user.firstname }} {{ user.lastname }}</div>
          <div class="user-role">
            {{ t(`roles.${role}`) }}
          </div>
          <div class="user-school" v-if="user.school">{{ user.school }}</div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.user-name { font-size: 2rem; font-weight: bold; }
.user-role { font-size: 1.4rem; color: gray; }
.user-school { font-size: 1.4rem; margin-top: 1rem; }
</style>
