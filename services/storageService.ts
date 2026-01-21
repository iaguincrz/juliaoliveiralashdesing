
import { Transaction, StockItem } from '../types';

const TRANSACTIONS_KEY = 'lashbalance_transactions';
const STOCK_KEY = 'lashbalance_stock';

export const storageService = {
  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveTransactions: (transactions: Transaction[]) => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  },
  getStock: (): StockItem[] => {
    const data = localStorage.getItem(STOCK_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveStock: (stock: StockItem[]) => {
    localStorage.setItem(STOCK_KEY, JSON.stringify(stock));
  }
};
