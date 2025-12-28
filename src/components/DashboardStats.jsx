import React, { useMemo } from "react";
import { TrendingUp, TrendingDown, Package, Activity, ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { formatRupiah } from "../utils";

export default function DashboardStats({ transactions }) {
  const stockSummary = useMemo(() => {
    const stocks = {};
    transactions.forEach((t) => {
      if (!stocks[t.item]) stocks[t.item] = 0;
      if (t.type === "BELI") stocks[t.item] += t.qty;
      else stocks[t.item] -= t.qty;
    });
    return stocks;
  }, [transactions]);

  // Hitung Cashflow & Profit
  const cashflow = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if(t.type === 'JUAL') income += t.total;
      else expense += t.total;
    });
    return { 
      income, 
      expense,
      profit: income - expense 
    };
  }, [transactions]);

  const recentTransactions = [...transactions].reverse().slice(0, 5);

  const StatCard = ({ title, value, subValue, icon: Icon, color, bgColor }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between relative overflow-hidden">
      <div className="relative z-10">
        <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wider mb-1">{title}</p>
        <h3 className={`text-xl md:text-2xl font-bold ${color}`}>{value}</h3>
        {subValue && <p className="text-xs mt-2 font-medium text-slate-400">{subValue}</p>}
      </div>
      <div className={`p-3 rounded-xl ${bgColor}`}>
        <Icon className={color} size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Profit Card (Dinamis Hijau/Merah) */}
        <div className={`p-5 rounded-2xl shadow-sm border flex flex-col justify-between relative overflow-hidden ${
            cashflow.profit >= 0 
            ? "bg-emerald-600 border-emerald-500 text-white" 
            : "bg-rose-600 border-rose-500 text-white"
        }`}>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                    <Wallet size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Profit Bersih</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">{formatRupiah(cashflow.profit)}</h3>
                <p className="text-xs mt-2 opacity-80">
                    {cashflow.profit >= 0 ? "Keuntungan saat ini" : "Defisit (Belanja Stok)"}
                </p>
            </div>
            {/* Background Icon Decoration */}
            <Wallet className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10" />
        </div>

        <StatCard 
          title="Pemasukan (Jual)" 
          value={formatRupiah(cashflow.income)} 
          icon={TrendingUp} 
          color="text-blue-600" 
          bgColor="bg-blue-50"
        />
        <StatCard 
          title="Pengeluaran (Beli)" 
          value={formatRupiah(cashflow.expense)} 
          icon={TrendingDown} 
          color="text-orange-600" 
          bgColor="bg-orange-50"
        />
         <StatCard 
          title="Total Transaksi" 
          value={transactions.length + " Tx"} 
          icon={Activity} 
          color="text-slate-600" 
          bgColor="bg-slate-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Stock Inventory */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2">
            <Package size={20} className="text-emerald-500" /> Stok Gudang
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {Object.entries(stockSummary).map(([item, qty]) => (
              <div key={item} className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-semibold text-slate-700 text-sm md:text-base">{item}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs md:text-sm font-bold ${
                  qty <= 0 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
                }`}>
                  {qty.toLocaleString()} KG
                </span>
              </div>
            ))}
            {Object.keys(stockSummary).length === 0 && (
              <p className="text-slate-400 text-sm col-span-2 text-center py-8">Belum ada data stok.</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 md:p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 md:mb-6">Baru Ditambahkan</h3>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Belum ada transaksi.</p>
            ) : (
              recentTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      t.type === 'BELI' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {t.type === 'BELI' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-700 text-xs md:text-sm">{t.item}</p>
                      <p className="text-[10px] md:text-xs text-slate-400">{t.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs md:text-sm font-bold ${
                      t.type === 'BELI' ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {t.type === 'BELI' ? '+' : '-'} {t.qty} KG
                    </p>
                    <p className="text-[10px] md:text-xs text-slate-400">{formatRupiah(t.total)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}