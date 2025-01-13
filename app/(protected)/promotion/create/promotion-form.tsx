"use client";

import React, { useState } from "react";

interface PromotionFormProps {
  onSubmit: (formData: any) => void;
}

const PromotionForm: React.FC<PromotionFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    promotionCode: "PROMO001",
    description: "",
    startDate: "",
    endDate: "",
    discountPercentage: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-bold">Promotion Code</label>
        <input
          type="text"
          name="promotionCode"
          value={formData.promotionCode}
          disabled
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block font-bold">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block font-bold">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block font-bold">End Date</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block font-bold">Discount Percentage</label>
        <input
          type="number"
          name="discountPercentage"
          value={formData.discountPercentage}
          onChange={handleChange}
          min="1"
          max="100"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Save Promotion
      </button>
    </form>
  );
};

export default PromotionForm;
