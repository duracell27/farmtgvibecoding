'use client';

import { Footer } from '@/components/Footer';

export default function CityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-green-50 pb-24" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 96px)' }}>
      {children}
      <Footer />
    </div>
  );
}


