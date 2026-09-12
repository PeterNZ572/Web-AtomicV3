'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import styles from '../projects.module.css'

type Props = { title: string; images: string[] }

export function ProjectGallery({ title, images }: Props) {
  // `null` means the lightbox is closed; otherwise it's the open image index.
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = useCallback(() => setOpenIndex(null), [])

  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? current : (current + delta + images.length) % images.length,
      ),
    [images.length],
  )

  useEffect(() => {
    if (openIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      else if (event.key === 'ArrowRight') step(1)
      else if (event.key === 'ArrowLeft') step(-1)
    }

    // Keep the page behind the overlay from scrolling while it's open.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [openIndex, close, step])

  return (
    <>
      <div className={styles.galleryGrid}>
        {images.map((url, index) => (
          <button
            key={url}
            type="button"
            className={styles.galleryCard}
            onClick={() => setOpenIndex(index)}
            aria-label={`View ${title} image ${index + 1} full size`}
          >
            <Image
              src={url}
              alt={`${title} — image ${index + 1}`}
              width={1200}
              height={900}
              unoptimized
            />
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — image ${openIndex + 1} of ${images.length}`}
          onClick={close}
        >
          <button type="button" className={styles.lightboxClose} onClick={close} aria-label="Close">
            ✕
          </button>

          {images.length > 1 ? (
            <button
              type="button"
              className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
              onClick={(event) => {
                event.stopPropagation()
                step(-1)
              }}
              aria-label="Previous image"
            >
              ←
            </button>
          ) : null}

          <div className={styles.lightboxStage} onClick={(event) => event.stopPropagation()}>
            <Image
              src={images[openIndex]}
              alt={`${title} — image ${openIndex + 1}`}
              width={1920}
              height={1440}
              unoptimized
              priority
            />
          </div>

          {images.length > 1 ? (
            <button
              type="button"
              className={`${styles.lightboxNav} ${styles.lightboxNext}`}
              onClick={(event) => {
                event.stopPropagation()
                step(1)
              }}
              aria-label="Next image"
            >
              →
            </button>
          ) : null}

          {images.length > 1 ? (
            <div className={styles.lightboxCount}>
              {openIndex + 1} / {images.length}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
