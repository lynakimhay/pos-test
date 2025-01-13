import{ productsModel } from "@/models/api/ProductsModel";
import PaginationData from "@/models/PaginationData";
import prisma from "@/lib/prisma";


export const getPaginatedProducts = async ({ pageSize = 10, currentPage = 1 }: { pageSize?: number, currentPage?: number }): Promise<PaginationData<productsModel>> => {
    const data = await prisma.product.findMany({
        skip: pageSize * (currentPage - 1),
        take: pageSize,
        orderBy: {
            id: 'asc',
        },
        include: {
            category: true, 
          },
    });

    const count = await prisma.product.count();
    const totalPages = Math.ceil(count / pageSize);

    const result: PaginationData<productsModel> = {
        pageSize,
        currentPage,
        prevPage: Math.max(currentPage - 1, 1),
        nextPage: Math.min(currentPage + 1, totalPages),
        totalItems: count,
        totalPages: totalPages,
        records: data.map(item => {
            return {
                id: item.id,
                nameKh: item.nameKh,
                nameEn: item.nameEn,
                category: item.category.nameEn,
                sku: item.sku,
                ImageUrl: item.imageUrl ?? null,

            } as productsModel;
        }),
    }
    return result;
}