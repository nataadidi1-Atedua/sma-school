
import React from 'react';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Plus, Search, Filter } from 'lucide-react';

const TRANSACTIONS = [
  { id: 'TX-001', student: 'Alice Thompson', category: 'Tuition Fee', amount: 1500, status: 'Paid', date: '2024-03-15' },
  { id: 'TX-002', student: '-', category: 'Science Lab Supplies', amount: -450, status: 'Completed', date: '2024-03-14' },
  { id: 'TX-003', student: 'Benjamin Carter', category: 'Bus Fee', amount: 120, status: 'Paid', date: '2024-03-12' },
  { id: 'TX-004', student: '-', category: 'Electricity Bill', amount: -820, status: 'Pending', date: '2024-03-10' },
  { id: 'TX-005', student: 'Chloe Miller', category: 'Exam Fee', amount: 200, status: 'Paid', date: '2024-03-08' },
];

const Finance: React.FC = () => {
  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Management</h1>
          <p className="text-slate-500">Track fee collections, salaries, and operational costs.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <Plus size={18} />
            Record Income
          </button>
          <button className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 transition-colors flex items-center gap-2">
            <Plus size={18} />
            Record Expense
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-xl shadow-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <Wallet size={24} className="opacity-80" />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">Net Balance</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">$124,500.80</h3>
          <p className="text-sm text-indigo-100">Across all operational accounts</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-emerald-600 mb-4">
            <ArrowUpCircle size={20} />
            <span className="text-sm font-bold uppercase">Total Income</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">$54,200</h3>
            <p className="text-xs text-slate-500 mt-1">This current month</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-rose-600 mb-4">
            <ArrowDownCircle size={20} />
            <span className="text-sm font-bold uppercase">Total Expenses</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">$21,840</h3>
            <p className="text-xs text-slate-500 mt-1">Operational & Payroll</p>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-bold text-slate-900 text-lg">Recent Transactions</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Find transactions..." 
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none w-48 focus:w-64 transition-all"
              />
            </div>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Entity / Student</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{tx.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{tx.student}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{tx.category}</td>
                  <td className={`px-6 py-4 text-sm font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      tx.status === 'Paid' || tx.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finance;
