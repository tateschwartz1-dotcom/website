import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Tate Schwartz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const [photo, consolas] = await Promise.all([
    fetch(new URL('../public/photos/photo1.jpg', import.meta.url)).then((res) =>
      res.arrayBuffer()
    ),
    fetch(new URL('../public/fonts/consola.ttf', import.meta.url)).then((res) =>
      res.arrayBuffer()
    ),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          background: '#FFD4B2',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '64px 0 64px 142px',
          fontFamily: 'Consolas',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            width: 390,
            height: 440,
            padding: '22px 22px 28px 22px',
            display: 'flex',
            flexDirection: 'column',
            transform: 'rotate(2deg)',
          }}
        >
          <img
            src={photo as unknown as string}
            alt="Tate Schwartz"
            width={346}
            height={346}
            style={{
              width: 346,
              height: 346,
              objectFit: 'cover',
              objectPosition: '50% 42%',
            }}
          />
        </div>

        <div
          style={{
            color: '#3A3A3A',
            width: 620,
            fontSize: 56,
            fontWeight: 400,
            letterSpacing: '0.05em',
            lineHeight: 1.1,
            marginLeft: 64,
            whiteSpace: 'nowrap',
          }}
        >
          TATE SCHWARTZ
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Consolas',
          data: consolas,
          weight: 400,
          style: 'normal',
        },
      ],
    }
  );
}
