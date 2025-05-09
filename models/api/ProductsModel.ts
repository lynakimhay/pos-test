import DataModel from "./model";

export interface productsModel extends DataModel {
  id: number;
  productCode:string;
  nameKh: string;
  nameEn: string;
  // No need to change ProductModel Category
  category: string;
  sku: string;
  ImageUrl?: string;
}