
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { Transaction, TransactionType } from '../types';
import { COLORS } from '../constants';
import { TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  stock: any[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, stock }) => {
  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);
    return {
      income,
      expenses,
      profit: income - expenses,
      lowStock: stock.filter(s => s.quantity <= s.minQuantity).length
    };
  }, [transactions, stock]);

  const barData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentYear = new Date().getFullYear();
    const data = months.map((m, idx) => {
      const filtered = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === idx && d.getFullYear() === currentYear;
      });
      return {
        name: m,
        Entradas: filtered.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0),
        Saídas: filtered.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0),
      };
    });
    const currentMonth = new Date().getMonth();
    return data.slice(Math.max(0, currentMonth - 5), currentMonth + 1);
  }, [transactions]);

  const pieData = useMemo(() => {
    const expenseCats = transactions.filter(t => t.type === TransactionType.EXPENSE);
    const groups = expenseCats.reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    const result = Object.keys(groups).map(name => ({ name, value: groups[name] }));
    return result.length > 0 ? result : [{ name: 'Sem gastos', value: 0 }];
  }, [transactions]);

  const PIE_COLORS = ['#fb7185', '#f472b6', '#c084fc', '#818cf8', '#60a5fa'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Mini Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <StatCard 
          title="Faturamento" 
          value={stats.income} 
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} 
          color="bg-emerald-50"
          positive
        />
        <StatCard 
          title="Despesas" 
          value={stats.expenses} 
          icon={<TrendingDown className="w-5 h-5 text-rose-500" />} 
          color="bg-rose-50"
          negative
        />
        <StatCard 
          title="Lucro" 
          value={stats.profit} 
          icon={<DollarSign className="w-5 h-5 text-pink-500" />} 
          color="bg-pink-50"
        />
        <StatCard 
          title="Avisos Estoque" 
          value={stats.lowStock} 
          isCurrency={false}
          icon={<Package className="w-5 h-5 text-orange-500" />} 
          color="bg-orange-50"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-pink-100/50 overflow-hidden">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-1.5 h-6 bg-pink-500 rounded-full mr-3" />
            Movimentação Mensal
          </h3>
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '11px', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} style={{ fontSize: '11px' }} />
                <Tooltip 
                  cursor={{ fill: '#FFF5F7' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                  formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }} />
                <Bar dataKey="Entradas" fill={COLORS.income} radius={[6, 6, 0, 0]} />
                <Bar dataKey="Saídas" fill={COLORS.expense} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-pink-100/50">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
             <div className="w-1.5 h-6 bg-pink-500 rounded-full mr-3" />
            Gastos por Tipo
          </h3>
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                />
                <Legend 
                  layout="horizontal" 
                  align="center" 
                  verticalAlign="bottom" 
                  wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-pink-100/50 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
             <div className="w-1.5 h-6 bg-pink-500 rounded-full mr-3" />
            Evolução de Ganhos
          </h3>
          <div className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={barData} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '11px', fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} style={{ fontSize: '11px' }} />
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                   formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="Entradas" 
                  stroke={COLORS.primary} 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: COLORS.primary, strokeWidth: 3, stroke: '#fff' }} 
                  activeDot={{ r: 8, strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, isCurrency = true, positive, negative }: any) => (
  <div className="p-4 sm:p-6 rounded-3xl border border-pink-100/50 shadow-sm bg-white hover:shadow-md transition-all flex flex-col justify-between">
    <div className={`w-10 h-10 rounded-2xl ${color} flex items-center justify-center mb-4 shrink-0 shadow-inner`}>
      {icon}
    </div>
    <div className="min-w-0">
      <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-[0.15em] block mb-1">{title}</span>
      <div className={`text-sm sm:text-2xl font-bold truncate ${positive ? 'text-emerald-600' : negative ? 'text-rose-600' : 'text-gray-800'}`}>
        {isCurrency ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : value}
      </div>
    </div>
  </div>
);
