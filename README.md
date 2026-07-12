# Wirid Harian — PWA Buku Digital

Template PWA (installable, mobile-first) dengan 10 tab, urutan:
Jumat, Sabtu, Minggu, Senin, Selasa, Rabu, Kamis, Manzil, Sholawat Tunjina, Sholawat 40.

## 1. Tempel link PDF (satu-satunya file yang perlu diedit)

Buka **`config.js`**. Untuk setiap item, ganti `"GANTI_DENGAN_FILE_ID"` dengan
File ID dari Google Drive.

Cara ambil File ID:
1. Klik kanan PDF di Drive → **Dapatkan link** → set ke **"Siapa saja yang memiliki link"**.
2. Link akan terlihat seperti:
   `https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/view?usp=sharing`
3. Bagian `1AbCdEfGhIjKlMnOpQrStUvWxYz` itulah File ID-nya. Tempel ke `fileId`.

Selama `fileId` masih `"GANTI_DENGAN_FILE_ID"`, tab itu akan menampilkan
kartu kosong dengan petunjuk — jadi aman untuk dipublikasikan bertahap.

## 2. Deploy ke GitHub Pages

Semua path di dalam project ini sudah relatif, jadi aman dipakai baik di
`namamu.github.io` maupun di `namamu.github.io/nama-repo/`.

1. Push seluruh isi folder ini (termasuk folder `icons/` dan file
   `.nojekyll`) ke sebuah repo GitHub.
2. Buka repo → **Settings → Pages**.
3. Di **Source**, pilih branch (biasanya `main`) dan folder `/ (root)` —
   atau `/docs` kalau kamu taruh filenya di folder `docs/`. Klik **Save**.
4. Tunggu ~1 menit, GitHub akan memberi URL seperti
   `https://namamu.github.io/nama-repo/`. Buka URL itu.
5. Di HP, buka URL tersebut di browser → ketuk menu (☰) di app →
   **"Pasang sebagai Aplikasi"** untuk instal ke layar utama.

**Catatan:**
- Kalau nanti mengedit `config.js` untuk isi link PDF, cukup commit &
  push lagi — GitHub Pages otomatis update dalam ~1 menit.
- File `.nojekyll` sengaja disertakan supaya GitHub tidak memproses
  project ini lewat Jekyll (memastikan semua file, termasuk
  `service-worker.js`, ter-serve apa adanya).
- Custom domain juga bisa dipakai lewat pengaturan **Pages** yang sama,
  kalau suatu saat diperlukan.

### Alternatif / uji coba lokal
- **Netlify / Vercel** — drag & drop folder ini, deploy instan.
- **Coba lokal dulu**: dari dalam folder ini jalankan
  `python3 -m http.server 8000`, lalu buka `http://localhost:8000`
  (tombol instal PWA tidak selalu aktif di `localhost`, tapi cukup
  untuk mengecek tampilan & isi PDF).

## 3. Struktur file

```
index.html          shell aplikasi (header, drawer, area baca, nav bawah)
style.css            tema warna & tipografi
app.js                logika navigasi, swipe, drawer, daftar isi
config.js             ⭐ EDIT DI SINI — daftar 10 tab + link Drive
manifest.json         metadata untuk "Add to Home Screen"
service-worker.js     cache shell aplikasi agar bisa dibuka offline
icons/                ikon aplikasi
.nojekyll              penanda agar GitHub Pages tidak memproses lewat Jekyll
```

## 4. Catatan tentang mode offline

Shell aplikasi (tampilan, menu, navigasi) di-cache dan tetap bisa dibuka
tanpa internet. Namun **isi PDF tetap dimuat dari Google Drive**, jadi untuk
membaca PDF tetap perlu koneksi saat itu — kecuali Drive juga meng-cache
sendiri di sisi browser pengguna. Jika benar-benar butuh baca 100% offline,
solusinya adalah menaruh file PDF di server yang sama dengan aplikasi ini
(bukan Drive), lalu itu bisa di-cache penuh oleh service worker.

## 5. Desain

- **Palet:** parchment `#F5EFE1`, ink `#2B2320`, maroon `#3A1A1A`, gold `#C4944A` — nuansa naskah kitab lama.
- **Tipografi:** *Amiri* (judul/label) + *Lora* (teks UI), pasangan serif yang cocok untuk buku bacaan Islami.
- **Elemen ciri khas:** motif rub el-hizb (bintang delapan) sebagai ornamen menu & ikon, dan ribbon emas penanda tab aktif — meniru pita penanda pada kitab fisik.
