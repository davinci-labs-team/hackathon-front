/**
 * Renvoie une approximation relative en français.
 * Exemple: "il y a 2 jours", "il y a 1 semaine"
 */
function timeAgoFR(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)

  if (seconds < 60) return `il y a ${seconds} seconde${seconds > 1 ? 's' : ''}`
  if (minutes < 60) return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`
  if (hours < 24) return `il y a ${hours} heure${hours > 1 ? 's' : ''}`
  if (days < 7) return `il y a ${days} jour${days > 1 ? 's' : ''}`
  return `il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`
}

/**
 * Renvoie une approximation relative en anglais.
 * Exemple: "2 days ago", "1 week ago"
 */
function timeAgoEN(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)

  if (seconds < 60) return `${seconds} second${seconds > 1 ? 's' : ''} ago`
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  return `${weeks} week${weeks > 1 ? 's' : ''} ago`
}

export function timeAgo(date: Date | string, locale: string): string {
  switch (locale) {
    case 'fr':
      return timeAgoFR(date)
    case 'en':
      return timeAgoEN(date)
    default:
      return timeAgoEN(date)
  }
}
