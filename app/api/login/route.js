import { supabase } from '../../../lib/supabase';

export async function POST(request) {
  try {
    const { nis, tanggal_lahir } = await request.json();

    const cleanNis = String(nis).trim();
    let cleanTanggalLahir = String(tanggal_lahir).trim();

        // 1. PENCARIAN UTAMA
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

    return Response.json({
      status: 'SUDAH_BUKA',
      nama_siswa: siswa.nama_siswa,
      status_kelulusan: siswa.status_kelulusan,
      message: 'Selamat melihat hasil!'
    });

  } catch (err) {
    return Response.json({ message: `Terjadi kesalahan server: ${err.message}` }, { status: 500 });
  }
}