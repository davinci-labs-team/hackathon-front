import { S3BucketService } from '@/services/s3BucketService'

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
