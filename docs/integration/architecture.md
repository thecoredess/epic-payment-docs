---
sidebar_position: 1
---

# Integration Architecture

## 🏗️ **System Architecture Overview**

The EPIC payment gateway follows a secure, multi-layered architecture designed for high availability, security, and scalability.

```mermaid
graph TB
    subgraph "Merchant Environment"
        MW[Merchant Website]
        MS[Merchant Server]
        MD[Merchant Database]
    end
    
    subgraph "EPIC Gateway"
        ELB[Load Balancer]
        EPS[EPIC Payment Service]
        EDB[(EPIC Database)]
        ESM[Security Module]
    end
    
    subgraph "Payment Providers"
        FPX[FPX Network]
        MIGS[MIGS Gateway]
        BANKS[(Banking Networks)]
    end
    
    subgraph "DBKL Systems"
        DBS[DBKL Backend]
        DDB[(DBKL Database)]
        DRP[Reconciliation Platform]
    end
    
    MW --> ELB
    ELB --> EPS
    EPS --> ESM
    EPS --> EDB
    EPS --> FPX
    EPS --> MIGS
    FPX --> BANKS
    MIGS --> BANKS
    EPS --> DBS
    DBS --> DDB
    DRP --> EDB
    DRP --> DDB
    
    MS --> MD
    MW --> MS
```

## 🔄 **Payment Flow Sequence**

### **Standard Payment Flow**

```mermaid
sequenceDiagram
    participant M as Merchant
    participant E as EPIC Gateway
    participant P as Payment Provider
    participant B as Bank

    M->>E: 1. Payment Request (POST)
    Note over M,E: Include: TRANS_ID, AMOUNT, MERCHANT_CODE, CHECKSUM
    
    E->>E: 2. Validate Request & Checksum
    
    alt Valid Request
        E->>P: 3. Forward to Payment Provider
        P->>B: 4. Process Payment
        B->>P: 5. Payment Response
        P->>E: 6. Return Result
        E->>M: 7. Redirect with Response
        Note over E,M: Include: STATUS, PAYMENT_TRANS_ID, APPROVAL_CODE
    else Invalid Request
        E->>M: Error Response
        Note over E,M: STATUS_CODE: Error details
    end
    
    M->>E: 8. Status Update Request (Optional)
    E->>M: 9. Current Transaction Status
```

## 🛠️ **Integration Components**

### **1. Request Handler**
- **Purpose**: Process incoming payment requests
- **Technology**: RESTful API endpoints
- **Security**: Checksum validation, rate limiting
- **Scalability**: Horizontal scaling with load balancing

### **2. Security Module**
- **Encryption**: AES-256 encryption for sensitive data
- **Authentication**: Merchant key validation
- **Integrity**: SHA-256 checksum verification
- **Audit**: Complete transaction logging

### **3. Payment Router**
- **FPX Integration**: Direct connection to PayNet
- **MIGS Integration**: Mastercard Internet Gateway Service
- **Bank List Management**: Dynamic bank list updates
- **Failover**: Automatic provider switching

### **4. Response Handler**
- **Real-time Updates**: Instant status notifications
- **Webhook Support**: Asynchronous notifications
- **Error Handling**: Graceful degradation
- **Retry Logic**: Exponential backoff for failures

## 🔐 **Security Architecture**

### **Multi-Layer Security**

```mermaid
graph TD
    A[Internet] --> B[WAF - Web Application Firewall]
    B --> C[Load Balancer with SSL Termination]
    C --> D[API Gateway]
    D --> E[Application Layer Security]
    E --> F[Database Encryption]
    
    subgraph "Security Controls"
        G[Rate Limiting]
        H[DDoS Protection]
        I[Intrusion Detection]
        J[Data Loss Prevention]
    end
    
    B --> G
    C --> H
    D --> I
    E --> J
```

### **Security Features**
- **SSL/TLS 1.3**: End-to-end encryption
- **PCI DSS Compliance**: Credit card data protection
- **Tokenization**: Sensitive data replacement
- **Fraud Detection**: Real-time transaction monitoring
- **Access Control**: Role-based permissions

## 🔗 **API Endpoints Architecture**

### **Primary Endpoints**

