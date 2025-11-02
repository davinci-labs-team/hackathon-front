import { S3BucketService } from '@/services/s3BucketService'
import { getAuthHeaders } from '@/stores/auth'

export const generateSignedUrls = async (filePaths: string[]): Promise<string[]> => {
  if (!filePaths || filePaths.length === 0) return []

  try {
    const urls = await Promise.all(
      filePaths.map((filePath) => S3BucketService.getFileUrl(filePath))
    )
    return urls.map((res) => res.url)
  } catch (err) {
    console.error('Failed to generate signed URLs:', err)
    return []
  }
}

export const openImaggeInNewTab = async (url: string) => {
  try {
    // Si S3 nécessite des headers spécifiques pour l'auth
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) throw new Error('Failed to fetch image')

    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    window.open(blobUrl, '_blank')
  } catch (err) {
    console.error('Error opening image:', err)
  }
}
