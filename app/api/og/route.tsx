import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || "Tyler O'Neil";
  const subtitle = searchParams.get('subtitle') || 'Software developer.';
  const type = searchParams.get('type');

  const safeTitle = title.slice(0, 120);
  const safeSubtitle = subtitle.slice(0, 180);
  const titleSize = clamp(72 - Math.floor(safeTitle.length / 18) * 6, 46, 72);

  return new ImageResponse(
    <div
      tw='h-full w-full flex flex-col justify-between text-[#f3f1ed] px-[72px] py-[64px]'
      style={{
        backgroundColor: '#232323',
        fontFamily: 'Inter, Arial, sans-serif'
      }}
    >
      <div tw='flex items-center justify-between text-[24px] tracking-[0.14em] text-[#a5a19a]'>
        <span>{type ? type : "Tyler O'Neil"}</span>
        <span>tyleroneil.dev</span>
      </div>

      <div tw='flex flex-col gap-5'>
        <h1 tw='m-0 font-semibold tracking-[-0.01em]' style={{ fontSize: `${titleSize}px`, lineHeight: 1.1 }}>
          {safeTitle}
        </h1>
        <p tw='m-0 text-[28px] leading-[1.4] text-[#d6d1c8] max-w-[900px]'>{safeSubtitle}</p>
      </div>

      <div tw='h-1 w-full bg-[#2a2a2a]' />
    </div>,
    {
      width: 1200,
      height: 630
    }
  );
}
