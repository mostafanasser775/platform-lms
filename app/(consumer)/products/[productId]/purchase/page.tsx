import { notFound } from "next/navigation";

export default async function PurchasePage({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = await params;
    const product = await getPublicProduct(productId);
    if (product === undefined) return notFound();
    return <div className="container my-4">{
        product.name} is not available for purchase</div>;
}   