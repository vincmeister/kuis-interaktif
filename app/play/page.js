'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function PlayPage() {
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const channel = supabase.channel('room_ROOM123');
    await channel.subscribe();
    await channel.send({
      type: 'broadcast',
      event: 'player_joined',
      payload: { name },
    });

    setJoined(true);
  };

  return (
    <main className="p-8 max-w-md mx-auto font-sans text-center">
      {!joined ? (
        <form onSubmit={handleJoin} className="flex flex-col gap-4 mt-12 bg-white p-6 rounded-xl shadow-md border">
          <h1 className="text-2xl font-bold text-gray-800">Masuk Kuis</h1>
          <input
            type="text"
            placeholder="Masukkan Nama Kamu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-3 rounded-lg text-center font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition">
            Bergabung
          </button>
        </form>
      ) : (
        <div className="bg-green-100 border border-green-200 p-8 rounded-xl mt-12 shadow-sm">
          <h2 className="text-2xl font-bold text-green-800">Berhasil Masuk! 🎉</h2>
          <p className="text-sm text-gray-600 mt-2">Nama kamu sudah tampil di layar host.</p>
        </div>
      )}
    </main>
  );
}