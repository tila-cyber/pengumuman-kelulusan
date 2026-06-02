import { supabase } from '../../../lib/supabase';

export async function POST(request) {
  try {
    const { nis, tanggal_lahir } = await request.json();

    const cleanNis = String(nis).trim();
    let cleanTanggalLahir = String(tanggal_lahir).trim();

    // 1. VALIDASI WAKTU RILIS (Kunci Server)
    const sekarang = new Date().getTime();
    // Samakan persis dengan target waktu di page.tsx (2 Juni 2026, 18:00 WIB)
    const targetWaktu = new Date('2026-06-02T18:00:00+07:00').getTime();

    // 2. PENCARIAN UTAMA DI SUPABASE
    let { data: daftarSiswa } = await supabase
      .from('siswa')
      .select('*')
      .eq('nis', cleanNis)
      .eq('tanggal_lahir', cleanTanggalLahir)
      .limit(1);

    let siswa = daftarSiswa && daftarSiswa.length > 0 ? daftarSiswa[0] : null;

    if (!siswa) {
      return Response.json(
        { message: 'NIS atau Tanggal Lahir salah, atau data tidak ditemukan di database.' }, 
        { status: 401 }
      );
    }

    // 3. JIKA BELUM WAKTUNYA, KUNCI DATA NILAI & STATUS KELULUSAN
    if (sekarang < targetWaktu) {
      return Response.json({
        status: 'BELUM_WAKTUNYA',
        nama_siswa: siswa.nama_siswa, // Nama tetap muncul agar siswa tahu akunnya benar
        message: 'Mohon bersabar, hasil kelulusan belum resmi dirilis.'
      });
    }

    // 4. JIKA SUDAH MELEWATI JAM RILIS, BUKA SEMUA DATA
    return Response.json({
      status: 'SUDAH_BUKA',
      message: 'Selamat melihat hasil!',
      ...siswa 
    });

  } catch (err) {
    return Response.json({ message: `Terjadi kesalahan server: ${err.message}` }, { status: 500 });
  }
}