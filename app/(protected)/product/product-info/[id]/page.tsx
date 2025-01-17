"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Replaces useRouter

interface Product {
  id: number;
  nameEn: string;
  nameKh: string;
  category: string;
  sku: string;
}

const ProductDetailPage = () => {
  const searchParams = useSearchParams(); // Get query parameters
  const id = searchParams.get("id"); // Get the product ID
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch product details from the API
      fetch(`/api/product/${id}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch((error) => console.error("Error fetching product:", error));
    }
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Product Details</h1>
      <div className="mt-4">
        <p>
          <strong>Name (EN):</strong> {product.nameEn}
        </p>
        <p>
          <strong>Name (KH):</strong> {product.nameKh}
        </p>
        <p>
          <strong>Category:</strong> {product.category}
        </p>
        <p>
          <strong>SKU:</strong> {product.sku}
        </p>
      </div>
    </div>
  );
};

export default ProductDetailPage;
