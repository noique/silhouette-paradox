import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'The Silhouette Paradox — DTC Dark Data Report'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px 100px',
          background: '#0A0A0A',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle warm gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(ellipse at 30% 50%, rgba(255,190,152,0.08) 0%, transparent 60%)',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            width: 60,
            height: 2,
            background: '#FFBE98',
            marginBottom: 40,
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#F5F0EB',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          The Silhouette Paradox
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: '#A9A9A9',
            letterSpacing: '0.02em',
            lineHeight: 1.5,
            maxWidth: 700,
            marginBottom: 48,
          }}
        >
          When luxury aesthetics mask financial hemorrhage
        </div>

        {/* Key stat */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#FFBE98',
            }}
          >
            $5M GMV
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#722F37',
            }}
          >
            0.12% net margin
          </div>
        </div>

        {/* Bottom right credit */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            fontSize: 16,
            color: '#808080',
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
          }}
        >
          Interactive Data Narrative — 2026
        </div>

        {/* Bottom left accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 100,
            width: 40,
            height: 2,
            background: '#722F37',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
