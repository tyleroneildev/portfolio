'use client';

import { useMemo, useState } from 'react';

const TIMEFRAMES = ['1D', '1W', '1M', '3M', '6M', 'YTD', '1Y', 'ALL'] as const;
const SIMPLE_RANGES = ['1D', '1W', '1M', '3M', '6M', 'YTD', '1Y', 'ALL'] as const;

type Timeframe = (typeof TIMEFRAMES)[number];
type SimpleRange = (typeof SIMPLE_RANGES)[number];

const COMPLEX_SERIES: Record<
  Timeframe,
  {
    candles: Array<[number, number, number, number]>;
    volumes: number[];
    maFast: number[];
    maSlow: number[];
  }
> = {
  '1D': {
    candles: [
      [58, 49, 64, 44],
      [49, 56, 61, 45],
      [56, 47, 60, 41],
      [47, 62, 66, 43],
      [62, 69, 74, 58],
      [69, 57, 71, 52],
      [57, 70, 76, 55],
      [70, 60, 73, 56],
      [60, 74, 80, 58],
      [74, 63, 77, 59],
      [63, 78, 82, 60],
      [78, 66, 83, 62]
    ],
    volumes: [20, 28, 16, 30, 34, 22, 26, 18, 32, 21, 29, 17],
    maFast: [51, 54, 52, 58, 60, 57, 62, 59, 66, 63, 69, 65],
    maSlow: [49, 50, 51, 53, 54, 55, 56, 57, 58, 59, 60, 61]
  },
  '1W': {
    candles: [
      [50, 58, 64, 47],
      [58, 49, 60, 44],
      [49, 62, 66, 46],
      [62, 54, 65, 50],
      [54, 68, 72, 51],
      [68, 56, 70, 52],
      [56, 65, 69, 52],
      [65, 59, 68, 55],
      [59, 70, 74, 56],
      [70, 61, 72, 57],
      [61, 67, 71, 58],
      [67, 63, 73, 58]
    ],
    volumes: [22, 19, 27, 18, 24, 21, 29, 25, 23, 19, 28, 22],
    maFast: [52, 54, 55, 57, 59, 56, 60, 58, 62, 60, 63, 61],
    maSlow: [48, 49, 50, 51, 52, 53, 54, 54, 55, 56, 57, 58]
  },
  '1M': {
    candles: [
      [45, 52, 58, 41],
      [52, 44, 56, 40],
      [44, 54, 60, 42],
      [54, 46, 58, 43],
      [46, 58, 64, 44],
      [58, 50, 62, 46],
      [50, 60, 66, 47],
      [60, 52, 64, 49],
      [52, 62, 68, 48],
      [62, 54, 66, 50],
      [54, 64, 70, 51],
      [64, 56, 72, 53]
    ],
    volumes: [18, 23, 28, 20, 30, 24, 22, 29, 23, 26, 21, 20],
    maFast: [46, 48, 50, 49, 52, 50, 54, 52, 56, 54, 58, 55],
    maSlow: [42, 44, 46, 45, 47, 48, 49, 50, 51, 52, 53, 54]
  },
  '3M': {
    candles: [
      [43, 51, 57, 38],
      [51, 41, 55, 37],
      [41, 54, 60, 39],
      [54, 45, 58, 40],
      [45, 58, 64, 41],
      [58, 48, 62, 43],
      [48, 60, 66, 44],
      [60, 50, 63, 45],
      [50, 62, 68, 46],
      [62, 52, 66, 47],
      [52, 64, 70, 48],
      [64, 54, 72, 49]
    ],
    volumes: [17, 22, 26, 19, 28, 23, 21, 27, 22, 25, 20, 19],
    maFast: [45, 47, 49, 48, 51, 49, 53, 51, 55, 53, 57, 54],
    maSlow: [41, 43, 45, 44, 46, 47, 48, 49, 50, 51, 52, 53]
  },
  '6M': {
    candles: [
      [40, 48, 54, 36],
      [48, 38, 52, 35],
      [38, 50, 56, 37],
      [50, 42, 55, 39],
      [42, 54, 60, 40],
      [54, 44, 58, 41],
      [44, 56, 62, 42],
      [56, 46, 60, 43],
      [46, 58, 64, 44],
      [58, 48, 62, 45],
      [48, 60, 66, 46],
      [60, 50, 68, 47]
    ],
    volumes: [16, 22, 18, 25, 23, 20, 26, 24, 21, 27, 25, 22],
    maFast: [42, 44, 46, 45, 48, 46, 50, 48, 52, 50, 54, 51],
    maSlow: [38, 40, 42, 41, 43, 44, 45, 46, 47, 48, 49, 50]
  },
  YTD: {
    candles: [
      [32, 40, 46, 28],
      [40, 30, 45, 27],
      [30, 42, 48, 29],
      [42, 34, 47, 30],
      [34, 44, 50, 31],
      [44, 36, 49, 32],
      [36, 46, 52, 33],
      [46, 38, 51, 34],
      [38, 48, 54, 35],
      [48, 40, 53, 36],
      [40, 50, 56, 37],
      [50, 42, 58, 38]
    ],
    volumes: [14, 20, 18, 23, 21, 19, 24, 22, 20, 25, 23, 21],
    maFast: [34, 36, 38, 37, 40, 38, 42, 40, 44, 42, 46, 43],
    maSlow: [30, 32, 34, 33, 35, 36, 37, 38, 39, 40, 41, 42]
  },
  '1Y': {
    candles: [
      [26, 34, 40, 22],
      [34, 24, 38, 21],
      [24, 36, 42, 23],
      [36, 28, 41, 24],
      [28, 38, 44, 25],
      [38, 30, 43, 26],
      [30, 40, 46, 27],
      [40, 32, 45, 28],
      [32, 42, 48, 29],
      [42, 34, 47, 30],
      [34, 44, 50, 31],
      [44, 36, 52, 32]
    ],
    volumes: [12, 18, 16, 21, 19, 17, 22, 20, 18, 23, 21, 19],
    maFast: [28, 30, 32, 31, 34, 32, 36, 34, 38, 36, 40, 37],
    maSlow: [24, 26, 28, 27, 29, 30, 31, 32, 33, 34, 35, 36]
  },
  ALL: {
    candles: [
      [22, 30, 38, 18],
      [30, 20, 36, 17],
      [20, 34, 42, 19],
      [34, 24, 40, 20],
      [24, 38, 46, 21],
      [38, 26, 44, 22],
      [26, 40, 48, 23],
      [40, 28, 46, 24],
      [28, 42, 50, 25],
      [42, 30, 48, 26],
      [30, 44, 52, 27],
      [44, 32, 54, 28]
    ],
    volumes: [11, 17, 15, 20, 18, 16, 21, 19, 17, 22, 20, 18],
    maFast: [26, 28, 30, 29, 32, 30, 34, 32, 36, 34, 38, 35],
    maSlow: [22, 24, 26, 25, 27, 28, 29, 30, 31, 32, 33, 34]
  }
};

