import os
import joblib
import pandas as pd
import numpy as np
import tensorflow as tf
import traceback
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .utils import add_technical_indicators, fetch_last_60_minutes

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, "models", "lstm_stock_model.keras")
feature_scaler_path = os.path.join(BASE_DIR, "feature_scaler.pkl")
target_scaler_path = os.path.join(BASE_DIR, "target_scaler.pkl")

try:
    model = tf.keras.models.load_model(model_path)
    feature_scaler = joblib.load(feature_scaler_path)
    target_scaler = joblib.load(target_scaler_path)
    print("[DEBUG] Model and scalers loaded successfully.")
except Exception as e:
    print("[ERROR] Failed to load model or scalers:")
    traceback.print_exc()

FEATURES = ['open', 'high', 'low', 'volume',
            'SMA_10', 'EMA_9', 'EMA_21', 'RSI_14', 'MA_20',
            'BB_Upper', 'BB_Lower', 'EMA_12', 'EMA_26',
            'MACD', 'Signal_Line', '%K', '%D', 'ATR_14']
            

@api_view(["POST"])
def predict_price(request, symbol):
    try:
        print(f"[DEBUG] Incoming request for symbol: {symbol}")
        if not symbol.endswith(".NS"):
            symbol += ".NS"
        print(f"[DEBUG] Final stock symbol used: {symbol}")

        df = fetch_last_60_minutes(symbol)
        print(f"[DEBUG] Raw data fetched. Shape: {None if df is None else df.shape}")
        if df is None or df.empty:
            print("[ERROR] Data is None or empty.")
            return Response({"error": "Insufficient or missing data from Yahoo Finance."}, status=400)

        df = add_technical_indicators(df)
        print(f"[DEBUG] Technical indicators added. Shape: {df.shape}")

        df.bfill(inplace=True)
        df.replace(0, np.nan, inplace=True)
        df.bfill(inplace=True)

        if df.shape[0] < 60:
            print(f"[ERROR] Not enough rows after preprocessing: {df.shape[0]}")
            return Response({"error": "Not enough valid data after preprocessing."}, status=400)

        X = df[FEATURES].tail(60)
        print(f"[DEBUG] Features selected. Shape: {X.shape}")
        print(f"[DEBUG] Last 2 rows of X before scaling:\n{X.tail(2)}")

        X_scaled = feature_scaler.transform(X.values)
        print(f"[DEBUG] Features scaled. Shape: {X_scaled.shape}")

        X_input = X_scaled.reshape(1, 60, len(FEATURES))
        print(f"[DEBUG] Input reshaped for model: {X_input.shape}")

        scaled_prediction = float(model.predict(X_input)[0][0])
        print(f"[DEBUG] Scaled prediction from model: {scaled_prediction}")

        # Inverse transform the scaled prediction
        predicted_close = target_scaler.inverse_transform(np.array([[scaled_prediction]]))[0][0]

        print(f"[DEBUG] Inversed predicted close price: {predicted_close}")

        return Response({"predicted_close": round(predicted_close, 2)})

    except Exception as e:
        print("[EXCEPTION] An error occurred:")
        traceback.print_exc()
        return Response({"error": f"Internal server error: {str(e)}"}, status=500)
