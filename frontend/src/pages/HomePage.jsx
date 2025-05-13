import React from 'react';
import Header from '../components/Header';
import '../components/styles/Homepage.css';

const HomePage = () => {
  return (
    <div>
      <Header />
      <main className="main-content">
        <h2 className="tagline">Indian Markets in Your Hand</h2>
        <p className="description">Track live stock prices, view charts, and get future predictions using LSTM and Transformer models.</p>
        <div className="instruction">📊 Select a stock or index to view its chart and predictions.</div>
      </main>
    </div>
  );
};

export default HomePage;
