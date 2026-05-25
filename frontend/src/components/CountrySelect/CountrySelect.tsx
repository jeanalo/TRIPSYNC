import { useState, useEffect, useRef, useMemo } from 'react';
import { useCountries } from '../../hooks/useCountries';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function CountrySelect({ value, onChange, placeholder = 'Select a country' }: Props) {
  const { countries, loading } = useCountries();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value || '');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!open) setSearch(value || ''); }, [value, open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q ? countries.filter((c) => c.name.toLowerCase().includes(q)) : countries;
  }, [countries, search]);

  return (
    <div ref={ref} className="relative h-full w-full">
      <input
        type="text"
        value={search}
        onFocus={() => { setOpen(true); setSearch(''); }}
        onChange={(e) => { setSearch(e.target.value); setOpen(true); if (!e.target.value) onChange(''); }}
        placeholder={loading ? 'Loading...' : placeholder}
        disabled={loading}
        className="h-full w-full border-none bg-transparent text-[20px] leading-[36px] text-[#1CA698] placeholder-[#1CA698]/50 outline-none disabled:cursor-wait"
      />
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 max-h-[280px] w-full overflow-y-auto rounded-xl border border-[#1CA698]/30 bg-white shadow-lg">
          {loading ? <p className="p-3 text-center text-[#1CA698]/60">Loading...</p>
          : filtered.length === 0 ? <p className="p-3 text-center text-[#1CA698]/60">No results</p>
          : filtered.map((c) => (
            <button key={c.name} type="button"
              onClick={() => { onChange(c.name); setSearch(c.name); setOpen(false); }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#1CA698]/10">
              <span className="text-xl">{c.flag}</span>
              <span className="text-[16px] text-gray-800">{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
