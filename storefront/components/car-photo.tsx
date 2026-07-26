import Image from "next/image"
import { useNativeImageTag } from "@/lib/image-url"

interface CarPhotoProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  sizes?: string
  priority?: boolean
}

export function CarPhoto({ src, alt, className = "", fill, sizes, priority }: CarPhotoProps) {
  const trimmed = src.trim()

  if (useNativeImageTag(trimmed)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={trimmed}
        alt={alt}
        referrerPolicy="no-referrer"
        className={`${fill ? "absolute inset-0 h-full w-full object-cover " : ""}${className}`}
      />
    )
  }

  return (
    <Image
      src={trimmed}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}
