'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function HostPage() {
  const [players, setPlayers] = useState([]);
  const roomCode = 'ROOM123';

  useEffect(() => {
    const channel = supabase.channel(`room_${roomCode}`)
      .on('broadcast', { event: 'player_joined' }, (payload) => {
        setPlayers((prev) => [...prev, payload.payload.name]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="p-8 max-w-lg mx-auto text-center font-sans">
      <h1 className="text-2xl font-bold mb-2">Layar Host Kuis</h1>
      <div className="bg-blue-100 p-6 rounded-xl my-4 shadow-inner">
        <p className="text-sm text-gray-600 font-semibold">Kode PIN Room:</p>
        <p className="text-5xl font-black text-blue-600 tracking-wider">{roomCode}</p>
      </div>

      <h2 className="text-lg font-semibold mt-6 mb-3">Pemain Bergabung ({players.length}):</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {players.length === 0 ? (
          <p className="text-gray-400 italic">Menunggu pemain bergabung...</p>
        ) : (
          players.map((p, idx) => (
            <span key={idx} className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
              {p}
            </span>
          ))
        )}
      </div>
    </main>
  );
}