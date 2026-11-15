import React, { useState } from 'react';
import { useCustomerAuth } from '../../context/useCustomerAuth';
import {
  getAddressesByCustomerId,
  saveAddress,
  deleteAddress,
  setDefaultSenderAddress,
} from '../../data/mockCustomers';
import type { SavedAddress, AddressType } from '../../types/customer';
import { IndustrialIcon } from '../../components/common/IndustrialIcon';
import { lookupPinCode, INDIAN_STATES } from '../../utils/indiaHelpers';

export const CustomerAddressesPage: React.FC = () => {
  const { customer, refreshCustomer } = useCustomerAuth();
  const customerId = customer?.id || '';

  const [addresses, setAddresses] = useState<SavedAddress[]>(() =>
    customerId ? getAddressesByCustomerId(customerId) : []
  );
  const [filterType, setFilterType] = useState<'all' | AddressType>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: 'receiver' as AddressType,
    label: '',
    name: '',
    company: '',
    mobile: '',
    email: '',
    houseNo: '',
    area: '',
    landmark: '',
    address: '',
    city: 'Delhi',
    state: 'Delhi',
    postalCode: '110006',
    isDefault: false,
  });

  const [formError, setFormError] = useState('');

  const loadAddresses = () => {
    if (customerId) {
      const list = getAddressesByCustomerId(customerId);
      setAddresses(list);
    }
  };

  const handleOpenAdd = (type: AddressType = 'receiver') => {
    setEditingId(null);
    setFormData({
      type,
      label: '',
      name: type === 'sender' ? (customer?.fullName || '') : '',
      company: type === 'sender' ? (customer?.company || '') : '',
      mobile: type === 'sender' ? (customer?.mobile || '') : '',
      email: type === 'sender' ? (customer?.email || '') : '',
      houseNo: '',
      area: '',
      landmark: '',
      address: '',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110006',
      isDefault: false,
    });
    setFormError('');
    setIsEditing(true);
  };

  const handleOpenEdit = (addr: SavedAddress) => {
    setEditingId(addr.id);
    setFormData({
      type: addr.type,
      label: addr.label,
      name: addr.name,
      company: addr.company || '',
      mobile: addr.mobile,
      email: addr.email || '',
      houseNo: addr.houseNo || '',
      area: addr.area || '',
      landmark: addr.landmark || '',
      address: addr.address,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      isDefault: !!addr.isDefault,
    });
    setFormError('');
    setIsEditing(true);
  };

  const handleDelete = (addrId: string) => {
    if (window.confirm('Are you sure you want to remove this saved address?')) {
      deleteAddress(addrId, customerId);
      loadAddresses();
      refreshCustomer();
    }
  };

  const handleSetDefaultSender = (addrId: string) => {
    setDefaultSenderAddress(addrId, customerId);
    loadAddresses();
    refreshCustomer();
  };

  const handlePinChange = (pin: string) => {
    const clean = pin.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => {
      const loc = clean.length === 6 ? lookupPinCode(clean) : null;
      return {
        ...prev,
        postalCode: clean,
        city: loc ? loc.city : prev.city,
        state: loc ? loc.state : prev.state,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.label.trim()) {
      setFormError('Please provide a label (e.g. Main Shop, Surat Factory, Jaipur Depot).');
      return;
    }
    if (!formData.name.trim()) {
      setFormError('Contact person name is required.');
      return;
    }
    if (formData.mobile.replace(/\D/g, '').length < 10) {
      setFormError('Mobile number must be at least 10 digits.');
      return;
    }
    if (!formData.address.trim()) {
      setFormError('Address is required.');
      return;
    }

    const addrId = editingId || `ADDR-${Date.now().toString().slice(-4)}`;

    const savedRecord: SavedAddress = {
      id: addrId,
      customerId,
      type: formData.type,
      label: formData.label.trim(),
      name: formData.name.trim(),
      company: formData.company.trim(),
      mobile: formData.mobile.trim(),
      email: formData.email.trim(),
      houseNo: formData.houseNo.trim(),
      area: formData.area.trim(),
      landmark: formData.landmark.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      postalCode: formData.postalCode.trim(),
      isDefault: formData.isDefault,
      createdAt: new Date().toISOString(),
    };

    saveAddress(savedRecord);
    loadAddresses();
    refreshCustomer();
    setIsEditing(false);
  };

  const filteredAddresses = addresses.filter(a =>
    filterType === 'all' ? true : a.type === filterType
  );

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 tracking-tight">
            Saved Addresses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage reusable sender origin points and frequent delivery receiver contacts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenAdd('receiver')}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-orange-500/20 hover:shadow transition-all flex items-center gap-2"
          >
            <IndustrialIcon name="plus" size={14} />
            <span>Add Receiver</span>
          </button>
          <button
            onClick={() => handleOpenAdd('sender')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <IndustrialIcon name="plus" size={14} />
            <span>Add Sender Hub</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {(
          [
            { id: 'all', label: 'All Addresses' },
            { id: 'sender', label: 'Sender Origins' },
            { id: 'receiver', label: 'Delivery Receivers' },
          ] as const
        ).map((t) => {
          const count = t.id === 'all' ? addresses.length : addresses.filter(a => a.type === t.id).length;
          const active = filterType === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setFilterType(t.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                active
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  active ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Address Cards Grid */}
      {filteredAddresses.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <IndustrialIcon name="pin" size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No saved addresses</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            You don't have any saved {filterType !== 'all' ? filterType : ''} addresses yet. Add addresses for fast 1-click booking.
          </p>
          <button
            onClick={() => handleOpenAdd('receiver')}
            className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
          >
            <IndustrialIcon name="plus" size={14} />
            <span>Add Your First Address</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAddresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all hover:border-slate-300 ${
                addr.isDefault ? 'border-orange-300 ring-1 ring-orange-200 bg-orange-50/10' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-heading font-bold text-sm text-slate-900 truncate">
                    {addr.label}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        addr.type === 'sender'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {addr.type}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-800">
                  {addr.name}
                  {addr.company && <span className="text-slate-500 font-normal"> ({addr.company})</span>}
                </div>

                <div className="text-xs text-slate-600 mt-2 line-clamp-2">
                  {addr.address}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">
                  {addr.city}, {addr.state} - <span className="font-mono">{addr.postalCode}</span>
                </div>

                {addr.landmark && (
                  <div className="text-[11px] text-slate-400 mt-1">
                    Landmark: {addr.landmark}
                  </div>
                )}

                <div className="text-xs text-slate-700 mt-2 font-mono flex items-center gap-1.5">
                  <IndustrialIcon name="phone" size={12} className="text-slate-400" />
                  <span>{addr.mobile}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {addr.type === 'sender' && !addr.isDefault ? (
                  <button
                    onClick={() => handleSetDefaultSender(addr.id)}
                    className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    Set as Default Sender
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    {addr.isDefault ? 'Default Origin' : 'Quick Receiver'}
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(addr)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit Address"
                  >
                    <IndustrialIcon name="file" size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Address"
                  >
                    <IndustrialIcon name="alert" size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Add / Edit Address Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-lg font-heading font-bold text-slate-900">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3 flex items-start gap-2">
                <span className="text-rose-600 shrink-0 mt-0.5">
                  <IndustrialIcon name="alert" size={14} />
                </span>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Address Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as AddressType })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="receiver">Delivery Receiver</option>
                    <option value="sender">Sender Dispatch Origin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Address Label <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Main Shop / Jaipur Depot"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Person Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amit Gupta"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Company / Firm Name
                  </label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Optional"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Complete Street Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Shop No., Complex, Street, Area"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    PIN Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.postalCode}
                    onChange={(e) => handlePinChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Town Hall"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              {formData.type === 'sender' && (
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span className="font-medium text-slate-700">Set as my primary default dispatch address</span>
                </label>
              )}

              <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerAddressesPage;
