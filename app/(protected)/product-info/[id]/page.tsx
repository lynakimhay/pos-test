"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

interface StatusMessage {
  message: string;
  type: "success" | "error" | "";
}

export default function ProductDetails() {
  const [product, setProduct] = useState<Product | null>(null);
  const [nameEn, setNameEn] = useState<string>("");
  const [nameKh, setNameKh] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [sku, setSku] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [status, setStatus] = useState<StatusMessage>({
    message: "",
    type: "",
  });

  const { id } = useParams(); // Access product ID from the route
  const router = useRouter();

  // Fetch product categories and product details
  useEffect(() => {
    if (!id) return;

    // Fetch product categories
    fetch("/api/category", { credentials: "same-origin" })
      .then((response) => response.json())
      .then((data) => setCategories(data.data))
      .catch((err) => console.error("Failed to fetch categories:", err));

    // Fetch product details
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

  // Handle form submission (update product)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/product/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameEn,
          nameKh,
          categoryId,
          sku,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus({ message: "Product updated successfully!", type: "success" });
      } else {
        setStatus({ message: data.message || "Failed to update product.", type: "error" });
      }
    } catch (err) {
      console.error("Error updating product:", err);
      setStatus({ message: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete product
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/product/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.ok) {
        setStatus({ message: "Product deleted successfully!", type: "success" });
        setTimeout(() => {
          router.push("/product"); // Redirect to product list page
        }, 2000); // Wait for 2 seconds before redirecting
      } else {
        setStatus({ message: data.message || "Failed to delete product.", type: "error" });
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      setStatus({ message: "Something went wrong. Please try again.", type: "error" });
    }
  };

  const handleCancel = () => {
    router.push("/product"); // Navigate back to the product list page
  };

  // Show loading or error state
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <PageWrapper>
      <div className="max-w-full-2xl mx-auto p-6 space-y-6 bg-white shadow-md rounded">
        <h1 className="text-3xl font-bold text-gray-800">Detail Product</h1>
        {status.message && (
          <div
            className={`p-4 rounded ${
              status.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status.message}
          </div>
        )}

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
              required
            />
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-gray-700 font-medium">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
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
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
