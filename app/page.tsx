'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  // Helper untuk mengubah format titik menjadi koma pada desimal nilai
  const formatNilai = (nilai: any) => {
    if (nilai === undefined || nilai === null) return '0';
    return nilai.toString().replace('.', ',');
  };

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
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 antialiased selection:bg-rose-800 selection:text-white">
      {/* Container melebar otomatis dari max-w-md menjadi max-w-2xl jika hasilSiswa aktif */}
      <div className={`w-full ${hasilSiswa ? 'max-w-2xl' : 'max-w-md'} bg-white rounded-2xl shadow-xl border border-slate-100 p-6 space-y-6 transition-all duration-300`}>
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-rose-900 tracking-tight">
            SDIT Tunas Ilmu
          </h1>
          <p className="text-sm text-slate-500">
            Sistem Informasi Kelulusan Siswa Kelas 6 TA 2025/2026
          </p>
        </div>

        {/* Komponen Kotak Hitung Mundur (Warna Merah Maroon Elegan & Tenang) */}
        <div className="bg-gradient-to-br from-rose-900 to-slate-800 rounded-xl p-4 text-white text-center shadow-md border border-rose-950/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-200 mb-2">
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
                <span className="text-[10px] uppercase text-rose-200">Hari</span>
              </div>
              <div className="text-2xl font-bold text-rose-300">:</div>
              <div>
                <span className="block text-2xl font-extrabold">{waktuMundur.jam}</span>
                <span className="text-[10px] uppercase text-rose-200">Jam</span>
              </div>
              <div className="text-2xl font-bold text-rose-300">:</div>
              <div>
                <span className="block text-2xl font-extrabold">{waktuMundur.menit}</span>
                <span className="text-[10px] uppercase text-rose-200">Menit</span>
              </div>
              <div className="text-2xl font-bold text-rose-300">:</div>
              <div>
                <span className="block text-2xl font-extrabold">{waktuMundur.detik}</span>
                <span className="text-[10px] uppercase text-rose-200">Detik</span>
              </div>
            </div>
          )}
        </div>

        {/* Form Login */}
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
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800 transition-all"
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
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-800 transition-all"
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
              className="w-full bg-rose-900 hover:bg-rose-950 text-white font-medium py-3 rounded-lg text-sm shadow-md transition-all disabled:opacity-50"
            >
              {loading ? 'Memeriksa...' : 'Lihat Hasil Kelulusan'}
            </button>
          </form>
        )}

        {/* Tampilan Hasil Kelulusan & Dashboard Nilai Setelah Login */}
        {hasilSiswa && (
          <div className="border-t border-slate-100 pt-4 space-y-6 animate-fadeIn">
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
              <>
                {/* Box Status Kelulusan Utama */}
                <div className={`p-6 rounded-xl text-center shadow-inner ${
                  hasilSiswa.status_kelulusan === 'LULUS' 
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-70">Dinyatakan</p>
                  <p className="text-3xl font-extrabold my-2 tracking-wide">{hasilSiswa.status_kelulusan}</p>
                  <p className="text-xs opacity-80">
                    {hasilSiswa.status_kelulusan === 'LULUS' 
                      ? 'Selamat menempuh jenjang pendidikan berikutnya!' 
                      : 'Hubungi bagian Tata Usaha untuk informasi lebih jelas'}
                  </p>
                </div>

                {/* ========================================================================= */}
                {/* VISUALISASI SEKTOR 1: NILAI IJAZAH */}
                {/* ========================================================================= */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-rose-900 p-4 text-white">
                    <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
                      📋 TRANSKRIP NILAI IJAZAH
                    </h3>
                  </div>
                  
                  <div className="p-5 space-y-5">
                    {/* Nilai Rata-Rata Besar */}
                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                      <span className="text-slate-700 font-bold text-xs uppercase tracking-wider">Rata-Rata Ijazah</span>
                      <span className="text-3xl font-black text-rose-900">{formatNilai(hasilSiswa["rata-rata"])}</span>
                    </div>

                    {/* Rentetan Grafik Batang Horizontal */}
                    <div className="space-y-3.5">
                      {[
                        { label: 'Pendidikan Agama Islam (PAI)', key: 'pai' },
                        { label: 'PPKN', key: 'ppkn' },
                        { label: 'Bahasa Indonesia', key: 'bi' },
                        { label: 'Matematika', key: 'mtk' },
                        { label: 'IPAS', key: 'ipas' },
                        { label: 'Bahasa Inggris', key: 'eng' },
                        { label: 'SBDP', key: 'sbdp' },
                        { label: 'PJOK', key: 'pjok' },
                        { label: 'Bahasa Mulok', key: 'bumel' },
                        { label: 'Bahasa Arab', key: 'arab' },
                      ].map((item) => {
                        const nilaiAngka = parseFloat(hasilSiswa[item.key]) || 0;
                        return (
                          <div key={item.key} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-600">
                              <span>{item.label}</span>
                              <span className="text-slate-800">{formatNilai(hasilSiswa[item.key])}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-rose-800 h-full rounded-full transition-all duration-1000" 
                                style={{ width: `${Math.min(nilaiAngka, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* VISUALISASI SEKTOR 2: NILAI TKA */}
                {/* ========================================================================= */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-slate-800 p-4 text-white">
                    <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
                      📊 TES KEMAMPUAN AKADEMIK (TKA)
                    </h3>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    {/* Grid Dua Kolom untuk Komparasi TKA */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                        <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mb-1">Numerasi</p>
                        <p className="text-2xl font-black text-slate-800">{formatNilai(hasilSiswa.numerasi)}</p>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                        <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mb-1">Literasi</p>
                        <p className="text-2xl font-black text-slate-800">{formatNilai(hasilSiswa.literasi)}</p>
                      </div>
                    </div>

                    {/* Ring Ringkasan Rata-Rata TKA */}
                    <div className="p-4 bg-slate-900 text-white rounded-xl flex justify-between items-center shadow-md">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Rata-Rata TKA</span>
                      <span className="text-2xl font-black text-amber-400">{formatNilai(hasilSiswa["rata-rata_tka"])}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => setHasilSiswa(null)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-3 rounded-lg text-xs transition-all border border-slate-200/50"
            >
              Kembali Ke Halaman Utama
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