import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Tate Schwartz';
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
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            color: '#3A3A3A',
            fontSize: 500,
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            lineHeight: 1,
          }}
        >
          T
        </div>
      </div>
    ),
    { ...size }
  );
}
