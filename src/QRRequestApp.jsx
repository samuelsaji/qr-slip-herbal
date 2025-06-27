// Frontend: React-based web app for QR-based request slip generation

import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import productList from './products.json'; // ✅ Import products correctly

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

  useEffect(() => {
    setProducts(productList);
  }, []);

  const handleAddRequest = () => {
    setRequests([...requests, { item: '', qty: 1, unit: 'pcs' }]);
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
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-10 border-t-8 border-green-400">
          <h1 className="text-4xl font-extrabold text-center text-green-700 mb-8 tracking-tight">Material Request Slip</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block mb-2 text-gray-600 font-semibold">Staff Name</label>
              <input
                className="w-full p-3 border-2 border-green-200 rounded-lg focus:outline-none focus:border-green-400"
                value={staffName}
                onChange={e => setStaffName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-600 font-semibold">Department</label>
              <select
                className="w-full p-3 border-2 border-green-200 rounded-lg focus:outline-none focus:border-green-400"
                value={department}
                onChange={e => setDepartment(e.target.value)}>
                <option value="">-- Select Department --</option>
                {departments.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            <label className="block mb-2 text-gray-600 font-semibold">Purpose of Requirement</label>
            <textarea
              className="w-full border-2 border-green-200 rounded-lg p-3 focus:outline-none focus:border-green-400"
              rows="2"
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              placeholder="Describe the purpose"
            />
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4 text-green-700">Requested Items</h2>
            {requests.map((r, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input
                  list="products"
                  className="border-2 border-green-200 p-2 rounded-lg w-full focus:outline-none focus:border-green-400"
                  value={r.item}
                  onChange={e => handleNewItem(i, e.target.value)}
                  placeholder="Enter or select item"
                />
                <datalist id="products">
                  {products.map(p => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
                <input
                  type="number"
                  className="border-2 border-green-200 p-2 rounded-lg w-full focus:outline-none focus:border-green-400"
                  value={r.qty}
                  min="1"
                  onChange={e => handleChange(i, 'qty', e.target.value)}
                  placeholder="Qty"
                />
                <select
                  className="border-2 border-green-200 p-2 rounded-lg w-full focus:outline-none focus:border-green-400"
                  value={r.unit}
                  onChange={e => handleChange(i, 'unit', e.target.value)}>
                  {units.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            ))}
            <button
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              onClick={handleAddRequest}
            >
              + Add Item
            </button>
          </div>

          <button
            className="mt-8 w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition text-lg shadow"
            onClick={generateQR}
          >
            Generate QR Code
          </button>
        </div>

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
            <div className="mb-6" style={{textAlign:'-webkit-center'}}>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Items Requested</h3>
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Item</th>
                    <th className="py-2 px-4 border-b text-left">Qty</th>
                    <th className="py-2 px-4 border-b text-left">Unit</th>
                  </tr>
                </thead>
                <tbody class="text-center">
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
            <br></br>
            <div className="flex justify-between mt-8 print:mt-4">
              <div className="border-t-2 border-gray-400 pt-2 w-1/3 text-center text-gray-600">Authorized Sign</div>
              <br></br>
              <div className="border-t-2 border-gray-400 pt-2 w-1/3 text-center text-gray-600">Received By</div>
            </div>
            <button
              className="mt-8 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition print:hidden"
              onClick={() => window.print()}>
              Print Slip
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
