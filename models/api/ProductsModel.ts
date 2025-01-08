import DataModel from "./model";

export interface UserModel extends DataModel {
  id: number;
  nameKh: string;
  nameEn: string;
  categoryId: string;
  sku: string;
  ImageUrl?: string;
}