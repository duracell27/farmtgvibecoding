'use client';

import { useEffect, useRef, useState } from 'react';

export default function DebugConsole() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const originalLog = useRef<(...args: unknown[]) => void>();
  const originalError = useRef<(...args: unknown[]) => void>();

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
    console.log = (...args: unknown[]) => { push('[log]', args); originalLog.current?.(...args); };
    console.error = (...args: unknown[]) => { push('[error]', args); originalError.current?.(...args); };
    return () => {
      if (originalLog.current) console.log = originalLog.current;
      if (originalError.current) console.error = originalError.current;
    };
  }, []);

  return (
    <div className="fixed bottom-24 right-2 z-[100]">
      <button
        onClick={() => setOpen(o => !o)}
        className="px-2 py-1 rounded-md text-xs font-bold bg-black/60 text-white"
        title="Debug Console"
      >
        {open ? 'Close Debug' : 'Open Debug'}
      </button>
      {open && (
        <div className="mt-2 w-[300px] h-[200px] bg-black/80 text-green-200 text-[10px] p-2 rounded overflow-auto">
          {lines.map((l, i) => (
            <div key={i} className="whitespace-pre-wrap break-words">{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}


