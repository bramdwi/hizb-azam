/**
 * =====================================================================
 *  KONFIGURASI ISI BUKU — edit hanya file ini untuk menempelkan link PDF
 * =====================================================================
 *
 * Cara mendapatkan FILE ID dari Google Drive:
 *  1. Klik kanan file PDF di Drive → "Dapatkan link" / "Get link"
 *  2. Pastikan aksesnya "Siapa saja yang memiliki link" (Anyone with the link)
 *  3. Link akan terlihat seperti ini:
 *       https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/view?usp=sharing
 *  4. Bagian tebal itulah FILE ID-nya:
 *       1AbCdEfGhIjKlMnOpQrStUvWxYz
 *  5. Tempelkan FILE ID itu ke properti `fileId` di bawah, gantikan teks
 *     "GANTI_DENGAN_FILE_ID".
 *
 *  Catatan: kamu boleh menempel link Drive LENGKAP juga (bukan cuma ID-nya
 *  saja) — aplikasi otomatis mengambil ID dari dalam link tersebut.
 *
 * Urutan array di bawah = urutan tab & urutan swipe di aplikasi.
 * Jangan ubah urutannya kecuali memang ingin mengubah urutan tab.
 */

const BOOK_CONFIG = {
  appTitle: "Wirid Harian",
  sections: [
    {
      group: "Bacaan Harian",
      items: [
        { id: "jumat",  label: "Jumat",  fileId: "1Lp2BAYFz2qot5kUAxI7pKi2eF7P63zIA" },
        { id: "sabtu",  label: "Sabtu",  fileId: "1r18CDnK4r2vEHaQXUclnWv2UDTjgCxFp" },
        { id: "minggu", label: "Minggu", fileId: "1HywuJkdCpLyMSvXlT_mDvw-ncRWtI4-O" },
        { id: "senin",  label: "Senin",  fileId: "11_COjQvYyoOZoMrTxqPlxKNar5kngWRD" },
        { id: "selasa", label: "Selasa", fileId: "1MCjzOfV3iZl5Xlo7EY2YJQ2uimcJKxr7" },
        { id: "rabu",   label: "Rabu",   fileId: "1Iv2nAjSCXLevnK8e5PTImzLrqAntfMJx" },
        { id: "kamis",  label: "Kamis",  fileId: "1dTCHgoBm8BPb5uWGLzHw2IuKeSxZf-60" },
      ],
    },
    {
      group: "Wirid & Sholawat",
      items: [
        { id: "manzil",          label: "Manzil",           fileId: "1JLoSUiLLN-wp5k9BC-mttP_4k-1MXhiR" },
        { id: "tunjina",         label: "Sholawat Tunjina",  fileId: "1hnLz0BQ1cOqTYTQrYNKx9oP6_3wh_IHs" },
        { id: "sholawat-40",     label: "Sholawat 40",       fileId: "1JPgVNqAxOPKXiLYT4dSA4fikA1NbLoTc" },
      ],
    },
  ],
};
