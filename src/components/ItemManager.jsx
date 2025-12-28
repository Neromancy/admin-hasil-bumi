import React, { useState } from "react";
import { Plus, Trash2, Package, AlertCircle } from "lucide-react";

export default function ItemManager({ items, onAdd, onDelete }) {
  const [newItem, setNewItem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    
    // Cek duplikat (case insensitive)
    if (items.some(i => i.toLowerCase() === newItem.trim().toLowerCase())) {
        alert("Barang ini sudah ada!");
        return;
    }

    onAdd(newItem.trim().toUpperCase());
    setNewItem("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 md:pb-0">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Package className="text-emerald-500" /> Tambah Jenis Barang Baru
        </h3>
        
        <form onSubmit={handleSubmit} className="flex gap-3">
            <input 
                type="text" 
                placeholder="Nama Barang (Misal: Cengkeh, Vanili)" 
                className="flex-1 rounded-xl border-slate-200 bg-white text-slate-900 p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none border shadow-sm"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
            />
            <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-emerald-200 shadow-md"
            >
                <Plus size={20} /> <span className="hidden sm:inline">Tambah</span>
            </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
            <h4 className="font-bold text-slate-700">Daftar Barang ({items.length})</h4>
        </div>
        
        {items.length === 0 ? (
            <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-3">
                <AlertCircle size={40} className="text-slate-200" />
                <p>Belum ada jenis barang. Silakan tambah di atas.</p>
            </div>
        ) : (
            <ul className="divide-y divide-slate-100">
                {items.map((item, index) => (
                    <li key={index} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                        <span className="font-medium text-slate-800">{item}</span>
                        <button 
                            onClick={() => {
                                if(confirm(`Hapus "${item}" dari daftar pilihan?`)) onDelete(item);
                            }}
                            className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </li>
                ))}
            </ul>
        )}
      </div>
    </div>
  );
}