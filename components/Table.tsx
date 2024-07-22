// src/components/Table.tsx

'use client';

import React from 'react';
import { CoinData } from '../types';

interface TableProps {
  data: CoinData[];
  currentPage: number;
  itemsPerPage: number;
}

const Table: React.FC<TableProps> = ({ data, currentPage, itemsPerPage }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Symbol</th>
          <th>Name</th>
          <th>Current Price</th>
          <th>Market Cap</th>
          <th>Volume</th>
          <th>Change 24h</th>
        </tr>
      </thead>
      <tbody>
        {selectedData.length > 0 ? (
          selectedData.map((item) => (
            <tr key={item.id}>
              <td>
                <button 
                  onClick={() => window.location.href = `/trending/${item.id}`} 
                  className="data-row-button"
                >
                  {item.id}
                </button>
              </td>
              <td>
                <button 
                  onClick={() => window.location.href = `/trending/${item.id}`} 
                  className="data-row-button"
                >
                  {item.symbol}
                </button>
              </td>
              <td>
                <button 
                  onClick={() => window.location.href = `/trending/${item.id}`} 
                  className="data-row-button"
                >
                  {item.name}
                </button>
              </td>
              <td>
                <button 
                  onClick={() => window.location.href = `/trending/${item.id}`} 
                  className="data-row-button"
                >
                  ${item.current_price.toFixed(2)}
                </button>
              </td>
              <td>
                <button 
                  onClick={() => window.location.href = `/trending/${item.id}`} 
                  className="data-row-button"
                >
                  ${item.market_cap.toLocaleString()}
                </button>
              </td>
              <td>
                <button 
                  onClick={() => window.location.href = `/trending/${item.id}`} 
                  className="data-row-button"
                >
                  ${item.total_volume.toLocaleString()}
                </button>
              </td>
              <td>
                <button 
                  onClick={() => window.location.href = `/trending/${item.id}`} 
                  className="data-row-button"
                >
                  {item.price_change_percentage_24h.toFixed(2)}%
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7}>No data available</td>
          </tr>
        )}
      </tbody>
      <style jsx>{`
        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-family: Arial, sans-serif;
        }
        .data-table th,
        .data-table td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: left;
        }
        .data-table th {
          background-color: #f4f4f4;
          font-weight: bold;
        }
        .data-row-button {
          background: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 100%;
          text-align: left;
          cursor: pointer;
          padding: 10px;
          margin: 0;
          color: #333;
          font: 16px Arial, sans-serif;
          transition: background 0.3s, border 0.3s, color 0.3s;
          text-decoration: none;
        }
        .data-row-button:hover {
          background-color: #e0e0e0;
          border-color: #bbb;
        }
        .data-row-button:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 0, 255, 0.5);
        }
        .data-row-button:active {
          background-color: #d0d0d0;
        }
        tr {
          cursor: pointer;
        }
      `}</style>
    </table>
  );
};

export default Table;
