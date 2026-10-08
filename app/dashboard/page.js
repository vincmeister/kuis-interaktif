'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getSessionAndQuizzes() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      setUser(session.user);

      // Ambil kuis yang hanya dibuat oleh user yang sedang login
      const { data } = await supabase
        .from('quizzes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      setQuizzes(data || []);
      setLoading(false);
    }

    getSessionAndQuizzes();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleDeleteQuiz = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kuis ini?')) return;

    await supabase.from('quizzes').delete().eq('id', id);
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  if (loading) {
    return <p className="p-8 text-center text-gray-500">Memuat Dashboard...</p>;
  }

  return (
    <main className="p-6 max-w-4xl mx-auto font-sans">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow border mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Saya</h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/create-quiz"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition"
          >
            + Buat Kuis Baru
          </Link>
          <button
            onClick={handleLogout}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>

      <h2 className="text-lg font-bold text-gray-800 mb-4">Daftar Kuis Milik Anda ({quizzes.length})</h2>

      {quizzes.length === 0 ? (
        <div className="bg-gray-50 border border-dashed rounded-2xl p-8 text-center text-gray-400">
          Belum ada kuis yang dibuat. Klik <b>+ Buat Kuis Baru</b> untuk memulai!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {quizzes.map((q) => (
            <div key={q.id} className="bg-white p-5 rounded-2xl border shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{q.title}</h3>
                <p className="text-xs text-indigo-600 font-mono font-bold mb-4">PIN Room: {q.code}</p>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Link
                  href={`/host?quiz_id=${q.id}&code=${q.code}`}
                  className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs"
                >
                  Mulai Permainan 🚀
                </Link>
                <button
                  onClick={() => handleDeleteQuiz(q.id)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-3 py-2 rounded-lg text-xs"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}