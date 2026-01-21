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

/**
 * Formate une date en français ou en anglais (US).
 * Exemple:
 *  - FR : "Samedi 27 juillet 2025 à 09h00"
 *  - EN : "Saturday, July 27, 2025 at 09:00 AM"
 */
export function formatDate(date: Date | string | null, locale: string): string {
  if (!date) return '-' // ou un texte traduit selon le contexte

  const d = typeof date === 'string' ? new Date(date) : date

  if (locale === 'fr') {
    let dateStr = d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1) // Capitaliser 1ère lettre

    const timeStr = d
      .toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      .replace(':', 'h')

    return `${dateStr} à ${timeStr}`
  }

  const dateStr = d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return `${dateStr} at ${timeStr}`
}

export function getDaysBetween(
  start: string | Date | null,
  end: string | Date | null
): number | null {
  if (!start || !end) return null // gérer les cas où une date est nulle

  const startD = typeof start === 'string' ? new Date(start) : start
  const endD = typeof end === 'string' ? new Date(end) : end

  const diffMs = endD.getTime() - startD.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  return Math.ceil(diffDays)
}

export function getDetailedDuration(start: string | Date | null, end: string | Date | null) {
  if (!start || !end) return null

  const startD = new Date(start).getTime()
  const endD = new Date(end).getTime()

  const diffMs = endD - startD
  if (diffMs < 0) return 'Date de fin invalide'

  const totalHours = diffMs / (1000 * 60 * 60)
  const days = Math.floor(totalHours / 24)
  const hours = Math.round(totalHours % 24)

  if (days === 0) return `${hours}h`
  if (hours === 0) return `${days}j`
  return `${days}j et ${hours}h`
}
