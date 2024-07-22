// src/components/Table.tsx

'use client';

import React from 'react';
import Link from 'next/link';
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
            <tr key={item.id} style={{ cursor: 'pointer' }}>
              <td>
                <Link href={`/trending/${item.id}`}>
                  {item.id}
                </Link>
              </td>
              <td>{item.symbol}</td>
              <td>{item.name}</td>
              <td>${item.current_price.toFixed(2)}</td>
              <td>${item.market_cap.toLocaleString()}</td>
              <td>${item.total_volume.toLocaleString()}</td>
              <td>{item.price_change_percentage_24h.toFixed(2)}%</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7}>No data available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
