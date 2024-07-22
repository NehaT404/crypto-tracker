
'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const timePeriods = {
  '1D': '1',
  '5D': '5',
  '1M': '30',
  '6M': '180',
  '1Y': '365',
  '5Y': '1825'
};

const coinIds = ['bitcoin', 'ethereum', 'solana'];

interface CoinData {
  prices: [number, number][];
}

interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    price_btc: number;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_change_percentage_24h: number;
  };
}

export default function Home() {
  const [selectedPeriod, setSelectedPeriod] = useState('5D');  // Set default to 5 days
  const [coinData, setCoinData] = useState<{ [key: string]: CoinData }>({});
  const [error, setError] = useState<string | null>(null);
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);

  const fetchCoinData = async (coin: string, days: string) => {
    const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${days}`;
    const options = {
      method: 'GET',
      headers: { accept: 'application/json' },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
      setError((error as Error).message);
      return null;
    }
  };

  const fetchTrendingCoins = async () => {
    const url = 'https://api.coingecko.com/api/v3/search/trending';
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-cg-pro-api-key': 'CG-aYfjnMwJEysXQvrWyeHrmXHB' },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setTrendingCoins(result.coins || []); // Ensure coins are set
    } catch (error) {
      console.error('Error fetching data:', error);
      setError((error as Error).message);
    }
  };

  const fetchData = async (period: string) => {
    setError(null);
    const days = timePeriods["5D"];
    const dataPromises = coinIds.map(coin => fetchCoinData(coin, days));
    const results = await Promise.all(dataPromises);
    const data: { [key: string]: CoinData } = {};
    results.forEach((result, index) => {
      if (result) {
        data[coinIds[index]] = result;
      }
    });
    setCoinData(data);
  };

  useEffect(() => {
    fetchData(selectedPeriod);
  }, [selectedPeriod]);

  useEffect(() => {
    fetchTrendingCoins();
  }, []);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    fetchData(period);
  };

  const data = {
    labels: coinData.bitcoin ? coinData.bitcoin.prices.map(price => new Date(price[0]).toLocaleDateString()) : [],
    datasets: coinIds.map(coin => ({
      label: coin.charAt(0).toUpperCase() + coin.slice(1),
      data: coinData[coin] ? coinData[coin].prices.map(price => price[1]) : [],
      fill: false,
      borderColor: coin === 'bitcoin' ? 'rgba(255, 0, 0, 1)' :
                    coin === 'ethereum' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 206, 86, 1)',
      backgroundColor: coin === 'bitcoin' ? 'rgba(255, 0, 0, 0.2)' :
                        coin === 'ethereum' ? 'rgba(54, 162, 235, 0.2)' : 'rgba(255, 206, 86, 0.2)',
      borderWidth: 2,
      tension: 0.4,
      pointStyle: 'rect',
      pointRadius: 5,
      pointBorderColor: coin === 'bitcoin' ? 'rgba(255, 0, 0, 1)' :
                        coin === 'ethereum' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 206, 86, 1)',
      pointBackgroundColor: '#fff',
      pointHoverRadius: 7,
      pointHoverBackgroundColor: coin === 'bitcoin' ? 'rgba(255, 0, 0, 1)' :
                                coin === 'ethereum' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 206, 86, 1)',
      pointHoverBorderColor: '#fff',
    }))
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
    },
    elements: {
      point: {
        radius: 5,
        pointStyle: 'rect',
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4" style={{ color: '#000000' }}>Global Cryptocurrency Market Data</h1>

      {coinData.bitcoin && (
        <div className="chart-container w-full max-w-4xl mb-8">
          <Line data={data} />
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">Trending Coins</h2>
      <div className="w-full max-w-4xl">
        {trendingCoins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingCoins.map((coin, index) => {
              const priceChange = coin.item.price_change_percentage_24h;
              return (
                <div key={index} className="flex items-center p-4 bg-white rounded shadow">
                  <img src={coin.item.small} alt={coin.item.name} className="w-10 h-10 mr-4" />
                  <div>
                    <p className="text-lg font-bold">{coin.item.name} ({coin.item.symbol.toUpperCase()})</p>
                    <p className="text-sm">Price (BTC): {coin.item.price_btc.toFixed(8)}</p>
                    <p className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      24h Change: {priceChange ? priceChange.toFixed(2) : 'N/A'}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No trending coins available.</p>
        )}
      </div>
    </div>
  );
}
