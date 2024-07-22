'use client';
import { useState, useEffect } from 'react';
import Pagination from '../../../components/Pagination';
import Table from '../../../components/Table';
import '../globals.css';
import { CoinData } from '../../../types';

export default function Trending() {
  const [data, setData] = useState<CoinData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalCoins = data.length;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">Cryptocurrency Data</h1>
      {loading && <div className="flex justify-center items-center h-64"><div className="loading-icon">Loading...</div></div>}
      {error && <p className="text-red-500 text-center">Error: {error}</p>}
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
