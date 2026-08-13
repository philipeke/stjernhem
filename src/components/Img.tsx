import { useState } from 'react'
import { IMAGES, type ImageName } from '../data/images.generated'
import { cn } from '../lib/cn'

type Props = {
  name: ImageName
  alt: string
  /** `sizes`-attributet — beskriv hur bred bilden faktiskt blir. */
  sizes?: string
  className?: string
  imgClassName?: string
  /** Laddas direkt istället för lazy. Använd bara ovanför vikningen. */
  priority?: boolean
  objectPosition?: string
}

/**
 * Responsiv bild med AVIF → WebP → JPEG och en suddig färgplatta
 * som ligger under tills den riktiga bilden tonat in.
 */
export function Img({
  name,
  alt,
  sizes = '100vw',
  className,
  imgClassName,
  priority = false,
  objectPosition,
}: Props) {
  const asset = IMAGES[name]
  const [loaded, setLoaded] = useState(false)
  const srcset = (ext: 'avif' | 'webp') =>
    asset.widths.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(', ')

  return (
    <span
      className={cn('relative block overflow-hidden bg-ink-800', className)}
      style={{
        backgroundImage: `url("${asset.placeholder}")`,
        backgroundSize: 'cover',
        backgroundPosition: objectPosition ?? 'center',
      }}
    >
      <picture>
        <source type="image/avif" srcSet={srcset('avif')} sizes={sizes} />
        <source type="image/webp" srcSet={srcset('webp')} sizes={sizes} />
        <img
          src={`/img/${name}.jpg`}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-700 ease-out',
            loaded ? 'opacity-100' : 'opacity-0',
            imgClassName
          )}
          style={objectPosition ? { objectPosition } : undefined}
        />
      </picture>
    </span>
  )
}