const SIMPLE_SERIES: Record<
  SimpleRange,
  {
    line: number[];
    metrics: { label: string; value: string }[];
  }
> = {
  '1D': {
    line: [38, 30, 44, 28, 46, 32, 48, 36, 50, 34, 52, 40],
    metrics: [
      { label: 'Total return', value: '+--%' },
      { label: 'Current price', value: '$--.--' },
      { label: 'Risk level', value: '8/10' }
    ]
  },
  '1W': {
    line: [34, 28, 40, 26, 42, 30, 44, 32, 46, 34, 48, 36],
    metrics: [
      { label: 'Total return', value: '+--%' },
      { label: 'Current price', value: '$--.--' },
      { label: 'Risk level', value: '8/10' }
    ]
  },
  '1M': {
    line: [30, 24, 36, 22, 38, 26, 40, 28, 42, 30, 44, 32],
    metrics: [
      { label: 'Total return', value: '+--%' },
      { label: 'Current price', value: '$--.--' },
      { label: 'Risk level', value: '8/10' }
    ]
  },
  '3M': {
    line: [28, 22, 34, 20, 36, 24, 38, 26, 40, 28, 42, 30],
    metrics: [
      { label: 'Total return', value: '+--%' },
      { label: 'Current price', value: '$--.--' },
      { label: 'Risk level', value: '8/10' }
    ]
  },
  '6M': {
    line: [26, 20, 32, 18, 34, 22, 36, 24, 38, 26, 40, 28],
    metrics: [
      { label: 'Total return', value: '+--%' },
      { label: 'Current price', value: '$--.--' },
      { label: 'Risk level', value: '8/10' }
    ]
  },
  YTD: {
    line: [24, 18, 30, 16, 32, 20, 34, 22, 36, 24, 38, 26],
    metrics: [
      { label: 'Total return', value: '+--%' },
      { label: 'Current price', value: '$--.--' },
      { label: 'Risk level', value: '8/10' }
    ]
  },
  '1Y': {
    line: [22, 16, 28, 14, 30, 18, 32, 20, 34, 22, 36, 24],
    metrics: [
      { label: 'Total return', value: '+--%' },
      { label: 'Current price', value: '$--.--' },
      { label: 'Risk level', value: '8/10' }
    ]
  },
  ALL: {
    line: [20, 26, 22, 30, 24, 36, 28, 40, 32, 44, 36, 48],
    metrics: [
      { label: 'Total return', value: '+--%' },
      { label: 'Current price', value: '$--.--' },
      { label: 'Risk level', value: '8/10' }
    ]
  }
};

