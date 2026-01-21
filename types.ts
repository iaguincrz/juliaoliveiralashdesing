
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum Category {
  SERVICE = 'Serviço',
  PRODUCT_SALE = 'Venda de Produto',
  SUPPLIES = 'Insumos/Materiais',
  FIXED_COST = 'Custo Fixo (Aluguel/Luz)',
  MARKETING = 'Marketing/Cursos',
  VARIABLE_COST = 'Custo Variável',
  OTHER = 'Outros'
}

export enum PaymentMethod {
  PIX = 'Pix',
  CREDIT_CARD = 'Cartão de Crédito',
  DEBIT_CARD = 'Cartão de Débito',
  CASH = 'Dinheiro',
  TRANSFER = 'Transferência'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: Category;
  description: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  observations?: string;
  linkedStockId?: string;
  linkedStockQty?: number;
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  unitPrice: number;
  lastUpdated: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  margin: number;
}
