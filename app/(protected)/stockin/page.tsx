import React from "react";
import PageWrapper from "@/components/page-wrapper";
import { PageTableView } from "./select-item-model";
import { getPaginatedPurchase } from "@/services/purchaseServer";


const StockIn = async ({ searchParams }: { searchParams: Record<string, string> }) => {
  const page = parseInt(searchParams.page || "1");
  const data = await getPaginatedPurchase({ pageSize: 10, currentPage: page });

  return <PageWrapper>
    <PageTableView title="StockIn" data={data} />
  </PageWrapper>;
};

export default StockIn;
// import React, { useState } from "react";

// const UploadForm = () => {
//   const [formData, setFormData] = useState({
//     id: 0,
//     supplierId: 0,
//     referenceNumber: "",
//     stockInDate: "",
//     supplierName: "",
//     numberOfItems: 0,
//     purchaseAmount: 0,
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const response = await fetch("/api/purchase", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     });

//     const data = await response.json();
//     console.log(data);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="number" name="id" placeholder="ID" onChange={handleChange} />
//       <input type="number" name="supplierId" placeholder="Supplier ID" onChange={handleChange} />
//       <input type="text" name="referenceNumber" placeholder="Reference Number" onChange={handleChange} />
//       <input type="date" name="stockInDate" placeholder="Stock-In Date" onChange={handleChange} />
//       <input type="text" name="supplierName" placeholder="Supplier Name" onChange={handleChange} />
//       <input type="number" name="numberOfItems" placeholder="Number of Items" onChange={handleChange} />
//       <input type="number" name="purchaseAmount" placeholder="Purchase Amount" onChange={handleChange} />
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default UploadForm;
