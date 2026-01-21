
import React, { useMemo, useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { Download, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface ReportsProps {
  transactions: Transaction[];
}

export const Reports: React.FC<ReportsProps> = ({ transactions }) => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());

  const periodData = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      if (period === 'monthly') {
        return tDate.getMonth() === currentDate.getMonth() && tDate.getFullYear() === currentDate.getFullYear();
      }
      if (period === 'daily') {
        return tDate.toDateString() === currentDate.toDateString();
      }
      if (period === 'weekly') {
        const start = new Date(currentDate);
        start.setDate(currentDate.getDate() - currentDate.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return tDate >= start && tDate <= end;
      }
      return true;
    });
  }, [transactions, period, currentDate]);

  const summary = useMemo(() => {
    const income = periodData.filter(t => t.type === TransactionType.INCOME).reduce((a, b) => a + b.amount, 0);
    const expense = periodData.filter(t => t.type === TransactionType.EXPENSE).reduce((a, b) => a + b.amount, 0);
    return {
      income,
      expense,
      profit: income - expense,
      count: periodData.length
    };
  }, [periodData]);

  const changePeriod = (dir: number) => {
    const next = new Date(currentDate);
    if (period === 'monthly') next.setMonth(next.getMonth() + dir);
    else if (period === 'daily') next.setDate(next.getDate() + dir);
    else if (period === 'weekly') next.setDate(next.getDate() + (dir * 7));
    setCurrentDate(next);
  };

  const getPeriodLabel = () => {
    if (period === 'monthly') return currentDate.toLocaleString('pt-BR', { month: 'short', year: 'numeric' });
    if (period === 'daily') return currentDate.toLocaleDateString('pt-BR');
    return `Semana ${currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex bg-white p-1 rounded-xl border border-pink-100 shadow-sm overflow-x-auto no-scrollbar">
          {(['daily', 'weekly', 'monthly'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 min-w-[80px] px-3 py-2 rounded-lg text-xs font-bold transition-all ${period === p ? 'bg-pink-500 text-white shadow-md' : 'text-gray-500'}`}
            >
              {p === 'daily' ? 'DIA' : p === 'weekly' ? 'SEM' : 'MÊS'}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-pink-100 shadow-sm">
          <button onClick={() => changePeriod(-1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-pink-500" /></button>
          <span className="font-bold text-gray-700 text-sm capitalize px-2">{getPeriodLabel()}</span>
          <button onClick={() => changePeriod(1)} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-pink-500" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ReportSummaryCard 
          label="Entradas" 
          value={summary.income} 
          icon={<Download className="w-5 h-5 rotate-180" />} 
          color="text-emerald-500" 
          bg="bg-emerald-50"
        />
        <ReportSummaryCard 
          label="Saídas" 
          value={summary.expense} 
          icon={<Download className="w-5 h-5" />} 
          color="text-rose-500" 
          bg="bg-rose-50"
        />
        <div className={`p-6 rounded-2xl border border-pink-100 shadow-sm flex flex-col items-center justify-center text-center ${summary.profit >= 0 ? 'bg-pink-500 text-white' : 'bg-rose-500 text-white'}`}>
           <span className="opacity-80 text-[11px] font-bold uppercase tracking-wider mb-1">Lucro Líquido</span>
           <span className="text-2xl font-bold leading-none">R$ {summary.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-sm sm:text-base">Detalhamento</h3>
          <span className="text-[10px] text-gray-400 font-bold uppercase bg-gray-50 px-2 py-0.5 rounded-full">{summary.count} ITENS</span>
        </div>
        <div className="max-h-[350px] overflow-y-auto divide-y divide-gray-50">
          {periodData.length > 0 ? (
            periodData.map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 sm:p-5 hover:bg-pink-50/30 transition-all">
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                  <div className={`w-1 h-8 rounded-full shrink-0 ${t.type === TransactionType.INCOME ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 text-xs sm:text-sm truncate">{t.description}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-tight">{t.category} • {t.paymentMethod}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className={`font-bold text-sm ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[9px] text-gray-400 font-medium">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-gray-400 text-sm">Sem movimentações.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReportSummaryCard = ({ label, value, icon, color, bg }: any) => (
  <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm flex items-center gap-4">
    <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0">
      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">{label}</span>
      <span className={`text-lg font-bold leading-none block truncate ${color}`}>R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
    </div>
  </div>
);
