"use client";

interface ProductFormData {
    nameEn: string;
    nameKh: string;
    categoryId: number;  // Changed to number
    sku: string;
    createdBy: string;
    updatedBy: string;
}
interface StatusMessage {
    message: string;
    type: 'success' | 'error' | '';
}
// app/page.tsx

import React, { useState } from "react";
import PageWrapper from "@/components/page-wrapper";

const AddProductPage = () => {
    // Form field states
    const [nameEn, setNameEn] = useState("");
    const [nameKh, setNameKh] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [sku, setSku] = useState("");
    
    // Status message state
    const [status, setStatus] = useState<StatusMessage>({ 
        message: '', 
        type: '' 
    });
    
    // Loading state
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Basic validation
        if (!nameEn || !nameKh || !categoryId || !sku) {
            setStatus({
                message: 'Please fill in all required fields',
                type: 'error'
            });
            return;
        }

        // Validate that categoryId is a valid number
        const categoryIdNum = parseInt(categoryId, 10);
        if (isNaN(categoryIdNum)) {
            setStatus({
                message: 'Category ID must be a valid number',
                type: 'error'
            });
            return;
        }
        
        const formData: ProductFormData = {
            nameEn,
            nameKh,
            categoryId: categoryIdNum, // Convert to number
            sku,
            createdBy: "1",
            updatedBy: "1"
        };
        
        setIsLoading(true);
        
        try {
            const response = await fetch('/api/product', {  // Updated to match your API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create product');
            }

            // Clear form
            setNameEn('');
            setNameKh('');
            setCategoryId('');
            setSku('');
            
            setStatus({
                message: data.message || 'Product created successfully!',
                type: 'success'
            });
            
        } catch (error) {
            console.error('Error creating product:', error);
            setStatus({
                message: error instanceof Error ? error.message : 'Failed to create product. Please try again.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageWrapper>
            <div className="max-w-2xl mx-auto p-6 space-y-6 bg-white shadow-md rounded">
                <h1 className="text-3xl font-bold text-gray-800">Add Product</h1>
                
                {status.message && (
                    <div 
                        className={`p-4 rounded ${
                            status.type === 'success' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
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
                        <label htmlFor="categoryId" className="block text-gray-700 font-medium">
                            Category ID <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"  // Changed to number type
                            id="categoryId"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter category ID"
                            min="1"  // Added min value
                            required
                        />
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

                    {/* Submit Button */}
                    <div className="text-right">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? 'Creating...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </PageWrapper>
    );
};

export default AddProductPage;