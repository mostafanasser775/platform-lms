import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { ProductCard } from "@/features/products/components/ProductCard";
import { asc, eq } from "drizzle-orm";

export default async function Home() {
  const products = await getPublicProducts();

  return (
    <div className="container mx-auto my-8 px-6">
      <PageHeader title="Browse Courses" />
      <hr />
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6  pb-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

async function getPublicProducts() {
  return db.query.ProductTable.findMany({
    columns: {
      id: true,
      priceInDollars: true,
      imageUrl: true,
      description: true,
      name: true,
    },
    where: eq(ProductTable.status, "public"),
    orderBy: asc(ProductTable.name),
  });
}
