'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Ensure date-fns is available for date handling
import './globals.css'; // Make sure to import your CSS file

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const coinIds = ['bitcoin', 'ethereum', 'solana'];
const contractAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'; // Example contract address
const apiKey = 'CG-aYfjnMwJEysXQvrWyeHrmXHB'; // Replace with your actual API key

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

const fetchCoinData = async (coin: string) => {
  const url = `https://api.coingecko.com/api/v3/coins/${coin}/contract/${contractAddress}/market_chart/range?vs_currency=usd&from=1711929600&to=1712275200&precision=4`;
  const options = {
    method: 'GET',
    headers: { accept: 'application/json', 'x-cg-demo-api-key': apiKey }, // Replace with actual API key
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
    return null;
  }
};

const fetchTrendingCoins = async () => {
  const url = 'https://api.coingecko.com/api/v3/search/trending';
  const options = {
    method: 'GET',
    headers: { accept: 'application/json' }, // Remove API key if not needed
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log('Trending coins data:', result); // Debugging information
    return result.coins || [];
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    return [];
  }
};

export default function Home() {
  const [coinData, setCoinData] = useState<{ [key: string]: CoinData }>({});
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const dataPromises = coinIds.map(coin => fetchCoinData(coin));
    const results = await Promise.all(dataPromises);
    const data: { [key: string]: CoinData } = {};
    results.forEach((result, index) => {
      if (result) {
        data[coinIds[index]] = result;
      }
    });
    setCoinData(data);
    const coins = await fetchTrendingCoins();
    setTrendingCoins(coins);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = {
    labels: coinData.bitcoin ? coinData.bitcoin.prices.map(price => new Date(price[0]).toLocaleTimeString()) : [],
    datasets: coinIds.map(coin => ({
      label: coin.charAt(0).toUpperCase() + coin.slice(1),
      data: coinData[coin] ? coinData[coin].prices.map(price => price[1]) : [],
      fill: false,
      borderColor: coin === 'bitcoin' ? 'rgba(255, 0, 0, 1)' :
                    coin === 'ethereum' ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 206, 86, 1)',
      backgroundColor: coin === 'bitcoin' ? 'rgba(255, 0, 0, 0.2)' :
                        coin === 'ethereum' ? 'rgba(54, 162, 235, 0.2)' : 'rgba(255, 206, 86, 0.2)',
      borderWidth: 3,
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
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        grid: {
          display: true,
          color: 'rgba(200, 200, 200, 0.2)',
        },
        ticks: {
          callback: (value: number) => `${value}`,
        },
      },
    },
    elements: {
      line: {
        borderColor: 'rgba(0,0,0,0.2)',
        borderWidth: 3,
        borderDash: [5, 5],
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 8,
        shadowOffsetX: 4,
        shadowOffsetY: 4,
        tension: 0.4,
      },
      point: {
        radius: 5,
        pointStyle: 'rect',
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 2,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 5,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
      },
    },
  };

  return (
    <div className="container">
      <h1 className="heading">Global Cryptocurrency Market Data</h1>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          {coinData.bitcoin && (
            <div className="chart-container">
              <Line data={data} />
            </div>
          )}

          <h2 className="heading">Trending Coins</h2>
          <div className="table-container">
            {trendingCoins.length > 0 ? (
              <table className="trending-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price (BTC)</th>
                    <th>24h Change</th>
                  </tr>
                </thead>
                <tbody>
  {trendingCoins.map((coin, index) => {
    const priceChange = coin.item.price_change_percentage_24h ?? 0; // Use default value if undefined
    return (
      <tr key={index}>
        <td><img src={coin.item.small} alt={coin.item.name} className="coin-image" /></td>
        <td>{coin.item.name} ({coin.item.symbol.toUpperCase()})</td>
        <td>{coin.item.price_btc.toFixed(8)}</td>
        <td className={priceChange >= 0 ? 'positive-change' : 'negative-change'}>
          {priceChange.toFixed(2)}%
        </td>
      </tr>
    );
  })}
</tbody>

              </table>
            ) : (
              <div>No trending coins available.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
