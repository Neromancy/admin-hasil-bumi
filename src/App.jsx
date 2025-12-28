// src/App.jsx
import React, { useState, useEffect } from "react";
import { LayoutDashboard, ArrowRightLeft, FileBarChart, Trash2, Menu, X, Sprout, Database, Package } from "lucide-react";
import DashboardStats from "./components/DashboardStats";
import TransactionForm from "./components/TransactionForm";
import TransactionReport from "./components/TransactionReport";
import ItemManager from "./components/ItemManager"; 
import { generateId } from "./utils";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [transactions, setTransactions] = useState([]);
  const [items, setItems] = useState(["CENGKEH", "KAPULAGA", "LADA", "KOPI"]); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load Transactions dari LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem("hasilBumiData");
    if (savedData) {
      setTransactions(JSON.parse(savedData));
    }
  }, []);

  // Load Items dari LocalStorage
  useEffect(() => {
    const savedItems = localStorage.getItem("hasilBumiItems");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // Simpan Transactions ke LocalStorage
  useEffect(() => {
    localStorage.setItem("hasilBumiData", JSON.stringify(transactions));
  }, [transactions]);

  // Simpan Items ke LocalStorage
  useEffect(() => {
    localStorage.setItem("hasilBumiItems", JSON.stringify(items));
  }, [items]);

  const addTransaction = (newTx) => {
    setTransactions([...transactions, newTx]);
    alert("Transaksi berhasil disimpan!");
    setActiveTab("dashboard");
  };

  const addItem = (newItem) => {
    setItems([...items, newItem]);
    alert(`Barang "${newItem}" berhasil ditambahkan.`);
  };

  const deleteItem = (itemToDelete) => {
    setItems(items.filter(i => i !== itemToDelete));
  };

  const clearData = () => {
    if (confirm("Hapus SEMUA data transaksi? Data Barang tidak akan dihapus.")) {
      setTransactions([]);
      localStorage.removeItem("hasilBumiData");
    }
  };

  // Fitur Load Dummy Data
  const loadDummyData = () => {
    if (transactions.length > 0) {
      if (!confirm("Data sudah ada. Tambahkan data dummy?")) return;
    }

    const today = new Date();
    const formatDate = (date) => date.toISOString().split("T")[0];
    const daysAgo = (days) => {
      const d = new Date();
      d.setDate(today.getDate() - days);
      return formatDate(d);
    };

    // Pastikan item dummy masuk ke daftar items agar dropdown tidak error
    const dummyItemsNames = ["CENGKEH KERING", "CENGKEH BASAH", "KAPULAGA LOKAL", "LADA HITAM", "LADA PUTIH"];
    const mergedItems = [...new Set([...items, ...dummyItemsNames])];
    setItems(mergedItems);

    const dummyData = [
      { id: generateId(), date: daysAgo(10), type: "BELI", item: "CENGKEH KERING", qty: 100, price: 115000, total: 11500000 },
      { id: generateId(), date: daysAgo(8), type: "BELI", item: "CENGKEH KERING", qty: 50, price: 112000, total: 5600000 },
      { id: generateId(), date: daysAgo(2), type: "JUAL", item: "CENGKEH KERING", qty: 80, price: 135000, total: 10800000 },
      { id: generateId(), date: daysAgo(15), type: "BELI", item: "KAPULAGA LOKAL", qty: 200, price: 65000, total: 13000000 },
      { id: generateId(), date: daysAgo(12), type: "JUAL", item: "KAPULAGA LOKAL", qty: 150, price: 78000, total: 11700000 },
      { id: generateId(), date: daysAgo(5), type: "BELI", item: "KAPULAGA LOKAL", qty: 100, price: 68000, total: 6800000 },
      { id: generateId(), date: daysAgo(20), type: "BELI", item: "LADA HITAM", qty: 500, price: 55000, total: 27500000 },
      { id: generateId(), date: daysAgo(18), type: "BELI", item: "LADA PUTIH", qty: 100, price: 90000, total: 9000000 },
      { id: generateId(), date: daysAgo(3), type: "JUAL", item: "LADA HITAM", qty: 200, price: 62000, total: 12400000 },
      { id: generateId(), date: daysAgo(0), type: "BELI", item: "CENGKEH BASAH", qty: 300, price: 35000, total: 10500000 },
    ];

    setTransactions([...transactions, ...dummyData]);
    alert("Data Dummy Berhasil Dimuat");
    setActiveTab("dashboard");
    setIsMobileMenuOpen(false);
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${
        activeTab === id
          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <Icon size={20} /> {label}
    </button>
  );

  return (
    <div className="h-[100dvh] w-full bg-slate-50 flex font-sans overflow-hidden">
      
      {/* Mobile Menu Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white z-50 px-4 flex items-center justify-between border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500 rounded-lg">
                <Sprout size={20} className="text-white" />
            </div>
            {/* GANTI NAMA DI SINI (MOBILE) */}
            <span className="font-bold text-lg text-slate-800">Admin</span>
        </div>
        <button 
            className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 active:scale-95 transition-transform"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out shadow-2xl
        md:relative md:translate-x-0 md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        pt-16 md:pt-0 
      `}>
        <div className="hidden md:flex p-8 items-center gap-3 border-b border-slate-800">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <Sprout size={24} className="text-white" />
          </div>
          {/* GANTI NAMA DI SINI (DESKTOP) */}
          <h1 className="font-bold text-2xl tracking-tight text-white">
            Admin
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-3">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="transaksi" icon={ArrowRightLeft} label="Input Transaksi" />
          <NavItem id="items" icon={Package} label="Kelola Barang" />
          <NavItem id="laporan" icon={FileBarChart} label="Laporan & Data" />
        </div>

        <div className="p-6 border-t border-slate-800 space-y-3">
          <button 
            onClick={loadDummyData} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 rounded-xl text-sm font-medium transition-colors"
          >
            <Database size={18} /> Load Dummy
          </button>
          <button 
            onClick={clearData} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-xl text-sm font-medium transition-colors"
          >
            <Trash2 size={18} /> Reset Tx
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50">
        <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-4 justify-between items-center sticky top-0 z-20">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {activeTab === 'dashboard' && 'Ringkasan Usaha'}
              {activeTab === 'transaksi' && 'Transaksi Baru'}
              {activeTab === 'items' && 'Master Data Barang'}
              {activeTab === 'laporan' && 'Laporan Keuangan'}
            </h2>
            <p className="text-slate-500 text-sm">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-3 md:p-8 pt-20 md:pt-8 scroll-smooth pb-32 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === "dashboard" && <DashboardStats transactions={transactions} />}
            
            {/* Mengirim props items ke Form agar bisa dropdown */}
            {activeTab === "transaksi" && <TransactionForm onSave={addTransaction} items={items} setActiveTab={setActiveTab} />}
            
            {activeTab === "items" && <ItemManager items={items} onAdd={addItem} onDelete={deleteItem} />}
            
            {activeTab === "laporan" && <TransactionReport transactions={transactions} items={items}/>}
          </div>
        </div>
      </main>

      {/* Overlay Mobile */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" 
            onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;