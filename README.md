# Task Management App

Aplikasi **Task Management** ini merupakan sistem untuk mengelola To Do List dengan fitur **autentikasi JWT**, **CRUD Task**, serta **filter dan sorting** berdasarkan status dan deadline.  
Frontend dibangun menggunakan **React.js**, sementara backend menggunakan **Laravel REST API** dengan **JWT Authentication**.

---

## Deskripsi Singkat

Task Management App memungkinkan pengguna untuk:

- Melakukan **Sign In, Sign Up & Logout** menggunakan JWT (Token Based Authentication).
- Melihat daftar seluruh task miliknya (spesifik milik user tersebut).
- **Melihat, menambahkan, mengedit, dan menghapus (CRUD)** task.
- Melakukan **filter berdasarkan status** (`todo`, `progress`, `done`).
- Melakukan **sorting berdasarkan deadline** (ascending / descending).

Aplikasi ini dibangun dengan arsitektur **frontend dan backend terpisah**, saling terhubung melalui **REST API**.

---

## Teknologi yang Digunakan

### 1. Backend (Laravel)

- **Laravel 10**
- **tymon/jwt-auth** untuk autentikasi berbasis token
- **Eloquent ORM**
- **MySQL** / **SQLite** sebagai database
- **Laravel Breeze** untuk struktur dasar auth
- **CORS Configuration** untuk komunikasi antara domain React dan Laravel

### 2. Frontend (React)

- **React 19 + Vite**
- **Axios** untuk komunikasi dengan API
- **Bootstrap 5** untuk layout dan styling
- **LocalStorage** untuk penyimpanan token JWT

---

## Langkah Menjalankan Aplikasi

### 1. Clone Repo

```bash
git clone https://github.com/username/task-management.git
cd task-management
```

### 2. Setup Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Ubah file .env sesuai konfigurasi lokal.

```bash
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=mysql
DB_DATABASE=task_db
DB_USERNAME=root
DB_PASSWORD=
```

Lalu jalankan migrasi database:

```bash
php artisan migrate
```

Jalankan server:

```bash
php artisan serve
```

Backend akan berjalan di: http://localhost:8000

### 3. Setup Frontend (React)

```bash
cd frontend
npm install
```

Buat file .env di dalam folder frontend:

```bash
VITE_API_URL=http://localhost:8000/api
```

Jalankan frontend:

```bash
npm run dev
```

Frontend akan berjalan di: http://localhost:5173

## Informasi Login Dummy

Gunakan akun berikut untuk uji coba:
Email : lana@mail.com
Password : password

Anda bisa membuat akun baru melalui endpoint /register atau menambahkan manual di tabel users.

## Struktur Database

Tabel : users

```bash
| Kolom      | Tipe      | Keterangan    |
| ---------- | --------- | ------------- |
| id         | bigint    | Primary key   |
| name       | varchar   | Nama pengguna |
| email      | varchar   | Email unik    |
| password   | varchar   | Hash password |
| created_at | timestamp | Waktu dibuat  |
| updated_at | timestamp | Waktu update  |
```

Tabel: tasks

```bash
| Kolom       | Tipe                           | Keterangan        |
| ----------- | ------------------------------ | ----------------- |
| task_id     | bigint                         | Primary key       |
| user_id     | bigint (FK)                    | Relasi ke users   |
| title       | varchar                        | Judul task        |
| description | varchar (nullable)             | Deskripsi task    |
| status      | enum(`todo`,`progress`,`done`) | Status task       |
| deadline    | date (nullable)                | Batas waktu       |
| created_by  | bigint (FK)                    | User pembuat task |
| created_at  | timestamp                      | Waktu dibuat      |
| updated_at  | timestamp                      | Waktu update      |
```

## Screenshots

Terdapat beberapa screenshot aplikasi di folder ./screenshots

## Developer

Lana Saiful Aqil
Fresh Graduate Universitas Gadjah Mada
Fullstack Web Developer (Laravel + React.js)
