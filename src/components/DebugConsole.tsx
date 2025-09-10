'use client';

import { useEffect, useRef, useState } from 'react';

export default function DebugConsole() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const originalLog = useRef<((...args: unknown[]) => void) | null>(null);
  const originalError = useRef<((...args: unknown[]) => void) | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    originalLog.current = console.log;
    originalError.current = console.error;
    const push = (prefix: string, args: unknown[]) => {
      const msg = `${prefix} ${args.map(a => {
        try { return typeof a === 'string' ? a : JSON.stringify(a); } catch { return String(a); }
      }).join(' ')}`;
      setLines(prev => [...prev.slice(-200), msg]);
    };
    console.log = (...args: unknown[]) => { push('[log]', args); originalLog.current && originalLog.current(...args); };
    console.error = (...args: unknown[]) => { push('[error]', args); originalError.current && originalError.current(...args); };
    return () => {
      if (originalLog.current) console.log = originalLog.current;
      if (originalError.current) console.error = originalError.current;
    };
  }, []);

  return (
    <div className="fixed right-2 top-[100px] z-[100]">
      <button
        onClick={() => setOpen(o => !o)}
        className="px-3 py-1.5 rounded-md text-xs font-bold bg-black/70 text-white shadow"
        title="Debug Console"
      >
        {open ? 'Close Debug' : 'Open Debug'}
      </button>
      {open && (
        <div className="mt-2 w-[320px] h-[220px] bg-black/85 text-green-200 text-[10px] p-2 rounded overflow-auto shadow-lg">
          {lines.map((l, i) => (
            <div key={i} className="whitespace-pre-wrap break-words">{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}


