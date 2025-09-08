'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function CityPage() {
  return (
    <main className="min-h-screen bg-green-50 p-4 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center space-x-2">
        <Image src="/images/місто.png" alt="Місто" width={28} height={28} className="w-8 h-8 object-contain" />
        <span className="text-2xl text-black font-bold">Місто</span>
      </h1>

      {/* City image full width */}
      <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Image 
          src="/images/містоФон.png" 
          alt="Місто"
          width={1200}
          height={600}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Link to Exchange */}
      <div className="mt-6 w-full">
        <Link href="/exchange" className="w-full flex items-center justify-center bg-green-700 rounded-lg p-3 space-x-2 text-white hover:text-green-800 font-medium">
          <Image src="/images/обмін.png" alt="Обмін" width={28} height={28} className="w-7 h-7 object-contain" />
          <span className="text-xl font-bold">Обмін</span>
        </Link>
      </div>
    </main>
  );
}


