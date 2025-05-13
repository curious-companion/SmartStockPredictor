import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PredictionDisplay from '../components/PredictionDisplay';
import OHLCVViewer from '../components/StockChart';
import '../components/styles/StockPage.css';
import Header from '../components/Header.jsx';

const StockPage = () => {
  const { symbol } = useParams();
  const [latestPrice, setLatestPrice] = useState(null);
  const [chartLoaded, setChartLoaded] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);

  const handleChartLoad = () => {
    setChartLoaded(true);
  };

  const handlePredictClick = () => {
    if (chartLoaded) {
      setShowPrediction(true);
    } else {
      alert('Please wait until the chart finishes loading.');
    }
  };

  return (
    <div className="stock-page">
      <Header /> {/* Header added here */}

      <h2 className="stock-name">{symbol}</h2>
      <p className="latest-price">₹ {latestPrice ?? 'Loading...'}</p>

      <div className="content-container">
        <div className="chart-section">
          <OHLCVViewer
            symbol={symbol}
            onChartLoad={handleChartLoad}
            onLatestPrice={setLatestPrice}
            setLoadingParent={(loading) => setChartLoaded(!loading)}
          />

          <button onClick={handlePredictClick} className="predict-button">
            Predict Next Price
          </button>

          {showPrediction && <PredictionDisplay symbol={symbol} />}
        </div>
      </div>
    </div>
  );
};

export default StockPage;
