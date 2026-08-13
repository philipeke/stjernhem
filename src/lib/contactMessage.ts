import { SITE } from '../data/content'

export type ContactFields = {
  namn: string
  organisation: string
  epost: string
  telefon: string
  meddelande: string
}

export const EMPTY_FIELDS: ContactFields = {
  namn: '',
  organisation: '',
  epost: '',
  telefon: '',
  meddelande: '',
}

export type FieldErrors = Partial<Record<keyof ContactFields, string>>

/**
 * Medvetet tillåtande e-postkontroll: den fångar uppenbara stavfel utan att
 * avvisa adresser som faktiskt fungerar. Den riktiga valideringen sker när
 * mejlet skickas.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validate(fields: ContactFields): FieldErrors {
  const errors: FieldErrors = {}
  if (!fields.namn.trim()) errors.namn = 'Fyll i ditt namn.'
  if (!fields.organisation.trim()) errors.organisation = 'Fyll i kommun eller organisation.'
  if (!fields.epost.trim()) errors.epost = 'Fyll i din e-postadress.'
  else if (!EMAIL.test(fields.epost.trim())) errors.epost = 'Kontrollera e-postadressen.'
  if (!fields.meddelande.trim()) errors.meddelande = 'Beskriv kort vad det gäller.'
  else if (fields.meddelande.trim().length < 10)
    errors.meddelande = 'Skriv gärna någon mening till så vi kan förbereda oss.'
  return errors
}

export function buildSubject(fields: ContactFields): string {
  const who = fields.organisation.trim() || fields.namn.trim()
  return `Förfrågan från ${who}`
}

export function buildBody(fields: ContactFields): string {
  return [
    `Namn: ${fields.namn.trim()}`,
    `Kommun/organisation: ${fields.organisation.trim()}`,
    `E-post: ${fields.epost.trim()}`,
    `Telefon: ${fields.telefon.trim() || '—'}`,
    '',
    fields.meddelande.trim(),
    '',
    `— Skickat via ${SITE.domain}`,
  ].join('\n')
}

export function buildMailto(fields: ContactFields): string {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(
    buildSubject(fields)
  )}&body=${encodeURIComponent(buildBody(fields))}`
}

/** Hela meddelandet som ren text — för kopiera-knappen. */
export function buildPlainText(fields: ContactFields): string {
  return `Till: ${SITE.email}\nÄmne: ${buildSubject(fields)}\n\n${buildBody(fields)}`
}
