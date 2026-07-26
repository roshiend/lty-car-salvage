import Image from "next/image"
import { isGoogleDriveImageUrl, normalizeImageUrl } from "@/lib/image-url"

interface CarPhotoProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  sizes?: string
  priority?: boolean
}

/** Renders car photos; Google Drive uses a plain img tag (Next image optimizer cannot fetch Drive). */
export function CarPhoto({ src, alt, className = "", fill, sizes, priority }: CarPhotoProps) {
  const normalized = normalizeImageUrl(src)
  const drive = isGoogleDriveImageUrl(normalized)

  if (drive) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={normalized}
        alt={alt}
        referrerPolicy="no-referrer"
        className={`${fill ? "absolute inset-0 h-full w-full object-cover " : ""}${className}`}
      />
    )
  }

  return (
    <Image
      src={normalized}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}
