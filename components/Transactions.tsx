
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, Category, PaymentMethod } from '../types';
import { CATEGORIES_INCOME, CATEGORIES_EXPENSE, PAYMENT_METHODS } from '../constants';
import { Button } from './ui/Button';
import { Plus, Search, Trash2, Edit3, X, ArrowUpCircle, ArrowDownCircle, Filter, Calendar } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
  onAdd: (t: Transaction) => void;
  onUpdate: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

export const Transactions: React.FC<TransactionsProps> = ({ transactions, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Partial<Transaction>>({
    type: TransactionType.INCOME,
    category: Category.SERVICE,
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: PaymentMethod.PIX,
    observations: ''
  });

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => filterType === 'ALL' || t.type === filterType)
      .filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, searchTerm]);

  const handleOpenModal = (t?: Transaction) => {
    if (t) {
      setFormData(t);
      setEditingId(t.id);
    } else {
      setFormData({
        type: TransactionType.INCOME,
        category: Category.SERVICE,
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: PaymentMethod.PIX,
        observations: ''
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      id: editingId || Math.random().toString(36).substr(2, 9),
    } as Transaction;

    if (editingId) {
      onUpdate(payload);
    } else {
      onAdd(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl shadow-sm border border-pink-50">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Pesquisar registros..."
              className="pl-11 pr-4 py-3 bg-pink-50/30 border border-pink-100 rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none w-full lg:w-72 text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="flex-1 px-4 py-3 bg-pink-50/30 border border-pink-100 rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none text-sm font-bold text-pink-600 appearance-none text-center"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <option value="ALL">TODOS</option>
              <option value={TransactionType.INCOME}>ENTRADAS</option>
              <option value={TransactionType.EXPENSE}>SAÍDAS</option>
            </select>
          </div>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full lg:w-auto py-4 rounded-2xl shadow-lg shadow-pink-100">
          <Plus className="w-5 h-5 mr-2" /> Novo Registro
        </Button>
      </div>

      {/* List / Cards for Mobile - Table for Desktop */}
      <div className="space-y-3 lg:hidden">
        {filteredTransactions.map(t => (
          <div key={t.id} className="bg-white p-4 rounded-3xl border border-pink-50 shadow-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-4 min-w-0">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${t.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                {t.type === TransactionType.INCOME ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate text-sm">{t.description}</p>
                <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(t.date).toLocaleDateString('pt-BR')}
                  <span className="mx-1.5">•</span>
                  {t.category}
                </div>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-1.5 shrink-0 ml-3">
              <span className={`font-black text-sm ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                {t.type === TransactionType.INCOME ? '+' : '-'} R$ {t.amount.toFixed(2)}
              </span>
              <div className="flex gap-1">
                <button onClick={() => handleOpenModal(t)} className="p-1.5 bg-gray-50 text-gray-400 rounded-lg"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => onDelete(t.id)} className="p-1.5 bg-rose-50 text-rose-400 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
        {filteredTransactions.length === 0 && (
          <div className="py-16 text-center text-gray-300 font-bold bg-white rounded-3xl border-2 border-dashed border-pink-50">
            Nenhum registro encontrado ✨
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-pink-50/50 text-pink-600 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="px-8 py-5">Data</th>
              <th className="px-8 py-5">Descrição</th>
              <th className="px-8 py-5">Categoria</th>
              <th className="px-8 py-5">Pagamento</th>
              <th className="px-8 py-5">Valor</th>
              <th className="px-8 py-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-50/50">
            {filteredTransactions.map(t => (
              <tr key={t.id} className="hover:bg-pink-50/20 transition-colors group">
                <td className="px-8 py-5 text-sm font-bold text-gray-400">
                  {new Date(t.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center">
                    {t.type === TransactionType.INCOME ? 
                      <ArrowUpCircle className="w-5 h-5 text-emerald-500 mr-3" /> : 
                      <ArrowDownCircle className="w-5 h-5 text-rose-500 mr-3" />
                    }
                    <span className="font-bold text-gray-800">{t.description}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest bg-gray-100 text-gray-500 uppercase">
                    {t.category}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm font-medium text-gray-500">{t.paymentMethod}</td>
                <td className={`px-8 py-5 font-black ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => handleOpenModal(t)} className="p-2 hover:bg-pink-50 text-pink-500 rounded-xl transition-all"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(t.id)} className="p-2 hover:bg-rose-50 text-rose-500 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-6 sm:p-8 border-b border-pink-50 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-800">{editingId ? 'Editar' : 'Novo'} Registro</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 bg-gray-50 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="flex bg-pink-50/50 p-1.5 rounded-2xl">
                <button 
                  type="button"
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.type === TransactionType.INCOME ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400'}`}
                  onClick={() => setFormData({...formData, type: TransactionType.INCOME, category: CATEGORIES_INCOME[0]})}
                >
                  Entrada
                </button>
                <button 
                  type="button"
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${formData.type === TransactionType.EXPENSE ? 'bg-white shadow-sm text-rose-600' : 'text-gray-400'}`}
                  onClick={() => setFormData({...formData, type: TransactionType.EXPENSE, category: CATEGORIES_EXPENSE[0]})}
                >
                  Saída
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Valor (R$)</label>
                  <input 
                    type="number" step="0.01" required
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none text-base font-bold text-gray-800"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Data</label>
                  <input 
                    type="date" required
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none text-base font-bold text-gray-800"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">O que foi feito?</label>
                <input 
                  type="text" required placeholder="Ex: Extensão Volume Russo"
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none text-base font-bold text-gray-800"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Categoria</label>
                  <select 
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-gray-800"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
                  >
                    {(formData.type === TransactionType.INCOME ? CATEGORIES_INCOME : CATEGORIES_EXPENSE).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Pagamento</label>
                  <select 
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-gray-800"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as PaymentMethod})}
                  >
                    {PAYMENT_METHODS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Notas extras</label>
                <textarea 
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none h-24 resize-none font-medium text-gray-600"
                  value={formData.observations}
                  onChange={(e) => setFormData({...formData, observations: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 transition-colors" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <Button variant="primary" type="submit" className="flex-1 py-4 rounded-2xl shadow-lg shadow-pink-100">Salvar Registro</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
