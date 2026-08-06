# Database Design - AI Shop

## Version

1.0

## Database

PostgreSQL

## ORM

Prisma ORM

------------------------------------------------------------------------

# IMPORTANT

Database Authentication **TIDAK BOLEH DIUBAH**.

Model berikut sudah digunakan oleh sistem authentication dan harus tetap
dipertahankan.

-   User
-   Account
-   Session
-   VerificationToken

AI hanya boleh menambahkan relasi jika diperlukan tanpa mengubah
struktur utama authentication.

------------------------------------------------------------------------

# Module Authentication

## User

Status : Existing

Digunakan untuk menyimpan akun pengguna.

## Account

Status : Existing

Digunakan untuk OAuth Account.

## Session

Status : Existing

Digunakan untuk Session Login.

## VerificationToken

Status : Existing

Digunakan untuk Email Verification.

------------------------------------------------------------------------

# Module User

## UserProfile

  Field       Type
  ----------- ----------
  id          String
  userId      String
  phone       String
  gender      Enum
  birthDate   Date
  avatar      String
  createdAt   DateTime
  updatedAt   DateTime

Relation: User (1) → UserProfile (1)

## UserAddress

  Field           Type
  --------------- ----------
  id              String
  userId          String
  label           String
  recipientName   String
  phone           String
  province        String
  city            String
  district        String
  postalCode      String
  address         Text
  isDefault       Boolean
  createdAt       DateTime
  updatedAt       DateTime

Relation: User (1) → UserAddress (N)

------------------------------------------------------------------------

# Module Product

## Category

  Field         Type
  ------------- -----------------
  id            String
  parentId      String Nullable
  name          String
  slug          String
  description   Text
  image         String
  isActive      Boolean
  createdAt     DateTime
  updatedAt     DateTime

## Brand

  Field         Type
  ------------- ----------
  id            String
  name          String
  slug          String
  description   Text
  logo          String
  website       String
  country       String
  isActive      Boolean
  createdAt     DateTime
  updatedAt     DateTime

## Product

  Field              Type
  ------------------ ------------------
  id                 String
  categoryId         String
  brandId            String
  sku                String
  slug               String
  name               String
  shortDescription   String
  description        Text
  price              Integer
  discountPrice      Integer Nullable
  weight             Integer
  status             Boolean
  isFeatured         Boolean
  createdAt          DateTime
  updatedAt          DateTime

## ProductVariant

  Field       Type
  ----------- -----------------
  id          String
  productId   String
  sku         String
  barcode     String Nullable
  size        Integer
  color       String
  stock       Integer
  createdAt   DateTime
  updatedAt   DateTime

Business Rule: Composite Unique (productId, size, color)

## ProductImage

  Field       Type
  ----------- ----------
  id          String
  productId   String
  imageUrl    String
  sortOrder   Integer
  createdAt   DateTime

## ProductSpecification

  Field       Type
  ----------- --------
  id          String
  productId   String
  name        String
  value       String

## ProductReview

  Field       Type
  ----------- --------------
  id          String
  productId   String
  userId      String
  rating      Decimal(2,1)
  review      Text
  createdAt   DateTime
  updatedAt   DateTime

------------------------------------------------------------------------

# Module Cart

## Cart

  Field       Type
  ----------- ----------
  id          String
  userId      String
  createdAt   DateTime
  updatedAt   DateTime

## CartItem

  Field              Type
  ------------------ ----------
  id                 String
  cartId             String
  productVariantId   String
  quantity           Integer
  createdAt          DateTime
  updatedAt          DateTime

------------------------------------------------------------------------

# Module Order

## Order

  Field           Type
  --------------- ----------
  id              String
  userId          String
  invoiceNumber   String
  subtotal        Integer
  shippingCost    Integer
  discount        Integer
  grandTotal      Integer
  status          Enum
  createdAt       DateTime
  updatedAt       DateTime

## OrderItem

  Field              Type
  ------------------ ----------
  id                 String
  orderId            String
  productVariantId   String
  quantity           Integer
  price              Integer
  subtotal           Integer
  createdAt          DateTime

------------------------------------------------------------------------

# Module Payment

## Payment

  Field           Type
  --------------- -------------------
  id              String
  orderId         String
  method          String
  amount          Integer
  status          Enum
  transactionId   String Nullable
  paidAt          DateTime Nullable
  createdAt       DateTime

------------------------------------------------------------------------

# Module Shipment

## Shipment

  Field            Type
  ---------------- -------------------
  id               String
  orderId          String
  courier          String
  service          String
  trackingNumber   String Nullable
  status           Enum
  shippedAt        DateTime Nullable
  deliveredAt      DateTime Nullable

------------------------------------------------------------------------

# Module Wishlist

## Wishlist

  Field       Type
  ----------- ----------
  id          String
  userId      String
  createdAt   DateTime

## WishlistItem

  Field        Type
  ------------ ----------
  id           String
  wishlistId   String
  productId    String
  createdAt    DateTime

------------------------------------------------------------------------

# Module AI

## Conversation

  Field       Type
  ----------- ----------
  id          String
  userId      String
  title       String
  createdAt   DateTime
  updatedAt   DateTime

## Message

  Field            Type
  ---------------- ----------
  id               String
  conversationId   String
  role             Enum
  content          Text
  createdAt        DateTime

------------------------------------------------------------------------

# Entity Relationship

User - UserProfile - UserAddress - Cart → CartItem - Order → OrderItem →
Payment → Shipment - Wishlist → WishlistItem - Conversation → Message -
ProductReview

Category → Product Brand → Product Product - ProductVariant -
ProductImage - ProductSpecification - ProductReview

------------------------------------------------------------------------

# Total Tables

-   Authentication (4)
-   User (2)
-   Product (7)
-   Cart (2)
-   Order (2)
-   Payment (1)
-   Shipment (1)
-   Wishlist (2)
-   AI (2)

**Total: 23 Tables**

------------------------------------------------------------------------

# Notes For AI

-   Authentication models (User, Account, Session, VerificationToken)
    must not be modified.
-   Target database is PostgreSQL using Prisma ORM.
-   Use Integer for all monetary values (price, discountPrice, subtotal,
    shippingCost, discount, grandTotal, amount).
-   Keep rating as Decimal(2,1).
-   Product stock must only exist in ProductVariant.
-   ProductVariant supports Size + Color.
-   Apply proper relations, indexes, unique constraints, and enums.
-   Use Composite Unique (productId, size, color) on ProductVariant.
-   Generate a clean production-ready schema.prisma.
