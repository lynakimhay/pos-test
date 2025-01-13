"use client";

import React, { useState } from "react";
import PageWrapper from "@/components/page-wrapper";
import PromotionForm from "./promotion-form";
import { createPromotion } from "@/services/promotionServices"; // Use the correct service function

const CreatePromotionPage: React.FC = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFormSubmit = async (formData: any) => {
    setError("");
    setSuccess(false);

    try {
      await createPromotion({
        promotionCode: formData.promotionCode,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        discountPercentage: parseInt(formData.discountPercentage),
      });

      setSuccess(true);
    } catch (err) {
      setError("Failed to create promotion. Please try again.");
    }
  };

  return (
    <PageWrapper>
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Create New Promotion</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">Promotion created successfully!</p>}

        <PromotionForm onSubmit={handleFormSubmit} />
      </div>
    </PageWrapper>
  );
};

export default CreatePromotionPage;
