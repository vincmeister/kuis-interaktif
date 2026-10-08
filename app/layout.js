export const metadata = {
  title: 'Kuis Interaktif',
  description: 'Aplikasi Kuis Realtime',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}