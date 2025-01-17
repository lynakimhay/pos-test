"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PurchaseModel } from "@/models/api/purchaseModel";
import PaginationData from "@/models/PaginationData";
import { TableViewPagination } from "@/components/tableview-pagination";
import { useRouter } from 'next/navigation';


interface Props {
  title: string;
  data: PaginationData<PurchaseModel>;
}

export const PageTableView: React.FC<Props> = ({ title, data }) => {
  const router = useRouter();
  const [paginatedData, setPaginatedData] = useState(data);

  const handlePrevClick = () => setPaginatedData((prev) => {
    return { ...prev, currentPage: data.prevPage };
  });

  const handleNextClick = () =>
    setPaginatedData((prev) => {
      return { ...prev, currentPage: data.nextPage };
    });

  const handlePageClick = (i: number) => setPaginatedData({ ...paginatedData, currentPage: i + 1 })
  const fetchStockApi = async () => {
    try {
      const response = await fetch("/stokcin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error("Error: " + response.status);
      }
    } catch (error) {
      console.error("Request failed", error);
    }
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{title}</h1>

      <div>
        {/* Search and Add Product Section */}
        <div className="flex justify-between items-center">
          <Input className="max-w-sm" placeholder="Search products..." />
          <Link href="/stockin/add-purchase">
            <Button>Add Purchase</Button>
          </Link>
        </div>


      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
            <TableHead>Id</TableHead>
              <TableHead>Supplier Name</TableHead>
              <TableHead>Reference Number</TableHead>
              <TableHead>Stock In Date</TableHead>
              <TableHead>Supplier Name</TableHead>
              <TableHead>Number Of item</TableHead>
              <TableHead>Purchase Amount</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
  {paginatedData.records.map((item) => (
    <TableRow
      key={item.id}
      className="cursor-pointer hover:bg-gray-100"
      onClick={() => router.push(`/stockin/add-detail/${item.id}`)}    >
        <TableCell>{item.id}</TableCell>
      <TableCell>{item.supplierName}</TableCell>
      <TableCell>{item.referenceNumber}</TableCell>
      <TableCell>{new Date(item.stockInDate).toLocaleDateString()}</TableCell>
      <TableCell>{item.supplierName}</TableCell>
      <TableCell>{item.numberOfItems}</TableCell>
      <TableCell>{item.purchaseAmount}</TableCell>
    </TableRow>
  ))}
</TableBody>


        </Table>
      </div>
      {/* Pagination */}
      <TableViewPagination
        onPrevClick={handlePrevClick}
        onNextClick={handleNextClick}
        onPageClick={(i) => handlePageClick(i)}
        path="/stockin"
        data={paginatedData}
      />
    </div >
  );
}