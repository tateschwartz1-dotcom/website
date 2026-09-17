'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

/** An image opened for a closer look. */
export interface Enlarged {
  src: string;
  alt: string;
  /**
   * Whether this image is already being shown inverted in the article. The
   * lightbox copies that decision rather than making its own, so enlarging an
   * image never changes how it looks — only how big it is.
   */
  invert: boolean;
}

interface ImageLightboxProps {
  enlarged: Enlarged | null;
  onClose: () => void;
  /** The reader's own background, so the zoom view keeps the page's mood. */
  overlayColor: string;
  /** The reader's text color, for the close button and hint. */
  controlColor: string;
}

export function ImageLightbox({
  enlarged,
  onClose,
  overlayColor,
  controlColor,
}: ImageLightboxProps) {
  const [zoomed, setZoomed] = useState(false);
  // Portalled to document.body, which only exists after mount.
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Every image opens fitted, whichever way the last one was left.
  useEffect(() => setZoomed(false), [enlarged?.src]);

  useEffect(() => {
    if (!enlarged) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // Hold the article still behind the overlay.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [enlarged, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {enlarged && (
        <motion.div
          className="fixed inset-0 z-[200]"
          style={{ backgroundColor: overlayColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          role="dialog"
          aria-modal="true"
          aria-label={enlarged.alt}
        >
          {/* Zoomed, the image overflows its container and the box scrolls, so
              a wide chart can be panned around. Fitted, it is centered whole.
              Clicking anywhere but the image closes. */}
          <div
            className={`h-full w-full p-4 md:p-8 ${
              zoomed ? 'overflow-auto' : 'flex items-center justify-center'
            }`}
            onClick={onClose}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={enlarged.src}
              alt={enlarged.alt}
              onClick={(e) => {
                e.stopPropagation();
                setZoomed((value) => !value);
              }}
              className={
                zoomed
                  ? 'w-[200%] max-w-none cursor-zoom-out md:w-[150%]'
                  : 'max-h-[88vh] max-w-full object-contain cursor-zoom-in'
              }
              style={enlarged.invert ? { filter: 'invert(1)' } : undefined}
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-4 text-2xl leading-none px-3 py-2 opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: controlColor }}
            aria-label="Close"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
