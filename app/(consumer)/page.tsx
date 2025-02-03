import { PageHeader } from "@/components/PageHeader";
import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { ProductCard } from "@/features/products/components/ProductCard";
import { asc, eq } from "drizzle-orm";

export default async function Home() {
  const products = await getPublicProducts()
  return (
    <div className="container my-4">
      <PageHeader title="Products" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        }
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
    orderBy: asc(ProductTable.name)
  })
}
