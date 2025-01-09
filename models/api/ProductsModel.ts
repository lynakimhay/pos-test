import DataModel from "./model";

export interface productsModel extends DataModel {
  id: number;
  nameKh: string;
  nameEn: string;
  category: string;
  sku: string;
  ImageUrl?: string;
}

