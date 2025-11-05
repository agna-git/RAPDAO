-- RAPDAO Token Database Schema

-- Accounts table - 지갑 주소 및 토큰 잔액 관리
CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  address TEXT UNIQUE NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table - 토큰 전송 기록
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  amount INTEGER NOT NULL,
  tx_hash TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_address) REFERENCES accounts(address),
  FOREIGN KEY (to_address) REFERENCES accounts(address)
);

-- Token info table - 토큰 기본 정보
CREATE TABLE IF NOT EXISTS token_info (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL DEFAULT 'RAPDAO',
  symbol TEXT NOT NULL DEFAULT 'RAP',
  total_supply INTEGER NOT NULL DEFAULT 1000000000,
  decimals INTEGER NOT NULL DEFAULT 18,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_accounts_address ON accounts(address);
CREATE INDEX IF NOT EXISTS idx_transactions_from ON transactions(from_address);
CREATE INDEX IF NOT EXISTS idx_transactions_to ON transactions(to_address);
CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(tx_hash);

-- Insert initial token info
INSERT OR IGNORE INTO token_info (id, name, symbol, total_supply, decimals) 
VALUES (1, 'RAPDAO', 'RAP', 1000000000, 18);
