export interface CartItem {
  id: string;
  name: string;
  salePrice: number;
  costPrice: number;
  stock: number;
  quantity: number;
}

export interface SalePayload {
  items: { itemId: string; quantity: number; price: number; costPrice: number }[];
  totalAmount: number;
  costTotal: number;
  paymentMode: 'cash' | 'digital' | 'debt';
  debtorName?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface RevenueData {
  grossRevenue: number;
  netProfit: number;
  totalSales: number;
}

export interface PopularItem {
  itemId: string;
  itemName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface DebtorSummary {
  debtorName: string;
  totalDebt: number;
  totalPaid: number;
  outstandingBalance: number;
  saleCount: number;
}
