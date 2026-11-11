import type { ReactNode } from 'react'

interface StopProps {
  id: string
  className?: string
  children: ReactNode
}

/** Sección de altura fija que marca una parada del recorrido; su contenido queda fijo mientras pasa. */
export function Stop({ id, className = '', children }: StopProps) {
  return (
    <section id={id} className={`stop ${className}`} data-stop>
      <div className="stop-frame">{children}</div>
    </section>
  )
}
