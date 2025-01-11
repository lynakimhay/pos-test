import React from "react";
import PageWrapper from "@/components/page-wrapper";
import { PageTableView } from "./page-tableview";
import { getPaginatedPurchase } from "@/services/purchaseServer";


const StockIn = async ({ searchParams }: { searchParams: Record<string, string> }) => {
  const page = parseInt(searchParams.page || "1");
  const data = await getPaginatedPurchase({ pageSize: 10, currentPage: page });

  return <PageWrapper>
    <PageTableView title="StockIn" data={data} />
  </PageWrapper>;
};

export default StockIn;
