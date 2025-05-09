"use client";
import React, { useContext, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { AppInfoContext } from "@/components/app-wrapper"; // Import useRouter
import PageWrapper from '@/components/page-wrapper';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { cookies } from "next/headers";

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
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const { token } = useContext(AppInfoContext);

  const router = useRouter(); // Initialize useRouter

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const validate = (): Errors => {
    const errors: Errors = {};

    if (!formData.firstName) errors.firstName = 'First Name is required.';
    if (!formData.lastName) errors.lastName = 'Last Name is required.';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Valid email is required.';
    if (!formData.phone || formData.phone.length < 9 || formData.phone.length > 10 || isNaN(Number(formData.phone))) errors.phone = 'Phone must be 9-10 digits.';
    if (!formData.address) errors.address = 'Address is required.';

    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // const token = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxIiwiZXhwaXJlc0F0IjoiMjAyNS0wMS0xMVQwNDo0OTozNi42OTFaIiwiaWF0IjoxNzM2NTY3Mzc2LCJleHAiOjE3MzY2MTA1NzZ9.7tVU5-LX177zol08VBAlB6hWjd4o1h7mcmrUH6SAgXA"; // Replace with actual token retrieval logic
    console.log(token)
    if (!token) {
      alert("No token found");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/customer/create', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in Authorization header
        }
      });

      console.log('Form submitted successfully:', response.data);
      setSubmitSuccess(true);
      setErrors({}); // Clear errors after successful submission
      
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
      console.error('Error:', error);
      setSubmitSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
    <div className="max-w-full mx-auto p-6 space-y-6 bg-white shadow-md rounded">
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4"
    >
      <h2 className="text-xl font-bold mb-6 text-center">Add Customer</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {['firstName', 'lastName', 'email', 'phone', 'address'].map((field) => (
          <div key={field} className="mb-4">
            <label 
              htmlFor={field} 
              className="block text-sm font-medium text-gray-700 capitalize"
            >
              {field}
            </label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              id={field}
              value={formData[field as keyof FormData]}
              onChange={handleChange}
              placeholder={`Enter your ${field}`}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 ${
                errors[field as keyof Errors] 
                  ? 'border-red-500' 
                  : 'border-gray-300'
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
  
      <button 
        type="submit" 
        className="py-2 px-6 bg-black text-white rounded focus:outline-none focus:ring focus:ring-blue-300 text-sm"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
  
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