| Endpoint | Method | Purpose | Rate Limit |
|----------|--------|---------|------------|
| `/eps/request` | POST | Initiate payment | 100/min |
| `/eps/update` | POST | Status updates | 200/min |
| `/eps/callback` | POST | Async notifications | Unlimited |
| `/eps/reconcile` | GET | Transaction reconciliation | 10/min |

### **Request/Response Flow**

```php
// Request Structure
POST https://epaymentstg.dbkl.gov.my/eps/request
Content-Type: application/x-www-form-urlencoded

TRANS_ID=TXN20240101001
AMOUNT=100.50
MERCHANT_CODE=DBKL001
PAYMENT_MODE=fpx
CHECKSUM=encrypted_validation_string
// ... additional DBKL-specific fields
```

```json
// Response Structure
{
    "STATUS": "SUCCESS",
    "STATUS_CODE": "00",
    "STATUS_MESSAGE": "Transaction Successful",
    "PAYMENT_TRANS_ID": "EPG20240101001",
    "APPROVAL_CODE": "123456",
    "TRANS_ID": "TXN20240101001",
    "AMOUNT": "100.50",
    "CHECKSUM": "response_validation_string"
}
```

## 📊 **Data Architecture**

### **Database Schema Overview**

```mermaid
erDiagram
    MERCHANTS ||--o{ TRANSACTIONS : creates
    TRANSACTIONS ||--o{ PAYMENTS : contains
    PAYMENTS ||--o{ RECONCILIATION : matches
    MERCHANTS ||--o{ API_KEYS : has
    TRANSACTIONS ||--o{ AUDIT_LOGS : generates
    
    MERCHANTS {
        string merchant_code PK
        string merchant_name
        string contact_email
        string api_key
        string pass_phrase
        datetime created_at
        boolean is_active
    }
    
    TRANSACTIONS {
        string trans_id PK
        string merchant_code FK
        decimal amount
        string payment_mode
        string status
        datetime created_at
        datetime updated_at
    }
    
    PAYMENTS {
        string payment_trans_id PK
        string trans_id FK
        string approval_code
        string bank_reference
        datetime payment_date
        string payment_status
    }
```

### **Data Flow**
1. **Transaction Creation**: Merchant initiates payment
2. **Validation**: System validates request integrity
3. **Processing**: Payment routed to appropriate provider
4. **Response**: Real-time status update
5. **Reconciliation**: Daily matching with bank records
6. **Reporting**: Business intelligence and analytics

## 🚀 **Performance & Scalability**

### **Performance Targets**
- **Response Time**: < 2 seconds for payment initiation
- **Throughput**: 10,000 transactions per minute
- **Availability**: 99.9% uptime (8.76 hours downtime/year)
- **Scalability**: Horizontal scaling to handle peak loads

### **Caching Strategy**
- **Redis**: Session and temporary data
- **CDN**: Static assets and documentation
- **Database**: Query result caching
- **API**: Response caching for stable data

## 🔄 **Integration Patterns**

### **Synchronous Integration**
```php
// Direct API call for immediate response
$response = $epic->processPayment([
    'trans_id' => 'TXN001',
    'amount' => 100.50,
    'payment_mode' => 'fpx'
]);

if ($response['status'] === 'SUCCESS') {
    // Handle successful payment
    redirectToSuccessPage($response);
} else {
    // Handle payment failure
    showErrorMessage($response['status_message']);
}
```

### **Asynchronous Integration**
```php
// Webhook handler for status updates
public function handleWebhook(Request $request) {
    $payload = $request->all();
    
    // Verify webhook signature
    if (!$this->verifySignature($payload)) {
        return response('Unauthorized', 401);
    }
    
    // Process status update
    $this->updateTransactionStatus($payload);
    
    return response('OK', 200);
}
```

## 📈 **Monitoring & Analytics**

### **Key Metrics**
- **Transaction Volume**: Real-time and historical
- **Success Rates**: By payment method and time
- **Error Rates**: Detailed error categorization
- **Performance**: Response times and throughput
- **Security**: Failed authentication attempts

### **Alerting System**
- **Critical**: System downtime, security breaches
- **Warning**: High error rates, performance degradation
- **Info**: Unusual transaction patterns, maintenance windows

---

:::tip Next Steps
Now that you understand the architecture, you can proceed to implement your integration using our [PHP Code Examples](../examples/php) or explore the [API Reference](../api/overview) for detailed technical specifications.
:::
