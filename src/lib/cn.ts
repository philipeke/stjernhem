import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Slår ihop klasslistor och låter den sist angivna klassen vinna när två
 * utilities styr samma sak (t.ex. `hidden` mot `inline-flex`). Utan det
 * avgörs krocken av ordningen i den genererade CSS-filen, vilket ger
 * svårhittade buggar när en komponent ska överstyras utifrån.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
