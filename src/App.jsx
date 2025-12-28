import React, { useState } from 'react';
import { LayoutDashboard, ShoppingCart, FileText, PlusCircle, TrendingUp } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([
    { id: 1, tanggal: '2023-10-25', barang: 'Kapulaga', tipe: 'Masuk', berat: 50, total: 2500000 },
    { id: 2, tanggal: '2023-10-26', barang: 'Cengkeh', tipe: 'Keluar', berat: 20, total: 3000000 },
  ]);

  const [formData, setFormData] = useState({ barang: 'Kapulaga', tipe: 'Masuk', berat: '', harga: '' });

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const newTrans = {
      id: Date.now(),
      tanggal: new Date().toISOString().split('T')[0],
      barang: formData.barang,
      tipe: formData.tipe,
      berat: Number(formData.berat),
      total: formData.berat * formData.harga
    };
    setTransactions([newTrans, ...transactions]);
    alert("Transaksi Berhasil Dicatat!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-green-800 text-white p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-10 flex items-center gap-2">
          <TrendingUp /> BumiAdmin
        </h1>
        <nav className="space-y-4">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-green-700' : 'hover:bg-green-700'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('transaksi')} className={`w-full flex items-center gap-3 p-3 rounded-lg ${activeTab === 'transaksi' ? 'bg-green-700' : 'hover:bg-green-700'}`}>
            <PlusCircle size={20} /> Input Transaksi
          </button>
          <button onClick={() => setActiveTab('laporan')} className={`w-full flex items-center gap-3 p-3 rounded-lg ${activeTab === 'laporan' ? 'bg-green-700' : 'hover:bg-green-700'}`}>
            <FileText size={20} /> Laporan Harian
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Utama</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <p className="text-gray-500 uppercase text-xs font-bold">Stok Kapulaga</p>
                <p className="text-2xl font-bold">1,240 Kg</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                <p className="text-gray-500 uppercase text-xs font-bold">Stok Cengkeh</p>
                <p className="text-2xl font-bold">850 Kg</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                <p className="text-gray-500 uppercase text-xs font-bold">Total Transaksi Hari Ini</p>
                <p className="text-2xl font-bold">Rp 12.500.000</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transaksi' && (
          <div className="max-w-2xl bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6">Input Transaksi Baru</h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Komoditas</label>
                <select className="w-full p-2 border rounded-md" value={formData.barang} onChange={(e) => setFormData({...formData, barang: e.target.value})}>
                  <option>Kapulaga</option>
                  <option>Cengkeh</option>
                  <option>Lada</option>
                  <option>Kayu Manis</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipe Transaksi</label>
                <div className="flex gap-4 mt-1">
                  <label><input type="radio" name="tipe" checked={formData.tipe === 'Masuk'} onChange={() => setFormData({...formData, tipe: 'Masuk'})} /> Masuk (Beli)</label>
                  <label><input type="radio" name="tipe" checked={formData.tipe === 'Keluar'} onChange={() => setFormData({...formData, tipe: 'Keluar'})} /> Keluar (Jual)</label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Berat (Kg)</label>
                  <input type="number" className="w-full p-2 border rounded-md" value={formData.berat} onChange={(e) => setFormData({...formData, berat: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Harga per Kg (Rp)</label>
                  <input type="number" className="w-full p-2 border rounded-md" value={formData.harga} onChange={(e) => setFormData({...formData, harga: e.target.value})} required />
                </div>
              </div>
              <button type="submit" className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition">Simpan Transaksi</button>
            </form>
          </div>
        )}

        {activeTab === 'laporan' && (
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Laporan Transaksi</h2>
              <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
                <FileText size={18} /> Cetak PDF
              </button>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 italic">
                  <th className="p-3 border-b">Tanggal</th>
                  <th className="p-3 border-b">Barang</th>
                  <th className="p-3 border-b">Tipe</th>
                  <th className="p-3 border-b">Berat (Kg)</th>
                  <th className="p-3 border-b">Total Harga</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{t.tanggal}</td>
                    <td className="p-3 border-b font-semibold">{t.barang}</td>
                    <td className="p-3 border-b">
                      <span className={`px-2 py-1 rounded text-xs ${t.tipe === 'Masuk' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {t.tipe}
                      </span>
                    </td>
                    <td className="p-3 border-b">{t.berat} Kg</td>
                    <td className="p-3 border-b">Rp {t.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;