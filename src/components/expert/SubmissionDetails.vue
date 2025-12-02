<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SubmissionDTO } from '@/types/submission'
import { TeamDTO } from '@/types/team'
import { S3BucketService } from '@/services/s3BucketService'

const { t } = useI18n()

const props = defineProps<{
  submissionInfo: SubmissionDTO | null
  teamInfo: TeamDTO | null
  tPrefix: string
}>()

const downloadSubmissionFile = async () => {
  if (!props.submissionInfo?.submissionFilePath) return
  try {
    const { url } = await S3BucketService.getFileUrl('submissions', props.submissionInfo.submissionFilePath)
    window.open(url, '_blank')
  } catch (error) {
    console.error('Error downloading file:', error)
  }
}
</script>

<template>
  <v-card class="pa-6 mb-6">
    <h2 class="text-xl font-semibold mb-4">
      {{ t(`${tPrefix}.submission.project`) }} : {{ teamInfo?.name || '-' }}
    </h2>

    <v-row class="mb-4">
      <v-col cols="12">
        <h3>
          <span v-if="submissionInfo?.githubLink">
            <a
              :href="submissionInfo.githubLink"
              target="_blank"
              rel="noopener noreferrer"
              style="color: #1e88e5; text-decoration: underline;"
            >
              {{ submissionInfo.githubLink }}
            </a>
          </span>
          <span v-else>{{ t(`${tPrefix}.submission.noGithubLink`) }}</span>
        </h3>
      </v-col>
    </v-row>

    <v-alert
      v-if="submissionInfo?.submissionFilePath"
      type="success"
      variant="tonal"
      class="mt-4"
    >
      <v-row align="center">
        <v-col cols="auto">
          <v-icon>mdi-file-check</v-icon>
        </v-col>
        <v-col>
          {{ t(`${tPrefix}.submission.fileUploaded`) }} :
          {{ submissionInfo.submissionFilePath.split('/').pop() }}
        </v-col>
        <v-col cols="auto">
          <v-btn
            variant="outlined"
            size="small"
            prepend-icon="mdi-download"
            @click="downloadSubmissionFile"
          >
            {{ t(`${tPrefix}.submission.download`) }}
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>
  </v-card>
</template>
