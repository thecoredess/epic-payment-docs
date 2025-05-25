---
sidebar_position: 10
---

# Mermaid Diagram Examples

This page demonstrates the various types of Mermaid diagrams you can create directly in markdown without needing external images.

## 🔄 Flow Charts

### Payment Processing Flow

```mermaid
flowchart TD
    A[User initiates payment] --> B{Valid merchant?}
    B -->|Yes| C[Generate transaction ID]
    B -->|No| D[Error: Invalid merchant]
    C --> E[Validate amount & currency]
    E --> F{Amount valid?}
    F -->|Yes| G[Create payment request]
    F -->|No| H[Error: Invalid amount]
    G --> I[Send to payment provider]
    I --> J{Payment successful?}
    J -->|Yes| K[Update transaction status]
    J -->|No| L[Return error to merchant]
    K --> M[Send confirmation to user]
    L --> N[Log failed transaction]
```

### System Architecture Flow

```mermaid
graph LR
    subgraph "Frontend"
        A[Merchant Website]
        B[Payment Form]
    end
    
    subgraph "EPIC Gateway"
        C[API Gateway]
        D[Authentication]
        E[Payment Processor]
        F[Database]
    end
    
    subgraph "Payment Providers"
        G[FPX]
        H[MIGS]
        I[Banks]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    E --> G
    E --> H
    G --> I
    H --> I
```

## 📊 Sequence Diagrams

### Complete Payment Sequence

```mermaid
sequenceDiagram
    participant User
    participant Merchant
    participant EPIC
    participant Bank
    
    User->>Merchant: 1. Select payment method
    Merchant->>EPIC: 2. POST /eps/request
    Note over Merchant,EPIC: TRANS_ID, AMOUNT, MERCHANT_CODE
    
    EPIC->>EPIC: 3. Validate request & checksum
    EPIC->>Bank: 4. Forward payment request
    Bank->>Bank: 5. Process payment
    Bank->>EPIC: 6. Payment response
    EPIC->>Merchant: 7. Redirect with response
    Note over EPIC,Merchant: STATUS, PAYMENT_TRANS_ID, APPROVAL_CODE
    
    Merchant->>User: 8. Show payment result
    
    opt Status Update Request
        Merchant->>EPIC: 9. GET /eps/update
        EPIC->>Merchant: 10. Current status
    end
```

### Error Handling Sequence

```mermaid
sequenceDiagram
    participant M as Merchant
    participant E as EPIC Gateway
    participant P as Payment Provider
    
    M->>E: Payment Request
    
    alt Invalid Checksum
        E->>M: Error: Invalid checksum
    else Network Timeout
        E->>P: Payment Request
        P-->>E: Timeout (no response)
        E->>M: Error: Network timeout
    else Insufficient Funds
        E->>P: Payment Request
        P->>E: Error: Insufficient funds
        E->>M: Error: Transaction declined
    else Successful Payment
        E->>P: Payment Request
        P->>E: Success: Payment approved
        E->>M: Success: Payment completed
    end
```

## 🗂️ Entity Relationship Diagrams

### Database Schema

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
        string status
        datetime created_at
        datetime updated_at
    }
    
    TRANSACTIONS {
        string trans_id PK
        string merchant_code FK
        decimal amount
        string currency
        string status
        string payment_mode
        datetime created_at
    }
    
    PAYMENTS {
        string payment_trans_id PK
        string trans_id FK
        string provider
        string approval_code
        string bank_code
        datetime processed_at
    }
    
    API_KEYS {
        string key_id PK
        string merchant_code FK
        string api_key
        string status
        datetime expires_at
    }
```

## 📈 State Diagrams

### Transaction Status Flow

```mermaid
stateDiagram-v2
    [*] --> Pending: Transaction created
    Pending --> Processing: Payment initiated
    Processing --> Success: Payment approved
    Processing --> Failed: Payment declined
    Processing --> Timeout: Network timeout
    Success --> [*]
    Failed --> [*]
    Timeout --> Retry: Auto retry
    Retry --> Processing: Retry attempt
    Retry --> Failed: Max retries exceeded
```

### API Request States

```mermaid
stateDiagram-v2
    [*] --> Received: Request received
    Received --> Validating: Check parameters
    Validating --> Valid: All checks pass
    Validating --> Invalid: Validation fails
    Valid --> Processing: Forward to provider
    Processing --> Completed: Response received
    Processing --> Error: Provider error
    Invalid --> [*]: Return error
    Completed --> [*]: Return success
    Error --> [*]: Return error
```

## 🏗️ Class Diagrams

### Payment Gateway Classes

```mermaid
classDiagram
    class PaymentGateway {
        +String merchantCode
        +String apiKey
        +processPayment(request)
        +validateChecksum(data)
        +generateResponse()
    }
    
    class Transaction {
        +String transId
        +Decimal amount
        +String currency
        +String status
        +DateTime createdAt
        +validate()
        +updateStatus()
    }
    
    class PaymentProvider {
        <<interface>>
        +processPayment(transaction)
        +getStatus(transactionId)
        +refund(transactionId)
    }
    
    class FPXProvider {
        +String bankCode
        +processPayment(transaction)
        +getBankList()
    }
    
    class MIGSProvider {
        +String acquirerId
        +processPayment(transaction)
        +tokenizeCard()
    }
    
    PaymentGateway --> Transaction: creates
    PaymentGateway --> PaymentProvider: uses
    PaymentProvider <|-- FPXProvider: implements
    PaymentProvider <|-- MIGSProvider: implements
```

## 🌐 Network Diagrams

### System Infrastructure

```mermaid
graph TB
    subgraph "Load Balancers"
        LB1[Primary LB]
        LB2[Secondary LB]
    end
    
    subgraph "Application Servers"
        APP1[App Server 1]
        APP2[App Server 2]
        APP3[App Server 3]
    end
    
    subgraph "Database Cluster"
        DB1[(Primary DB)]
        DB2[(Replica DB)]
        DB3[(Backup DB)]
    end
    
    subgraph "External Services"
        FPX[FPX Network]
        MIGS[MIGS Gateway]
        BANKS[Banking Networks]
    end
    
    Internet --> LB1
    Internet --> LB2
    LB1 --> APP1
    LB1 --> APP2
    LB2 --> APP2
    LB2 --> APP3
    
    APP1 --> DB1
    APP2 --> DB1
    APP3 --> DB1
    DB1 --> DB2
    DB1 --> DB3
    
    APP1 --> FPX
    APP2 --> MIGS
    APP3 --> BANKS
```

## How to Use Mermaid in Your Docs

Simply use the `mermaid` code block in your markdown files:

````markdown
```mermaid
graph TD
    A[Start] --> B[Process]
    B --> C[End]
```
````

### Supported Diagram Types:
- **Flowcharts** (`graph` or `flowchart`)
- **Sequence Diagrams** (`sequenceDiagram`)
- **Class Diagrams** (`classDiagram`)
- **State Diagrams** (`stateDiagram-v2`)
- **Entity Relationship** (`erDiagram`)
- **User Journey** (`journey`)
- **Gantt Charts** (`gantt`)
- **Pie Charts** (`pie`)
- **Git Flow** (`gitgraph`)

No more need for external image files - create professional diagrams directly in your markdown! 
