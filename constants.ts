
import { Category, PaymentMethod } from './types';

export const COLORS = {
  primary: '#f472b6', // pink-400
  secondary: '#db2777', // pink-600
  accent: '#fdf2f8', // pink-50
  income: '#10b981', // emerald-500
  expense: '#f43f5e', // rose-500
  text: '#1f2937', // gray-800
};

export const INITIAL_STOCK_ITEMS = [
  { id: '1', name: 'Cola Lash Premium', quantity: 5, minQuantity: 2, unitPrice: 150, lastUpdated: new Date().toISOString() },
  { id: '2', name: 'Fios 0.07D Mix', quantity: 12, minQuantity: 5, unitPrice: 45, lastUpdated: new Date().toISOString() },
  { id: '3', name: 'Pads em Gel (Par)', quantity: 50, minQuantity: 20, unitPrice: 2, lastUpdated: new Date().toISOString() },
];

export const CATEGORIES_INCOME = [Category.SERVICE, Category.PRODUCT_SALE, Category.OTHER];
export const CATEGORIES_EXPENSE = [Category.SUPPLIES, Category.FIXED_COST, Category.MARKETING, Category.VARIABLE_COST, Category.OTHER];

export const PAYMENT_METHODS = [
  PaymentMethod.PIX,
  PaymentMethod.CREDIT_CARD,
  PaymentMethod.DEBIT_CARD,
  PaymentMethod.CASH,
  PaymentMethod.TRANSFER
];
