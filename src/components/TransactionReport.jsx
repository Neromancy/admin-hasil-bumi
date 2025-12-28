import React, { useState, useMemo } from "react";
import { formatRupiah } from "../utils";
import { Filter, Calendar, TrendingUp, TrendingDown, ArrowRight, Wallet } from "lucide-react";

// TERIMA PROP 'items' DI SINI
export default function TransactionReport({ transactions, items = [] }) {
  const [filterType, setFilterType] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedItem, setSelectedItem] = useState("SEMUA");

  // LOGIKA BARU: Gabungkan Master Items + History Items
  const uniqueItems = useMemo(() => {
    // 1. Ambil nama barang dari history transaksi (jaga-jaga barang lama yang dihapus master)
    const historyItems = transactions.map((t) => t.item);
    
    // 2. Gabungkan dengan items dari Master Data (props items)
    // Set akan otomatis menghapus duplikat
    const combined = new Set(["SEMUA", ...items, ...historyItems]);
    
    // 3. Urutkan abjad agar rapi
    return Array.from(combined).sort();
  }, [transactions, items]);

  const filteredData = useMemo(() => {
    return transactions.filter((t) => {
      if (selectedItem !== "SEMUA" && t.item !== selectedItem) return false;
      const txDate = new Date(t.date);
      const filterDate = new Date(selectedDate);

      if (filterType === "daily") return t.date === selectedDate;
      if (filterType === "monthly") return txDate.getMonth() === filterDate.getMonth() && txDate.getFullYear() === filterDate.getFullYear();
      if (filterType === "yearly") return txDate.getFullYear() === filterDate.getFullYear();
      return true;
    });
  }, [transactions, filterType, selectedDate, selectedItem]);

  const summary = filteredData.reduce(
    (acc, curr) => {
      if (curr.type === "BELI") {
        acc.totalBeli += curr.total;
        acc.qtyBeli += curr.qty;
      } else {
        acc.totalJual += curr.total;
        acc.qtyJual += curr.qty;
      }
      return acc;
    },
    { totalBeli: 0, totalJual: 0, qtyBeli: 0, qtyJual: 0 }
  );

  const profit = summary.totalJual - summary.totalBeli;

  return (
    <div className="space-y-4 md:space-y-6 pb-24 md:pb-0">
      
      {/* Filter Bar */}
      <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-3">
            {/* Toggle Periode */}
            <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
            {['daily', 'monthly', 'yearly'].map((type) => (
                <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex-1 px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all capitalize ${
                    filterType === type ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
                >
                {type === 'daily' ? 'Harian' : type === 'monthly' ? 'Bulanan' : 'Tahunan'}
                </button>
            ))}
            </div>

            {/* Filter Inputs */}
            <div className="grid grid-cols-2 gap-2 flex-1">
                <div className="relative">
                    <div className="absolute left-2.5 top-2.5 pointer-events-none text-slate-400">
                        <Filter size={14} />
                    </div>
                    <select
                        className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs md:text-sm focus:ring-1 focus:ring-emerald-500 outline-none appearance-none shadow-sm"
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                    >
                    {uniqueItems.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                </div>
                <div className="relative">
                    <div className="absolute left-2.5 top-2.5 pointer-events-none text-slate-400">
                        <Calendar size={14} />
                    </div>
                    <input
                        type={filterType === "daily" ? "date" : filterType === "monthly" ? "month" : "number"}
                        className="w-full pl-8 pr-2 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs md:text-sm focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm"
                        value={filterType === "yearly" ? new Date(selectedDate).getFullYear() : selectedDate.slice(0, filterType === 'monthly' ? 7 : 10)}
                        onChange={(e) => {
                            if(filterType === 'yearly') setSelectedDate(`${e.target.value}-01-01`);
                            else setSelectedDate(e.target.value);
                        }}
                    />
                </div>
            </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {/* Card Pembelian */}
        <div className="bg-blue-600 p-4 rounded-xl text-white shadow-lg shadow-blue-200/50 relative overflow-hidden">
          <div className="relative z-10">
            <p className="flex items-center gap-1 text-blue-100 text-xs font-medium mb-1"><TrendingDown size={14} /> Total Pembelian</p>
            <h3 className="text-xl md:text-2xl font-bold">{formatRupiah(summary.totalBeli)}</h3>
            <p className="mt-1 text-xs text-blue-100 opacity-90">{summary.qtyBeli.toLocaleString()} KG</p>
          </div>
        </div>

        {/* Card Penjualan */}
        <div className="bg-orange-600 p-4 rounded-xl text-white shadow-lg shadow-orange-200/50 relative overflow-hidden">
          <div className="relative z-10">
            <p className="flex items-center gap-1 text-orange-100 text-xs font-medium mb-1"><TrendingUp size={14} /> Total Penjualan</p>
            <h3 className="text-xl md:text-2xl font-bold">{formatRupiah(summary.totalJual)}</h3>
            <p className="mt-1 text-xs text-orange-100 opacity-90">{summary.qtyJual.toLocaleString()} KG</p>
          </div>
        </div>

        {/* Card Profit Net */}
        <div className={`p-4 rounded-xl text-white shadow-lg relative overflow-hidden ${
             profit >= 0 ? "bg-emerald-600 shadow-emerald-200/50" : "bg-rose-600 shadow-rose-200/50"
        }`}>
          <div className="relative z-10">
            <p className="flex items-center gap-1 text-white/80 text-xs font-medium mb-1"><Wallet size={14} /> {profit >= 0 ? 'Profit Bersih' : 'Defisit / Stok'}</p>
            <h3 className="text-xl md:text-2xl font-bold">{formatRupiah(profit)}</h3>
            <p className="mt-1 text-xs text-white/90">
                {profit >= 0 ? "Keuntungan Periode Ini" : "Pengeluaran Lebih Besar"}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col">
        <div className="md:hidden px-4 py-2 bg-slate-50 text-xs text-slate-400 flex items-center gap-1 border-b border-slate-100">
            <ArrowRight size={12} /> Geser tabel ke kiri untuk detail
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap md:whitespace-normal">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] md:text-sm uppercase tracking-wider">
              <tr>
                <th className="px-3 py-3 font-semibold">Tgl</th>
                <th className="px-3 py-3 font-semibold">Tipe</th>
                <th className="px-3 py-3 font-semibold">Barang</th>
                <th className="px-3 py-3 font-semibold text-right">KG</th>
                <th className="px-3 py-3 font-semibold text-right">Rp/KG</th>
                <th className="px-3 py-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs md:text-sm">
              {filteredData.length > 0 ? (
                filteredData.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3 text-slate-600">{t.date}</td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        t.type === "BELI" 
                          ? "bg-blue-50 text-blue-600 border-blue-100" 
                          : "bg-orange-50 text-orange-600 border-orange-100"
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-700">{t.item}</td>
                    <td className="px-3 py-3 text-right text-slate-600">{t.qty}</td>
                    <td className="px-3 py-3 text-right text-slate-600">{formatRupiah(t.price)}</td>
                    <td className="px-3 py-3 text-right font-bold text-slate-800">{formatRupiah(t.total)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 text-sm">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}