# Amir App CLI

Template ini digunakan untuk membuat script Command Line Interface (CLI) khusus untuk internal project (seperti sinkronisasi database, seeding, pembersihan data, atau task cron).

## 🚀 Cara Menjalankan

Gunakan `bun` untuk menjalankan script CLI:

```bash
bun run cli <command> [options]
```

Atau menggunakan script npm/bun dari package.json:

```bash
bun run cli hello --name Amir
```

### Command yang tersedia:

- `hello` : Contoh command dasar.
  - `-n, --name <string>` : Nama yang akan disapa (default: "World").

Untuk melihat bantuan dan semua opsi:
```bash
bun run cli --help
```

## 🛠️ Cara Menambah Command Baru

1. Buat file baru di dalam folder `cli/commands/` (misal: `sync-db.ts`).
2. Export fungsi command tersebut.
3. Buat file test `sync-db.test.ts` (Wajib, sesuai *GUIDELINE.md*).
4. Update file `cli/index.ts`:
   - Import fungsi command baru.
   - Tambahkan *case* baru pada `switch (command)` statement.
   - Tambahkan *help menu* di fungsi `showHelp()`.
   - Daftarkan argumen (options) baru jika diperlukan pada object `options` di `parseArgs`.

*Catatan: CLI ini dibuat native menggunakan `node:util` `parseArgs` yang ringan dan cepat, serta berjalan secara optimal di runtime Bun.*
