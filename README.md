# 🎥 Aforsy - YouTube AI Sidekick

**Asisten AI Cerdas untuk Analisis Video YouTube**

Aforsy adalah ekstensi Chrome yang menggunakan kecerdasan buatan untuk menganalisis konten video YouTube melalui transkrip, membantu Anda memahami inti dari setiap video dengan lebih mudah dan cepat.

---

## ✨ Fitur Utama

| Fitur                 | Deskripsi                                                                      |
| --------------------- | ------------------------------------------------------------------------------ |
| 🤖 **Analisis AI**    | Ekstraksi poin penting dari transkrip secara otomatis                          |
| ⚡ **Smart Caching**  | Menyimpan data hingga 5 video terakhir untuk performa optimal                  |
| 🌍 **Multi-bahasa**   | Dukungan Bahasa Indonesia, Inggris, Spanyol, Prancis, Jerman, Jepang, Mandarin |
| 💬 **Chat Persisten** | Riwayat diskusi tersimpan terpisah untuk setiap video                          |
| ⏱️ **Timestamp Jump** | Klik timestamp untuk langsung ke bagian video yang relevan                     |

---

## 📦 Panduan Instalasi

### Langkah 1: Unduh Ekstensi

Unduh berkas `aforsy-youtube-sidekick-v.0.0.1.zip` dari [Release terbaru](https://github.com/asyrofuddien/extention-wxt/releases/tag/v.0.0.1)

### Langkah 2: Ekstrak Berkas

Ekstrak berkas ZIP ke folder pilihan Anda. Hasil ekstrak akan terlihat seperti:

```
aforsy-youtube-sidekick-v.0.0.1/
├── manifest.json
├── popup.html
├── sidepanel.html
├── background.js
├── chunks/
├── assets/
└── ...
```

### Langkah 3: Buka Chrome Extensions

1. Buka Google Chrome
2. Ketik `chrome://extensions/` di address bar dan tekan Enter

### Langkah 4: Aktifkan Developer Mode

Cari toggle **Developer mode** di pojok kanan atas dan aktifkan

### Langkah 5: Load Unpacked

1. Klik tombol **Load unpacked**
2. Pilih folder `aforsy-youtube-sidekick-v.0.0.1/` yang sudah Anda ekstrak
3. Klik **Select Folder**

### ✅ Selesai!

Anda akan melihat ekstensi Aforsy muncul di daftar ekstensi dengan status "Enabled"

---

## 🎮 Cara Menggunakan

1. **Buka Video YouTube**

   - Navigasi ke video YouTube apa pun

2. **Buka Aforsy**

   - Klik ikon Aforsy di toolbar Chrome (pojok kanan atas)
   - Sidepanel akan terbuka di sebelah kanan

3. **Pilih Bahasa (opsional)**

   - Ubah bahasa transkrip dengan klik flag di header

4. **Mulai Bertanya**

   - Ketik pertanyaan atau pilih prompt yang disarankan
   - Aforsy akan menganalisis transkrip dan memberikan jawaban

5. **Navigasi dengan Timestamp**
   - Klik timestamp `[06:38]` di chat untuk loncat ke bagian video tersebut

---

## 🔧 Troubleshooting

### Ekstensi tidak muncul di Chrome

- Pastikan Anda sudah mengekstrak folder dengan benar
- Cek bahwa file `manifest.json` ada di folder utama
- Refresh halaman extensions (`chrome://extensions/`)

### Transkrip tidak bisa diambil

- Pastikan video YouTube memiliki subtitle/transkrip
- Beberapa video mungkin tidak tersedia transkripsnya
- Coba pilih bahasa lain

### Chat tidak merespons

- Pastikan koneksi internet stabil
- Tunggu beberapa saat, server backend mungkin sedang diproses
- Refresh sidepanel

---

## 📝 Catatan

- Data chat disimpan lokal di browser Anda
- Transkrip diambil dari YouTube melalui backend server
- Ekstensi hanya bekerja di situs `youtube.com`

---

## 👨‍💻 Dikembangkan oleh

**Muhammad Asyrofuddien**

---

## 📄 Lisensi

Proyek ini adalah proyek open source. Gunakan sesuai kebutuhan Anda.

---

## 🐛 Laporkan Bug

Temukan bug atau ingin memberikan saran? Buka [Issue di GitHub](https://github.com/asyrofuddien/extention-wxt/issues)

---

**Versi 0.0.1** | © 2026 Aforsy
