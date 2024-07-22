// src/types/index.ts

import React from 'react';

interface PriceChangePercentages {
  [key: string]: number;
}

// export type DataKey = 
//   | 'price_change_percentage_24h' 
//   | 'price_change_percentage_7d' 
//   | 'price_change_percentage_30d' 
//   | 'price_change_percentage_1y' 
//   | 'price_change_percentage_2y';

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

export interface TrendingCoin {
  id: React.Key | null | undefined;
  image: string | undefined;
  name: string | undefined;
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    data: {
      price_change_percentage_1d_in_currency: PriceChangePercentages;
      price_change_percentage_7d_in_currency: PriceChangePercentages;
      price_change_percentage_365d_in_currency: PriceChangePercentages;
      price: number;
      price_btc: string;
      price_change_percentage_24h: PriceChangePercentages;
      price_change_percentage_7d: PriceChangePercentages;
      price_change_percentage_30d: PriceChangePercentages;
      price_change_percentage_1y: PriceChangePercentages;
      price_change_percentage_2y: PriceChangePercentages;
    };
  };
}
