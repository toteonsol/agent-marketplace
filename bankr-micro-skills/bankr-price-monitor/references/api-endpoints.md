# API Endpoints Reference

## Price Monitoring API

### Get Current Price

```
GET /api/prices/{token}/{chain}
```

**Parameters:**
- `token`: Token symbol (ETH, BTC, SOL, USDC)
- `chain`: base, ethereum, polygon, solana

**Response:**
```json
{
  "token": "ETH",
  "chain": "base",
  "price_usd": 2850.50,
  "price_timestamp": "2026-02-26T14:58:00Z",
  "volume_24h": 15000000,
  "liquidity": 5000000
}
```

### Get Price History

```
GET /api/prices/{token}/{chain}/history?interval=5m&period=24h
```

**Parameters:**
- `interval`: 5m, 15m, 1h, 4h, 1d
- `period`: 1h, 4h, 24h, 7d, 30d

**Response:**
```json
{
  "token": "ETH",
  "chain": "base",
  "prices": [
    {"timestamp": "2026-02-26T00:00:00Z", "price": 2800.00},
    {"timestamp": "2026-02-26T05:00:00Z", "price": 2850.50},
    ...
  ],
  "high_24h": 2900,
  "low_24h": 2700,
  "volume_24h": 15000000
}
```

## Trigger Management API

### Create Trigger

```
POST /api/triggers
Content-Type: application/json
Authorization: Bearer {api_key}

{
  "monitor_id": "monitor_123",
  "condition": "price < 2800",
  "action": "buy",
  "amount": "$2",
  "enabled": true
}
```

**Response:**
```json
{
  "trigger_id": "trig_456",
  "status": "active",
  "created_at": "2026-02-26T14:58:00Z"
}
```

### List Active Triggers

```
GET /api/triggers?status=active
Authorization: Bearer {api_key}
```

### Execute Trigger Manually

```
POST /api/triggers/{trigger_id}/execute
Authorization: Bearer {api_key}
```

## Integration with Bankr

### Execute Trade

```
POST /api/bankr/swap
Authorization: Bearer {bankr_api_key}

{
  "from_token": "USDC",
  "to_token": "ETH",
  "amount": "2",
  "chain": "base",
  "max_slippage": "1%",
  "timeout": "30s"
}
```

**Response:**
```json
{
  "swap_id": "swap_789",
  "tx_hash": "0x...",
  "from_amount": "2.00",
  "to_amount": "0.000700",
  "status": "confirmed",
  "timestamp": "2026-02-26T14:58:05Z"
}
```

## Monitoring API

### Get Monitor Status

```
GET /api/monitors/{monitor_id}
Authorization: Bearer {api_key}
```

**Response:**
```json
{
  "monitor_id": "monitor_123",
  "token": "ETH",
  "chain": "base",
  "status": "running",
  "current_price": 2850.50,
  "triggers_active": 2,
  "last_check": "2026-02-26T14:57:55Z",
  "trades_executed": 5,
  "total_pnl": 12.50
}
```

### Disable Monitor

```
POST /api/monitors/{monitor_id}/disable
Authorization: Bearer {api_key}
```

## Error Handling

### Common Errors

```json
{
  "error": "token_not_found",
  "message": "Token 'INVALID' not found on chain 'base'",
  "code": 404
}
```

```json
{
  "error": "insufficient_liquidity",
  "message": "Cannot execute swap: pool liquidity too low",
  "code": 422
}
```

```json
{
  "error": "price_volatility_exceeded",
  "message": "Price moved >5% since last poll, skipping trade for safety",
  "code": 429
}
```

## Rate Limits

- **Price checks**: 120 per minute per monitor
- **Trigger executions**: 10 per minute
- **Bankr swaps**: 5 per minute

Exceeding limits returns `429 Too Many Requests` with retry-after header.

## Authentication

Use your Bankr API key:

```
Authorization: Bearer bk_AHA5P8D5CQDRWQRM99HK8DXGHZWFUDM5
```

Store keys securely. Rotate quarterly.
