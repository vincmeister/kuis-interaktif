'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage('Pendaftaran berhasil! Silakan login.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else {
        router.push('/dashboard');
        router.refresh();
      }
    }
    setLoading(false);
  };

  return (
    <main className="p-6 max-w-md mx-auto font-sans mt-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg border">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          {isRegister ? 'Daftar Akun Pembuat Kuis' : 'Login Pembuat Kuis'}
        </h1>

        {message && (
          <div className="bg-indigo-50 text-indigo-700 text-sm p-3 rounded-xl mb-4 text-center font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-xl mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-xl mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow"
          >
            {loading ? 'Memproses...' : isRegister ? 'Daftar Sekarang' : 'Masuk'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-600 font-semibold hover:underline"
          >
            {isRegister ? 'Sudah punya akun? Login' : 'Belum punya akun? Daftar gratis'}
          </button>
        </div>
      </div>
    </main>
  );
}