/**
 * A post's drawing: a transparent PNG under /public, framed 4:3 and letterboxed
 * rather than cropped, so a drawing of any shape lands in a consistent box with
 * nothing cut off.
 *
 * The drawings are black line art on transparency, which vanishes against a dark
 * background — so on night mode the artwork is inverted to white ink instead.
 */

interface PostDrawingProps {
  drawing?: string;
  title: string;
  /** Set on dark reading backgrounds. */
  invert?: boolean;
  className?: string;
}

export function PostDrawing({ drawing, title, invert = false, className = '' }: PostDrawingProps) {
  if (!drawing) return null;

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={drawing}
      alt={`Drawing for ${title}`}
      className={`w-full h-full object-contain ${className}`}
      style={invert ? { filter: 'invert(1)' } : undefined}
    />
  );
}
