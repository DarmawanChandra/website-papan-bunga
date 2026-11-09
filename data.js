/* =========================================================
   DATA TOKO
   Semua tulisan di website diambil dari file ini.
   Untuk mengganti isi website, ubah teks di dalam tanda kutip "...".
   Jangan hapus tanda koma, kurung kurawal { }, dan kurung siku [ ].
   {toko} di dalam teks otomatis diganti dengan nama toko.

   PERHATIAN: semua isi di bawah ini masih DATA CONTOH,
   kecuali lokasi toko di Bagan Batu.
   ========================================================= */
const DATA_TOKO = {
  // Nama toko. Kata pertama tampil di kotak hitam pada logo.
  nama: "Taman Ucapan",

  // Tentang kami (tampil di samping judul besar)
  tentang: [
    "{toko} membuat papan bunga untuk pernikahan, duka cita, ucapan selamat, dan pembukaan usaha di Bagan Batu dan sekitarnya.",
    "Kami mulai tahun 2018 dari sebuah toko kecil. Setiap papan dirangkai dari bunga segar, ditulis rapi, dan diantar langsung ke lokasi acara."
  ],

  // Pesan yang langsung terisi saat pembeli menekan tombol WhatsApp
  pesanWA: "Halo {toko}, saya mau pesan papan bunga.",

  // Lokasi toko (hanya satu tempat, tidak ada cabang).
  // wa: nomor WhatsApp toko, boleh ditulis 08xx. Selama masih "0812-xxxx-xxxx",
  //     tombol WhatsApp meminta pembeli memilih kontak sendiri.
  // linkMaps: link Google Maps toko. Kalau kosong, website mencari alamatnya.
  // foto: foto toko, contoh "foto/toko.jpg". Kalau kosong, tampil gambar papan.
  lokasi: {
    nama: "Bagan Batu",
    wilayah: "Rokan Hilir, Riau",
    alamat: ["Jl. Contoh Raya No. 12", "Bagan Batu, Rokan Hilir, Riau"],
    wa: "0812-xxxx-xxxx",
    linkMaps: "",
    jam: [
      { hari: "Senin – Sabtu", jam: "07.00 – 21.00" },
      { hari: "Minggu", jam: "08.00 – 18.00" },
      { hari: "Duka cita", jam: "24 jam" }
    ],
    foto: "",
    // Tulisan di gambar papan, dipakai selama foto toko belum ada
    papan: { warna: "hijau", baris: ["SELAMAT DATANG", "di {toko}", "Bagan Batu, Rokan Hilir"] }
  },

  // Daftar harga, ditulis tanpa titik (450000 = Rp450.000).
  // ukuran: tulisan kecil di bawah nama. Boleh dikosongkan "".
  // mulaiDari: true artinya "harga mulai dari" dan diberi tanda *.
  harga: [
    {
      kategori: "Ucapan Selamat & Grand Opening",
      item: [
        { nama: "Standar", ukuran: "2 x 1,25 m", harga: 450000 },
        { nama: "Besar", ukuran: "2,5 x 1,5 m", harga: 650000 },
        { nama: "Papan Double", ukuran: "2 papan", harga: 1100000, mulaiDari: true }
      ]
    },
    {
      kategori: "Pernikahan",
      item: [
        { nama: "Standar", ukuran: "2 x 1,25 m", harga: 450000 },
        { nama: "Besar", ukuran: "2,5 x 1,5 m", harga: 650000 },
        { nama: "Full Bunga Segar", ukuran: "", harga: 950000, mulaiDari: true }
      ]
    },
    {
      kategori: "Duka Cita",
      item: [
        { nama: "Standar", ukuran: "2 x 1,25 m", harga: 400000 },
        { nama: "Besar", ukuran: "2,5 x 1,5 m", harga: 600000 }
      ]
    },
    {
      kategori: "Tambahan",
      item: [
        { nama: "Logo perusahaan", ukuran: "", harga: 50000 },
        { nama: "Antar luar kota", ukuran: "", harga: 100000, mulaiDari: true }
      ]
    }
  ],

  catatanHarga: "Harga bisa berubah sewaktu-waktu. Untuk harga terbaru, tanya lewat WhatsApp. (* harga mulai dari) (diperbarui 2026)",

  // Koleksi papan. Tampil di foto pembuka yang berganti-ganti dan di pita koleksi.
  // warna: hijau, pink, putih, oranye, ungu, atau biru.
  // Kalau sudah ada foto asli, simpan fotonya di folder "foto",
  // lalu tulis namanya, contoh: foto: "foto/pernikahan-1.jpg"
  galeri: [
    { judul: "Pernikahan", warna: "pink", baris: ["HAPPY WEDDING", "Rina & Dimas", "dari Keluarga Besar Wijaya"], foto: "" },
    { judul: "Duka Cita", warna: "putih", baris: ["TURUT BERDUKA CITA", "Atas wafatnya Bapak Hadi Santoso", "dari Rekan Kerja PT Maju Bersama"], foto: "" },
    { judul: "Selamat & Sukses", warna: "oranye", baris: ["SELAMAT & SUKSES", "Atas pelantikan Ibu Maya Lestari", "dari Rekan-rekan Kantor"], foto: "" },
    { judul: "Grand Opening", warna: "hijau", baris: ["HAPPY GRAND OPENING", "Kopi Senja", "dari Sahabat & Rekan Usaha"], foto: "" },
    { judul: "Ulang Tahun", warna: "ungu", baris: ["HAPPY BIRTHDAY", "Mama Lina yang ke-50", "dari Anak & Cucu"], foto: "" },
    { judul: "Wisuda", warna: "biru", baris: ["HAPPY GRADUATION", "Sari Dewi, S.Kom.", "dari Teman-teman Kampus"], foto: "" }
  ],

  // Lowongan kerja.
  // linkForm: link Google Form lamaran. Kalau kosong, tombol membuka WhatsApp toko.
  lowongan: {
    teks: [
      "Kami mencari perangkai bunga, penulis huruf papan, dan kurir pengantar yang rajin, teliti, dan ramah.",
      "Kami menawarkan bagi hasil yang menarik dan kesempatan belajar merangkai bunga dari dasar.",
      "Merasa cocok? Kirim lamaranmu lewat tombol di bawah."
    ],
    linkForm: "",
    pesanWA: "Halo {toko}, saya mau melamar kerja."
  },

  // Media sosial. Tulis nama akunnya saja, tanpa @. Kosongkan "" kalau tidak ada.
  sosmed: {
    instagram: "tamanucapan.contoh",
    tiktok: "tamanucapan.contoh"
  }
};
