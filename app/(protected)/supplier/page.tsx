
import React from "react";
import PageWrapper from "@/components/page-wrapper";
import { SupplierTable } from "./supplier-table";
import { getPaginatedSupplier } from "@/services/supplierServices";

const SupplierPage = async ({ searchParams }: { searchParams: Record< string, string> }) => {
  const page = parseInt(searchParams.page || "1", 10);

  try {
    // Fetch paginated supplier data
    const data = await getPaginatedSupplier({ pageSize: 10, currentPage: page });

    return (
      <PageWrapper>
        <SupplierTable title="Suppliers" data={data} />
      </PageWrapper>
    );
  } catch (error) {
    return (
      <PageWrapper>
        <p className="text-red-500">Failed to load supplier data.</p>
      </PageWrapper>
    );
  }
};

export default SupplierPage;