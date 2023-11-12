# Test Technical QA-Atmatech
# Pengujian Otomatis API Atmatech dengan Cypress

Repositori ini berisi pengujian API otomatis untuk Atmatech menggunakan Cypress.

## Prasyarat

Sebelum memulai, pastikan Anda telah memenuhi persyaratan berikut:

- Node.js dan npm terinstal
- Git terinstal
- Clone dari [repositori Atmatech Automation API](https://github.com/bungkoko/Atmatech_automation_api.git)

## Memulai

1. Clone repositori:
```bash
git clone https://github.com/bungkoko/Atmatech_automation_api.git
```
2. Pindah ke folder proyek:
```bash
cd Atmatech_automation_api
```
3. Install dependensi:
```bash
npm install
```
## Menjalankan Pengujian Cypress

Untuk menjalankan pengujian Cypress, ikuti langkah-langkah berikut:

## Buka Cypress Test Runner:

```bash
npx cypress open
```
1. Di Cypress Test Runner, klik pada file pengujian yang ingin Anda jalankan.
2. Cypress menjalankan pengujian Anda.
Menjalankan Pengujian Tanpa Antarmuka (Command Line)
Untuk menjalankan pengujian dalam mode tanpa antarmuka (command line), gunakan perintah berikut:

```bash
npx cypress run
```
Ini akan menjalankan semua pengujian di browser Electron bawaan.

## Konfigurasi Lingkungan
Ubah file cypress.json untuk mengonfigurasi variabel lingkungan pengujian.

## Struktur Folder
1. cypress/e2e: Berisi file pengujian.
2. cypress/support: Berisi file dukungan seperti perintah dan variabel global.

## Lisensi
Proyek ini dilisensikan di bawah Lisensi MIT.

