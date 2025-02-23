import { CTA } from "@/components/CTA";
import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";
// import { Stats } from "@/components/Stats";
// import { Testimonials } from "@/components/Testimonials";
import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { ProductCard } from "@/features/products/components/ProductCard";
import { asc, eq } from "drizzle-orm";

export default async function Home() {
  const products = await getPublicProducts();

  return (
    <div className="min-h-screen w-full">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Latest Courses
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Join thousands of students already learning with us
          </p>
        </div>
        <div className="mt-8  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6   pb-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Features />

      {/* <Stats />
      <Testimonials /> */}
      <CTA />


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
    limit: 6
  });
}
