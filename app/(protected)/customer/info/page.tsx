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
import PageWrapper from "@/components/page-wrapper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const AddCustomer: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [getCustomer, setCustomer] = useState<FormData | null>(null); // Make sure to specify the type as FormData or null

  const { token } = useContext(AppInfoContext);

  const router = useRouter(); // Initialize useRouter
  const searchParams = useSearchParams(); // Move it inside the component
  const id = searchParams.get("id"); // Access query params

  useEffect(() => {
    if (id) {
      const fetchCustomer = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/customer/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include the token in Authorization header
              },
            }
          );
          console.log("customer", response.data.customer);
          setCustomer(response.data.customer); // Update the state with customer data
          setFormData(response.data.customer); // Optionally pre-fill the form fields with customer data
        } catch (error) {
          console.error("Error fetching customer data:", error);
          alert("Error fetching customer data.");
        }
      };

      fetchCustomer();
    }
  }, [id, token]); // Dependency array ensures it runs when 'id' or 'token' changes

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validate = (): Errors => {
    const errors: Errors = {};

    if (!formData.firstName) errors.firstName = "First Name is required.";
    if (!formData.lastName) errors.lastName = "Last Name is required.";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Valid email is required.";
    if (
      !formData.phone ||
      formData.phone.length < 9 ||
      formData.phone.length > 10 ||
      isNaN(Number(formData.phone))
    )
      errors.phone = "Phone must be 9-10 digits.";
    if (!formData.address) errors.address = "Address is required.";

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

    if (!id) {
      alert("No customer ID provided for update.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/customer/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in Authorization header
          },
        }
      );

      console.log("Form submitted successfully:", response.data);
      setSubmitSuccess(true);
      setErrors({}); // Clear errors after successful submission

      // Navigate to /customer after successful submission
      // console.success('Checklists deleted successfully.');
      toast.success("Customer Update Successfully!", {
        position: "top-center",
        autoClose: 5000,
      });
      setTimeout(() => {
        router.replace("/customer");
      }, 5500);
    } catch (error) {
      toast.error("Failed To Update Customer", {
        position: "top-center",
        autoClose: 5000,
      });
      console.error("Error:", error);
      setSubmitSuccess(false);
    } finally {
      setLoading(false);
    }
  };
  console.log("customer", getCustomer);
  

  const handleDelete = async () => {
    if (!id || !token) {
      alert("Cannot delete without a valid customer ID or token.");
      return;
    }

    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://localhost:3000/api/customer/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Customer Delete Successfully!", {
          position: "top-center",
          autoClose: 5000,
        });
        setTimeout(() => {
          router.replace("/customer");
        }, 5500);
      } catch (error) {
        toast.error("Failed To Delete Customer", {
          position: "top-center",
          autoClose: 5000,
        });
        console.error("Error deleting customer:", error);
      }
    }
  };

  return (
    <PageWrapper>
    <div className="max-w-full mx-auto p-6 space-y-6 bg-white shadow-md rounded">
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <h2 className="text-xl font-bold mb-6 text-center">Update Customer</h2>

        <div className="grid grid-cols-2 gap-6">
          {["firstName", "lastName", "email", "phone", "address"].map(
            (field) => (
              <div key={field} className="mb-4">
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700 capitalize"
                >
                  {field}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  id={field}
                  value={formData[field as keyof FormData] || ""}
                  onChange={handleChange}
                  placeholder={`Enter your ${field}`}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 ${
                    errors[field as keyof Errors]
                      ? "border-red-500"
                      : "border-gray-300"
                  } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                />
                {errors[field as keyof Errors] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field as keyof Errors]}
                  </p>
                )}
              </div>
            )
          )}
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
              onClick={() => router.push("/customer")}
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
            Customer added successfully!
          </p>
        )}
      </form>
    </div>
    <ToastContainer
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        /> 
    </PageWrapper>
  );
};

export default AddCustomer;