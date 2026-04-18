import { useEffect, useRef, useState } from 'react';

interface Option {
  label: string;
  value: string;
}

interface Props {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
}

export default function CustomSelect({ value, options, onChange, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={rootRef} className={`relative min-w-[180px] ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-2xl border border-stone-300 bg-white px-4 py-3 text-left text-sm font-medium text-stone-800 shadow-[0_10px_25px_rgba(28,25,23,0.08)] transition-all hover:border-primary-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected?.label}</span>
        <svg className={`h-4 w-4 text-stone-500 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-30 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_20px_45px_rgba(28,25,23,0.14)]">
          <ul role="listbox" className="max-h-64 overflow-y-auto py-2">
            {options.map((option) => {
              const active = option.value === value;
              return (
                <li key={option.value || option.label}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-sm transition-colors ${active ? 'bg-primary-500 text-stone-950 font-semibold' : 'text-stone-700 hover:bg-stone-100'}`}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}