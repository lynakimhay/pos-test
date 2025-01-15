import React from "react";
import PageWrapper from "@/components/page-wrapper";
import { PageTableView } from "./listcustomer";
import { getPaginatedCustomers } from "@/services/customerServices";

interface PageProps {
  searchParams: { [key: string]: string | undefined };
}

const CustomerPage = async ({ searchParams }: PageProps ) => {
  const page = parseInt(searchParams.page || "1");
  const data = await getPaginatedCustomers({ pageSize: 10, currentPage: page });

  return <PageWrapper>
    <PageTableView title="Customers" data={data} />
  </PageWrapper>;
};

export default CustomerPage;

