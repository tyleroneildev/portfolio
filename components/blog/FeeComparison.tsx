'use client';

import { useMemo, useState } from 'react';

const MER_INDEX = 0.0021;
const MER_MUTUAL = 0.02;
const currencyFormatter = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' });

const chipBase = 'rounded-full border border-[#3a3a3a] px-2 py-0.5 text-[10px] uppercase tracking-[0.08em]';

function clampNumber(value: number, min: number, max?: number) {
  if (!Number.isFinite(value)) return min;
  if (max !== undefined) return Math.min(Math.max(value, min), max);
  return Math.max(value, min);
}

function simulateFeeDrag(params: {
  startingAmount: number;
  monthlyContribution: number;
  years: number;
  annualReturn: number;
  mer: number;
}) {
  const months = Math.max(0, Math.round(params.years * 12));
  const monthlyGrossRate = Math.pow(1 + params.annualReturn, 1 / 12) - 1;
  const monthlyFeeRate = Math.pow(1 + params.mer, 1 / 12) - 1;

  let balance = params.startingAmount;
  let totalFees = 0;

  for (let i = 0; i < months; i += 1) {
    const balanceBeforeFee = balance * (1 + monthlyGrossRate);
    const feeThisMonth = balanceBeforeFee * monthlyFeeRate;
    balance = balanceBeforeFee - feeThisMonth + params.monthlyContribution;
    totalFees += feeThisMonth;
  }

  const totalContributed = params.startingAmount + params.monthlyContribution * months;

  return {
    endingValue: balance,
    totalFees,
    totalContributed
  };
}

export default function FeeComparison() {
  const [years, setYears] = useState(30);
  const annualReturn = 0.07;
  const startingAmount = 0;
  const monthlyContribution = 500;

  const results = useMemo(() => {
    const index = simulateFeeDrag({
      startingAmount,
      monthlyContribution,
      years,
      annualReturn,
      mer: MER_INDEX
    });

    const mutual = simulateFeeDrag({
      startingAmount,
      monthlyContribution,
      years,
      annualReturn,
      mer: MER_MUTUAL
    });

    const maxEnding = Math.max(index.endingValue, mutual.endingValue, 1);

    return {
      index,
      mutual,
      maxEnding,
      difference: Math.abs(index.endingValue - mutual.endingValue)
    };
  }, [startingAmount, monthlyContribution, years, annualReturn]);

  return (
    <section aria-label='Fee comparison' className='w-full overflow-hidden'>
      <div className='mt-4 rounded-2xl border border-[#2f2f2f] bg-[#1b1b1b] px-4 pb-4 text-[#c9c9c9] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-sm font-semibold tracking-[0.18em] text-[#e0e0e0] uppercase'>Fees add up</h2>
            <p className='text-[11px] font-semibold tracking-[0.14em] text-[#d7d7d7] uppercase'>
              7% return · $500/month invested
            </p>
          </div>
        </div>

        <div className='mt-4 rounded-xl border border-[#2a2a2a] bg-[#161616] px-3 py-3'>
          <div className='flex items-center justify-between text-[10px] tracking-[0.14em] text-[#7b7b7b] uppercase'>
            <span>Years</span>
            <span className='text-[#bdbdbd]'>{years}</span>
          </div>
          <input
            type='range'
            min={1}
            max={40}
            value={years}
            onChange={(event) => setYears(clampNumber(Number(event.target.value), 1, 40))}
            className='mt-2 h-2 w-full accent-[#5f5f5f]'
          />
        </div>

        <div className='mt-4 grid gap-3 md:grid-cols-2'>
          <div className='rounded-xl border border-[#2a2a2a] bg-[#191919] p-4'>
            <div className='flex items-start justify-between gap-3'>
              <p className='text-[11px] leading-tight tracking-[0.18em] text-[#7b7b7b] uppercase'>
                Low cost index fund
              </p>
              <span className={[chipBase, 'text-[#9a9a9a]'].join(' ')}>0.21% MER</span>
            </div>
            <div className='mt-2 flex flex-col gap-1'>
              <p className='text-lg font-semibold text-[#e0e0e0]'>
                {currencyFormatter.format(results.index.endingValue)}
              </p>
              <p className='text-xs text-[#22c55e]'>Fees paid {currencyFormatter.format(results.index.totalFees)}</p>
            </div>
          </div>

          <div className='rounded-xl border border-[#2a2a2a] bg-[#191919] p-4'>
            <div className='flex items-start justify-between gap-3'>
              <p className='text-[11px] leading-tight tracking-[0.18em] text-[#7b7b7b] uppercase'>
                Typical mutual fund
              </p>
              <span className={[chipBase, 'text-[#9a9a9a]'].join(' ')}>2.00% MER</span>
            </div>
            <div className='mt-2 flex flex-col gap-1'>
              <p className='text-lg font-semibold text-[#e0e0e0]'>
                {currencyFormatter.format(results.mutual.endingValue)}
              </p>
              <p className='text-xs text-[#ef4444]'>Fees paid {currencyFormatter.format(results.mutual.totalFees)}</p>
            </div>
          </div>
        </div>

        <div className='mt-4 rounded-xl border border-[#2a2a2a] bg-[#161616] px-4 py-4 text-center text-sm text-[#bdbdbd] md:text-base'>
          Difference after {years} years:{' '}
          <span className='text-lg font-semibold text-[#e0e0e0] md:text-xl'>
            {currencyFormatter.format(results.difference)}
          </span>
        </div>
      </div>
    </section>
  );
}
