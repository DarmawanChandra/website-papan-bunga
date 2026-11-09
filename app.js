/* =========================================================
   app.js
   Mengisi halaman dengan data dari data.js, lalu menyalakan
   gerakan halus: kursor bulat, foto pembuka, dan pita koleksi.
   Biasanya file ini tidak perlu diubah: cukup ubah data.js.
   ========================================================= */
(function () {
  "use strict";

  const D = DATA_TOKO;
  const L = D.lokasi || {};

  /* ---------- Alat bantu ---------- */

  // Mengamankan teks supaya tidak terbaca sebagai kode HTML
  function esc(teks) {
    return String(teks == null ? "" : teks)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // 450000 menjadi "Rp450.000"
  function rupiah(angka) {
    return "Rp" + new Intl.NumberFormat("id-ID").format(angka);
  }

  // 3 menjadi "03"
  function duaDigit(n) {
    return String(n).padStart(2, "0");
  }

  // Mengganti {toko} dan sejenisnya di dalam teks
  function isiTemplate(teks, nilai) {
    return String(teks == null ? "" : teks).replace(/\{(\w+)\}/g, function (asli, kunci) {
      return Object.prototype.hasOwnProperty.call(nilai, kunci) ? nilai[kunci] : asli;
    });
  }

  function pakaiNama(teks) {
    return isiTemplate(teks, { toko: D.nama });
  }

  // Link WhatsApp dengan pesan yang sudah terisi.
  // Nomor 08xx otomatis menjadi 628xx.
  // Kalau nomor belum lengkap (masih contoh), WhatsApp meminta pembeli memilih kontak.
  function linkWA(nomor, pesan) {
    let angka = String(nomor || "").replace(/\D/g, "");
    const isiPesan = encodeURIComponent(pesan);
    if (angka.length < 9) return "https://wa.me/?text=" + isiPesan;
    if (angka.charAt(0) === "0") angka = "62" + angka.slice(1);
    else if (angka.charAt(0) === "8") angka = "62" + angka;
    return "https://wa.me/" + angka + "?text=" + isiPesan;
  }

  // Link Google Maps. Kalau linkMaps kosong, Google Maps mencari alamatnya.
  function linkMaps(lokasi) {
    if (lokasi.linkMaps) return lokasi.linkMaps;
    return "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent((lokasi.alamat || []).join(", "));
  }

  // Mengisi elemen berdasarkan id-nya
  function tulis(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  // Menjalankan fungsi untuk setiap elemen yang cocok
  function pakaiSemua(pilihan, fungsi) {
    Array.prototype.forEach.call(document.querySelectorAll(pilihan), fungsi);
  }

  /* ---------- Gambar papan bunga (dipakai selama belum ada foto asli) ---------- */

  const TEMA = {
    hijau:  { bunga: ["#f6c445", "#ffffff", "#f2994a"], papan: "#fffdf5", teks: ["#2f7d5b", "#245f46", "#66756d"] },
    pink:   { bunga: ["#f6a6c1", "#ffffff", "#e57399"], papan: "#ffffff", teks: ["#c0457a", "#7d2d52", "#6e5a64"] },
    putih:  { bunga: ["#ffffff", "#f4ecb0", "#e6e1d1"], papan: "#ffffff", teks: ["#1f1f1f", "#333333", "#5a5a5a"] },
    oranye: { bunga: ["#f59e42", "#ffd166", "#ffffff"], papan: "#fffaf0", teks: ["#c0561c", "#7a3510", "#6b5b4d"] },
    ungu:   { bunga: ["#b89be6", "#f5c4dc", "#ffffff"], papan: "#ffffff", teks: ["#6c46b2", "#43307a", "#625a70"] },
    biru:   { bunga: ["#8ec3ef", "#ffffff", "#5b9bd6"], papan: "#ffffff", teks: ["#245f9e", "#173f6b", "#55606b"] }
  };
  const DAUN = "#4e8a5c";
  const DAUN_TUA = "#3b6e48";
  const KAYU = "#b48a5a";

  // Angka acak yang selalu sama untuk tulisan yang sama, supaya gambar tidak berubah-ubah
  function pembuatAcak(benih) {
    let s = 0;
    for (let i = 0; i < benih.length; i++) s = (s * 31 + benih.charCodeAt(i)) % 2147483647;
    if (s <= 0) s = 12345;
    return function () {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
  }

  function bulat(n) {
    return Math.round(n * 10) / 10;
  }

  // Satu kuntum bunga bulat (seperti krisan)
  function kuntum(x, y, r, warna) {
    x = bulat(x);
    y = bulat(y);
    return `<circle cx="${x}" cy="${y}" r="${bulat(r)}" fill="${warna}"/>` +
      `<circle cx="${x}" cy="${y}" r="${bulat(r * 0.62)}" fill="none" stroke="rgba(0,0,0,.1)" stroke-width="${bulat(r * 0.2)}"/>` +
      `<circle cx="${x}" cy="${y}" r="${bulat(r * 0.22)}" fill="rgba(0,0,0,.16)"/>`;
  }

  // Ukuran huruf mengecil kalau tulisannya panjang
  function ukuranHuruf(teks, maks, lebarHuruf) {
    return bulat(Math.min(maks, 220 / (Math.max(teks.length, 1) * lebarHuruf)));
  }

  const GAYA_BARIS = [
    { maks: 22, lebar: 0.7, font: "Arial, Helvetica, sans-serif", tebal: 700, miring: "normal" },
    { maks: 17, lebar: 0.5, font: "Georgia, 'Times New Roman', serif", tebal: 400, miring: "italic" },
    { maks: 11, lebar: 0.55, font: "Arial, Helvetica, sans-serif", tebal: 400, miring: "normal" }
  ];

  function gambarPapan(baris, warna, label) {
    const t = TEMA[warna] || TEMA.hijau;
    baris = (baris || []).slice(0, 3).map(pakaiNama);
    const acak = pembuatAcak(baris.join("|") + warna);
    // Posisi, lebar, tinggi, dan tebal bingkai bunga papan
    const X = 14, Y = 12, LEBAR = 292, TINGGI = 180, B = 22;
    let daun = "";
    let bunga = "";

    // Titik-titik bunga di sepanjang bingkai
    const titik = [];
    const nX = Math.round((LEBAR - B) / 13);
    const nY = Math.round((TINGGI - B) / 13);
    for (let i = 0; i <= nX; i++) {
      const x = X + B / 2 + (LEBAR - B) * i / nX;
      titik.push([x, Y + B / 2], [x, Y + TINGGI - B / 2]);
    }
    for (let i = 1; i < nY; i++) {
      const y = Y + B / 2 + (TINGGI - B) * i / nY;
      titik.push([X + B / 2, y], [X + LEBAR - B / 2, y]);
    }

    titik.forEach(function (p) {
      if (acak() < 0.7) {
        const dx = bulat(p[0] + (acak() - 0.5) * 10);
        const dy = bulat(p[1] + (acak() - 0.5) * 10);
        daun += `<ellipse cx="${dx}" cy="${dy}" rx="7" ry="2.8" fill="${DAUN_TUA}" transform="rotate(${Math.round(acak() * 180)} ${dx} ${dy})"/>`;
      }
      const r = 7.2 + acak() * 2.8;
      const w = t.bunga[Math.floor(acak() * t.bunga.length)];
      bunga += kuntum(p[0] + (acak() - 0.5) * 3, p[1] + (acak() - 0.5) * 3, r, w);
    });

    // Bunga besar di empat sudut
    const s = B / 2 + 3;
    [[X + s, Y + s], [X + LEBAR - s, Y + s], [X + s, Y + TINGGI - s], [X + LEBAR - s, Y + TINGGI - s]].forEach(function (p) {
      bunga += kuntum(p[0], p[1], 14, t.bunga[0]);
    });

    // Tulisan di tengah papan
    const posisiY = baris.length === 3 ? [76, 110, 138] : baris.length === 2 ? [92, 124] : [110];
    let tulisan = "";
    baris.forEach(function (isiBaris, i) {
      const g = GAYA_BARIS[i];
      tulisan += `<text x="${X + LEBAR / 2}" y="${posisiY[i]}" text-anchor="middle" font-family="${g.font}" ` +
        `font-weight="${g.tebal}" font-style="${g.miring}" font-size="${ukuranHuruf(isiBaris, g.maks, g.lebar)}" ` +
        `fill="${t.teks[i]}">${esc(isiBaris)}</text>`;
    });

    const kakiY = Y + TINGGI - 6;
    return `<svg viewBox="0 0 320 252" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label)}">` +
      `<ellipse cx="160" cy="244" rx="118" ry="5" fill="rgba(0,0,0,.08)"/>` +
      `<rect x="58" y="${kakiY}" width="8" height="${244 - kakiY}" rx="2" fill="${KAYU}"/>` +
      `<rect x="254" y="${kakiY}" width="8" height="${244 - kakiY}" rx="2" fill="${KAYU}"/>` +
      `<rect x="${X}" y="${Y}" width="${LEBAR}" height="${TINGGI}" rx="8" fill="${DAUN}"/>` +
      `<rect x="${X + B}" y="${Y + B}" width="${LEBAR - 2 * B}" height="${TINGGI - 2 * B}" rx="3" fill="${t.papan}"/>` +
      `<rect x="${X + B + 6}" y="${Y + B + 6}" width="${LEBAR - 2 * B - 12}" height="${TINGGI - 2 * B - 12}" rx="2" fill="none" stroke="${t.teks[0]}" stroke-opacity=".25"/>` +
      daun + bunga + tulisan +
      `</svg>`;
  }

  // Foto asli kalau ada. Kalau belum ada, pakai gambar papan.
  function gambarKarya(item, label) {
    return item.foto
      ? `<img src="${esc(item.foto)}" alt="${esc(label)}" loading="lazy">`
      : gambarPapan(item.baris, item.warna, label);
  }

  /* ---------- Ikon media sosial ---------- */
  const IKON = {
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<circle cx="17.4" cy="6.6" r="1.25" fill="currentColor"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>'
  };

  function akun(nama) {
    return String(nama || "").trim().replace(/^@/, "");
  }

  function htmlSosmed() {
    const s = D.sosmed || {};
    let html = "";
    if (akun(s.instagram)) {
      html += `<a href="https://www.instagram.com/${encodeURIComponent(akun(s.instagram))}/" target="_blank" rel="noopener" aria-label="Instagram">${IKON.instagram}</a>`;
    }
    if (akun(s.tiktok)) {
      html += `<a href="https://www.tiktok.com/@${encodeURIComponent(akun(s.tiktok))}" target="_blank" rel="noopener" aria-label="TikTok">${IKON.tiktok}</a>`;
    }
    return html;
  }

  /* ---------- Mengisi halaman ---------- */

  document.title = D.nama + " | Papan Bunga " + L.nama;
  pakaiSemua('[data-isi="nama"]', function (el) { el.textContent = D.nama; });
  pakaiSemua('[data-isi="lokasi"]', function (el) { el.textContent = L.nama; });

  // Logo: kata pertama di kotak hitam, sisanya di kotak terang
  const kata = String(D.nama).trim().split(/\s+/);
  tulis("logo", `<span class="logo-atas">${esc(kata[0])}</span>` +
    (kata.length > 1 ? `<span class="logo-bawah">${esc(kata.slice(1).join(" "))}</span>` : ""));
  const logo = document.getElementById("logo");
  if (logo) logo.setAttribute("aria-label", D.nama + ", kembali ke atas");

  // Tombol Pesan Sekarang langsung membuka WhatsApp
  const linkPesan = linkWA(L.wa, pakaiNama(D.pesanWA));
  const tombolPesan = document.getElementById("tombol-pesan");
  if (tombolPesan) {
    tombolPesan.href = linkPesan;
    tombolPesan.target = "_blank";
    tombolPesan.rel = "noopener";
  }

  // Tentang kami
  tulis("tentang-teks", (D.tentang || []).map(function (p) {
    return `<p>${esc(pakaiNama(p))}</p>`;
  }).join(""));

  // Foto pembuka yang berganti-ganti
  tulis("pembuka-foto", (D.galeri || []).map(function (g, i) {
    return `<div class="bingkai${i === 0 ? " aktif" : ""}">${gambarKarya(g, "Papan bunga " + g.judul)}</div>`;
  }).join(""));

  // Daftar harga
  function htmlHarga(daftar) {
    return daftar.map(function (grup) {
      const baris = grup.item.map(function (it) {
        return `<div class="harga-baris">` +
          `<span class="harga-nama">${esc(it.nama)}${it.mulaiDari ? " *" : ""}` +
          `${it.ukuran ? `<small>${esc(it.ukuran)}</small>` : ""}</span>` +
          `<span class="nilai">${rupiah(it.harga)}</span>` +
          `</div>`;
      }).join("");
      return `<div class="harga-grup"><h4>${esc(grup.kategori)}</h4>${baris}</div>`;
    }).join("");
  }

  // Panel lokasi: nama, alamat, jam buka, tombol, gambar, dan harga
  const papanLokasi = L.papan || {};
  const fotoLokasi = L.foto
    ? `<img src="${esc(L.foto)}" alt="Toko ${esc(D.nama)} di ${esc(L.nama)}" loading="lazy">`
    : gambarPapan(papanLokasi.baris, papanLokasi.warna, "Gambar contoh papan bunga " + D.nama);
  const jamBuka = (L.jam || []).map(function (j) {
    return esc(j.hari) + " " + esc(j.jam);
  }).join("<br>");

  tulis("panel-lokasi",
    `<h3 class="panel-nama">${esc(L.nama)}</h3>` +
    `<p class="panel-wilayah">( ${esc(L.wilayah)} )</p>` +
    `<div class="panel-info">` +
      `<p>${(L.alamat || []).map(esc).join("<br>")}<br>WA ${esc(L.wa || "-")}</p>` +
      `<p>Jam Buka<br>${jamBuka}</p>` +
      `<div class="panel-aksi">` +
        `<a class="tautan-kurung" href="${esc(linkPesan)}" target="_blank" rel="noopener">( WhatsApp )</a>` +
        `<a class="tautan-kurung" href="${esc(linkMaps(L))}" target="_blank" rel="noopener">( Google Maps )</a>` +
      `</div>` +
    `</div>` +
    `<div class="panel-foto">${fotoLokasi}</div>` +
    `<div class="panel-harga">${htmlHarga(D.harga || [])}` +
      `<p class="catatan-harga">${esc(D.catatanHarga)}</p>` +
    `</div>`);

  // Pita koleksi: isinya dibuat dua kali supaya bisa berputar tanpa putus
  const kartu = (D.galeri || []).map(function (g, i) {
    return `<figure class="karya">` +
      `<div class="karya-gambar">${gambarKarya(g, "Papan bunga " + g.judul)}</div>` +
      `<figcaption><span>${duaDigit(i + 1)}</span>${esc(g.judul)}</figcaption>` +
      `</figure>`;
  }).join("");
  tulis("pita-koleksi", `<div class="pita-jalur">` +
    `<div class="pita-set">${kartu}</div>` +
    `<div class="pita-set" aria-hidden="true">${kartu}</div>` +
    `</div>`);

  // Karier
  const lowongan = D.lowongan || {};
  const linkLamar = lowongan.linkForm ||
    linkWA(L.wa, pakaiNama(lowongan.pesanWA || "Halo {toko}, saya mau melamar kerja."));
  tulis("karier-teks", (lowongan.teks || []).map(function (p) {
    return `<p>${esc(pakaiNama(p))}</p>`;
  }).join("") +
    `<a class="tombol-hitam" href="${esc(linkLamar)}" target="_blank" rel="noopener">` +
    (lowongan.linkForm ? "( Formulir Lamaran )" : "( Lamar Lewat WhatsApp )") + `</a>`);

  // Media sosial dan hak cipta
  tulis("sosmed-atas", htmlSosmed());
  tulis("sosmed-bawah", htmlSosmed());
  tulis("hak-cipta", `&copy; ${new Date().getFullYear()} ${esc(D.nama)} &bull; Semua hak dilindungi`);

  /* ---------- Gerakan halus ---------- */

  function cocok(kueri) {
    return !!(window.matchMedia && window.matchMedia(kueri).matches);
  }
  const kurangiGerak = cocok("(prefers-reduced-motion: reduce)");

  // Foto pembuka berganti setiap 1,8 detik dengan efek memudar
  const bingkai = document.querySelectorAll("#pembuka-foto .bingkai");
  if (!kurangiGerak && bingkai.length > 1) {
    let aktif = 0;
    window.setInterval(function () {
      bingkai[aktif].classList.remove("aktif");
      aktif = (aktif + 1) % bingkai.length;
      bingkai[aktif].classList.add("aktif");
    }, 1800);
  }

  // Kursor bulat hanya untuk perangkat dengan mouse (bukan HP)
  if (cocok("(hover: hover) and (pointer: fine)")) pasangKursor();

  function pasangKursor() {
    const kursor = document.createElement("div");
    kursor.className = "kursor";
    kursor.setAttribute("aria-hidden", "true");
    kursor.innerHTML = '<div class="kursor-bulat"></div>';
    document.body.appendChild(kursor);

    let tujuanX = 0, tujuanY = 0; // posisi mouse
    let x = 0, y = 0;             // posisi bulatan
    let ada = false;              // mouse sudah pernah bergerak di halaman
    let jalan = false;            // animasi sedang berjalan
    let waktuLalu = 0;
    let cekNanti = false;

    function gambar() {
      kursor.style.transform = "translate3d(" + x.toFixed(2) + "px, " + y.toFixed(2) + "px, 0)";
    }

    // Setiap gambar layar, bulatan bergerak sebagian jarak menuju mouse.
    // Rumus ini memakai waktu asli, jadi tetap halus di layar 60 Hz maupun 144 Hz.
    function langkah(waktu) {
      const dt = waktuLalu ? Math.min(waktu - waktuLalu, 64) : 16.7;
      waktuLalu = waktu;
      const k = kurangiGerak ? 1 : 1 - Math.exp(-0.014 * dt);
      x += (tujuanX - x) * k;
      y += (tujuanY - y) * k;
      if (Math.abs(tujuanX - x) < 0.05 && Math.abs(tujuanY - y) < 0.05) {
        x = tujuanX;
        y = tujuanY;
        gambar();
        jalan = false;
        waktuLalu = 0;
        return;
      }
      gambar();
      window.requestAnimationFrame(langkah);
    }

    function mulai() {
      if (jalan) return;
      jalan = true;
      window.requestAnimationFrame(langkah);
    }

    // Membesar di atas judul besar
    function aturBesar(el) {
      kursor.classList.toggle("besar", !!(el && el.closest && el.closest('[data-kursor="besar"]')));
    }

    function tampil() { kursor.classList.add("tampil"); }
    function sembunyi() { kursor.classList.remove("tampil"); }

    window.addEventListener("pointermove", function (e) {
      // Sentuhan jari di layar sentuh: sembunyikan bulatan
      if (e.pointerType && e.pointerType !== "mouse") {
        sembunyi();
        return;
      }
      tujuanX = e.clientX;
      tujuanY = e.clientY;
      if (!ada) {
        // Gerakan pertama: bulatan langsung muncul di posisi mouse
        ada = true;
        x = tujuanX;
        y = tujuanY;
        gambar();
      }
      tampil();
      aturBesar(e.target);
      mulai();
    }, { passive: true });

    // Saat halaman digulir tanpa menggerakkan mouse, cek lagi apa yang ada di bawah mouse
    window.addEventListener("scroll", function () {
      if (!ada || cekNanti) return;
      cekNanti = true;
      window.requestAnimationFrame(function () {
        cekNanti = false;
        aturBesar(document.elementFromPoint(tujuanX, tujuanY));
      });
    }, { passive: true });

    document.documentElement.addEventListener("mouseleave", sembunyi);
    document.documentElement.addEventListener("mouseenter", function () {
      if (ada) tampil();
    });
  }
})();
