import {PageTableView} from "./product-table"
import PageWrapper from "@/components/page-wrapper";
import { getPaginatedProducts } from "@/services/productServices";

interface PageProps{
  searchParams: {[key: string]: string | undefined};
}
const ProductPage = async ({ searchParams }: PageProps) => {
  const page = parseInt(searchParams.page || "1");
  const data = await getPaginatedProducts({ pageSize: 10, currentPage: page });

  return <PageWrapper>
  <PageTableView title="Product " data={data} />
</PageWrapper>;
};

export default ProductPage;

