"use client";

import React, { useState } from "react";
import PageWrapper from "@/components/page-wrapper";

const AddProductPage = () => {
    // States for form fields
    const [nameEn, setNameEn] = useState("");
    const [nameKh, setNameKh] = useState("");
    const [category, setCategory] = useState("");
    const [sku, setSku] = useState("");
    const [imageUrl, setImageUrl] = useState("");

   
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission behavior
        console.log("Form Data:", { nameEn, nameKh, category, sku, imageUrl });
    };
    
    return (
        <PageWrapper>
            <div className="max-w-2xl mx-auto p-6 space-y-6 bg-white shadow-md rounded">
                <h1 className="text-3xl font-bold text-gray-800">Add Product</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Product Name (English) */}
                    <div>
                        <label htmlFor="nameEn" className="block text-gray-700 font-medium">
                            Product Name (English)
                        </label>
                        <input
                            type="text"
                            id="nameEn"
                            value={nameEn}
                            onChange={(e) => setNameEn(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter product name in English"
                        />
                    </div>

                    {/* Product Name (Khmer) */}
                    <div>
                        <label htmlFor="nameKh" className="block text-gray-700 font-medium">
                            Product Name (Khmer)
                        </label>
                        <input
                            type="text"
                            id="nameKh"
                            value={nameKh}
                            onChange={(e) => setNameKh(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter product name in Khmer"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-gray-700 font-medium">
                            Category
                        </label>
                        <input
                            type="text"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter product category"
                        />
                    </div>

                    {/* SKU */}
                    <div>
                        <label htmlFor="sku" className="block text-gray-700 font-medium">
                            SKU
                        </label>
                        <input
                            type="text"
                            id="sku"
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter SKU"
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label htmlFor="imageUrl" className="block text-gray-700 font-medium">
                            Image URL
                        </label>
                        <input
                            type="text"
                            id="imageUrl"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter image URL"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="text-right">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </PageWrapper>
    );
};

export default AddProductPage;
