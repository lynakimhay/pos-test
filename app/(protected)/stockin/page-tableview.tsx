"use client";

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
import Link from "next/link";
interface Props {
  title: string;
  data: PaginationData<PurchaseModel>;
}

export const PageTableView: React.FC<Props> = ({ title, data }) => {
  const [paginatedData, setPaginatedData] = useState(data);

  const handlePrevClick = () => setPaginatedData((prev) => {
    return { ...prev, currentPage: data.prevPage };
  });

  const handleNextClick = () =>
    setPaginatedData((prev) => {
      return { ...prev, currentPage: data.nextPage };
    });

  const handlePageClick = (i: number) => setPaginatedData({ ...paginatedData, currentPage: i + 1 })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{title}</h1>

      <div className="flex justify-between items-center">
        <Input className="max-w-sm" placeholder="Search products..." />
        <Link href="/stockin/add-purchase">
        <Button>Add Product</Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>StockInDate</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Total-Items</TableHead>
              <TableHead>Amounts</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.records.map((item) => (
              <TableRow key={item.referenceNumber}>
                 <TableCell>{item.referenceNumber}</TableCell>
                <TableCell>{item.stockInDate.toLocaleDateString()}</TableCell>
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
    </div>
  );
}