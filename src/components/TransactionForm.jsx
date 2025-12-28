import React, { useState, useEffect } from "react";
import { generateId } from "../utils";
import { Save, ArrowDownLeft, ArrowUpRight, PlusCircle } from "lucide-react";

// Terima prop 'items' dan 'setActiveTab'
export default function TransactionForm({ onSave, items = [], setActiveTab }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "BELI", 
    item: "",
    qty: "", 
    price: "", 
  });

  // Set default item jika list items ada dan belum dipilih
  useEffect(() => {
    if (items.length > 0 && !formData.item) {
        setFormData(prev => ({ ...prev, item: items[0] }));
    }
  }, [items]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.item || !formData.qty || !formData.price) return;

    const total = parseFloat(formData.qty) * parseFloat(formData.price);
    const newTx = {
      id: generateId(),
      date: formData.date,
      type: formData.type,
      item: formData.item, // Tidak perlu toUpperCase karena sudah dari select
      qty: parseFloat(formData.qty),
      price: parseFloat(formData.price),
      total: total,
    };

    onSave(newTx);
    // Reset form tapi pertahankan tanggal dan item terakhir
    setFormData({ ...formData, qty: "", price: "" }); 
  };

  const isBuy = formData.type === "BELI";

  return (
    <div className="w-full max-w-lg mx-auto pb-24 md:pb-0">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Toggle Button Group */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex bg-slate-200 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFormData({...formData, type: "BELI"})}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                isBuy ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <ArrowDownLeft size={18} /> Masuk (Beli)
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, type: "JUAL"})}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                !isBuy ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <ArrowUpRight size={18} /> Keluar (Jual)
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tanggal</label>
            <input
              type="date"
              required
              className="w-full rounded-xl border-slate-200 bg-white text-slate-900 p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none border shadow-sm"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          {/* INPUT BARANG BERUBAH JADI SELECT */}
          <div>
            <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Barang</label>
                {/* Link pintas untuk tambah barang */}
                <button 
                    type="button"
                    onClick={() => setActiveTab("items")}
                    className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1"
                >
                    <PlusCircle size={12} /> Kelola Barang
                </button>
            </div>
            
            {items.length > 0 ? (
                <div className="relative">
                    <select
                        required
                        className="w-full rounded-xl border-slate-200 bg-white text-slate-900 p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none border shadow-sm appearance-none"
                        value={formData.item}
                        onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                    >
                        {items.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                    {/* Icon Panah Custom */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            ) : (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm text-center">
                    Belum ada data barang. <br/>
                    <button onClick={() => setActiveTab("items")} className="underline font-bold">Tambah dulu di sini</button>
                </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Berat</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0"
                  className="w-full rounded-xl border-slate-200 bg-white text-slate-900 p-3 pr-8 text-sm focus:ring-2 focus:ring-emerald-500 outline-none border shadow-sm placeholder:text-slate-400"
                  value={formData.qty}
                  onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                />
                <span className="absolute right-3 top-3 text-slate-400 text-xs font-bold">KG</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Harga / KG</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400 text-xs font-bold">Rp</span>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="0"
                  className="w-full rounded-xl border-slate-200 bg-white text-slate-900 p-3 pl-8 text-sm focus:ring-2 focus:ring-emerald-500 outline-none border shadow-sm placeholder:text-slate-400"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-1">Total Transaksi</p>
            <p className="text-xl font-bold text-slate-800">
                {formData.qty && formData.price 
                  ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(formData.qty * formData.price)
                  : "Rp 0"
                }
            </p>
          </div>

          <button
            type="submit"
            disabled={items.length === 0}
            className={`w-full flex justify-center items-center gap-2 py-3.5 px-6 rounded-xl text-white font-bold shadow-lg transform active:scale-95 transition-all ${
                items.length === 0 ? "bg-slate-300 cursor-not-allowed" :
                isBuy ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200" : "bg-orange-600 hover:bg-orange-700 shadow-orange-200"
            }`}
          >
            <Save size={20} />
            Simpan {isBuy ? 'Pembelian' : 'Penjualan'}
          </button>
        </div>
      </form>
    </div>
  );
}