'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Image from 'next/image';

// Register Chart.js components
Chart.register(...registerables);

interface CoinDescriptionProps {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_data: {
    current_price: {
      usd?: number;
    };
    high_24h: {
      usd?: number;
    };
    low_24h: {
      usd?: number;
    };
    low_52w: {
      usd?: number;
    };
    high_52w: {
      usd?: number;
    };
  };
  description: {
    en: string;
  };
}

interface HistoricalPrice {
  prices: [number, number][];
}

const timeRanges = {
  '1d': '1',
  '7d': '7',
  '30d': '30',
  '1y': '365',
} as const;

type TimeRange = keyof typeof timeRanges;

const CoinDetails = () => {
  const { coinid } = useParams();
  const [coinDetails, setCoinDetails] = useState<CoinDescriptionProps | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalPrice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1y');

  const fetchData = useCallback(async () => {
    if (!coinid) return;

    try {
      const [detailsResponse, historicalResponse] = await Promise.all([
        fetch(`https://api.coingecko.com/api/v3/coins/${coinid}`),
        fetch(`https://api.coingecko.com/api/v3/coins/${coinid}/market_chart?vs_currency=usd&days=${timeRanges[selectedRange]}`)
      ]);

      if (!detailsResponse.ok || !historicalResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const detailsData: CoinDescriptionProps = await detailsResponse.json();
      const historicalData: HistoricalPrice = await historicalResponse.json();

      setCoinDetails(detailsData);
      setHistoricalData(historicalData);
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    }
  }, [coinid, selectedRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) return <div className="error">Error: {error}</div>;
  if (!coinDetails || !historicalData) return <div className="loading">Loading...</div>;

  // Prepare chart data
  const chartLabels = historicalData.prices.map(([timestamp]) => new Date(timestamp).toLocaleDateString());
  const chartPrices = historicalData.prices.map(([, price]) => price);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Price in USD',
        data: chartPrices,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: $${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: (value: number) => `$${value}`,
        },
        grid: {
          borderColor: '#ddd',
        },
      },
    },
  };

  // Performance data
  const {
    current_price,
    high_24h,
    low_24h,
    high_52w,
    low_52w
  } = coinDetails.market_data;

  const performanceData = {
    labels: ['Current Price', '24h High', '24h Low', '52w High', '52w Low'],
    datasets: [
      {
        label: 'Performance',
        data: [
          current_price?.usd ?? 0,
          high_24h?.usd ?? 0,
          low_24h?.usd ?? 0,
          high_52w?.usd ?? 0,
          low_52w?.usd ?? 0,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const performanceOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: $${context.raw}`,
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
        ticks: {
          callback: (value: number) => `$${value}`,
        },
        grid: {
          borderColor: '#ddd',
        },
      },
    },
  };

  return (
    <div className="container">
      <div className="coin-header">
        <Image
          src={coinDetails.image.large}
          alt={coinDetails.name}
          width={100}
          height={100}
          className="coin-image"
        />
        <h1>{coinDetails.name}</h1>
        <p>Current Price: ${coinDetails.market_data.current_price.usd?.toFixed(2)}</p>
      </div>
      <div className="coin-description">
        <h2>Description</h2>
        <p>{coinDetails.description.en.replace(/'/g, '&apos;')}</p>
      </div>
      <div className="coin-chart">
        <h2>{selectedRange.toUpperCase()} Price Chart</h2>
        <Line data={chartData}  />
      </div>
      <div className="chart-controls">
        {Object.keys(timeRanges).map((range) => (
          <button
            key={range}
            className={`range-button ${selectedRange === range ? 'active' : ''}`}
            onClick={() => setSelectedRange(range as TimeRange)}
          >
            {range}
          </button>
        ))}
      </div>
      <div className="performance-section">
        <h2>Performance</h2>
        <Line data={performanceData}  />
        <div className="performance-metrics">
          {/* <p>Today's Low: ${coinDetails.market_data.low_24h?.usd?.toFixed(2)}</p>
          <p>Today's High: ${coinDetails.market_data.high_24h?.usd?.toFixed(2)}</p> */}
          <p>52W Low: ${coinDetails.market_data.low_52w?.usd?.toFixed(2)}</p>
          <p>52W High: ${coinDetails.market_data.high_52w?.usd?.toFixed(2)}</p>
        </div>
      </div>
      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .coin-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .coin-image {
          width: 100px;
          height: 100px;
          border-radius: 50%;
        }
        .coin-description {
          margin-bottom: 20px;
        }
        .coin-chart {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 10px;
          background: #f9f9f9;
        }
        .chart-controls {
          text-align: center;
          margin: 20px 0;
        }
        .range-button {
          margin: 0 5px;
          padding: 10px 20px;
          border: 1px solid #333;
          border-radius: 20px;
          background: transparent;
          color: #333;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.3s, color 0.3s;
        }
        .range-button.active {
          background: #333;
          color: #fff;
        }
        .performance-section {
          margin-top: 20px;
        }
        .performance-metrics p {
          margin: 5px 0;
        }
        .error {
          color: red;
          text-align: center;
          font-size: 18px;
        }
        .loading {
          text-align: center;
          font-size: 18px;
        }
      `}</style>
    </div>
  );
};

export default CoinDetails;
