"use client";
import React, { useState } from "react";
import PageWrapper from "@/components/page-wrapper";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const AddPromotion = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [promotionCode, setPromotionCode] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!promotionCode) newErrors.promotionCode = "Promotion code is required.";
    if (!description) newErrors.description = "Description is required.";
    if (!startDate) newErrors.startDate = "Start date is required.";
    if (!endDate) newErrors.endDate = "End date is required.";
    if (!discountPercentage || isNaN(Number(discountPercentage))) {
      newErrors.discountPercentage = "Discount percentage must be a valid number.";
    }
    if (!imageFile) newErrors.imageFile = "An image is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    let imageUrl: string | null = "";

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      try {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          credentials: "same-origin",
          body: formData,
        });
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.secure_url;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload image.",
        });
        setIsLoading(false);
        return;
      }
    }

    const payload = {
      promotionCode,
      description,
      startDate,
      endDate,
      discountPercentage,
      imageUrl,
    };

    try {
      const response = await fetch("/api/promotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Promotion added successfully.",
        });
        setPromotionCode("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        setDiscountPercentage("");
        setImageFile(null);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to add promotion.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding promotion.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Add Promotion</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg shadow-lg">
            {/* Promotion Code */}
            <div className="flex flex-col">
              <label htmlFor="promotionCode" className="text-sm font-medium text-gray-700 mb-2">
                Promotion Code
              </label>
              <input
                type="text"
                className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                id="promotionCode"
                placeholder="Enter promotion code"
                value={promotionCode}
                onChange={(e) => setPromotionCode(e.target.value)}
              />
              {errors.promotionCode && <p className="text-sm text-red-500 mt-1">{errors.promotionCode}</p>}
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                id="description"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
            </div>

            {/* Start Date */}
            <div className="flex flex-col">
              <label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>}
            </div>

            {/* End Date */}
            <div className="flex flex-col">
              <label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>}
            </div>

            {/* Discount Percentage */}
            <div className="flex flex-col">
              <label htmlFor="discountPercentage" className="text-sm font-medium text-gray-700 mb-2">
                Discount Percentage
              </label>
              <input
                type="number"
                className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                id="discountPercentage"
                placeholder="Enter discount percentage"
                min="0"
                max="100"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
              />
              {errors.discountPercentage && (
                <p className="text-sm text-red-500 mt-1">{errors.discountPercentage}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="flex flex-col">
              <label htmlFor="imageFile" className="text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="border rounded-md p-3"
                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
              />
              {errors.imageFile && <p className="text-sm text-red-500 mt-1">{errors.imageFile}</p>}
              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-24 h-24 mt-2 object-cover rounded-md"
                />
              )}
            </div>

            {/* Buttons */}
            <div className="col-span-2 flex space-x-4 mt-6">
              <button
                type="button"
                className="py-2 px-6 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                onClick={() => {
                  alert("Form canceled");
                  router.push("/promotion"); // Navigate to the promotion page
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className={`py-2 px-6 ${isLoading ? "bg-gray-400" : "bg-black"
                  } text-white font-semibold rounded-md shadow-md`}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default AddPromotion;
