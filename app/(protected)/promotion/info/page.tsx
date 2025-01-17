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
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl"
      >
        <h2 className="text-xl font-bold mb-6 text-center">Update Promotion</h2>

        <div className="grid grid-cols-2 gap-6">
          {Object.keys(formData).map((field) => (
            <div key={field} className="mb-4">
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700 capitalize"
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
                className={`mt-1 block w-full rounded-md border ${errors[field as keyof Errors] ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
              />
              {errors[field as keyof Errors] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field as keyof Errors]}
                </p>
              )}
            </div>
          ))}

        </div>

        <div className="flex justify-between mt-6">
          <div className="flex gap-4">
            <button
              type="submit"
              className="py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/promotion")}
              className="py-3 px-4 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete
          </button>
        </div>

        {submitSuccess && (
          <p className="text-green-500 text-sm mt-4 text-center">
            Promotion updated successfully!
          </p>
        )}
      </form>
    </div>
  );
};

export default AddPromotion;
