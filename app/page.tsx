'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  // State untuk form login
  const [nis, setNis] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  
  // State untuk status aplikasi
  const [loading, setLoading] = useState(false);
  const [pesanError, setPesanError] = useState('');
  const [hasilSiswa, setHasilSiswa] = useState<any>(null);

  // State untuk Countdown
  const [waktuMundur, setWaktuMundur] = useState({ hari: 0, jam: 0, menit: 0, detik: 0 });
  const [sudahWaktunya, setSudahWaktunya] = useState(false);

  // Waktu target: 2 Juni 2026 18:00 WIB
  const targetWaktu = new Date('2026-05-30T18:00:00+07:00').getTime();

  useEffect(() => {
    const hitungWaktu = () => {
      const sekarang = new Date().getTime();
      const selisih = targetWaktu - sekarang;

      if (selisih <= 0) {
        setSudahWaktunya(true);
        setWaktuMundur({ hari: 0, jam: 0, menit: 0, detik: 0 });
      } else {
        const d = Math.floor(selisih / (1000 * 60 * 60 * 24));
        const h = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((selisih % (1000 * 60)) / 1000);
        setWaktuMundur({ hari: d, jam: h, menit: m, detik: s });
      }
    };

    hitungWaktu();
    const interval = setInterval(hitungWaktu, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPesanError('');
    setHasilSiswa(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nis, tanggal_lahir: tanggalLahir }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPesanError(data.message);
      } else {
        setHasilSiswa(data);
      }
    } catch (err) {
      setPesanError('Terjadi gangguan koneksi, coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 antialiased selection:bg-blue-500 selection:text-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            SDIT Tunas Ilmu
          </h1>
          <p className="text-sm text-slate-500">
            Sistem Informasi Kelulusan Siswa Kelas 6 TA 2025/2026
          </p>
        </div>

        {/* Komponen Kotak Hitung Mundur */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white text-center shadow-md">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-100 mb-2">
            {sudahWaktunya ? "Status Pengumuman:" : "Hitung Mundur Pengumuman:"}
          </p>
          
          {sudahWaktunya ? (
            <div className="text-lg font-bold animate-pulse text-emerald-300">
              Gerbang Pengumuman Telah Dibuka!
            </div>
          ) : (
            <div className="flex justify-center space-x-4 text-center">
              <div>
                <span className="block text-2xl font-extrabold">{waktuMundur.hari}</span>
                <span className="text-[10px] uppercase text-blue-200">Hari</span>
              </div>
              <div className="text-2xl font-bold">:</div>
              <div>
                <span className="block text-2xl font-extrabold">{waktuMundur.jam}</span>
                <span className="text-[10px] uppercase text-blue-200">Jam</span>
              </div>
              <div className="text-2xl font-bold">:</div>
              <div>
                <span className="block text-2xl font-extrabold">{waktuMundur.menit}</span>
                <span className="text-[10px] uppercase text-blue-200">Menit</span>
              </div>
              <div className="text-2xl font-bold">:</div>
              <div>
                <span className="block text-2xl font-extrabold">{waktuMundur.detik}</span>
                <span className="text-[10px] uppercase text-blue-200">Detik</span>
              </div>
            </div>
          )}
        </div>

        {/* Form Login - Selalu tampil agar siswa bisa cek akun */}
        {!hasilSiswa && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Nomor Induk Siswa (NIS)
              </label>
              <input
                type="text"
                required
                placeholder="Masukkan NIS kamu"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
             <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Tanggal Lahir (DDMMYYYY)
             </label>
             <input
              type="text"
              required
              placeholder="Contoh: 17052008"
              value={tanggalLahir}
              onChange={(e) => setTanggalLahir(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {pesanError && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg font-medium border border-red-100">
                ⚠️ {pesanError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg text-sm shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
            >
              {loading ? 'Memeriksa...' : 'Lihat Hasil Kelulusan'}
            </button>
          </form>
        )}

        {/* Tampilan Hasil Kelulusan Setelah Login */}
        {hasilSiswa && (
          <div className="border-t border-slate-100 pt-4 space-y-4 animate-fadeIn">
            <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
              <p className="text-xs text-slate-400 uppercase font-bold">Nama Siswa</p>
              <p className="text-base font-bold text-slate-800">{hasilSiswa.nama_siswa}</p>
            </div>

            {hasilSiswa.status === 'BELUM_WAKTUNYA' ? (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center">
                <p className="text-amber-800 font-semibold text-sm">{hasilSiswa.message}</p>
                <p className="text-[11px] text-amber-600 mt-1">Data Anda aman di server, tombol hasil terkunci hingga waktu rilis.</p>
              </div>
            ) : (
              <div className={`p-6 rounded-xl text-center shadow-inner ${
              hasilSiswa.status_kelulusan === 'LULUS' 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}>
              <p className="text-xs uppercase tracking-widest font-bold opacity-70">Dinyatakan</p>
              <p className="text-3xl font-extrabold my-2 tracking-wide">{hasilSiswa.status_kelulusan}</p>
    
              {/* Baris teks dinamis di bawah ini yang diubah */}
              <p className="text-xs opacity-80">
                {hasilSiswa.status_kelulusan === 'LULUS' 
                ? 'Selamat menempuh jenjang pendidikan berikutnya!' 
                : 'Hubungi bagian Tata Usaha untuk informasi lebih jelas'}
              </p>
              </div>
            )}

            <button
              onClick={() => setHasilSiswa(null)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-2 rounded-lg text-xs transition-all"
            >
              Kembali
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-50">
          &copy; 2026 Tim IT SDIT Tunas Ilmu.
        </div>
      </div>
    </main>
  );
}