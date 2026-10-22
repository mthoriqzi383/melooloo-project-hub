# Mengedit slide bersama tim

1. Buka `editor.html` di website Melooloo. Pilih slide, lalu klik teks langsung pada pratinjau atau isi kolom **Judul slide** dan **Kalimat pembuka**. Teks lain juga dapat dipilih dari daftar di kanan. Perubahan langsung tampil di pratinjau. Gunakan kolom catatan untuk permintaan visual, foto, grafik, atau pemeriksaan angka.
2. Isi nama penyunting, lalu klik **Unduh draf untuk ditinjau**. Kirim berkas JSON itu kepada penanggung jawab presentasi. Draf tersimpan juga di browser yang dipakai; klik **Buka draf tim lain** untuk memeriksa berkas rekan.
3. Penanggung jawab meninjau teks sebelum dan sesudah di editor. Untuk angka dan klaim, cocokkan dengan sumber slide atau model keuangan yang berlaku. File sumber Canva/PPTX tidak berubah.
4. Untuk menyiapkan edit yang disetujui secara lokal, jalankan `python3 review_slide_draft.py nama-draf.json` untuk melihat perbedaan, lalu jalankan kembali dengan `--approve`. Ini mengubah `published-edits.js` saja. Tinjau hasil di presentasi dan perubahan Git sebelum membuat commit/pull request ke situs publik.

Editor ini mencakup 60 slide pada urutan presentasi baru. Teks pada slide selain pemasaran dapat diubah tanpa mengubah grafik dasar, foto, animasi, atau file sumber. Delapan slide pemasaran baru (halaman sumber 8–15) dapat dipratinjau dan diberi catatan peninjau; teksnya diperbarui pada materi pemasaran tersendiri. Berkas draf tidak otomatis terkirim atau diterbitkan. Setiap browser menyimpan drafnya sendiri, jadi unduh berkas sebelum berpindah perangkat atau menghapus data browser.
