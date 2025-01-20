"use client";

import React, { useState, useEffect } from "react";
import PageWrapper from "@/components/page-wrapper";
import { useRouter } from "next/navigation";

interface ProductFormData {
  nameEn: string;
  nameKh: string;
  categoryId: number;
  sku: string;
  imageUrl: string | null;
}

interface StatusMessage {
  message: string;
  type: "success" | "error" | "";
}

interface CategoryProduct {
  id: number;
  nameEn: string;
}

interface ExistingProduct {
  nameEn: string;
  nameKh: string;
  sku: string;
}

const AddProductPage = () => {
  const router = useRouter();

  // Form field states
  const [nameEn, setNameEn] = useState("");
  const [nameKh, setNameKh] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sku, setSku] = useState("");
  const [categories, setCategories] = useState<CategoryProduct[]>([]);
  const [existingProducts, setExistingProducts] = useState<ExistingProduct[]>([]);
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    // Fetch categories from the API
    fetch("/api/category", { credentials: "same-origin" })
      .then((response) => response.json())
      .then((data) => setCategories(data.data))
      .catch((error) => console.error("Error fetching categories:", error));

    // Fetch existing products to check for duplicates
    fetch("/api/product", { credentials: "same-origin" })
      .then((response) => response.json())
      .then((data) => setExistingProducts(data.data))
      .catch((error) => console.error("Error fetching existing products:", error));
  }, []);

  // Status message state
  const [status, setStatus] = useState<StatusMessage>({
    message: "",
    type: "",
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(nameEn, nameKh, categoryId, sku, image);

    let imageUrl: string | null = null;
    if (image) {
      const formData = new FormData();
      formData.append("file", image);

      try {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          credentials: "same-origin",
          body: formData,
        });
        const uploadData = await uploadResponse.json();

        imageUrl = uploadData.secure_url
          ? uploadData.secure_url.toString()
          : null;
        console.log(uploadData, imageUrl);
        console.log("Success upload")
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }


    // Basic validation
    if (!nameEn || !nameKh || !categoryId || !sku || !image) {
      setStatus({
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    // Validate that categoryId is a valid number
    const categoryIdNum = parseInt(categoryId, 10);
    if (isNaN(categoryIdNum)) {
      setStatus({
        message: "Category ID must be a valid number.",
        type: "error",
      });
      return;
    }

    // Check for duplicate product details
    const isDuplicate = existingProducts.some(
      (product) =>
        product.nameEn === nameEn || product.nameKh === nameKh || product.sku === sku
    );
    if (isDuplicate) {
      setStatus({
        message: "Product already exists.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      
      // Prepare product data
      const formData: ProductFormData = {
        nameEn,
        nameKh,
        categoryId: parseInt(categoryId),
        sku,
        imageUrl,
      };

      // Submit product data
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create product.");
      }

      // Clear form fields
      setNameEn("");
      setNameKh("");
      setCategoryId("");
      setSku("");
      setImage(null);

      // Update status and add the new product to the list
      setStatus({
        message: data.message || "Product created successfully!",
        type: "success",
      });
      setExistingProducts((prev) => [...prev, { nameEn, nameKh, sku }]);

      // Redirect after success
      setTimeout(() => {
        router.push("/product"); // Replace with your product page route
      }, 1500);
    } catch (error) {
      console.error("Error creating product:", error);
      setStatus({
        message:
          error instanceof Error
            ? error.message
            : "Failed to create product. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-full mx-auto p-6 space-y-6 bg-white shadow-md rounded">
        <h1 className="text-3xl font-bold text-gray-800">Add Product</h1>

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
          {/* Product Name (English) */}
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

          {/* Product Name (Khmer) */}
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

          {/* Category ID */}
          <div>
            <label
              htmlFor="categoryId"
              className="block text-gray-700 font-medium"
            >
              Category ID <span className="text-red-500">*</span>
            </label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* SKU */}
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

          {/* Upload image */}
          <div>
            <label htmlFor="image" className="block text-gray-700 font-medium">
              Product Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              disabled={isLoading}
              className={`py-2 px-6 bg-black text-white rounded focus:outline-none focus:ring focus:ring-blue-300 text-sm ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Creating..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default AddProductPage;
