import type { TeaId } from '../content/teas'

/** Té que el visitante señala en el catálogo; la escena levanta su lata. */
export const selection: { teaId: TeaId | null } = { teaId: null }

/** Marca un té como señalado o limpia la selección con null. */
export function selectTea(teaId: TeaId | null): void {
  selection.teaId = teaId
}
