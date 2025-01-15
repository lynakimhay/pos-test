"use client";
import React, { useState, useEffect } from "react";
import PageWrapper from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// import { useToast } from "@/hooks/use-toast";
import { useToast } from "@/hooks/use-toast";

const AddSupplierPage: React.FC = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [supplierName, setSupplierName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [province, setProvince] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [taxIdentification, setTaxIdentification] = useState("");
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!supplierName) newErrors.supplierName = "Supplier name is required.";
    if (!contactEmail || !/\S+@\S+\.\S+/.test(contactEmail))
      newErrors.contactEmail = "Valid email is required.";
    if (!contactPhone || isNaN(Number(contactPhone)))
      newErrors.contactPhone = "A valid phone number is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!validate()) {
      setIsLoading(false);
      return;
    }

    let imageUrl: string | null = null;
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
        imageUrl = uploadData.secure_url || null;
        toast({
          title: "Success",
          description: "Image uploaded successfully.",
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        setMessage("Image upload failed.");
        toast({
          title: "Error",
          description: "Image upload failed.",
        });
        setIsLoading(false);
        return;
      }
    }

    const supplierData = {
      supplierName,
      contactName,
      contactEmail,
      contactPhone,
      addressLine1,
      addressLine2,
      province,
      websiteUrl,
      taxIdentification,
      imageUrl,
    };

    try {
      const response = await fetch("/api/supplier", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierData),
      });

      if (response.ok) {
        setMessage("Supplier added successfully.");
        toast({
          title: "Success",
          description: "New supplier added.",
        });
        router.back();
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
        toast({
          title: "Error",
          description: `Failed to add supplier: ${errorData.message}`,
        });
      }
    } catch (error) {
      console.error("Error adding supplier:", error);
      setMessage("Failed to add supplier.");
      toast({
        title: "Error",
        description: "Failed to add supplier.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Add Supplier</h1>
        {message && <p>{message}</p>}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="supplierName">Supplier Name</label>
              <input
                className="border p-1"
                type="text"
                id="supplierName"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Supplier Name"
              />
              {errors.supplierName && (
                <p className="text-sm text-red-600">{errors.supplierName}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="contactName">Contact Name</label>
              <input
                className="border p-1"
                type="text"
                id="contactName"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Contact Name"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="contactEmail">Contact Email</label>
              <input
                className="border p-1"
                type="email"
                id="contactEmail"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Contact Email"
              />
              {errors.contactEmail && (
                <p className="text-sm text-red-600">{errors.contactEmail}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="contactPhone">Contact Phone</label>
              <input
                className="border p-1"
                type="text"
                id="contactPhone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Contact Phone"
              />
              {errors.contactPhone && (
                <p className="text-sm text-red-600">{errors.contactPhone}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="addressLine1">Address Line 1</label>
              <input
                className="border p-1"
                type="text"
                id="addressLine1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="Address Line 1"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="addressLine2">Address Line 2</label>
              <input
                className="border p-1"
                type="text"
                id="addressLine2"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Address Line 2"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="province">Province</label>
              <input
                className="border p-1"
                type="text"
                id="province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="Province"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="websiteUrl">Website URL</label>
              <input
                className="border p-1"
                type="text"
                id="websiteUrl"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="Website URL"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="taxIdentification">Tax Identification</label>
              <input
                className="border p-1"
                type="text"
                id="taxIdentification"
                value={taxIdentification}
                onChange={(e) => setTaxIdentification(e.target.value)}
                placeholder="Tax Identification"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="imageFile">Profile Image</label>
              <input
                type="file"
                id="imageFile"
                onChange={(e) => setImageFile(e.target.files?.[0])}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-blue-500" type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default AddSupplierPage;

