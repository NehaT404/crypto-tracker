'use client';

import { useState, useEffect } from 'react';
import Pagination from '../../../components/Pagination';
import Table from '../../../components/Table';
import '../globals.css';
import { CoinData } from '../../../types';

export default function Trending() {
  const [data, setData] = useState<CoinData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add a loading state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result: CoinData[] = await response.json();
        setData(result);
        setError(null);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, []);

  const totalCoins = data.length;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="trending-container">
      <h1 className="trending-title">Cryptocurrency Data</h1>
      {loading && <div className="loading-icon">Loading...</div>} {/* Show loading icon */}
      {error && <p className="error-message">Error: {error}</p>}
      {!loading && !error && (
        <>
          <Table data={data} currentPage={currentPage} itemsPerPage={itemsPerPage} />
          <Pagination
            currentPage={currentPage}
            totalCoins={totalCoins}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