const CHART_WIDTH = 320;
const CHART_HEIGHT = 160;

function buildLinePoints(values: number[]) {
  const max = 100;
  const min = 0;
  return values
    .map((value, index) => {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * CHART_WIDTH;
      const normalized = (value - min) / (max - min);
      const y = CHART_HEIGHT - normalized * CHART_HEIGHT;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export default function StockViewComparison() {
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('1D');
  const [showIndicators, setShowIndicators] = useState(true);
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [activeRange, setActiveRange] = useState<SimpleRange>('ALL');
  const [tradeAction, setTradeAction] = useState<{
    complex: 'buy' | 'sell' | null;
    simple: 'buy' | 'sell' | null;
  }>({ complex: null, simple: null });

  const complexData = useMemo(() => COMPLEX_SERIES[activeTimeframe], [activeTimeframe]);
  const simpleData = useMemo(() => SIMPLE_SERIES[activeRange], [activeRange]);
  const compareLine = useMemo(
    () =>
      complexData.maSlow.map((value, index) => {
        if (index % 3 === 0) return value + 14;
        if (index % 3 === 1) return value - 10;
        return value + 6;
      }),
    [complexData.maSlow]
  );

  const eventMarkers = [
    {
      label: 'E',
      x: 0.18,
      y: 0.28,
      detail: 'Earnings\nEPS: --.--\nRevenue: --.--\nGuidance: --'
    },
    {
      label: 'D',
      x: 0.55,
      y: 0.6,
      detail: 'Dividend\nEx-date: --/--\nYield: --.--%\nPayout: --'
    },
    {
      label: 'S',
      x: 0.82,
      y: 0.42,
      detail: 'Split\nRatio: --:--\nEffective: --/--\nImpact: --'
    }
  ];

  const chipBase = 'rounded-full border border-[#3a3a3a] px-1.5 py-0.5 text-[10px] uppercase tracking-[0.08em]';
  const chipActive = 'bg-[#2a2a2a] text-[#f0ede7]';
  const chipIdle = 'text-[#9a9a9a]';

  return (
    <section aria-label='Stock view comparison' className='w-full overflow-hidden'>
      <div className='h-220 w-full overflow-hidden pt-4 sm:h-230 md:h-105'>
        <div className='grid h-full grid-rows-[1fr_1fr_auto] gap-6 md:grid-cols-2 md:grid-rows-[1fr_auto] md:gap-6'>
          <div className='flex flex-col rounded-2xl border border-[#2f2f2f] bg-[#1b1b1b] p-4 text-[#c9c9c9] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]'>
            <div className='flex items-center justify-between text-sm'>
              <div className='flex items-center gap-3'>
                <span className='text-base font-semibold tracking-[0.2em] text-[#e0e0e0]'>VEQT</span>
                <span className='text-xs text-[#7f7f7f] uppercase'>$--.--</span>
                <span className='text-xs text-[#7f7f7f]'>--%</span>
              </div>
              <span className='text-[11px] tracking-[0.2em] text-[#6b6b6b] uppercase'>Complex</span>
            </div>

            <div className='mt-3 flex flex-wrap items-center justify-between gap-2'>
              <div className='grid w-full grid-cols-8 gap-1'>
                {TIMEFRAMES.map((timeframe) => {
                  const isActive = timeframe === activeTimeframe;
                  return (
                    <button
                      key={timeframe}
                      className={[chipBase, isActive ? chipActive : chipIdle].join(' ')}
                      onClick={() => setActiveTimeframe(timeframe)}
                      type='button'
                    >
                      {timeframe}
                    </button>
                  );
                })}
              </div>
              <div className='flex items-center gap-2 text-xs'>
                <button
                  className={[
                    'rounded-md border border-[#3a3a3a] px-2 py-1 text-[11px] tracking-[0.12em] uppercase',
                    showIndicators ? 'text-[#e0e0e0]' : 'text-[#7f7f7f]'
                  ].join(' ')}
                  onClick={() => setShowIndicators((prev) => !prev)}
                  type='button'
                >
                  Indicators
                </button>
                <button
                  className={[
                    'rounded-md border border-[#3a3a3a] px-2 py-1 text-[11px] tracking-[0.12em] uppercase',
                    compareEnabled ? 'text-[#e0e0e0]' : 'text-[#7f7f7f]'
                  ].join(' ')}
                  onClick={() => setCompareEnabled((prev) => !prev)}
                  type='button'
                >
                  Compare
                </button>
                <button
                  className={[
                    'rounded-md border px-2 py-1 text-[11px] tracking-[0.12em] uppercase',
                    tradeAction.complex === 'buy'
                      ? 'border-[#3e7b4b] bg-[#17381f] text-[#d5f4dd]'
                      : 'border-[#343434] text-[#6f6f6f]'
                  ].join(' ')}
                  onClick={() =>
                    setTradeAction((prev) => ({
                      ...prev,
                      complex: prev.complex === 'buy' ? null : 'buy'
                    }))
                  }
                  type='button'
                >
                  Buy
                </button>
                <button
                  className={[
                    'rounded-md border px-2 py-1 text-[11px] tracking-[0.12em] uppercase',
                    tradeAction.complex === 'sell'
                      ? 'border-[#824040] bg-[#3b1a1a] text-[#f0c7c7]'
                      : 'border-[#343434] text-[#6f6f6f]'
                  ].join(' ')}
                  onClick={() =>
                    setTradeAction((prev) => ({
                      ...prev,
                      complex: prev.complex === 'sell' ? null : 'sell'
                    }))
                  }
                  type='button'
                >
                  Sell
                </button>
              </div>
            </div>

            <div className='mt-4 flex-1'>
              <div className='h-45 w-full rounded-xl border border-[#2f2f2f] bg-[#151515] p-2 sm:h-50 md:h-42.5'>
                <svg aria-hidden='true' className='h-full w-full' viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
                  <rect x='0' y='0' width={CHART_WIDTH} height={CHART_HEIGHT} fill='none' />
                  {Array.from({ length: 12 }).map((_, index) => {
                    const x = (index / 11) * CHART_WIDTH;
                    return (
                      <line
                        key={`x-${index}`}
                        x1={x}
                        y1={0}
                        x2={x}
                        y2={CHART_HEIGHT}
                        stroke='#2a2a2a'
                        strokeWidth='0.6'
                      />
                    );
                  })}
                  {Array.from({ length: 8 }).map((_, index) => {
                    const y = (index / 7) * CHART_HEIGHT;
                    return (
                      <line
                        key={`y-${index}`}
                        x1={0}
                        y1={y}
                        x2={CHART_WIDTH}
                        y2={y}
                        stroke='#242424'
                        strokeWidth='0.6'
                      />
                    );
                  })}

                  {complexData.candles.map((candle, index) => {
                    const [open, close, high, low] = candle;
                    const isUp = close >= open;
                    const stroke = isUp ? '#4a8f6a' : '#9a4a4a';
                    const fill = isUp ? '#1f3327' : '#3b1f1f';
                    const xStep = CHART_WIDTH / complexData.candles.length;
                    const x = index * xStep + xStep * 0.3;
                    const candleWidth = xStep * 0.4;
                    const highY = CHART_HEIGHT - (high / 100) * CHART_HEIGHT;
                    const lowY = CHART_HEIGHT - (low / 100) * CHART_HEIGHT;
                    const openY = CHART_HEIGHT - (open / 100) * CHART_HEIGHT;
                    const closeY = CHART_HEIGHT - (close / 100) * CHART_HEIGHT;
                    const bodyTop = Math.min(openY, closeY);
                    const bodyHeight = Math.max(2, Math.abs(openY - closeY));
                    return (
                      <g key={`candle-${index}`}>
                        <line
                          x1={x + candleWidth / 2}
                          y1={highY}
                          x2={x + candleWidth / 2}
                          y2={lowY}
                          stroke={stroke}
                          strokeWidth='1'
                        />
                        <rect
                          x={x}
                          y={bodyTop}
                          width={candleWidth}
                          height={bodyHeight}
                          fill={fill}
                          stroke={stroke}
                          strokeWidth='0.8'
                        />
                      </g>
                    );
                  })}

                  {showIndicators && (
                    <>
                      <polyline
                        fill='none'
                        stroke='#b0b0b0'
                        strokeWidth='1.2'
                        points={buildLinePoints(complexData.maFast)}
                      />
                      <polyline
                        fill='none'
                        stroke='#6f6f6f'
                        strokeWidth='1'
                        points={buildLinePoints(complexData.maSlow)}
                      />
                    </>
                  )}

                  {compareEnabled && (
                    <polyline
                      fill='none'
                      stroke='#9f9f9f'
                      strokeWidth='1.6'
                      strokeDasharray='6 3'
                      points={buildLinePoints(compareLine)}
                    />
                  )}

                  {complexData.volumes.map((volume, index) => {
                    const xStep = CHART_WIDTH / complexData.volumes.length;
                    const barWidth = xStep * 0.5;
                    const x = index * xStep + xStep * 0.25;
                    const barHeight = (volume / 40) * 40;
                    return (
                      <rect
                        key={`vol-${index}`}
                        x={x}
                        y={CHART_HEIGHT - barHeight}
                        width={barWidth}
                        height={barHeight}
                        fill='#2f2f2f'
                      />
                    );
                  })}

                  {eventMarkers.map((marker) => {
                    const x = marker.x * CHART_WIDTH;
                    const y = marker.y * CHART_HEIGHT;
                    return (
                      <g key={marker.label}>
                        <title>{marker.detail}</title>
                        <circle cx={x} cy={y} r='6.5' fill='#1b1b1b' stroke='#7f7f7f' strokeWidth='0.8' />
                        <text x={x} y={y + 2} textAnchor='middle' fill='#bdbdbd' fontSize='7' fontFamily='monospace'>
                          {marker.label}
                        </text>
                      </g>
                    );
                  })}

                  <text x='4' y='12' fill='#666666' fontSize='7'>
                    180
                  </text>
                  <text x='4' y='40' fill='#5a5a5a' fontSize='7'>
                    140
                  </text>
                  <text x='4' y='68' fill='#5a5a5a' fontSize='7'>
                    120
                  </text>
                  <text x='4' y='96' fill='#5a5a5a' fontSize='7'>
                    100
                  </text>
                  <text x='4' y='124' fill='#5a5a5a' fontSize='7'>
                    80
                  </text>
                  <text x='4' y='152' fill='#5a5a5a' fontSize='7'>
                    60
                  </text>
                </svg>
              </div>
            </div>

            <div className='mt-2 grid h-19.5 grid-cols-2 gap-2 text-[9px] tracking-[0.12em] text-[#7b7b7b] uppercase'>
              <div className='rounded-lg border border-[#2a2a2a] bg-[#171717] px-2 pt-0 pb-1 text-[9px] leading-[1.15]'>
                <p className='-mt-0.5 leading-none text-[#9b9b9b]'>Order ticket</p>
                <div className='mt-0.5 grid grid-cols-3 gap-1.5 text-[#9a9a9a]'>
                  <span className='rounded-full border border-[#343434] px-1.5 text-center'>MKT</span>
                  <span className='rounded-full border border-[#2f2f2f] px-1.5 text-center'>LMT</span>
                  <span className='rounded-full border border-[#2f2f2f] px-1.5 text-center'>STP</span>
                </div>
                <div className='mt-0.5 flex items-center justify-between text-[#8a8a8a]'>
                  <span>Qty: ---</span>
                  <span>Est: $---</span>
                  <span className='rounded border border-[#2f2f2f] px-1.5 text-[#8a8a8a]'>Preview</span>
                </div>
              </div>

              <div className='rounded-lg border border-[#2a2a2a] bg-[#171717] px-2 pt-0 pb-1 leading-[1.15]'>
                <p className='-mt-0.5 leading-none text-[#9b9b9b]'>Level 2</p>
                <div className='mt-0.5 grid grid-cols-2 gap-x-2 text-[9px] text-[#8a8a8a]'>
                  <span>Bid 200</span>
                  <span>Ask 150</span>
                  <span>$--.--</span>
                  <span>$--.--</span>
                  <span>Bid 120</span>
                  <span>Ask 90</span>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col rounded-2xl border border-[#2f2f2f] bg-[#191919] p-4 text-[#c9c9c9] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]'>
            <div className='flex items-center justify-between text-sm'>
              <div className='flex items-center gap-3'>
                <span className='text-base font-semibold tracking-[0.2em] text-[#e0e0e0]'>VEQT</span>
              </div>
              <span className='text-[11px] tracking-[0.2em] text-[#6b6b6b] uppercase'>Simple</span>
            </div>

            <div className='mt-3 grid w-full grid-cols-8 gap-1 text-xs'>
              {SIMPLE_RANGES.map((range) => {
                const isActive = range === activeRange;
                return (
                  <button
                    key={range}
                    className={[chipBase, isActive ? chipActive : chipIdle].join(' ')}
                    onClick={() => setActiveRange(range)}
                    type='button'
                  >
                    {range}
                  </button>
                );
              })}
            </div>

            <div className='mt-4 flex-1'>
              <div className='h-45 w-full rounded-xl border border-[#2f2f2f] bg-[#151515] p-2 sm:h-50 md:h-42.5'>
                <svg aria-hidden='true' className='h-full w-full' viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
                  <rect x='0' y='0' width={CHART_WIDTH} height={CHART_HEIGHT} fill='none' />
                  {Array.from({ length: 4 }).map((_, index) => {
                    const x = (index / 3) * CHART_WIDTH;
                    return (
                      <line
                        key={`simple-x-${index}`}
                        x1={x}
                        y1={0}
                        x2={x}
                        y2={CHART_HEIGHT}
                        stroke='#242424'
                        strokeWidth='0.6'
                      />
                    );
                  })}
                  {Array.from({ length: 4 }).map((_, index) => {
                    const y = (index / 3) * CHART_HEIGHT;
                    return (
                      <line
                        key={`simple-y-${index}`}
                        x1={0}
                        y1={y}
                        x2={CHART_WIDTH}
                        y2={y}
                        stroke='#242424'
                        strokeWidth='0.6'
                      />
                    );
                  })}

                  <polyline fill='none' stroke='#5fae7a' strokeWidth='1.4' points={buildLinePoints(simpleData.line)} />

                  <text x='6' y='14' fill='#666666' fontSize='7'>
                    High
                  </text>
                  <text x='6' y={CHART_HEIGHT - 6} fill='#666666' fontSize='7'>
                    Low
                  </text>
                  <text x={CHART_WIDTH - 32} y={CHART_HEIGHT - 6} fill='#666666' fontSize='7'>
                    Now
                  </text>
                </svg>
              </div>
            </div>

            <div className='mt-3 flex items-center justify-center gap-2 text-xs'>
              <button
                className={[
                  'rounded-md border px-2 py-1 text-[11px] tracking-[0.12em] uppercase',
                  tradeAction.simple === 'buy'
                    ? 'border-[#3e7b4b] bg-[#17381f] text-[#d5f4dd]'
                    : 'border-[#343434] text-[#6f6f6f]'
                ].join(' ')}
                onClick={() =>
                  setTradeAction((prev) => ({
                    ...prev,
                    simple: prev.simple === 'buy' ? null : 'buy'
                  }))
                }
                type='button'
              >
                Buy
              </button>
              <button
                className={[
                  'rounded-md border px-2 py-1 text-[11px] tracking-[0.12em] uppercase',
                  tradeAction.simple === 'sell'
                    ? 'border-[#824040] bg-[#3b1a1a] text-[#f0c7c7]'
                    : 'border-[#343434] text-[#6f6f6f]'
                ].join(' ')}
                onClick={() =>
                  setTradeAction((prev) => ({
                    ...prev,
                    simple: prev.simple === 'sell' ? null : 'sell'
                  }))
                }
                type='button'
              >
                Sell
              </button>
            </div>

            <div className='mt-3 grid grid-cols-3 gap-3 text-[11px] tracking-[0.14em] text-[#7b7b7b] uppercase'>
              {simpleData.metrics.map((metric) => (
                <div key={metric.label} className='flex flex-col gap-1'>
                  <p className='h-4 leading-none'>{metric.label}</p>
                  <p className='h-4 text-xs leading-none text-[#b0b0b0]'>{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
