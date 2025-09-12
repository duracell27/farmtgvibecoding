'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ userId: string; userName: string; text: string; createdAt: number }>>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const load = async () => {
    try {
      const res = await fetch('/api/chat', { cache: 'no-store' });
      const data = await res.json();
      if (data?.success) setMessages(data.messages || []);
    } catch {}
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const tg = window.Telegram?.WebApp as { initDataUnsafe?: { user?: { id?: number; first_name?: string; last_name?: string } } } | undefined;
      const user = tg?.initDataUnsafe?.user;
      const body = {
        userId: user?.id || 'web',
        userName: user ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}` : 'Гість',
        text: text.trim(),
      };
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data?.success) {
        setText('');
        await load();
      }
    } catch {}
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-4 pt-[100px]">
      <div className="fixed inset-0 bg-green-50 -z-10" />
      <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Чат</h1>
      <div ref={listRef} className="bg-white border rounded-lg p-3 h-[50vh] overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm">Повідомлень поки немає</div>
        )}
        {messages.map((m, idx) => (
          <div key={idx} className="mb-3">
            <div className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">{m.userName}</span> • {new Date(m.createdAt).toLocaleString('uk-UA')}
            </div>
            <div className="text-sm text-gray-800">{m.text}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center space-x-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Написати повідомлення..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          maxLength={500}
        />
        <button
          onClick={send}
          disabled={loading || !text.trim()}
          className={`px-3 py-2 rounded-lg text-white text-sm font-semibold ${!text.trim() || loading ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'}`}
        >
          Відправити
        </button>
      </div>

      <div className="mt-6">
        <Link href="/" className="inline-flex items-center text-green-700 font-semibold">← На головну</Link>
      </div>
      </div>
    </main>
  );
}


