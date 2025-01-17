"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageWrapper from "@/components/page-wrapper";

interface Product {
  id: number;
  nameEn: string;
  nameKh: string;
  categoryId: number;
  sku: string;
}

interface ProductCategory {
  id: number;
  nameEn: string;
}

export default function ProductDetails() {
  const [product, setProduct] = useState<Product | null>(null);
  const [nameEn, setNameEn] = useState<string>("");
  const [nameKh, setNameKh] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [sku, setSku] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<ProductCategory[]>([]);

  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    fetch("/api/category", { credentials: "same-origin" })
      .then((response) => response.json())
      .then((data) => setCategory(data.data));

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/${id}`);
        const data = await response.json();

        if (response.ok) {
          setProduct(data.product);
          setNameEn(data.product.nameEn);
          setNameKh(data.product.nameKh);
          setCategoryId(data.product.categoryId);
          setSku(data.product.sku);
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

  //   try {
  //     const response = await fetch(/api/product/${id}, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(0),
  //     });

  //     const data = await response.json();
  //     console.log('Response:', data); 
  //     if (response.ok) {
  //       alert("Product updated successfully!");
  //     } else {
  //       setError(data.message);
  //     }
  //   } catch (err) {
  //     console.error("Failed to update product:", err);
  //     setError("Something went wrong.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto p-6 space-y-6 bg-white shadow-md rounded">
        <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nameEn" className="block text-gray-700 font-medium">
              Product Name (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nameEn"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter product name in English"
              required
            />
          </div>

          <div>
            <label htmlFor="nameKh" className="block text-gray-700 font-medium">
              Product Name (Khmer) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nameKh"
              value={nameKh}
              onChange={(e) => setNameKh(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter product name in Khmer"
              required
            />
          </div>




<div>
            <label htmlFor="categoryId" className="block text-gray-700 font-medium">
              Category ID <span className="text-red-500">*</span>
            </label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))} // Convert the value to a number
            >
              <option value="">Select CategoryId</option>
              {category.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sku" className="block text-gray-700 font-medium">
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter SKU"
              required
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}