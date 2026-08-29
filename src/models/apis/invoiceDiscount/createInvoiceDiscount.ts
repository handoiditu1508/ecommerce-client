export type CreateInvoiceDiscountCommand = {
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  discountCode: string;
  discountValue: number;
  isPercentage: boolean;
  discountLimit?: number;
  requiredInvoiceValue?: number;
  usesLimit?: number;
  usesLimitsPerUser?: number;
};
