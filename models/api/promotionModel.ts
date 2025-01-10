import { Decimal } from "@prisma/client/runtime/library";
import DataModel from "./model";

export interface PromotionModel extends DataModel {
  promotionCode: string;
  description: string;
  startDate: string;
  endDate: string;
  discountPercentage: Decimal;
}