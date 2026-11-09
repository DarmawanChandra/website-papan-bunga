/* =========================================================
   DATA TOKO
   Semua tulisan di website diambil dari file ini.
   Untuk mengganti isi website, ubah teks di dalam tanda kutip "...".
   Jangan hapus tanda koma, kurung kurawal { }, dan kurung siku [ ].
   {toko} di dalam teks otomatis diganti dengan nama toko.

   PERHATIAN: semua isi di bawah ini masih DATA CONTOH.
   ========================================================= */
const DATA_TOKO = {
  // Nama toko dan wilayah layanan
  nama: "Taman Ucapan",
  area: "Jakarta & Tangerang",

  // Bagian paling atas
  pembuka: {
    judul: "Papan bunga untuk setiap momen penting.",
    sub: "Pernikahan, duka cita, ucapan selamat, dan grand opening. Dirangkai dari bunga segar dan diantar tepat waktu ke lokasi acara.",
    // Tulisan di gambar papan besar. Warna: hijau, pink, putih, oranye, ungu, biru.
    papan: {
      warna: "hijau",
      baris: ["SELAMAT & SUKSES", "Atas Pembukaan Toko Baru", "dari {toko}"]
    }
  },

  // Tentang kami. Paragraf pertama tampil lebih besar.
  tentang: [
    "{toko} membuat papan bunga untuk pernikahan, duka cita, ucapan selamat, dan pembukaan usaha.",
    "Kami mulai tahun 2018 dari satu toko kecil di Kebon Jeruk. Sekarang ada 3 cabang di Jakarta dan Tangerang.",
    "Setiap papan dirangkai dari bunga segar, ditulis rapi, dan diantar langsung ke lokasi acara."
  ],

  // Pesan yang langsung terisi saat pembeli menekan tombol WhatsApp.
  // {cabang} diganti nama cabang.
  pesanWA: "Halo {toko} cabang {cabang}, saya mau pesan papan bunga.",

  // Daftar harga, ditulis tanpa titik (450000 = Rp450.000).
  // mulaiDari: true artinya "harga mulai dari" dan diberi tanda *.
  // Harga ini dipakai semua cabang. Kalau ada cabang yang harganya beda,
  // tambahkan bagian "harga" sendiri di data cabang itu.
  harga: [
    {
      kategori: "Ucapan Selamat & Grand Opening",
      item: [
        { nama: "Standar (2 x 1,25 m)", harga: 450000 },
        { nama: "Besar (2,5 x 1,5 m)", harga: 650000 },
        { nama: "Papan Double", harga: 1100000, mulaiDari: true }
      ]
    },
    {
      kategori: "Pernikahan",
      item: [
        { nama: "Standar (2 x 1,25 m)", harga: 450000 },
        { nama: "Besar (2,5 x 1,5 m)", harga: 650000 },
        { nama: "Full Bunga Segar", harga: 950000, mulaiDari: true }
      ]
    },
    {
      kategori: "Duka Cita",
      item: [
        { nama: "Standar (2 x 1,25 m)", harga: 400000 },
        { nama: "Besar (2,5 x 1,5 m)", harga: 600000 }
      ]
    },
    {
      kategori: "Tambahan",
      item: [
        { nama: "Logo perusahaan", harga: 50000 },
        { nama: "Antar luar kota", harga: 100000, mulaiDari: true }
      ]
    }
  ],

  catatanHarga: "Harga bisa berubah sewaktu-waktu. Untuk harga terbaru, tanya lewat WhatsApp. (* harga mulai dari) (diperbarui 2026)",

  // Daftar cabang.
  // wa: nomor WhatsApp cabang, boleh ditulis 08xx. Selama masih "0812-xxxx-xxxx",
  //     tombol WhatsApp meminta pembeli memilih kontak sendiri.
  // linkMaps: link Google Maps toko. Kalau kosong, website mencari alamatnya.
  cabang: [
    {
      nama: "Kebon Jeruk",
      wilayah: "Jakarta Barat",
      alamat: ["Jl. Contoh Raya No. 12", "Kebon Jeruk, Jakarta Barat"],
      wa: "0812-xxxx-xxxx",
      linkMaps: "",
      jam: [
        { hari: "Senin – Sabtu", jam: "07.00 – 21.00" },
        { hari: "Minggu", jam: "08.00 – 18.00" },
        { hari: "Duka cita", jam: "24 jam" }
      ]
    },
    {
      nama: "Tebet",
      wilayah: "Jakarta Selatan",
      alamat: ["Jl. Contoh Melati No. 8", "Tebet, Jakarta Selatan"],
      wa: "0812-xxxx-xxxx",
      linkMaps: "",
      jam: [
        { hari: "Senin – Sabtu", jam: "07.00 – 21.00" },
        { hari: "Minggu", jam: "08.00 – 18.00" },
        { hari: "Duka cita", jam: "24 jam" }
      ]
    },
    {
      nama: "BSD City",
      wilayah: "Tangerang Selatan",
      alamat: ["Ruko Contoh Blok A No. 3", "BSD City, Tangerang Selatan"],
      wa: "0812-xxxx-xxxx",
      linkMaps: "",
      jam: [
        { hari: "Senin – Sabtu", jam: "08.00 – 20.00" },
        { hari: "Minggu", jam: "09.00 – 17.00" }
      ]
    }
  ],

  // Galeri. Selama foto belum ada, website menggambar papan contoh.
  // Kalau sudah ada foto asli, simpan fotonya di folder "foto",
  // lalu tulis namanya, contoh: foto: "foto/pernikahan-1.jpg"
  galeri: [
    { judul: "Pernikahan", warna: "pink", baris: ["HAPPY WEDDING", "Rina & Dimas", "dari Keluarga Besar Wijaya"], foto: "" },
    { judul: "Duka Cita", warna: "putih", baris: ["TURUT BERDUKA CITA", "Atas wafatnya Bapak Hadi Santoso", "dari Rekan Kerja PT Maju Bersama"], foto: "" },
    { judul: "Selamat & Sukses", warna: "oranye", baris: ["SELAMAT & SUKSES", "Atas pelantikan Ibu Maya Lestari", "dari Keluarga Besar Kantor Cabang"], foto: "" },
    { judul: "Grand Opening", warna: "hijau", baris: ["HAPPY GRAND OPENING", "Kopi Senja", "dari Sahabat & Rekan Usaha"], foto: "" },
    { judul: "Ulang Tahun", warna: "ungu", baris: ["HAPPY BIRTHDAY", "Mama Lina yang ke-50", "dari Anak & Cucu"], foto: "" },
    { judul: "Wisuda", warna: "biru", baris: ["HAPPY GRADUATION", "Sari Dewi, S.Kom.", "dari Teman-teman Kampus"], foto: "" }
  ],

  // Lowongan kerja.
  // linkForm: link Google Form lamaran. Kalau kosong, tombol membuka WhatsApp cabang pertama.
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
