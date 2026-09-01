'use client';

import { useMemo, useState } from 'react';
import { CityCard } from '@/components/CityCard';
import type { City } from '@/lib/data/cities';
import type { Country } from '@/lib/data/countries';
import type { Locale, Ui } from '@/lib/i18n';

type SortKey = 'score' | 'cheapest' | 'fastest' | 'safest';

type Props = {
  cities: City[];
  countries: Country[];
  locale: Locale;
  ui: Ui['filters'];
};

const REGIONS = ['Europe', 'Asia', 'Americas', 'Africa', 'Oceania'] as const;

export function CitiesFilters({ cities, countries, locale, ui }: Props) {
  const [region, setRegion] = useState<string>('any');
  const [maxCost, setMaxCost] = useState<number>(100);
  const [minMbps, setMinMbps] = useState<number>(0);
  const [minSafety, setMinSafety] = useState<number>(0);
  const [minScore, setMinScore] = useState<number>(0);
  const [sort, setSort] = useState<SortKey>('score');
  const [query, setQuery] = useState('');

  const countryRegion = useMemo(
    () => new Map(countries.map((c) => [c.slug, c.region])),
    [countries],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = cities.filter((c) => {
      if (region !== 'any' && countryRegion.get(c.country) !== region) return false;
      if (c.costIndex > maxCost) return false;
      if (c.internetMbps < minMbps) return false;
      if (c.safetyIndex < minSafety) return false;
      if (c.nomadScore < minScore) return false;
      if (q) {
        const name = (c.name[locale] || c.name.en).toLowerCase();
        if (!name.includes(q) && !c.country.includes(q)) return false;
      }
      return true;
    });
    if (sort === 'cheapest') list = list.sort((a, b) => a.costIndex - b.costIndex);
    else if (sort === 'fastest') list = list.sort((a, b) => b.internetMbps - a.internetMbps);
    else if (sort === 'safest') list = list.sort((a, b) => b.safetyIndex - a.safetyIndex);
    else list = list.sort((a, b) => b.nomadScore - a.nomadScore);
    return list;
  }, [cities, countryRegion, region, maxCost, minMbps, minSafety, minScore, sort, query, locale]);

  const reset = () => {
    setRegion('any');
    setMaxCost(100);
    setMinMbps(0);
    setMinSafety(0);
    setMinScore(0);
    setSort('score');
    setQuery('');
  };

  return (
    <div>
      <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs uppercase tracking-widest text-muted font-semibold">{ui.filters}</p>
          <button
            type="button"
            onClick={reset}
            className="text-xs text-muted hover:text-ink transition-colors underline underline-offset-4"
          >
            Reset
          </button>
        </div>

        <div className="mt-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ui.searchCity}
            className="w-full rounded-md border border-line bg-cream px-4 py-2.5 text-sm placeholder:text-muted focus:outline-none focus:border-ink"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Chip active={region === 'any'} onClick={() => setRegion('any')}>{ui.allRegions}</Chip>
          {REGIONS.map((r) => (
            <Chip key={r} active={region === r} onClick={() => setRegion(r)}>{r}</Chip>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Slider
            label={ui.maxCostIndex}
            help={`≤ ${maxCost}/100`}
            min={30}
            max={100}
            step={5}
            value={maxCost}
            onChange={setMaxCost}
          />
          <Slider
            label={ui.minInternet}
            help={`≥ ${minMbps} Mbps`}
            min={0}
            max={300}
            step={10}
            value={minMbps}
            onChange={setMinMbps}
          />
          <Slider
            label={ui.minSafety}
            help={`≥ ${minSafety}/100`}
            min={0}
            max={100}
            step={5}
            value={minSafety}
            onChange={setMinSafety}
          />
          <Slider
            label={ui.minNomadScore}
            help={`≥ ${minScore}/10`}
            min={0}
            max={10}
            step={1}
            value={minScore}
            onChange={setMinScore}
          />
        </div>

        <div className="mt-5 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted uppercase tracking-widest font-semibold">{ui.sortBy}</span>
          {([
            ['score', ui.sortScore],
            ['cheapest', ui.sortCheapest],
            ['fastest', ui.sortFastest],
            ['safest', ui.sortSafest],
          ] as [SortKey, string][]).map(([v, label]) => (
            <Chip key={v} active={sort === v} onClick={() => setSort(v)}>{label}</Chip>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">{filtered.length} cities match your filters</p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-line px-6 py-12 text-center text-muted">
          No city matches. Try widening one of the sliders.
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <li key={c.slug}>
              <CityCard city={c} locale={locale} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
        active
          ? 'bg-ink text-cream'
          : 'bg-cream border border-line text-charcoal hover:border-ink'
      }`}
    >
      {children}
    </button>
  );
}

function Slider({
  label,
  help,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  help: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-semibold tracking-tightish">{label}</label>
        <span className="text-[11px] text-muted tabular-nums">{help}</span>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-accent h-2 cursor-pointer"
      />
    </div>
  );
}
