import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-4xl font-extrabold mb-8 text-blue-600">Kuis Interaktif Realtime</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/host" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition">
          Masuk Sebagai Host
        </Link>
        <Link href="/play" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition">
          Masuk Sebagai Pemain
        </Link>
      </div>
    </main>
  );
}