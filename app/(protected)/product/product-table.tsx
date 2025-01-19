"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
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
import { productsModel } from "@/models/api/ProductsModel";
import PaginationData from "@/models/PaginationData";
import { TableViewPagination } from "@/components/tableview-pagination";
import Link from "next/link";

interface Props {
  title: string;
  data: PaginationData<productsModel>;
}

// Debounce Hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler); // Cleanup the timeout
  }, [value, delay]);

  return debouncedValue;
}

export const PageTableView: React.FC<Props> = ({ title, data }) => {
  const [paginatedData, setPaginatedData] = useState(data);
  const [searchQuery, setSearchQuery] = useState("");
  const searchQueryDebounced = useDebounce(searchQuery, 300); // Debounce search query
  const router = useRouter();

  const handlePrevClick = () =>
    setPaginatedData((prev) => {
      return { ...prev, currentPage: data.prevPage };
    });

  const handleNextClick = () =>
    setPaginatedData((prev) => {
      return { ...prev, currentPage: data.nextPage };
    });

  const handlePageClick = (i: number) =>
    setPaginatedData({ ...paginatedData, currentPage: i + 1 });

  const handleAddProductClick = () => {
    router.push("product/add-product"); // Replace with your actual "Add Product" page route
  };

  // Filter records based on the search query (case-insensitive)
  const filteredRecords = paginatedData.records.filter((item) =>
    item.nameEn.toLowerCase().includes(searchQueryDebounced.toLowerCase()) ||
    item.nameKh.toLowerCase().includes(searchQueryDebounced.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQueryDebounced.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQueryDebounced.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className=" text-3xl font-bold">{title}</h1>

      {/* Search bar and Add Product button */}
      <div className="flex justify-between items-center">
        <Input
          className="max-w-sm"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={handleAddProductClick}>Add Product</Button>
      </div>

      {/* Table with filtered data */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>English Name</TableHead>
              <TableHead>Khmer Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Link
                    href={`/product-info/${item.id}`}
                    className="block p-3 text-blue-700 text-sm font-bold"
                  >
                    View
                  </Link>
                </TableCell>
                <TableCell>{item.nameEn}</TableCell>
                <TableCell>{item.nameKh}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.ImageUrl}</TableCell>
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
        path="/product"
        data={paginatedData}
      />
    </div>
  );
};
