# React Native Wallet

Project ini terdiri dari:
- `backend/` - REST API (Express + Neon Postgres + Upstash Redis)
- `mobile/` - Aplikasi mobile (Expo Router + React Native + Clerk)

## Prasyarat
- [Node.js](https://nodejs.org/) (versi terbaru LTS)
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) di device atau emulator (Android/iOS)
- Akun [Neon](https://console.neon.tech/), [Upstash](https://console.upstash.com/), dan [Clerk](https://dashboard.clerk.com/)

## 1) Menjalankan Backend

1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```

2. Salin file `.env.example` ke `.env` dan isi nilainya:
   ```bash
   cp .env.example .env  # macOS/Linux
   Copy-Item .env.example .env  # Windows PowerShell
   ```
   Yang perlu diisi: `DATABASE_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `PORT` (default `5001`)

3. Install dependencies:
   ```bash
   npm install
   ```

4. Jalankan server (development dengan nodemon):
   ```bash
   npm run dev
   ```
   Atau untuk production:
   ```bash
   npm start
   ```
   Server akan berjalan di `http://localhost:5001` (sesuai `PORT` di `.env`).

## 2) Menjalankan Mobile (Expo)

1. Masuk ke direktori mobile:
   ```bash
   cd mobile
   ```

2. Salin file `.env.example` ke `.env` dan isi `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` serta `EXPO_PUBLIC_API_URL`.
   ```bash
   cp .env.example .env  # macOS/Linux
   Copy-Item .env.example .env  # Windows PowerShell
   ```

   Catatan URL API:
   - Android emulator: `http://10.0.2.2:5001/api`
   - iOS simulator: `http://localhost:5001/api`
   - Device fisik (LAN): `http://<IP-LAN-KOMPUTER>:5001/api`

3. Install dependencies:
   ```bash
   npm install
   ```

4. Jalankan Expo dev server:
   ```bash
   npx expo start
   ```
   Lalu scan QR dengan Expo Go, atau tekan `a` (Android), `i` (iOS), atau `w` (web).

> Setelah mengubah `.env`, restart dev server dengan cache bersih: `npx expo start -c`

## Tips
- Pastikan backend sudah berjalan sebelum menjalankan mobile (terutama untuk request API).
- Untuk menguji di device fisik, pastikan device dan komputer berada di jaringan Wi-Fi yang sama.
