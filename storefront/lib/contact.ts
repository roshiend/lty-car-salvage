export const WHATSAPP_NUMBER = "447353259996"
export const WHATSAPP_DISPLAY = "07353 259996"
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

export function whatsappUrl(message?: string) {
  if (!message) return WHATSAPP_URL
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
}
