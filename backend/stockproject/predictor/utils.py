import pandas_ta as ta
import pandas as pd
import yfinance as yf
import numpy as np

def add_technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
    df['SMA_10'] = df['close'].rolling(window=10).mean()

    df['EMA_9'] = df['close'].ewm(span=9, adjust=False).mean()
    df['EMA_21'] = df['close'].ewm(span=21, adjust=False).mean()

    def compute_rsi(data, window = 14):
        delta = data.diff()
        gain = np.where(delta>0, delta, 0)
        loss = np.where(delta<0, -delta, 0)
        avg_gain = pd.Series(gain).rolling(window=window, min_periods=1).mean()
        avg_loss = pd.Series(loss).rolling(window=window, min_periods=1).mean()

        rs = np.where(avg_loss == 0, 100, avg_gain / avg_loss)  # Avoid division by zero
        rsi = 100 - (100 / (1 + rs))

        return pd.Series(rsi)

    df['RSI_14'] = compute_rsi(df['close'], 14)

    df['MA_20'] = df['close'].rolling(window=20).mean()
    df['BB_Upper'] = df['MA_20'] + 2 * df['close'].rolling(window=20).std()
    df['BB_Lower'] = df['MA_20'] - 2 * df['close'].rolling(window=20).std()

    df['EMA_12'] = df['close'].ewm(span=12, adjust=False).mean()
    df['EMA_26'] = df['close'].ewm(span=26, adjust=False).mean()
    df['MACD'] = df['EMA_12']-df['EMA_26']
    df['Signal_Line'] = df['MACD'].ewm(span=9, adjust=False).mean()

    df['L14'] = df['low'].rolling(window=14).min()
    df['H14'] = df['high'].rolling(window=14).max()
    df['%K'] = df['close']-df['L14']
    df['%D'] = df['%K'].rolling(window=3).mean()

    df['HL'] = df['high']-df['low']
    df['HC'] = df['high']-df['close']
    df['LC'] = df['close']-df['low']
    df['TR'] = df[['HL', 'HC', 'LC']].max(axis=1)
    df['ATR_14'] = df['TR'].rolling(window=14).mean()
    # Only keep the last 60 rows (after indicators calculated)
    df = df.tail(60)

    # Drop any remaining NaNs (they may exist due to indicator calculation)
    df = df.dropna()

    return df



def fetch_last_60_minutes(symbol):
    
    data = yf.download(
        tickers=symbol,
        period="2d",  # 2 days to ensure enough minute data is returned
        interval="1m"
    )
    data = data.tail(100).reset_index()
    data.columns = ['datetime', 'open', 'high', 'low', 'close', 'volume']
    return data[['open', 'high', 'low', 'close', 'volume']]
