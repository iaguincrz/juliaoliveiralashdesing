
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Inventory } from './components/Inventory';
import { Reports } from './components/Reports';
import { Transaction, StockItem, TransactionType } from './types';
import { storageService } from './services/storageService';
import { INITIAL_STOCK_ITEMS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);

  // Carrega dados iniciais
  useEffect(() => {
    const savedTransactions = storageService.getTransactions();
    const savedStock = storageService.getStock();
    
    setTransactions(savedTransactions);
    setStock(savedStock.length > 0 ? savedStock : INITIAL_STOCK_ITEMS);
  }, []);

  // Salva dados sempre que houver mudanças
  useEffect(() => {
    storageService.saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    storageService.saveStock(stock);
  }, [stock]);

  const handleAddTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
  };

  const handleUpdateTransaction = (updated: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAddStock = (item: StockItem) => {
    setStock(prev => [item, ...prev]);
  };

  const handleUpdateStock = (updated: StockItem) => {
    setStock(prev => prev.map(item => item.id === updated.id ? updated : item));
  };

  const handleDeleteStock = (id: string) => {
    setStock(prev => prev.filter(item => item.id !== id));
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="max-w-7xl mx-auto">
        {activeTab === 'dashboard' && <Dashboard transactions={transactions} stock={stock} />}
        {activeTab === 'transactions' && (
          <Transactions 
            transactions={transactions} 
            onAdd={handleAddTransaction} 
            onUpdate={handleUpdateTransaction} 
            onDelete={handleDeleteTransaction} 
          />
        )}
        {activeTab === 'inventory' && (
          <Inventory 
            stock={stock} 
            onAdd={handleAddStock} 
            onUpdate={handleUpdateStock} 
            onDelete={handleDeleteStock} 
          />
        )}
        {activeTab === 'reports' && <Reports transactions={transactions} />}
      </div>
    </Layout>
  );
};

export default App;
