<div align="center">

# 🔗 Delcom Link Tree

**Kumpulkan semua tautan pentingmu dalam satu tempat.**

Aplikasi web pengelola *link tree* berbasis Svelte 5, terhubung ke Delcom Open API.

![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-runtime-000000?logo=bun&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-5-6E9F18?logo=vitest&logoColor=white)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)

</div>

---

## ✨ Fitur

| Area | Kemampuan |
| --- | --- |
| 🔐 **Autentikasi** | Daftar, masuk, dan keluar dengan token Bearer yang disimpan di `localStorage`. |
| 🌳 **Link Tree** | Tambah, ubah, hapus satu, dan hapus semua. Tipe `public`, `unlisted`, atau `private`. |
| 🖼️ **Sampul** | Unggah dan ganti gambar sampul tiap link tree. |
| 🔗 **Item Tautan** | Tambah, ubah, dan hapus tautan di dalam link tree. |
| 🔎 **Pencarian & Filter** | Cari berdasarkan judul dan saring "Milik saya". |
| 📊 **Statistik** | Ringkasan total serta jumlah public, unlisted, dan private. |
| 📝 **Editor Markdown** | Deskripsi ditulis dengan Toast UI Editor. |
| 👤 **Pengguna & Profil** | Daftar pengguna, ubah data diri, foto, dan kata sandi. |
| 🧭 **Router Kustom** | Navigasi memakai History API tanpa library tambahan. |
| ✅ **Pengujian** | Coverage 100% untuk statements, branches, functions, dan lines. |

## 🧰 Teknologi

- **Svelte 5** (runes) + **Vite**, bahasa JavaScript
- **Tailwind CSS v4** dengan font **Plus Jakarta Sans**
- **lucide-svelte** untuk ikon
- **SweetAlert2** untuk dialog
- **Toast UI Editor** untuk editor Markdown
- **Vitest** + **Testing Library** untuk pengujian
- **Bun** sebagai package manager dan runner skrip

## 🚀 Memulai

### Prasyarat

- [Bun](https://bun.sh) terpasang
- Koneksi internet untuk mengakses Delcom Open API

### Instalasi

```bash
git clone https://github.com/DanovanGian/ifs24004-pabwe2026-sk-p6-svelte.git
cd ifs24004-pabwe2026-sk-p6-svelte
bun install
```

### Konfigurasi lingkungan

Salin contoh berkas lingkungan lalu sesuaikan:

```bash
cp .env.example .env
```

```env
VITE_DELCOM_BASEURL=https://open-api.delcom.org/api/v1
APP_PORT=3004
```

### Menjalankan

```bash
# pengembangan
bun run dev        # http://localhost:3004

# produksi
bun run build
bun run preview    # http://localhost:3004
```

## 🧪 Pengujian

> Gunakan `bun run test`, **bukan** `bun test`.

```bash
bun run test            # jalankan semua tes sekali
bun run test:watch      # mode watch
bun run test:coverage   # laporan coverage (threshold 100%)
```

Laporan HTML tersedia di `coverage/index.html` setelah menjalankan `test:coverage`.

## 🗂️ Struktur Proyek

```
src/
├── App.svelte               # memilih layout & halaman dari rute
├── router.js                # router kustom (navigate, currentPath, resolveRoute)
├── features/
│   ├── auth/                # login, register, logout
│   │   ├── api/  layouts/  pages/  states/
│   ├── common/pages/        # NotFoundPage (404)
│   ├── linktrees/           # fitur utama
│   │   ├── api/             # linkTreeApi.js
│   │   ├── components/      # Navbar, Sidebar, MarkdownEditor
│   │   ├── layouts/         # LinkTreeLayout
│   │   ├── modals/          # Add, Change, ChangeCover, Item
│   │   ├── pages/           # HomePage, DetailPage
│   │   └── states/          # linkTreesStore.js
│   └── users/               # daftar pengguna & profil
├── helpers/                 # apiHelper, toolsHelper
└── hooks/                   # useInput
```

## 🛣️ Rute

| Path | Halaman | Layout |
| --- | --- | --- |
| `/auth/login` | Masuk | Autentikasi |
| `/auth/register` | Daftar | Autentikasi |
| `/` | Semua Link Tree | Aplikasi |
| `/link-trees/:linkTreeId` | Detail Link Tree | Aplikasi |
| `/users` | Daftar Pengguna | Aplikasi |
| `/profile` | Profil | Aplikasi |
| *lainnya* | 404 | Tanpa layout |

Halaman aplikasi tanpa token dialihkan ke login, dan halaman autentikasi saat sudah masuk dialihkan ke beranda.

## 🔌 Endpoint API

Basis URL: `https://open-api.delcom.org/api/v1`. Respons dianggap berhasil bila `status === "success"`. Header otorisasi: `Authorization: Bearer <token>`.

| Metode | Endpoint | Fungsi |
| --- | --- | --- |
| `POST` | `/auth/login`, `/auth/register` | Autentikasi |
| `GET` `PUT` | `/users/me` | Profil saya |
| `GET` | `/users` | Daftar pengguna |
| `GET` `POST` `DELETE` | `/link-trees` | Daftar, tambah, hapus semua |
| `GET` `PUT` `DELETE` | `/link-trees/:id` | Detail, ubah, hapus |
| `POST` | `/link-trees/:id/cover` | Unggah sampul |
| `POST` | `/link-trees/:id/items` | Tambah item |
| `PUT` `DELETE` | `/link-trees/:id/items/:itemId` | Ubah dan hapus item |

Dokumentasi lengkap: [open-api.delcom.org/docs/1.0/api-link-trees](https://open-api.delcom.org/docs/1.0/api-link-trees)

## 🧠 Catatan Desain

- **Satu pintu ke API.** Semua permintaan lewat `apiRequest` di `apiHelper.js`, yang mengurus URL dasar, header Bearer, dan pembedaan JSON dengan `FormData`.
- **Store Svelte, bukan Pinia.** State memakai `writable` dan `derived`, dipasang lewat impor langsung.
- **Mutasi seragam.** Semua aksi tulis di `linkTreesStore.js` lewat satu fungsi `mutate`: nyalakan bendera, kirim permintaan, muat ulang data bila sukses, matikan bendera.
- **Mudah diuji.** Logika rute berupa fungsi murni sehingga coverage 100% terjaga.

## 📄 Lisensi

Dibuat untuk keperluan praktikum PABWE 2026, Institut Teknologi Del.

<div align="center">

Dibuat dengan ☕ oleh **Gian Danovan** (11S24004)

</div>