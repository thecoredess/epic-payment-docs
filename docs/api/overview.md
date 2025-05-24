---
sidebar_position: 1
---

# API Overview

## 🔗 **EPIC Payment Gateway API**

The EPIC API provides secure, reliable payment processing capabilities for merchants integrating with DBKL's payment systems.

## 🌍 **Base URLs**

### **Staging Environment**
```
Base URL: https://epaymentstg.dbkl.gov.my
```

### **Production Environment**
```
Base URL: https://epayment.dbkl.gov.my
```

## 🔑 **Authentication**

EPIC uses **checksum-based authentication** for secure API communication:

1. **Merchant Code**: Unique identifier provided by DBKL
2. **API Key**: Secret key for encryption
3. **Pass Phrase**: Additional security layer for checksum generation
4. **Checksum**: Encrypted validation string for request integrity

### **Checksum Generation Formula**
```
Checksum Data = TRANS_ID + PAYMENT_MODE + AMOUNT + MERCHANT_CODE
Encrypted Checksum = encrypt(Checksum Data, API_KEY, PASS_PHRASE)
```

## 🚀 **Quick Start**

### **1. Basic Payment Request**

```http
POST /eps/request HTTP/1.1
Host: epaymentstg.dbkl.gov.my
Content-Type: application/x-www-form-urlencoded

TRANS_ID=TXN20240101001&
AMOUNT=100.50&
MERCHANT_CODE=DBKL001&
PAYMENT_MODE=fpx&
CHECKSUM=encrypted_string&
RESPONSE_URL=https://yoursite.com/callback
```

### **2. Response Handling**

```json
{
    "STATUS": "SUCCESS",
    "STATUS_CODE": "00",
    "STATUS_MESSAGE": "Transaction Successful",
    "PAYMENT_TRANS_ID": "EPG20240101001",
    "APPROVAL_CODE": "123456",
    "TRANS_ID": "TXN20240101001",
    "AMOUNT": "100.50",
    "CHECKSUM": "response_checksum"
}
```

## 📋 **API Endpoints Reference**

| Endpoint | Method | Purpose | Rate Limit |
|----------|--------|---------|------------|
| `/eps/request` | POST | Initiate payment transaction | 100 req/min |
| `/eps/update` | POST | Check transaction status | 200 req/min |
| `/eps/callback` | POST | Receive payment notifications | Unlimited |
| `/eps/reconcile` | GET | Daily reconciliation data | 10 req/hour |

## 💳 **Payment Modes**

### **FPX (Online Banking)**
- **Code**: `fpx` or `fpx1`
- **Description**: Direct bank transfer via PayNet
- **Processing Time**: Real-time
- **Bank Support**: All major Malaysian banks

### **MIGS (Credit Cards)**
- **Code**: `migs`
- **Description**: Credit/Debit card processing
- **Processing Time**: Real-time
- **Card Support**: Visa, Mastercard, American Express

## 🏛️ **DBKL-Specific Fields**

For DBKL integrations, additional fields are required:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `KOD_HASIL` | String | Yes | Revenue code |
| `PROCESS_CODE` | String | Yes | Process identifier |
| `MODULE_ID` | String | Yes | Module identifier |
| `EMAIL` | String | No | Customer email |
| `CUST_NAME` | String | No | Customer name |
| `CUST_PHONE` | String | No | Customer phone |

## 🔒 **Security Features**

### **Data Encryption**
- **Algorithm**: AES-256 encryption
- **SSL/TLS**: TLS 1.3 for transport security
- **Checksum**: SHA-256 based validation

### **Request Validation**
- Parameter validation
- Checksum verification
- Rate limiting
- IP whitelisting (optional)

### **Response Security**
- Encrypted response checksums
- Tamper detection
- Audit logging

## 📊 **Status Codes**

### **Success Codes**
| Code | Status | Description |
|------|---------|-------------|
| `00` | SUCCESS | Transaction completed successfully |
| `000` | APPROVED | Payment approved by bank |

### **Error Codes**
| Code | Status | Description |
|------|---------|-------------|
| `01` | DECLINED | Payment declined by bank |
| `05` | INSUFFICIENT_FUNDS | Insufficient account balance |
| `12` | INVALID_TRANSACTION | Invalid transaction details |
| `14` | INVALID_CARD | Invalid card number |
| `30` | FORMAT_ERROR | Request format error |
| `96` | SYSTEM_ERROR | Gateway system error |

### **Pending Codes**
| Code | Status | Description |
|------|---------|-------------|
| `68` | PENDING | Transaction pending approval |
| `77` | PROCESSING | Currently being processed |

## 🔄 **Webhook Notifications**

EPIC can send real-time notifications to your callback URL:

### **Webhook Structure**
```json
{
    "event_type": "payment.completed",
    "timestamp": "2024-01-01T12:00:00Z",
    "trans_id": "TXN20240101001",
    "status": "SUCCESS",
    "amount": "100.50",
    "signature": "webhook_signature"
}
```

### **Webhook Verification**
```php
function verifyWebhook($payload, $signature, $secret) {
    $expectedSignature = hash_hmac('sha256', $payload, $secret);
    return hash_equals($expectedSignature, $signature);
}
```

## 📈 **Rate Limiting**

API rate limits are enforced to ensure system stability:

### **Default Limits**
- **Payment Requests**: 100 per minute
- **Status Checks**: 200 per minute
- **Reconciliation**: 10 per hour

### **Rate Limit Headers**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🧪 **Testing & Sandbox**

### **Test Data**
```json
{
    "test_merchant_code": "DBKL_TEST_001",
    "test_api_key": "test_key_12345",
    "test_pass_phrase": "test_phrase",
    "test_amounts": [
        {"amount": "1.00", "expected": "SUCCESS"},
        {"amount": "2.00", "expected": "DECLINED"},
        {"amount": "3.00", "expected": "INSUFFICIENT_FUNDS"}
    ]
}
```

### **Test Bank Codes (FPX)**
- `TEST0001` - Always successful
- `TEST0002` - Always declined
- `TEST0003` - Always timeout

## 🚨 **Error Handling Best Practices**

### **Retry Logic**
```javascript
async function paymentWithRetry(paymentData, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await makePaymentRequest(paymentData);
            return response;
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await sleep(Math.pow(2, i) * 1000); // Exponential backoff
        }
    }
}
```

### **Timeout Handling**
```php
// Set appropriate timeouts
$context = stream_context_create([
    'http' => [
        'timeout' => 30, // 30 seconds
        'method' => 'POST',
        'content' => $postData
    ]
]);
```

## 📞 **Support & Resources**

### **Technical Support**
- **Email**: [tech.support@dbkl.gov.my](mailto:tech.support@dbkl.gov.my)
- **Response Time**: 4 hours (business hours)
- **Support Hours**: Mon-Fri, 9:00 AM - 6:00 PM (Malaysia Time)

### **Documentation**
- [Integration Guide](../integration/architecture)
- [Code Examples](../examples/php)
- [Getting Started](../getting-started/overview)

### **Status Page**
- **System Status**: [status.epayment.dbkl.gov.my](https://status.epayment.dbkl.gov.my)
- **Maintenance Windows**: Announced 48 hours in advance

---

:::tip Need Help?
If you're new to EPIC integration, start with our [Getting Started Guide](../getting-started/overview) for step-by-step instructions.
:::

:::warning Security Notice
- Always validate checksums on responses
- Use HTTPS for all API calls
- Store credentials securely
- Implement proper error handling
- Log all transactions for audit
::: 