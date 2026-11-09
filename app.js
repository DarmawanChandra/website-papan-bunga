/* =========================================================
   app.js
   Mengisi halaman dengan data dari data.js.
   Biasanya file ini tidak perlu diubah: cukup ubah data.js.
   ========================================================= */
(function () {
  "use strict";

  const D = DATA_TOKO;

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

  // Mengganti {toko}, {cabang}, dan sejenisnya di dalam teks
  function isiTemplate(teks, nilai) {
    return String(teks == null ? "" : teks).replace(/\{(\w+)\}/g, function (asli, kunci) {
      return Object.prototype.hasOwnProperty.call(nilai, kunci) ? nilai[kunci] : asli;
    });
  }

  // Mengganti {toko} dengan nama toko
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
  function linkMaps(cabang) {
    if (cabang.linkMaps) return cabang.linkMaps;
    return "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent((cabang.alamat || []).join(", "));
  }

  // Mengisi elemen berdasarkan id-nya
  function tulis(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
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
    const X = 14, Y = 12, L = 292, T = 180, B = 22; // posisi, lebar, tinggi, dan tebal bingkai bunga
    let daun = "";
    let bunga = "";

    // Titik-titik bunga di sepanjang bingkai
    const titik = [];
    const nX = Math.round((L - B) / 13);
    const nY = Math.round((T - B) / 13);
    for (let i = 0; i <= nX; i++) {
      const x = X + B / 2 + (L - B) * i / nX;
      titik.push([x, Y + B / 2], [x, Y + T - B / 2]);
    }
    for (let i = 1; i < nY; i++) {
      const y = Y + B / 2 + (T - B) * i / nY;
      titik.push([X + B / 2, y], [X + L - B / 2, y]);
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
    [[X + s, Y + s], [X + L - s, Y + s], [X + s, Y + T - s], [X + L - s, Y + T - s]].forEach(function (p) {
      bunga += kuntum(p[0], p[1], 14, t.bunga[0]);
    });

    // Tulisan di tengah papan
    const posisiY = baris.length === 3 ? [76, 110, 138] : baris.length === 2 ? [92, 124] : [110];
    let tulisan = "";
    baris.forEach(function (isiBaris, i) {
      const g = GAYA_BARIS[i];
      tulisan += `<text x="${X + L / 2}" y="${posisiY[i]}" text-anchor="middle" font-family="${g.font}" ` +
        `font-weight="${g.tebal}" font-style="${g.miring}" font-size="${ukuranHuruf(isiBaris, g.maks, g.lebar)}" ` +
        `fill="${t.teks[i]}">${esc(isiBaris)}</text>`;
    });

    const kakiY = Y + T - 6;
    return `<svg viewBox="0 0 320 252" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label)}">` +
      `<ellipse cx="160" cy="244" rx="118" ry="5" fill="rgba(0,0,0,.08)"/>` +
      `<rect x="58" y="${kakiY}" width="8" height="${244 - kakiY}" rx="2" fill="${KAYU}"/>` +
      `<rect x="254" y="${kakiY}" width="8" height="${244 - kakiY}" rx="2" fill="${KAYU}"/>` +
      `<rect x="${X}" y="${Y}" width="${L}" height="${T}" rx="8" fill="${DAUN}"/>` +
      `<rect x="${X + B}" y="${Y + B}" width="${L - 2 * B}" height="${T - 2 * B}" rx="3" fill="${t.papan}"/>` +
      `<rect x="${X + B + 6}" y="${Y + B + 6}" width="${L - 2 * B - 12}" height="${T - 2 * B - 12}" rx="2" fill="none" stroke="${t.teks[0]}" stroke-opacity=".25"/>` +
      daun + bunga + tulisan +
      `</svg>`;
  }

  /* ---------- Mengisi halaman ---------- */

  // Nama toko
  document.title = D.nama + " | Papan Bunga " + D.area;
  document.querySelectorAll('[data-isi="nama"]').forEach(function (el) {
    el.textContent = D.nama;
  });

  // Bagian pembuka
  tulis("pembuka-label", "( Papan Bunga &middot; " + esc(D.area) + " )");
  tulis("pembuka-judul", esc(pakaiNama(D.pembuka.judul)));
  tulis("pembuka-sub", esc(pakaiNama(D.pembuka.sub)));
  tulis("pembuka-gambar", gambarPapan(D.pembuka.papan.baris, D.pembuka.papan.warna, "Gambar contoh papan bunga"));

  // Tentang kami
  tulis("tentang-teks",
    D.tentang.map(function (p) { return `<p>${esc(pakaiNama(p))}</p>`; }).join("") +
    `<div class="tombol-baris"><a class="tombol tombol-utama" href="#cabang">Pesan Sekarang</a></div>`);

  // Cabang dan harga
  function htmlHarga(daftar) {
    return daftar.map(function (grup) {
      const baris = grup.item.map(function (it) {
        return `<div class="harga-baris">` +
          `<span>${esc(it.nama)}${it.mulaiDari ? " *" : ""}</span>` +
          `<span class="titik" aria-hidden="true"></span>` +
          `<span class="nilai">${rupiah(it.harga)}</span>` +
          `</div>`;
      }).join("");
      return `<div class="harga-grup"><h3>${esc(grup.kategori)}</h3>${baris}</div>`;
    }).join("");
  }

  tulis("daftar-cabang", D.cabang.map(function (c, i) {
    const pesan = isiTemplate(D.pesanWA, { toko: D.nama, cabang: c.nama });
    const jam = (c.jam || []).map(function (j) {
      return `<span>${esc(j.hari)}</span><span>${esc(j.jam)}</span>`;
    }).join("");
    return `<details class="cabang"${i === 0 ? " open" : ""}>` +
      `<summary>` +
        `<span class="cabang-no">${duaDigit(i + 1)}.</span>` +
        `<span class="cabang-judul">` +
          `<span class="cabang-nama">${esc(c.nama)}</span>` +
          `<span class="cabang-wilayah">( ${esc(c.wilayah)} )</span>` +
        `</span>` +
        `<span class="cabang-tanda" aria-hidden="true"></span>` +
      `</summary>` +
      `<div class="cabang-isi">` +
        `<div class="cabang-info">` +
          `<div class="info-blok"><p class="info-judul">Alamat</p><p>${(c.alamat || []).map(esc).join("<br>")}</p></div>` +
          `<div class="info-blok"><p class="info-judul">WhatsApp</p><p>${esc(c.wa || "-")}</p></div>` +
          `<div class="info-blok"><p class="info-judul">Jam Buka</p><div class="jam">${jam}</div></div>` +
          `<div class="tombol-baris">` +
            `<a class="tombol tombol-utama" href="${esc(linkWA(c.wa, pesan))}" target="_blank" rel="noopener">WhatsApp</a>` +
            `<a class="tombol" href="${esc(linkMaps(c))}" target="_blank" rel="noopener">Google Maps</a>` +
          `</div>` +
        `</div>` +
        `<div class="cabang-harga">` +
          htmlHarga(c.harga || D.harga) +
          `<p class="catatan-harga">${esc(D.catatanHarga)}</p>` +
        `</div>` +
      `</div>` +
    `</details>`;
  }).join(""));

  // Galeri
  tulis("daftar-galeri", D.galeri.map(function (g, i) {
    const gambar = g.foto
      ? `<img src="${esc(g.foto)}" alt="Papan bunga ${esc(g.judul)}" loading="lazy">`
      : gambarPapan(g.baris, g.warna, "Gambar contoh papan bunga " + g.judul);
    return `<figure class="karya">` +
      `<div class="karya-gambar${g.foto ? " ada-foto" : ""}">${gambar}</div>` +
      `<figcaption><span>${duaDigit(i + 1)}</span>${esc(g.judul)}</figcaption>` +
    `</figure>`;
  }).join(""));

  // Lowongan kerja
  const lowongan = D.lowongan || {};
  const linkLamar = lowongan.linkForm ||
    linkWA((D.cabang[0] || {}).wa, pakaiNama(lowongan.pesanWA || "Halo {toko}, saya mau melamar kerja."));
  tulis("lowongan-teks",
    (lowongan.teks || []).map(function (p) { return `<p>${esc(pakaiNama(p))}</p>`; }).join("") +
    `<div class="tombol-baris"><a class="tombol tombol-utama" href="${esc(linkLamar)}" target="_blank" rel="noopener">` +
    (lowongan.linkForm ? "Isi Formulir Lamaran" : "Lamar lewat WhatsApp") + `</a></div>`);

  // Media sosial dan hak cipta
  const sosmed = D.sosmed || {};
  const akun = function (nama) { return String(nama || "").trim().replace(/^@/, ""); };
  const linkSosmed = [];
  if (akun(sosmed.instagram)) {
    linkSosmed.push(`<a href="https://www.instagram.com/${encodeURIComponent(akun(sosmed.instagram))}/" target="_blank" rel="noopener">Instagram</a>`);
  }
  if (akun(sosmed.tiktok)) {
    linkSosmed.push(`<a href="https://www.tiktok.com/@${encodeURIComponent(akun(sosmed.tiktok))}" target="_blank" rel="noopener">TikTok</a>`);
  }
  tulis("sosmed", linkSosmed.join(""));
  tulis("hak-cipta", `&copy; ${new Date().getFullYear()} ${esc(D.nama)}. Semua hak dilindungi.`);
})();
