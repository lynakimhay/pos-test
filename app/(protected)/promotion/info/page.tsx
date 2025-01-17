"use client";
import React, {
  useContext,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation"; // Correct import
import { AppInfoContext } from "@/components/app-wrapper";

interface FormData {
  promotionCode: string;
  description: string;
  startDate: string;
  endDate: string;
  discountPercentage: string;
}

interface Errors {
  id?: number
  promotionCode?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  discountPercentage?: string;
}

const AddPromotion: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    promotionCode: "",
    description: "",
    startDate: "",
    endDate: "",
    discountPercentage: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const { token } = useContext(AppInfoContext);

  const router = useRouter(); // Initialize useRouter
  const searchParams = useSearchParams(); // Move it inside the component
  const id = searchParams.get("id"); // Access query params
  useEffect(() => {
    if (!id) return;

    const fetchPromotion = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/promotion/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { promotionCode, description, startDate, endDate, discountPercentage } = response.data;

        const formattedData = {
          promotionCode,
          description,
          startDate: startDate.slice(0, 10), // Format the date
          endDate: endDate.slice(0, 10),
          discountPercentage,
        };

        setFormData(formattedData);
      } catch (error) {
        console.error("Error fetching promotion data:", error);
        alert("Error fetching promotion data.");
      }
    };

    fetchPromotion();
  }, [id, token]);




  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validate = (): Errors => {
    const errors: Errors = {};

    if (!formData.promotionCode)
      errors.promotionCode = "Promotion Code is required.";
    if (!formData.description)
      errors.description = "Description is required.";
    if (!formData.startDate) errors.startDate = "Start Date is required.";
    if (!formData.endDate) errors.endDate = "End Date is required.";
    if (
      !formData.discountPercentage ||
      isNaN(Number(formData.discountPercentage))
    )
      errors.discountPercentage = "Valid Discount Percentage is required.";

    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!token) {
      alert("No token found");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/promotion/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Form submitted successfully:", response.data);
      setSubmitSuccess(true);
      setErrors({});

      router.replace("/promotion");
    } catch (error) {
      console.error("Error:", error);
      setSubmitSuccess(false);
      alert(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !token) {
      alert("Cannot delete without a valid promotion ID or token.");
      return;
    }

    if (confirm("Are you sure you want to delete this promotion?")) {
      setLoading(true); // Disable button while processing
      try {
        await axios.delete(`http://localhost:3000/api/promotion/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Promotion deleted successfully.");
        router.push("/promotion");
      } catch (error: any) {
        console.error("Error deleting promotion:", error);
        alert(`Failed to delete promotion. ${error.response?.data?.message || ""}`);
      } finally {
        setLoading(false); // Re-enable button
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 ">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-10 rounded-lg shadow-lg w-full"
    >
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Update Promotion
      </h2>
  
      <div className="grid grid-cols-2 gap-6">
        {Object.keys(formData).map((field) => (
          <div key={field} className="mb-4">
            <label
              htmlFor={field}
              className="block text-base font-medium text-gray-700 capitalize"
            >
              {field}
            </label>
            <input
              type={field.includes("Date") ? "date" : "text"}
              name={field}
              id={field}
              value={formData[field as keyof FormData] || ""}
              onChange={handleChange}
              placeholder={`Enter ${field}`}
              className={`mt-2 block w-full rounded-lg border ${
                errors[field as keyof Errors] ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-lg`}
            />
            {errors[field as keyof Errors] && (
              <p className="text-red-500 text-sm mt-2">
                {errors[field as keyof Errors]}
              </p>
            )}
          </div>
        ))}
      </div>
  
      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-6">
       
  
          <button
            type="button"
            onClick={() => router.push("/promotion")}
            className="py-2 px-6 bg-gray-500 text-white text-sm font-semibold rounded-lg shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-6 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
  
        <button
          type="button"
          onClick={handleDelete}
          className="py-2 px-6 bg-red-600 text-white text-sm font-semibold rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete
        </button>
      </div>
  
      {submitSuccess && (
        <p className="text-green-500 text-lg mt-6 text-center">
          Promotion updated successfully!
        </p>
      )}
    </form>
  </div>
  
  );
};

export default AddPromotion;
