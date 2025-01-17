import DataModel from "./model";

export interface productsModel extends DataModel {
  id: number;
  productCode:string;
  nameKh: string;
  nameEn: string;
  categoryNameEn: string;
  sku: string;
  ImageUrl?: string;
}