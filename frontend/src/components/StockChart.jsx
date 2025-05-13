import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import stockSymbols from "../utils/stockSymbols.js";

const OHLCVViewer = ({ symbol, onLatestPrice, setLoadingParent }) => {
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([{ data: [] }]);
  const [earliestTime, setEarliestTime] = useState(null);
  const [latestTime, setLatestTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOHLCV = async (nseSymbol, limit = 375) => {
    const res = await axios.get(`http://127.0.0.1:8000/api/ohlcv/${nseSymbol}/`, {
      params: { limit },
    });
    return res.data.filter(entry =>
      entry.Open != null && entry.High != null && entry.Low != null && entry.Close != null && entry.Datetime
    );
  };

  const prepareChartData = (data) => {
    return data.map(entry => ({
      x: new Date(entry.Datetime),
      y: [
        parseFloat(entry.Open),
        parseFloat(entry.High),
        parseFloat(entry.Low),
        parseFloat(entry.Close),
      ],
    }));
  };

  const initializeChart = async () => {
    const symbolObj = stockSymbols[symbol];
    console.log(symbol);
    const nseSymbol = symbolObj?.NSE;
    if (!nseSymbol) return;

    setLoading(true);
    setLoadingParent?.(true);

    try {
      const data = await fetchOHLCV(nseSymbol);
      if (data.length > 0) {
        const formattedData = prepareChartData(data);
        const earliest = new Date(data[0].Datetime);
        const latest = new Date(data[data.length - 1].Datetime);
        setEarliestTime(earliest);
        setLatestTime(latest);

        const closePrices = data.map(entry => parseFloat(entry.Close));
        const minPrice = Math.floor(Math.min(...closePrices));
        const maxPrice = Math.ceil(Math.max(...closePrices));

        setChartSeries([{ data: formattedData }]);
        setChartOptions({
          chart: {
            type: "candlestick",
            height: 400,
            zoom: { enabled: true, type: "x" },
            toolbar: { autoSelected: "zoom" },
          },
          title: { text: `${symbol}`, align: "left" },
          xaxis: {
            type: "category",
            labels: {
              rotate: -45,
              style: { fontSize: "10px" },
              datetimeUTC: false,
            },
            min: earliest.getTime(),
            max: latest.getTime(),
          },
          yaxis: {
            tickAmount: 6,
            labels: {
              formatter: val => val.toFixed(2),
              style: { fontSize: "10px" },
            },
            min: minPrice,
            max: maxPrice,
          },
          plotOptions: {
            candlestick: { wick: { useFillColor: true } },
          },
          dataLabels: { enabled: false },
        });

        const latestClose = parseFloat(data[data.length - 1].Close).toFixed(2);
        onLatestPrice?.(latestClose);
      }
    } catch (error) {
      console.error("Error loading chart data:", error);
    } finally {
      setLoading(false);
      setLoadingParent?.(false);
    }
  };

  useEffect(() => {
    initializeChart();
  }, [symbol]);

  return (
    <div style={{ overflowX: "auto", paddingBottom: "10px" }}>
      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="candlestick"
          height={400}
        />
      )}
    </div>
  );
};

export default OHLCVViewer;
