import React, { useState, useEffect, useMemo } from 'react';
import {
  getInventoryItems,
  saveInventoryItem,
  deleteInventoryItem,
  adjustStock,
  getInventoryTransactions,
  getWarehouses,
} from '../data/mockAssets';
import type {
  InventoryItem,
  InventoryTransaction,
  InventoryCategory,
  StockStatus,
} from '../types/assets';
import { AppIcon } from '../components/common/AppIcon';
import { useEnterprise } from '../context/EnterpriseContext';

const CATEGORIES: InventoryCategory[] = [
  'Automotive Parts',
  'Textiles & Garments',
  'Industrial Machinery',
  'Electronics & Tech',
  'Pharmaceuticals',
  'Chemicals & Liquids',
  'FMCG & Food',
];

export const InventoryManagementPage: React.FC = () => {
  const { branchLabel } = useEnterprise();
  const [activeTab, setActiveTab] = useState<'catalog' | 'movements' | 'low_stock'>('catalog');

  const [items, setItems] = useState<InventoryItem[]>(() => getInventoryItems());
  const [transactions, setTransactions] = useState<InventoryTransaction[]>(() => getInventoryTransactions());
  const [warehouses] = useState(() => getWarehouses());

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'quantity' | 'totalValueInr' | 'name' | 'id'>('totalValueInr');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 7;

  // Modal Dialog States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  // Stock Adjustment Modal
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(10);
  const [adjustType, setAdjustType] = useState<'stock_in' | 'stock_out'>('stock_in');
  const [adjustReference, setAdjustReference] = useState<string>('');
  const [adjustNotes, setAdjustNotes] = useState<string>('');

  // Form State for Add / Edit Item
  const [itemForm, setItemForm] = useState<Partial<InventoryItem>>({
    id: '',
    name: '',
    category: 'Automotive Parts',
    warehouseId: 'WH-DEL-01',
    warehouseName: 'Delhi Central Capital Hub',
    locationCode: 'Zone A / R-01 / B-01',
    quantity: 100,
    unitOfMeasure: 'Boxes',
    minThreshold: 25,
    unitCostInr: 1500,
    supplier: '',
    barcode: '',
  });

  useEffect(() => {
    const handleUpdate = () => {
      setItems(getInventoryItems());
      setTransactions(getInventoryTransactions());
    };
    window.addEventListener('freightline_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('freightline_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Inventory KPI Metrics
  const metrics = useMemo(() => {
    const totalSkus = items.length;
    const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);
    const lowStockCount = items.filter(i => i.status === 'low_stock').length;
    const outOfStockCount = items.filter(i => i.status === 'out_of_stock').length;
    const totalValuation = items.reduce((sum, i) => sum + i.totalValueInr, 0);
    return { totalSkus, totalUnits, lowStockCount, outOfStockCount, totalValuation };
  }, [items]);

  // Filtered & Sorted Catalog
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeTab === 'low_stock') {
        if (item.status !== 'low_stock' && item.status !== 'out_of_stock') return false;
      } else {
        if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      }

      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
      if (warehouseFilter !== 'all' && item.warehouseId !== warehouseFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchSku = item.id.toLowerCase().includes(q);
        const matchName = item.name.toLowerCase().includes(q);
        const matchSup = item.supplier.toLowerCase().includes(q);
        const matchWh = item.warehouseName.toLowerCase().includes(q);
        const matchLoc = item.locationCode.toLowerCase().includes(q);
        return matchSku || matchName || matchSup || matchWh || matchLoc;
      }
      return true;
    }).sort((a, b) => {
      let cmp = 0;
      if (sortField === 'quantity') cmp = a.quantity - b.quantity;
      else if (sortField === 'totalValueInr') cmp = a.totalValueInr - b.totalValueInr;
      else if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else cmp = a.id.localeCompare(b.id);
      return sortAsc ? cmp : -cmp;
    });
  }, [items, activeTab, statusFilter, categoryFilter, warehouseFilter, searchQuery, sortField, sortAsc]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;

  // Handlers for Add / Edit
  const handleOpenAdd = () => {
    setItemForm({
      id: `SKU-${Date.now().toString().slice(-4)}`,
      name: '',
      category: 'Automotive Parts',
      warehouseId: warehouses[0]?.id || 'WH-DEL-01',
      warehouseName: warehouses[0]?.name || 'Delhi Central Capital Hub',
      locationCode: 'Zone A / R-01 / B-01',
      quantity: 100,
      unitOfMeasure: 'Boxes',
      minThreshold: 25,
      unitCostInr: 1200,
      supplier: '',
      barcode: `FLX-SKU-${Date.now().toString().slice(-4)}`,
    });
    setEditingItem(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setItemForm({ ...item });
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleSaveItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.name || !itemForm.id) return;

    const qty = Number(itemForm.quantity) || 0;
    const min = Number(itemForm.minThreshold) || 20;
    const cost = Number(itemForm.unitCostInr) || 1000;

    let status: StockStatus = 'in_stock';
    if (qty === 0) status = 'out_of_stock';
    else if (qty <= min) status = 'low_stock';
    else if (qty > min * 5) status = 'overstocked';

    const selectedWh = warehouses.find(w => w.id === itemForm.warehouseId);

    const newItem: InventoryItem = {
      id: itemForm.id.toUpperCase(),
      name: itemForm.name,
      category: (itemForm.category as InventoryCategory) || 'Automotive Parts',
      warehouseId: itemForm.warehouseId || 'WH-DEL-01',
      warehouseName: selectedWh?.name || 'Delhi Central Capital Hub',
      locationCode: itemForm.locationCode || 'Zone A / R-01 / B-01',
      quantity: qty,
      unitOfMeasure: itemForm.unitOfMeasure || 'Boxes',
      minThreshold: min,
      unitCostInr: cost,
      totalValueInr: qty * cost,
      status,
      supplier: itemForm.supplier || 'National Trade Suppliers',
      lastRestocked: itemForm.lastRestocked || new Date().toISOString().split('T')[0],
      barcode: itemForm.barcode || `FLX-${itemForm.id}`,
    };

    saveInventoryItem(newItem);
    setShowAddModal(false);
  };

  const handleConfirmDelete = () => {
    if (deletingItemId) {
      deleteInventoryItem(deletingItemId);
      setDeletingItemId(null);
    }
  };

  // Quick Stock Adjustment Submit
  const handleStockAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;

    const delta = adjustType === 'stock_in' ? Math.abs(adjustDelta) : -Math.abs(adjustDelta);
    adjustStock(
      adjustingItem.id,
      delta,
      adjustType,
      adjustReference || (adjustType === 'stock_in' ? 'PO-MANUAL-RESTOCK' : 'SO-MANUAL-DISPATCH'),
      adjustNotes || 'Manual stock update from Inventory Console',
      'Inventory Operations Supervisor'
    );

    setAdjustingItem(null);
  };

  const getStockBadge = (status: StockStatus) => {
    switch (status) {
      case 'in_stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            In Stock
          </span>
        );
      case 'low_stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Low Stock Alert
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Out of Stock
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            Surplus / Overstocked
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-saas-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 tracking-tight">
              Inventory & Material Catalogue
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-navy-50 text-navy-800 border border-navy-200">
              <AppIcon name="inventory" size={13} />
              <span>SKU Ledger</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time SKU catalog, stock-level thresholds, bin allocations, and transaction audits for{' '}
            <strong className="text-slate-700 font-semibold">{branchLabel}</strong>.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-saas-sm transition-colors"
        >
          <AppIcon name="plus" size={14} />
          <span>Add SKU Item</span>
        </button>
      </div>

      {/* 2. Overview KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Total SKUs</div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-slate-900">{metrics.totalSkus}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Active catalog lines</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Units on Hand</div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-slate-900">{metrics.totalUnits.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Stored volume units</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Low Stock Watch</div>
          <div className={`text-2xl sm:text-3xl font-heading font-black ${metrics.lowStockCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {metrics.lowStockCount}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-0.5">Needs replenishment</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Out of Stock</div>
          <div className={`text-2xl sm:text-3xl font-heading font-black ${metrics.outOfStockCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {metrics.outOfStockCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Zero quantity items</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm col-span-2 sm:col-span-1">
          <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Total Valuation</div>
          <div className="text-2xl sm:text-3xl font-heading font-black text-emerald-600">
            ₹{(metrics.totalValuation / 100000).toFixed(2)}L
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Asset inventory value</div>
        </div>
      </div>

      {/* 3. Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        {[
          { key: 'catalog', label: 'Inventory Catalog', count: items.length, icon: 'box' as const },
          { key: 'low_stock', label: 'Low Stock Alerts', count: metrics.lowStockCount + metrics.outOfStockCount, icon: 'alert' as const },
          { key: 'movements', label: 'Stock Movements & Ledger', count: transactions.length, icon: 'file-text' as const },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as typeof activeTab);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                isActive
                  ? 'border-orange-500 text-orange-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <AppIcon name={tab.icon} size={14} />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[11px] ${
                isActive
                  ? 'bg-orange-100 text-orange-700'
                  : tab.key === 'low_stock' && (metrics.lowStockCount > 0 || metrics.outOfStockCount > 0)
                  ? 'bg-amber-100 text-amber-800 font-bold'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. TAB CONTENT: CATALOG OR LOW STOCK */}
      {(activeTab === 'catalog' || activeTab === 'low_stock') && (
        <div className="space-y-4">
          {/* Search & Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-saas-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <AppIcon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search SKU code, item name, supplier, warehouse location..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Warehouse Filter */}
              <select
                value={warehouseFilter}
                onChange={(e) => {
                  setWarehouseFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium"
              >
                <option value="all">All Warehouses</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.city} ({w.id})</option>
                ))}
              </select>

              {/* Status Filter (if in full catalog tab) */}
              {activeTab === 'catalog' && (
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium"
                >
                  <option value="all">All Stock Statuses</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="overstocked">Surplus</option>
                </select>
              )}
            </div>
          </div>

          {/* Inventory Data Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-saas-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th
                      onClick={() => {
                        setSortField('id');
                        setSortAsc(p => !p);
                      }}
                      className="py-3 px-4 cursor-pointer hover:text-slate-900 select-none"
                    >
                      SKU Code & Item Name
                    </th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Warehouse & Bin Location</th>
                    <th
                      onClick={() => {
                        setSortField('quantity');
                        setSortAsc(p => !p);
                      }}
                      className="py-3 px-4 cursor-pointer hover:text-slate-900 select-none"
                    >
                      Stock on Hand
                    </th>
                    <th className="py-3 px-4">Min Reorder</th>
                    <th
                      onClick={() => {
                        setSortField('totalValueInr');
                        setSortAsc(p => !p);
                      }}
                      className="py-3 px-4 cursor-pointer hover:text-slate-900 select-none"
                    >
                      Unit Cost / Valuation
                    </th>
                    <th className="py-3 px-4">Health Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {paginatedItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        No inventory SKUs match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setViewingItem(item)}
                            className="font-mono font-bold text-slate-900 hover:text-orange-600 block text-left"
                          >
                            {item.id}
                          </button>
                          <div className="font-medium text-slate-800 truncate max-w-xs mt-0.5">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Supplier: {item.supplier}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {item.category}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-800">{item.warehouseName}</div>
                          <div className="font-mono text-[10px] text-orange-600 font-semibold mt-0.5">
                            {item.locationCode}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 text-sm font-mono">
                            {item.quantity.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase">
                            {item.unitOfMeasure}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono text-slate-600">
                          {item.minThreshold} {item.unitOfMeasure}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-slate-900">
                            ₹{item.totalValueInr.toLocaleString()}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400">
                            @ ₹{item.unitCostInr.toLocaleString()} / {item.unitOfMeasure}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {getStockBadge(item.status)}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setAdjustingItem(item);
                                setAdjustDelta(10);
                                setAdjustType('stock_in');
                                setAdjustReference('RESTOCK-PO-01');
                                setAdjustNotes('');
                              }}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px] transition-colors"
                              title="Adjust stock in / out"
                            >
                              Adjust
                            </button>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1 text-slate-400 hover:text-orange-600 rounded"
                              title="Edit SKU"
                            >
                              <AppIcon name="edit" size={14} />
                            </button>
                            <button
                              onClick={() => setDeletingItemId(item.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              title="Delete SKU"
                            >
                              <AppIcon name="trash" size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing <strong className="text-slate-700">{paginatedItems.length}</strong> of{' '}
                <strong className="text-slate-700">{filteredItems.length}</strong> catalog items
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-600 disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="font-mono text-xs">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-600 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: STOCK MOVEMENTS AUDIT TRAIL */}
      {activeTab === 'movements' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-saas-sm overflow-hidden space-y-3 p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                Stock Movements & Electronic Ledger
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete transactional history of inbound receipts, dispatches, and warehouse transfers
              </p>
            </div>
            <span className="font-mono text-xs text-slate-400">
              {transactions.length} Transactions Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Transaction ID</th>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">SKU & Item Name</th>
                  <th className="py-2.5 px-3">Quantity</th>
                  <th className="py-2.5 px-3">Reference / Manifest</th>
                  <th className="py-2.5 px-3">Authorized By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{tx.id}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{tx.timestamp}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tx.type === 'stock_in'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : tx.type === 'stock_out'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <AppIcon name={tx.type === 'stock_in' ? 'arrow-down' : 'arrow-up'} size={11} />
                        <span>{tx.type.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono font-bold text-slate-800">{tx.sku}</span>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{tx.itemName}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">{tx.reference}</td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">{tx.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. MODAL: ADD / EDIT SKU ITEM */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-saas-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-heading font-bold text-base text-slate-900">
                {editingItem ? 'Edit SKU Item' : 'Register New Inventory SKU'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <AppIcon name="x" size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveItemSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={itemForm.id}
                    onChange={(e) => setItemForm(p => ({ ...p, id: e.target.value }))}
                    placeholder="e.g. SKU-AUTO-901"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono uppercase text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm(p => ({ ...p, category: e.target.value as InventoryCategory }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item Title / Description *</label>
                <input
                  type="text"
                  required
                  value={itemForm.name}
                  onChange={(e) => setItemForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Heavy Duty Alternator Motors (24V)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Allocated Warehouse</label>
                  <select
                    value={itemForm.warehouseId}
                    onChange={(e) => setItemForm(p => ({ ...p, warehouseId: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.city})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Storage Bin / Rack Location</label>
                  <input
                    type="text"
                    value={itemForm.locationCode}
                    onChange={(e) => setItemForm(p => ({ ...p, locationCode: e.target.value }))}
                    placeholder="Zone A / R-01 / B-04"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Quantity *</label>
                  <input
                    type="number"
                    required
                    value={itemForm.quantity}
                    onChange={(e) => setItemForm(p => ({ ...p, quantity: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit of Measure</label>
                  <select
                    value={itemForm.unitOfMeasure}
                    onChange={(e) => setItemForm(p => ({ ...p, unitOfMeasure: e.target.value as InventoryItem['unitOfMeasure'] }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Boxes">Boxes</option>
                    <option value="Units">Units</option>
                    <option value="Pallets">Pallets</option>
                    <option value="Kg">Kg</option>
                    <option value="Litres">Litres</option>
                    <option value="Rolls">Rolls</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reorder Point</label>
                  <input
                    type="number"
                    value={itemForm.minThreshold}
                    onChange={(e) => setItemForm(p => ({ ...p, minThreshold: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Valuation Cost (₹)</label>
                  <input
                    type="number"
                    value={itemForm.unitCostInr}
                    onChange={(e) => setItemForm(p => ({ ...p, unitCostInr: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Supplier / Manufacturer</label>
                  <input
                    type="text"
                    value={itemForm.supplier}
                    onChange={(e) => setItemForm(p => ({ ...p, supplier: e.target.value }))}
                    placeholder="Supplier name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-saas-sm"
                >
                  {editingItem ? 'Update SKU' : 'Save SKU Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: QUICK STOCK ADJUSTMENT */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-saas-lg max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-xs text-orange-600 font-bold">{adjustingItem.id}</span>
                <h4 className="font-heading font-bold text-sm text-slate-900">Adjust Inventory Stock</h4>
              </div>
              <button onClick={() => setAdjustingItem(null)} className="text-slate-400 hover:text-slate-600">
                <AppIcon name="x" size={16} />
              </button>
            </div>

            <form onSubmit={handleStockAdjustSubmit} className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500">Current Stock:</span>
                <strong className="text-slate-900 font-mono ml-1.5">{adjustingItem.quantity} {adjustingItem.unitOfMeasure}</strong>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operation Type</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setAdjustType('stock_in')}
                    className={`py-1.5 rounded-md font-semibold ${adjustType === 'stock_in' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'}`}
                  >
                    + Stock In (Receipt)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('stock_out')}
                    className={`py-1.5 rounded-md font-semibold ${adjustType === 'stock_out' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600'}`}
                  >
                    - Stock Out (Issue)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantity ({adjustingItem.unitOfMeasure})</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustDelta}
                  onChange={(e) => setAdjustDelta(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reference Document / Consignment</label>
                <input
                  type="text"
                  required
                  value={adjustReference}
                  onChange={(e) => setAdjustReference(e.target.value)}
                  placeholder="e.g. PO-2026-9912 or FLX-8829"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Notes</label>
                <input
                  type="text"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  placeholder="Restock batch, customer shipment, etc."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-saas-sm"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL: VIEW SKU DETAILS */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-saas-lg max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-xs text-orange-600 font-bold">{viewingItem.id}</span>
                <h3 className="font-heading font-black text-base text-slate-900">{viewingItem.name}</h3>
              </div>
              <button onClick={() => setViewingItem(null)} className="text-slate-400 hover:text-slate-600">
                <AppIcon name="x" size={16} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="font-semibold text-slate-800">{viewingItem.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Warehouse:</span>
                <span className="font-medium text-slate-800">{viewingItem.warehouseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bin Location:</span>
                <span className="font-mono font-bold text-orange-600">{viewingItem.locationCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Quantity in Stock:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{viewingItem.quantity} {viewingItem.unitOfMeasure}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Unit Cost:</span>
                <span className="font-mono text-slate-800">₹{viewingItem.unitCostInr.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Asset Value:</span>
                <span className="font-mono font-bold text-emerald-600">₹{viewingItem.totalValueInr.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Supplier:</span>
                <span className="text-slate-800">{viewingItem.supplier}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL: DELETE CONFIRMATION */}
      {deletingItemId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-saas-lg max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AppIcon name="alert" size={20} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-slate-900">Delete SKU Item?</h4>
                <p className="text-xs text-slate-500 mt-0.5">This action will remove the SKU from the catalogue.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingItemId(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
