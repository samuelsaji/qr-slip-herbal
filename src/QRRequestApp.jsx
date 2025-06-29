// Frontend: React-based web app for QR-based request slip generation

import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import productList from './products.json'; // ✅ Import products correctly
import Select from 'react-select';
import accountCodes from './accounts.json';
import './index.css';


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
  const accountCodeOptions = accountCodes; // ✅ no map needed if it's already in value/label format

  const dimensions = ['AOH', 'BLP', 'BLR', 'CLT', 'CSTR', 'DGP', 'DGP-CR', 'DGP-PW', 'ETP', 'FDGP', 'FOH', 'FTP', 'GPB', 'GRP', 'HGP', 'HVP', 'MUS', 'NPD', 'PWR', 'QAQC', 'RPB', 'SCC', 'SFD', 'SGCG', 'SGU-F', 'SGU-M', 'SGU-T', 'SPD', 'STR', 'USB', 'WHP', '(blank)'];


  useEffect(() => {
    setProducts(productList);
  }, []);

  const handleAddRequest = () => {
  setRequests([...requests, {
    item: '',
    qty: 1,
    unit: 'pcs',
    accountCode: '', 
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
  .map(r => `${r.item}:${r.qty}${r.unit}:${r.accountCode}:${r.dimension}`)
  .join('|');


  const data = `${slipNo},${dateTime},${department},${staffName},${items},Purpose:${purpose}`;
  setQrData(data);
};


  return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="no-print bg-white rounded-2xl shadow-2xl p-10 mb-10 border-t-8 border-green-400">
          <h1 className="text-4xl font-extrabold text-center text-green-700 mb-10 tracking-tight">Material Request Slip</h1>
          <div className='flex justify-between items-center mb-8'>
            {/* Staff Info */}
          <div className="ml-10 grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <div>
              <label className="block mr-10  mb-4 text-gray-600 font-semibold text-lg " >Staff Name</label>
              <input className=" p-5 border-2 border-green-200 rounded-lg focus:outline-none focus:border-green-400 text-lg"
                value={staffName}
                onChange={e => setStaffName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            
          </div>

          {/* Purpose */}
          <div className="mb-10">
            <label className="block mb-4 mr-25 text-gray-600 font-semibold text-lg">Purpose of Requirement</label>
            <textarea
              className=" pr-15 border-2 border-green-200 rounded-lg p-5 pl-20 focus:outline-none focus:border-green-400 text-lg"
              rows="1"
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              placeholder="Describe the purpose"
            />
          </div>
          </div>

          

<div className="mt-8">
  <h2 className="text-lg font-bold mb-4 text-green-700">Requested Items</h2>
  {requests.map((r, i) => (
    <div key={i} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Item Name */}
        <div className="md:col-span-2">
          <label className="mr-60 block text-sm font-medium text-gray-700 mb-2">
            Select Item
          </label>
          <Select
            options={products.map(p => ({ value: p, label: p }))}
            onChange={selected => handleNewItem(i, selected?.value || '')}
            placeholder="Choose item..."
            isClearable
            className="text-sm"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block mr-55 text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <input
            type="number"
            className="border-2 border-green-200 p-2 rounded-lg w-full focus:outline-none focus:border-green-400"
            value={r.qty}
            min="1"
            onChange={e => handleChange(i, 'qty', e.target.value)}
          />
        </div>

        {/* Unit */}
        <div>
          <label className="block mr-55 text-sm font-medium text-gray-700 mb-2">
            Unit
          </label>
          <select
            className="border-2 border-green-200 p-2 rounded-lg w-full focus:outline-none focus:border-green-400"
            value={r.unit}
            onChange={e => handleChange(i, 'unit', e.target.value)}>
            {units.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>


      </div>

      {/* Second row for Account Code and Dimension */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Account Code */}
        <div>
          <label className="block mr-55 text-sm font-medium text-gray-700 mb-2">
            Account Code
          </label>
          <Select
            options={accountCodeOptions}
            onChange={selected => handleChange(i, 'accountCode', selected?.value || '')}
            placeholder="Choose account code..."
            isClearable
            className="text-sm"
          />
        </div>

        {/* Dimension */}
        <div>
          <label className="block mr-60 text-sm font-medium text-gray-700 mb-2">
            Dimension
          </label>
          <select
            className=" text-gray-500 border-2 border-green-200 p-2 rounded-lg w-full focus:outline-none focus:border-green-400 text-sm"
            value={r.dimension}
            onChange={e => handleChange(i, 'dimension', e.target.value)}>
            <option >Select dimension...</option>
            {dimensions.map(dim => (
              <option key={dim} value={dim}>{dim}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  ))}
  
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
       < div className="print-only">
          <div className="print-receiept min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm mx-auto shadow-lg print:shadow-none print:max-w-none" style={{fontFamily: 'monospace'}}>
        
        {/* Header */}
        <div className="text-center py-6 px-4 border-b-2 border-dashed border-gray-300">
          <h1 className="text-xl font-bold uppercase tracking-wider mb-2">REQUEST SLIP</h1>
          <div className="text-xs text-gray-600 uppercase">Purchase Receipt Style</div>
        </div>
        
        {/* Receipt Details */}
        <div className="px-4 py-4 text-center text-sm">
          <div className="mb-3">
            <div className="font-bold text-base mb-1">SLIP #{slipNo}</div>
            <div className="text-xs text-gray-600">{dateTime}</div>
          </div>
          
          <div className="border-t border-dashed border-gray-300 pt-3 mb-3">
            
            <div className="mb-2">
              <div className="text-xs text-gray-500 uppercase">Requested By</div>
              <div className="font-semibold">{staffName}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase">Purpose</div>
              <div className="font-semibold">{purpose}</div>
            </div>
          </div>
        </div>
        
        {/* Items Section */}
        <div className="px-4 py-4 border-t border-dashed border-gray-300">
          <div className="text-center mb-3">
            <h3 className="font-bold text-sm uppercase tracking-wide">Items Requested</h3>
          </div>
          
          <div className="text-xs w-1/2 mx-auto">
            {/* Removed the column headers as we are combining */}
            {requests.filter(r => r.item && r.qty && r.unit).map((r, i) => (
              <div key={i} className="py-2 border-b border-dotted border-gray-200 last:border-b-0">
                {/* Item name and quantity/unit together */}
                <div className="font-medium">
                  {r.item} ({r.qty} {r.unit})
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-dashed border-gray-300 mt-3 pt-3 text-center">
            <div className="text-xs text-gray-500 uppercase mb-1">Total Items</div>
            <div className="font-bold text-lg">{requests.filter(r => r.item && r.qty && r.unit).length}</div>
          </div>
        </div>
        
        {/* QR Code */}
        <div className="text-center py-4 border-t border-dashed border-gray-300">
          <QRCodeCanvas value={qrData} size={180} className="mx-auto mb-2" />
          <div className="text-xs text-gray-500">Scan for Details</div>
        </div>
        
        {/* Signature Section */}
        <div className="px-4  py-4 border-t border-dashed border-gray-300">
          <div className="grid grid-cols-2 gap-4 text-xs text-center">
            <div>
              <div className="border-b border-gray-400 mb-1 pb-2 h-8"></div>
              <div className="text-gray-500 uppercase">Authorized By</div>
            </div>
            <div>
              <div className="border-b border-gray-400 mb-1 pb-2 h-8"></div>
              <div className="text-gray-500 uppercase">Received By</div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center py-4 border-t-2 border-dashed border-gray-400">
          <div className="text-xs text-gray-500 mb-3">Thank you for your request!</div>
          <button
            className="px-6 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-900 transition print:hidden uppercase tracking-wide"
            onClick={() => window.print()}
          >
            Print Receipt
          </button>
        </div>
        
        {/* Receipt Cut Line */}
        <div className="text-center py-2 print:hidden">
          <div className="text-xs text-gray-400"> ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ </div>
        </div>
        
      </div>
    </div>
    </div>
        )}
      </div>
        <style jsx>{`
        .print-only {
          display: none;
        }

        @media print {
          .no-print {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: white;
            z-index: 9999;
          }

          .receipt-container {
            width: 38mm;
            max-width: 220px;
            margin: 0 auto;
            padding: 10px;
            background: white;
            font-size: 12px;
            line-height: 1.4;
          }

          .receipt-header {
            text-align: center;
            padding: 15px 0;
            border-bottom: 2px dashed #333;
            margin-bottom: 15px;
          }

          .receipt-details {
            padding: 10px 0;
            text-align: center;
            font-size: 11px;
          }

          .receipt-divider {
            border-top: 1px dashed #333;
            padding-top: 10px;
            margin-bottom: 10px;
          }

          .receipt-items {
            padding: 10px 0;
            border-top: 1px dashed #333;
          }

          .receipt-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 0;
            border-bottom: 1px dotted #ccc;
            text-align: center;
            gap: 8px;
          }

          .receipt-item:last-child {
            border-bottom: none;
          }

          .receipt-item .text-center {
            text-align: center;
          }

          .receipt-total {
            border-top: 1px dashed #333;
            margin-top: 10px;
            padding-top: 10px;
            text-align: center;
          }

          .receipt-qr {
            text-align: center;
            padding: 15px 0;
            border-top: 1px dashed #333;
          }

          .receipt-signatures {
            padding: 15px 0;
            border-top: 1px dashed #333;
          }

          .signature-line {
            border-bottom: 1px solid #333;
            height: 20px;
            margin-bottom: 5px;
          }

          .receipt-footer {
            text-align: center;
            padding: 15px 0;
            border-top: 2px dashed #333;
          }

          .print-button {
            display: none !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          @page {
            size: A4;
            margin: 10mm;
          }
        }

        @media screen {
          .print-only {
            display: block;
            background: #f5f5f5;
            padding: 20px;
            margin-top: 20px;
          }

          .receipt-container {
            background: white;
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
            font-family: monospace;
          }

          .receipt-header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px dashed #333;
            margin-bottom: 20px;
          }

          .receipt-details {
            padding: 15px 0;
            text-align: center;
            font-size: 14px;
          }

          .receipt-divider {
            border-top: 1px dashed #333;
            padding-top: 15px;
            margin-bottom: 15px;
          }

          .receipt-items {
            padding: 15px 0;
            border-top: 1px dashed #333;
          }

          .receipt-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px dotted #ccc;
            gap: 12px;
          }

          .receipt-item .text-center {
            text-align: center;
          }

          .receipt-total {
            border-top: 1px dashed #333;
            margin-top: 15px;
            padding-top: 15px;
            text-align: center;
          }

          .receipt-qr {
            text-align: center;
            padding: 20px 0;
            border-top: 1px dashed #333;
          }

          .receipt-signatures {
            padding: 20px 0;
            border-top: 1px dashed #333;
          }

          .signature-line {
            border-bottom: 1px solid #333;
            height: 30px;
            margin-bottom: 8px;
          }

          .receipt-footer {
            text-align: center;
            padding: 20px 0;
            border-top: 2px dashed #333;
          }

          .print-button {
            padding: 12px 24px;
            background: #333;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: background 0.3s;
          }

          .print-button:hover {
            background: #555;
          }
        }
      `}</style>
    </div>
  );
}