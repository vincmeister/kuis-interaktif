'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CreateQuizPage() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctOption: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctOption: 0 }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('Anda harus login terlebih dahulu!');
      router.push('/login');
      return;
    }

    // Generate PIN unik acak 6 digit
    const code = 'QUIZ' + Math.floor(100 + Math.random() * 900);

    // 1. Simpan Kuis
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert([{ title, code, user_id: session.user.id }])
      .select()
      .single();

    if (quizError) {
      alert('Gagal membuat kuis: ' + quizError.message);
      setLoading(false);
      return;
    }

    // 2. Simpan Soal-soal
    const formattedQuestions = questions.map((q) => ({
      quiz_id: quizData.id,
      question_text: q.questionText,
      options: q.options,
      correct_option: parseInt(q.correctOption),
    }));

    const { error: qError } = await supabase.from('questions').insert(formattedQuestions);

    if (qError) {
      alert('Kuis dibuat, namun gagal menyimpan beberapa soal: ' + qError.message);
    } else {
      alert('Kuis berhasil dibuat!');
      router.push('/dashboard');
    }

    setLoading(false);
  };

  return (
    <main className="p-6 max-w-2xl mx-auto font-sans">
      <h1 className="text-2xl font-bold text-indigo-600 mb-6">Buat Kuis Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow border">
          <label className="text-xs font-bold text-gray-600 uppercase">Judul Kuis</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Kuis Matematika Kelas 5"
            className="w-full border p-3 rounded-xl mt-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-white p-6 rounded-2xl shadow border space-y-4">
            <h3 className="font-bold text-indigo-600 text-sm">Soal Nomor {qIndex + 1}</h3>
            
            <input
              type="text"
              required
              placeholder="Tuliskan pertanyaan..."
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
              className="w-full border p-3 rounded-xl text-sm"
            />

            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  required
                  placeholder={`Pilihan ${String.fromCharCode(65 + optIndex)}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                  className="border p-2.5 rounded-lg text-sm"
                />
              ))}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500">Jawaban yang Benar:</label>
              <select
                value={q.correctOption}
                onChange={(e) => handleQuestionChange(qIndex, 'correctOption', e.target.value)}
                className="w-full border p-2.5 rounded-lg text-sm mt-1"
              >
                {q.options.map((_, optIndex) => (
                  <option key={optIndex} value={optIndex}>
                    Pilihan {String.fromCharCode(65 + optIndex)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="flex-1 bg-indigo-50 text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-100 transition border border-indigo-200"
          >
            + Tambah Soal
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition"
          >
            {loading ? 'Menyimpan...' : 'Simpan Kuis'}
          </button>
        </div>
      </form>
    </main>
  );
}