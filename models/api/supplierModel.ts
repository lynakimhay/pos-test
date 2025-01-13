// export interface SupplierModel {
//     supplierName: string;
//     contactName?: string;
//     contactEmail?: string;
//     contactPhone?: string;
//     addressLine1: string;
//     addressLine2: string;
//     province?: string;
//     websiteUrl: string;
//     taxIdentification?  : string;
//     createdAt: string;
//     updatedAt: string;
// }


import DataModel from "./model";

export interface SupplierModel extends DataModel {
  id: number;
  supplierName: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  addressLine1?: string;
  addressLine2?: string;
  province?: string;
  websiteUrl?: string;
  imageUrl?: string;
  taxIdentification?: string;
  createdAt: Date;
  updatedAt?: Date;
  StockIn: any;
}