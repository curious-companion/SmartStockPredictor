import { useEffect, useState } from "react";
import axios from "axios"; // assuming axios is used for fetching

export default function PredictionDisplay({ symbol }) {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // optional error state

  useEffect(() => {
    const fetchPrice = async (symbol) => {
      try {
        const response = await axios.post(`http://127.0.0.1:8000/predict/${symbol}/`);
        return response.data?.predicted_close; // adjust key based on your API response
      } catch (err) {
        console.error("Error fetching predicted price:", err);
        setError("Error fetching prediction");
        return null;
      }
    };

    const loadPrice = async () => {
      setLoading(true);
      const result = await fetchPrice(symbol);
      setPrice(result);
      setLoading(false);
    };

    loadPrice();
  }, [symbol]);

  return (
    <div className="text-xl mt-4">
      <strong>Predicted Next Price:</strong>{" "}
      {loading
        ? "Loading..."
        : error
        ? error
        : price !== null
        ? `₹${price.toFixed(2)}`
        : "Unavailable"}
    </div>
  );
}
