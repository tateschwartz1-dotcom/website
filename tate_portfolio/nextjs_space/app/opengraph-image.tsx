import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Tate Schwartz Portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#F5A88E',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            background: '#3A3A3A',
            borderRadius: 24,
            width: 140,
            height: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#F5A88E',
            fontSize: 90,
            fontWeight: 'bold',
            fontFamily: 'serif',
          }}
        >
          T
        </div>
        <div
          style={{
            color: '#3A3A3A',
            fontSize: 64,
            fontWeight: 'bold',
            fontFamily: 'serif',
            letterSpacing: 4,
          }}
        >
          TATE SCHWARTZ
        </div>
        <div
          style={{
            color: '#3A3A3A',
            fontSize: 32,
            fontFamily: 'serif',
            opacity: 0.7,
          }}
        >
          tateschwartz.net
        </div>
      </div>
    ),
    { ...size }
  );
}
