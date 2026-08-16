import { prisma } from "../lib/prisma";

async function main() {
  console.log("Menjalankan seeder order...");

  // Get a user
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "testuser@example.com",
      }
    });
  }

  // Ensure user has an address
  let address = await prisma.userAddress.findFirst({ where: { userId: user.id } });
  if (!address) {
    address = await prisma.userAddress.create({
      data: {
        userId: user.id,
        label: "Rumah",
        recipientName: user.name || "Test User",
        phone: "08123456789",
        province: "DKI Jakarta",
        city: "Jakarta Selatan",
        district: "Tebet",
        postalCode: "12810",
        address: "Jl. Tebet Timur Dalam No. 123",
        isDefault: true,
      }
    });
  }

  // Get a product variant
  const variant = await prisma.productVariant.findFirst({
    include: { product: true }
  });

  if (!variant) {
    console.error("No product variants found! Please add a product with a variant first.");
    return;
  }

  // Create Order 1: Pending
  const order1 = await prisma.order.create({
    data: {
      userId: user.id,
      invoiceNumber: "INV-" + new Date().getTime(),
      subtotal: variant.product.price,
      shippingCost: 25000,
      discount: 0,
      grandTotal: variant.product.price + 25000,
      status: "PENDING",
      items: {
        create: {
          productVariantId: variant.id,
          quantity: 1,
          price: variant.product.price,
          subtotal: variant.product.price,
        }
      },
      payment: {
        create: {
          method: "Bank Transfer",
          amount: variant.product.price + 25000,
          status: "PENDING",
        }
      },
      shipment: {
        create: {
          courier: "JNE",
          service: "REG",
          status: "PENDING",
        }
      }
    }
  });

  // Create Order 2: Paid & Shipped
  const order2 = await prisma.order.create({
    data: {
      userId: user.id,
      invoiceNumber: "INV-" + (new Date().getTime() + 1),
      subtotal: variant.product.price * 2,
      shippingCost: 35000,
      discount: 10000,
      grandTotal: (variant.product.price * 2) + 35000 - 10000,
      status: "SHIPPED",
      items: {
        create: {
          productVariantId: variant.id,
          quantity: 2,
          price: variant.product.price,
          subtotal: variant.product.price * 2,
        }
      },
      payment: {
        create: {
          method: "Credit Card",
          amount: (variant.product.price * 2) + 35000 - 10000,
          status: "SUCCESS",
        }
      },
      shipment: {
        create: {
          courier: "SiCepat",
          service: "BEST",
          trackingNumber: "001122334455",
          status: "SHIPPED",
        }
      }
    }
  });

  console.log("Berhasil membuat 2 dummy orders:", order1.invoiceNumber, order2.invoiceNumber);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
