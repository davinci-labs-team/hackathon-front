/**
 * Verify if a URL is a valid image format
 */
export function isValidImageUrl(url: string): boolean {
  return /\.(jpeg|jpg|gif|png|webp|avif|svg)$/.test(url.toLowerCase())
}

export function newTabImage(url: string): void {
  if (isValidImageUrl(url)) {
    window.open(url, '_blank')
  } else {
    console.error('Invalid image URL:', url)
  }
}
