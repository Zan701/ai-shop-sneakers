# 🚀 AI Shop - Implementation Documentation

> Version : 1.0
> Status : Development
> Framework : Next.js 15
> Database : PostgreSQL
> ORM : Prisma
> AI : Ollama
> Language : TypeScript

---

# 📖 Project Overview

AI Shop merupakan website e-commerce modern yang dilengkapi dengan Artificial Intelligence (AI Chatbot). AI tidak hanya berfungsi sebagai chatbot biasa, tetapi mampu memahami data produk dari database sehingga dapat memberikan rekomendasi, menjawab pertanyaan pelanggan, membantu proses pembelian, hingga menjadi asisten belanja digital.

Project ini dibuat sebagai media pembelajaran Fullstack Development sekaligus implementasi AI pada website modern menggunakan teknologi terbaru.

---

# 🎯 Tujuan Project

- Membangun website e-commerce modern menggunakan Next.js.
- Menggunakan PostgreSQL sebagai database utama.
- Menggunakan Prisma ORM.
- Mengimplementasikan AI Chatbot menggunakan Ollama.
- Menerapkan arsitektur project yang scalable.
- Menjadi project portfolio Fullstack AI Developer.

---

# 🛠 Tech Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI
- Lucide React

---

## Backend

- Next.js API Route
- Server Actions
- Prisma ORM

---

## Database

- PostgreSQL

---

## Authentication

- Better Auth (akan ditambahkan)

---

## AI

- Ollama
- Llama 3.2 / Qwen 2.5
- AI SDK (Opsional)

---

## Deployment

Frontend

- Vercel

Backend

- Next.js Server

Database

- PostgreSQL

AI

- Ollama Local

---

# 📂 Struktur Folder

```text
ai-shop/
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│   ├── images/
│   ├── icons/
│   ├── logo/
│   └── favicon.ico
│
├── src/
│   │
│   ├── app/
│   │
│   ├── components/
│   │
│   ├── lib/
│   │
│   ├── services/
│   │
│   ├── repositories/
│   │
│   ├── hooks/
│   │
│   ├── contexts/
│   │
│   ├── types/
│   │
│   ├── validations/
│   │
│   ├── constants/
│   │
│   ├── config/
│   │
│   └── middleware.ts
│
├── .env
├── package.json
└── README.md
```

---

# 🏛 Arsitektur Project

```
Browser

↓

Page

↓

Component

↓

Service

↓

Repository

↓

Prisma

↓

PostgreSQL
```

---

# 🤖 Arsitektur AI

```
User

↓

Chatbot

↓

API Route

↓

AI Service

↓

Repository

↓

Prisma

↓

PostgreSQL

↓

AI Service

↓

Ollama

↓

Jawaban AI
```

---

# 📦 Fase Pengembangan

## Phase 1

### Project Setup

- [ ] Install Next.js
- [ ] Install Tailwind CSS
- [x] Install Prisma
- [x] Install PostgreSQL
- [x] Konfigurasi Environment
- [x] Konfigurasi Prisma

---

## Phase 2

### Database

- [x] Product
- [x] Category
- [x] User
- [x] Cart
- [x] Cart Item
- [x] Order
- [x] Order Item
- [x] Chat History

---

## Phase 3

### Authentication

- [ ] Login
- [ ] Register
- [ ] Session
- [ ] Middleware
- [ ] Role User
- [ ] Role Admin

---

## Phase 4

### User Website

#### UI & Design System (TBD)
- [x] Setup Library UI Tambahan (Menunggu konfirmasi)
- [x] Konfigurasi Font (Menunggu konfirmasi)
- [x] Konfigurasi Warna & Tema (Menunggu konfirmasi)
- [x] Setup Shadcn UI
- [x] Global Layout (Navbar & Footer)

#### Halaman
- [ ] Home
- [ ] Product
- [ ] Product Detail
- [ ] Search
- [ ] Cart
- [ ] Checkout
- [ ] Profile

---

## Phase 5

### Admin Dashboard

- [ ] Dashboard
- [ ] Product Management
- [ ] Category Management
- [ ] Order Management
- [ ] User Management

---

## Phase 6

### AI Integration

- [ ] Install Ollama
- [ ] Install Model AI
- [ ] Integrasi API
- [ ] Chat UI
- [ ] Streaming Response
- [ ] Context Prompt

---

## Phase 7

### AI Shopping Assistant

AI mampu:

- Menjawab pertanyaan produk
- Memberikan rekomendasi produk
- Memberikan rekomendasi berdasarkan budget
- Menjelaskan spesifikasi produk
- Memberikan FAQ
- Memberikan saran pembelian

---

## Phase 8

### AI Advanced

- Memory Chat
- Semantic Search
- Embedding
- RAG (Retrieval Augmented Generation)
- Function Calling
- Recommendation Engine

---

# 📊 Database Flow

```
Frontend

↓

API

↓

Service

↓

Repository

↓

Prisma

↓

PostgreSQL
```

---

# 🤖 AI Flow

```
Pertanyaan User

↓

API Chat

↓

Cari Data Produk

↓

Prisma

↓

PostgreSQL

↓

Gabungkan Context

↓

Ollama

↓

Jawaban AI

↓

Frontend
```

---

# 📌 Coding Rules

## 1.

Jangan pernah mengakses Prisma langsung dari Component.

Harus melalui:

Page

↓

Service

↓

Repository

↓

Prisma

---

## 2.

Semua Business Logic berada pada folder:

```
services/
```

---

## 3.

Semua Query Database berada pada folder:

```
repositories/
```

---

## 4.

Semua UI berada pada folder:

```
components/
```

---

## 5.

Semua Routing berada pada folder:

```
app/
```

---

## 6.

Gunakan TypeScript pada seluruh project.

---

## 7.

Gunakan Environment Variable untuk seluruh konfigurasi sensitif.

---

## 8.

Jangan melakukan hardcode URL maupun API Key.

---

# 🎯 Target Akhir

Website AI Shop memiliki fitur:

✅ Login

✅ Register

✅ CRUD Product

✅ Category

✅ Cart

✅ Checkout

✅ Order

✅ Dashboard Admin

✅ PostgreSQL

✅ Prisma ORM

✅ AI Chatbot

✅ AI Recommendation

✅ AI Product Search

✅ AI FAQ

✅ AI Memory

✅ RAG

---

# 🚀 Future Development

- Voice Assistant
- AI Image Search
- AI Product Comparison
- AI Recommendation Engine
- Multi Language
- Payment Gateway
- Email Notification
- Push Notification
- Analytics Dashboard
- AI Sales Report
- Docker Deployment
- CI/CD
- Cloud Deployment

---

# 📝 Catatan

Project ini dikembangkan menggunakan pendekatan Fullstack Modern dengan memisahkan UI, Business Logic, Repository, Database, dan AI Service agar mudah dikembangkan, diuji, serta dipelihara. Arsitektur ini dirancang supaya di masa depan dapat mengganti model AI (misalnya dari Ollama ke OpenAI atau Gemini) maupun mengganti database dengan perubahan kode seminimal mungkin.