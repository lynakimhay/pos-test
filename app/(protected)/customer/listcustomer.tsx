"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { CustomerModel } from "@/models/api/customerModel";
import PaginationData from "@/models/PaginationData";
import { TableViewPagination } from "@/components/tableview-pagination";

interface Props {
  title: string;
  data: PaginationData<CustomerModel>;
}

export const PageTableView: React.FC<Props> = ({ title, data }) => {
  const [paginatedData, setPaginatedData] = useState(data);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecords, setFilteredRecords] = useState(data.records);
  const router = useRouter();

  // Handle search filtering
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRecords(paginatedData.records);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredRecords(
        paginatedData.records.filter(
          (item) =>
            item.firstName.toLowerCase().includes(lowerCaseQuery) ||
            item.lastName.toLowerCase().includes(lowerCaseQuery) ||
            item.email.toLowerCase().includes(lowerCaseQuery) ||
            item.phone.toLowerCase().includes(lowerCaseQuery) ||
            item.address.toLowerCase().includes(lowerCaseQuery)
        )
      );
    }
  }, [searchQuery, paginatedData.records]);

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="flex justify-between items-center">
        <Input
          className="max-w-sm"
          placeholder="Search Customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <a href="/customer/create">
          <Button>Add Customer</Button>
        </a>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>FirstName</TableHead>
              <TableHead>LastName</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((item) => (
              <TableRow
                key={item.id}
                onClick={() => router.push(`/customer/info?id=${item.id}`)}
                style={{ cursor: "pointer" }}
                role="link"
                onMouseOver={(e) =>
                  (e.currentTarget.style.textDecoration = "underline")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                <TableCell>{item.firstName}</TableCell>
                <TableCell>{item.lastName}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.address}</TableCell>
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
        path="/customer"
        data={paginatedData}
      />
    </div>
  );
};
