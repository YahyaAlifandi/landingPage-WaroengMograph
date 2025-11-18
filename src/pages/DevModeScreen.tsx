export default function DevModeScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold mb-3">Development Mode</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        Fitur ini hanya tersedia saat <span className="font-semibold">Development Mode</span> aktif.
      </p>

      <div className="space-y-3 mb-8">
        <a
          href="/event/free-preset"
          className="block text-indigo-600 hover:underline"
        >
          ➜ Kembali ke Free Preset
        </a>

        <a
          href="/event/free-preset/add-preset"
          className="block text-indigo-600 hover:underline"
        >
          ➜ Coba akses Add Preset
        </a>
      </div>

      <p className="text-sm text-gray-500">
        Ubah nilai <code className="px-1 py-0.5 bg-gray-100 rounded">VITE_DEVELOPMENT=false</code>  
        untuk mode produksi.
      </p>

      <footer className="mt-12 text-xs text-gray-400">
        © {new Date().getFullYear()} Waroeng Mograph — All Rights Reserved
      </footer>
    </div>
  );
}
