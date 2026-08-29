import { PromotionStatus, PromotionType } from "@/models/entities/Promotion";

export type PromotionBaseFilter = {
  id?: number;
  name?: string;
  startDate?: Date;
  isStarted?: boolean;
  endDate?: Date;
  isEndDateNull?: boolean;
  isEnded?: boolean;
  statuses?: PromotionStatus[];
  types?: PromotionType[];
};
