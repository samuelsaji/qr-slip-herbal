// Frontend: React-based web app for QR-based request slip generation

import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import productList from './products.json'; // ✅ Import products correctly
import Select from 'react-select';

const units = ['pcs', 'box', 'set', 'pack'];
const departments = ['IT', 'HR', 'Accounts', 'Operations', 'Maintenance'];

// Temporary fallback components (replace until you add real ones)
const Button = ({ children, className = '', ...props }) => (
  <button className={`bg-blue-600 text-white px-4 py-2 rounded ${className}`} {...props}>
    {children}
  </button>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg border p-4 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children }) => <div>{children}</div>;


export default function QRRequestApp() {
  const [slipNo] = useState(`SLIP-${Date.now().toString().slice(-6)}`);
  const [dateTime] = useState(new Date().toLocaleString());
  const [staffName, setStaffName] = useState('');
  const [department, setDepartment] = useState('');
  const [purpose, setPurpose] = useState('');
  const [requests, setRequests] = useState([]);
  const [qrData, setQrData] = useState('');
  const [products, setProducts] = useState([]);
  const accountCodes = ['AC-101', 'AC-102', 'AC-103', 'AC-200'];
  const dimensions = ['12-inch', '18-inch', '24-inch', '36-inch'];


  useEffect(() => {
    setProducts(productList);
  }, []);

      const handleAddRequest = () => {
      setRequests([...requests, {
        item: '',
        qty: 1,
        unit: 'pcs',
        accountCode: '',
        dimension: ''
      }]);
    };


  const handleChange = (index, key, value) => {
    const updated = [...requests];
    updated[index][key] = value;
    setRequests(updated);
  };

  const handleNewItem = (index, newItem) => {
    if (!products.includes(newItem)) {
      setProducts([...products, newItem]);
    }
    handleChange(index, 'item', newItem);
  };

  const generateQR = () => {
  if (!staffName.trim()) {
    alert("Please enter Staff Name.");
    return;
  }

  if (!department) {
    alert("Please select a Department.");
    return;
  }

  if (requests.length === 0) {
    alert("Please add at least one item.");
    return;
  }

  const validItems = requests.filter(r => r.item && r.qty && r.unit);

  if (validItems.length === 0) {
    alert("Please complete at least one item with name, quantity, and unit.");
    return;
  }

  if (!purpose.trim()) {
    alert("Please enter a purpose.");
    return;
  }

  const items = validItems
    .map(r => `${r.item}:${r.qty}${r.unit}`)
    .join('|');

  const data = `${slipNo},${dateTime},${department},${staffName},${items},Purpose:${purpose}`;
  setQrData(data);
};


  return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-10 mb-10 border-t-8 border-green-400">
          <h1 className="text-4xl font-extrabold text-center text-green-700 mb-10 tracking-tight">Material Request Slip</h1>

          {/* Staff Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <div>
              <label className="block mb-4 text-gray-600 font-semibold text-lg" >Staff Name</label>
              <input className="w-full p-5 border-2 border-green-200 rounded-lg focus:outline-none focus:border-green-400 text-lg"
                value={staffName}
                onChange={e => setStaffName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block mb-4 text-gray-600 font-semibold text-lg">Department</label>
              <select
                className="w-full p-5 border-2 border-green-200 rounded-lg focus:outline-none focus:border-green-400 text-lg"
                value={department}
                onChange={e => setDepartment(e.target.value)}>
                <option value="">-- Select Department --</option>
                {departments.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Purpose */}
          <div className="mb-12">
            <label className="block mb-4 text-gray-600 font-semibold text-lg">Purpose of Requirement</label>
            <textarea
              className="w-full border-2 border-green-200 rounded-lg p-5 focus:outline-none focus:border-green-400 text-lg"
              rows="4"
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              placeholder="Describe the purpose"
            />
          </div>

          {/* Item Entry */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-green-700">Requested Items</h2>
            <div className="space-y-4">
              {requests.map((r, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                {/* Item dropdown */}
                <div className="md:col-span-2">
                  <Select
                    options={products.map(p => ({ value: p, label: p }))}
                    onChange={selected => handleNewItem(i, selected?.value || '')}
                    placeholder="Select item"
                    isClearable
                    className="text-sm"
                  />
                </div>

                {/* Qty */}
                <input
                  type="number"
                  className="border-2 border-green-200 p-2 rounded-lg w-full focus:outline-none focus:border-green-400"
                  value={r.qty}
                  min="1"
                  onChange={e => handleChange(i, 'qty', e.target.value)}
                  placeholder="Qty"
                />

                {/* Unit */}
                <select
                  className="border-2 border-green-200 p-2 rounded-lg w-full focus:outline-none focus:border-green-400"
                  value={r.unit}
                  onChange={e => handleChange(i, 'unit', e.target.value)}>
                  {units.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>

                {/* Account Code */}
                <select
                  className="border-2 border-green-200 p-2 rounded-lg w-full focus:outline-none focus:border-green-400"
                  value={r.accountCode}
                  onChange={e => handleChange(i, 'accountCode', e.target.value)}>
                  <option value="">Account Code</option>
                  {accountCodes.map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>

                {/* Dimension */}
                <select
                  className="border-2 border-green-200 p-2 rounded-lg w-full focus:outline-none focus:border-green-400"
                  value={r.dimension}
                  onChange={e => handleChange(i, 'dimension', e.target.value)}>
                  <option value="">Dimension</option>
                  {dimensions.map(dim => (
                    <option key={dim} value={dim}>{dim}</option>
                  ))}
                </select>
              </div>
              ))}
            </div>

            <button
              className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={handleAddRequest}
            >
              + Add Item
            </button>
          </div>

          <button
            className="mt-10 w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition text-lg shadow"
            onClick={generateQR}
          >
            Generate QR Code
          </button>
        </div>

        {/* QR Preview */}
        {qrData && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-t-8 border-blue-400 print:border-t-0 print:shadow-none print:p-2">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Request Slip</h2>
            <div className="flex flex-col md:flex-row md:justify-between mb-4 text-gray-700">
              <div className="mb-2 md:mb-0"><span className="font-semibold">Slip No:</span> {slipNo}</div>
              <div><span className="font-semibold">Date & Time:</span> {dateTime}</div>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between mb-4 text-gray-700">
              <div className="mb-2 md:mb-0"><span className="font-semibold">Department:</span> {department}</div>
              <div><span className="font-semibold">Requested By:</span> {staffName}</div>
            </div>
            <div className="mb-4 text-gray-700"><span className="font-semibold">Purpose:</span> {purpose}</div>
            <div className="mb-6">
              <QRCodeCanvas value={qrData} size={200} className="mx-auto my-4" />
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Items Requested</h3>
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Item</th>
                    <th className="py-2 px-4 border-b text-left">Qty</th>
                    <th className="py-2 px-4 border-b text-left">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.filter(r => r.item && r.qty && r.unit).map((r, i) => (
                    <tr key={i}>
                      <td className="py-2 px-4 border-b">{r.item}</td>
                      <td className="py-2 px-4 border-b">{r.qty}</td>
                      <td className="py-2 px-4 border-b">{r.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between mt-8 print:mt-4">
              <div className="border-t-2 border-gray-400 pt-2 w-1/3 text-center text-gray-600">Authorized Sign</div>
              <div className="border-t-2 border-gray-400 pt-2 w-1/3 text-center text-gray-600">Received By</div>
            </div>
            <button
              className="mt-8 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition print:hidden"
              onClick={() => window.print()}
            >
              Print Slip
            </button>
          </div>
        )}
      </div>
    </div>

  );
}
