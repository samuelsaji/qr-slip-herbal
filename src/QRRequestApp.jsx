// Frontend: React-based web app for QR-based request slip generation

import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';


const initialProducts = [
  'Keyboard', 'Mouse', 'Monitor', 'Laptop', 'Charger', 'Headset'
];

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
  const [products, setProducts] = useState(initialProducts);

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
    const items = requests
      .filter(r => r.item && r.qty)
      .map(r => `${r.item}:${r.qty}${r.unit}`)
      .join('|');
    const data = `${slipNo},${dateTime},${department},${staffName},${items},Purpose:${purpose}`;
    setQrData(data);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">Material Request Slip</h1>

      <div className="mb-6 shadow-lg">
        <div>
          <div className="mb-4">
            <div className="mb-1 text-sm text-gray-500">Slip No:</div>
            <div className="font-semibold">{slipNo}</div>
          </div>
          <div className="mb-4">
            <div className="mb-1 text-sm text-gray-500">Date & Time:</div>
            <div className="font-semibold">{dateTime}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-1 text-sm font-medium">Staff Name</label>
              <input
                className="w-full p-2 border rounded"
                value={staffName}
                onChange={e => setStaffName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Department</label>
              <select
                className="w-full p-2 border rounded"
                value={department}
                onChange={e => setDepartment(e.target.value)}>
                <option value="">-- Select Department --</option>
                {departments.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <button variant="outline" onClick={handleAddRequest}>+ Add Item</button>
          </div>

          {requests.map((r, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <input
                  list="products"
                  className="border p-2 rounded w-full"
                  value={r.item}
                  onChange={e => handleNewItem(i, e.target.value)}
                  placeholder="Enter or select item"
                />
                <datalist id="products">
                  {products.map(p => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </div>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={r.qty}
                min="1"
                onChange={e => handleChange(i, 'qty', e.target.value)}
              />
              <select
                className="border p-2 rounded w-full"
                value={r.unit}
                onChange={e => handleChange(i, 'unit', e.target.value)}>
                {units.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          ))}

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Purpose of Requirement</label>
            <textarea
              className="w-full border p-2 rounded"
              rows="3"
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
            />
          </div>

          <button className="mt-2 w-full" onClick={generateQR}>Generate QR Code</button>
        </div>
      </div>

      {qrData && (
        <div className="p-6 shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Generated Request Slip</h2>
          <div className="mb-1">Slip No: <strong>{slipNo}</strong></div>
          <div className="mb-1">Date & Time: {dateTime}</div>
          <div className="mb-1">Department: {department}</div>
          <div className="mb-1">Requested By: {staffName}</div>
          <div className="mb-2">Purpose: {purpose}</div>

          <QRCodeCanvas value={qrData} size={256} className="mx-auto my-4" />

          <div className="flex justify-between mt-6">
            <div className="border-t pt-2 w-1/3 text-center">Authorized By</div>
            <div className="border-t pt-2 w-1/3 text-center">Received By</div>
          </div>

          <button className="mt-6" onClick={() => window.print()}>Print Slip</button>
        </div>
      )}
    </div>
  );
}
