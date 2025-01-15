import { Decimal } from "@prisma/client/runtime/library";
import DataModel from "./model";

export interface PromotionModel extends DataModel {
  id:number;
  promotionCode: string;
  description: string;
  startDate: string;
  endDate: string;
  discountPercentage: Decimal;
  imageUrl: string;

}