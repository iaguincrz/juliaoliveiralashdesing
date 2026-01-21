
import React, { useState } from 'react';
import { StockItem } from '../types';
import { Button } from './ui/Button';
import { Plus, AlertTriangle, Edit3, Trash2, X, Package, Search, Check } from 'lucide-react';

interface InventoryProps {
  stock: StockItem[];
  onAdd: (item: StockItem) => void;
  onUpdate: (item: StockItem) => void;
  onDelete: (id: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ stock, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<StockItem>>({
    name: '',
    quantity: 0,
    minQuantity: 5,
    unitPrice: 0
  });

  const filteredStock = stock.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: StockItem) => {
    if (item) {
      setFormData(item);
      setEditingId(item.id);
    } else {
      setFormData({ name: '', quantity: 0, minQuantity: 5, unitPrice: 0 });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      id: editingId || Math.random().toString(36).substr(2, 9),
      lastUpdated: new Date().toISOString()
    } as StockItem;

    if (editingId) {
      onUpdate(payload);
    } else {
      onAdd(payload);
    }
    setIsModalOpen(false);
  };

  const performDelete = (id: string) => {
    onDelete(id);
    setConfirmingDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Add */}
      <div className="flex flex-col gap-4 bg-white p-4 rounded-3xl shadow-sm border border-pink-50">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Pesquisar materiais..."
            className="pl-11 pr-4 py-4 bg-pink-50/30 border border-pink-100 rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none w-full text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full py-4 rounded-2xl shadow-lg shadow-pink-100 font-bold">
          <Plus className="w-5 h-5 mr-2" /> Novo Produto
        </Button>
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredStock.map(item => (
          <div key={item.id} className={`bg-white p-5 rounded-[2.5rem] border shadow-sm hover:shadow-xl transition-all relative overflow-hidden group ${item.quantity <= item.minQuantity ? 'border-orange-200 bg-orange-50/30' : 'border-pink-50'}`}>
            
            {/* Overlay de Confirmação de Exclusão */}
            {confirmingDeleteId === item.id && (
              <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                <Trash2 className="w-10 h-10 text-rose-500 mb-3" />
                <p className="font-bold text-gray-800 text-sm mb-4">Deseja realmente excluir este produto?</p>
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setConfirmingDeleteId(null)}
                    className="flex-1 py-3 bg-gray-100 text-gray-500 font-bold rounded-2xl text-xs uppercase tracking-widest"
                  >
                    Não
                  </button>
                  <button 
                    onClick={() => performDelete(item.id)}
                    className="flex-1 py-3 bg-rose-500 text-white font-bold rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-rose-100"
                  >
                    Sim, Excluir
                  </button>
                </div>
              </div>
            )}

            {item.quantity <= item.minQuantity && confirmingDeleteId !== item.id && (
              <div className="absolute top-0 right-0 p-3 bg-orange-100 text-orange-600 rounded-bl-[1.5rem] flex items-center gap-1.5 animate-pulse z-0 pointer-events-none">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Repor Urgente</span>
              </div>
            )}
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500 shadow-inner group-hover:scale-110 transition-transform">
                <Package className="w-7 h-7" />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenModal(item)} 
                  className="p-3 bg-gray-50 text-gray-400 hover:text-pink-500 rounded-xl transition-colors shadow-sm active:scale-90"
                  aria-label="Editar"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setConfirmingDeleteId(item.id)} 
                  className="p-3 bg-rose-50 text-rose-400 hover:bg-rose-100 rounded-xl transition-colors shadow-sm active:scale-90"
                  aria-label="Excluir"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-1 tracking-tight truncate">{item.name}</h3>
            
            <div className="mt-8 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Qtd. Disponível</span>
                <div className="flex items-baseline gap-1">
                   <span className={`text-4xl font-black leading-none ${item.quantity <= item.minQuantity ? 'text-orange-500' : 'text-gray-800'}`}>
                    {item.quantity}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase">UN</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Vlr. Un</span>
                <span className="text-2xl font-bold text-gray-700 leading-none">R$ {item.unitPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <span>Mínimo: {item.minQuantity}</span>
              <span className="text-pink-300">Atualizado: {new Date(item.lastUpdated).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}</span>
            </div>
          </div>
        ))}
        {filteredStock.length === 0 && (
          <div className="col-span-full py-24 text-center text-gray-300 font-bold bg-white rounded-[2.5rem] border-2 border-dashed border-pink-50">
            Nenhum item no estoque ✨
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-pink-50 flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-gray-800">{editingId ? 'Editar' : 'Novo'} Produto</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 bg-gray-50 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nome do Insumo</label>
                <input 
                  type="text" required placeholder="Ex: Cola HS-10 5ml"
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-gray-800"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Qtd. Atual</label>
                  <input 
                    type="number" required min="0"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-gray-800"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Mín. Alerta</label>
                  <input 
                    type="number" required min="1"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-gray-800"
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({...formData, minQuantity: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Custo Unitário (R$)</label>
                <input 
                  type="number" step="0.01" required
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-200 outline-none font-bold text-gray-800"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({...formData, unitPrice: parseFloat(e.target.value)})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" className="flex-1 py-4 font-bold text-gray-400" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <Button variant="primary" type="submit" className="flex-1 py-4 rounded-2xl shadow-lg shadow-pink-100">Salvar Item</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
