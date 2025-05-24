---
sidebar_position: 1
---

# PHP Integration

## 🚀 **Complete PHP Integration Guide**

This guide provides a complete, production-ready PHP implementation for integrating with the EPIC payment gateway.

## 📦 **Installation & Setup**

### **1. Download EPIC PHP Library**

```bash
# Option 1: Download from DBKL portal
wget https://epayment.dbkl.gov.my/downloads/epic-php-lib.zip

# Option 2: Install via Composer (if available)
composer require dbkl/epic-payment-gateway
```

### **2. Directory Structure**

```
your-project/
├── config/
│   └── epic.php
├── lib/
│   └── StringEncrypter.php
├── examples/
│   ├── payment-form.php
│   ├── payment-callback.php
│   └── status-check.php
└── logs/
    └── epic.log
```

## 🔧 **Configuration Setup**

### **config/epic.php**

```php
<?php
return [
    'staging' => [
        'request_url' => 'https://epaymentstg.dbkl.gov.my/eps/request',
        'update_url' => 'https://epaymentstg.dbkl.gov.my/eps/update',
        'merchant_code' => 'DBKL_STAGING_001',
        'api_key' => 'your-staging-api-key-here',
        'pass_phrase' => 'your-staging-passphrase',
    ],
    'production' => [
        'request_url' => 'https://epayment.dbkl.gov.my/eps/request',
        'update_url' => 'https://epayment.dbkl.gov.my/eps/update',
        'merchant_code' => 'DBKL_PROD_001',
        'api_key' => 'your-production-api-key-here',
        'pass_phrase' => 'your-production-passphrase',
    ],
    'environment' => 'staging', // Change to 'production' for live
    
    // DBKL-specific configuration
    'dbkl_fields' => [
        'KOD_HASIL' => 'required',
        'PROCESS_CODE' => 'required', 
        'MODULE_ID' => 'required',
        'EMAIL' => 'optional',
        'CUST_NAME' => 'optional',
        'CUST_PHONE' => 'optional',
    ],
    
    // Logging and debugging
    'enable_logging' => true,
    'log_file' => __DIR__ . '/../logs/epic.log',
    'debug_mode' => false,
];
```

## 🔐 **EPIC Payment Class**

### **lib/EpicPayment.php**

```php
<?php

require_once 'StringEncrypter.php';

class EpicPayment 
{
    private $config;
    private $encrypter;
    private $environment;
    
    public function __construct($configPath = null) 
    {
        $this->config = require($configPath ?: __DIR__ . '/../config/epic.php');
        $this->environment = $this->config['environment'];
        
        $envConfig = $this->config[$this->environment];
        $this->encrypter = new StringEncrypter(
            $envConfig['api_key'], 
            $envConfig['pass_phrase']
        );
    }
    
    /**
     * Generate payment request URL with all parameters
     */
    public function createPaymentRequest($params) 
    {
        // Validate required parameters
        $this->validatePaymentParams($params);
        
        // Get environment configuration
        $envConfig = $this->config[$this->environment];
        
        // Prepare payment data
        $paymentData = [
            'TRANS_ID' => $params['trans_id'],
            'AMOUNT' => number_format($params['amount'], 2, '.', ''),
            'MERCHANT_CODE' => $envConfig['merchant_code'],
            'PAYMENT_MODE' => $params['payment_mode'],
            'RESPONSE_URL' => $params['response_url'],
            'BANK_CODE' => $params['bank_code'] ?? '',
        ];
        
        // Add DBKL-specific fields
        $this->addDbklFields($paymentData, $params);
        
        // Generate checksum
        $checksumData = $paymentData['TRANS_ID'] . 
                       $paymentData['PAYMENT_MODE'] . 
                       $paymentData['AMOUNT'] . 
                       $paymentData['MERCHANT_CODE'];
                       
        $paymentData['CHECKSUM'] = $this->encrypter->encrypt($checksumData);
        
        // Log the request
        $this->logTransaction('REQUEST', $paymentData);
        
        return [
            'url' => $envConfig['request_url'],
            'data' => $paymentData,
            'method' => 'POST'
        ];
    }
    
    /**
     * Process payment response/callback
     */
    public function processResponse($responseData) 
    {
        try {
            // Log the response
            $this->logTransaction('RESPONSE', $responseData);
            
            // Validate response checksum
            if (!$this->validateResponseChecksum($responseData)) {
                throw new Exception('Invalid response checksum');
            }
            
            // Process the response
            $result = [
                'status' => $responseData['STATUS'] ?? 'UNKNOWN',
                'status_code' => $responseData['STATUS_CODE'] ?? '',
                'status_message' => $responseData['STATUS_MESSAGE'] ?? '',
                'trans_id' => $responseData['TRANS_ID'] ?? '',
                'payment_trans_id' => $responseData['PAYMENT_TRANS_ID'] ?? '',
                'approval_code' => $responseData['APPROVAL_CODE'] ?? '',
                'amount' => $responseData['AMOUNT'] ?? '',
                'is_successful' => $this->isSuccessfulPayment($responseData),
                'timestamp' => date('Y-m-d H:i:s'),
            ];
            
            return $result;
            
        } catch (Exception $e) {
            $this->logError('Error processing response: ' . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Check transaction status
     */
    public function checkTransactionStatus($transId) 
    {
        $envConfig = $this->config[$this->environment];
        
        $statusData = [
            'TRANS_ID' => $transId,
            'MERCHANT_CODE' => $envConfig['merchant_code'],
        ];
        
        // Generate checksum for status check
        $checksumData = $transId . $envConfig['merchant_code'];
        $statusData['CHECKSUM'] = $this->encrypter->encrypt($checksumData);
        
        // Make HTTP request to status endpoint
        $response = $this->makeHttpRequest($envConfig['update_url'], $statusData);
        
        return $this->processResponse($response);
    }
    
    /**
     * Validate payment parameters
     */
    private function validatePaymentParams($params) 
    {
        $required = ['trans_id', 'amount', 'payment_mode', 'response_url'];
        
        foreach ($required as $field) {
            if (empty($params[$field])) {
                throw new InvalidArgumentException("Missing required field: {$field}");
            }
        }
        
        // Validate amount
        if (!is_numeric($params['amount']) || $params['amount'] <= 0) {
            throw new InvalidArgumentException("Invalid amount: must be a positive number");
        }
        
        // Validate payment mode
        $validModes = ['fpx', 'fpx1', 'migs'];
        if (!in_array($params['payment_mode'], $validModes)) {
            throw new InvalidArgumentException("Invalid payment mode: must be one of " . implode(', ', $validModes));
        }
        
        // Validate transaction ID format
        if (!preg_match('/^[A-Za-z0-9_-]{1,50}$/', $params['trans_id'])) {
            throw new InvalidArgumentException("Invalid transaction ID format");
        }
    }
    
    /**
     * Add DBKL-specific fields
     */
    private function addDbklFields(&$paymentData, $params) 
    {
        $dbklFields = $this->config['dbkl_fields'];
        
        foreach ($dbklFields as $field => $requirement) {
            if (isset($params[strtolower($field)])) {
                $paymentData[$field] = $params[strtolower($field)];
            } elseif ($requirement === 'required') {
                throw new InvalidArgumentException("Missing required DBKL field: {$field}");
            }
        }
    }
    
    /**
     * Validate response checksum
     */
    private function validateResponseChecksum($responseData) 
    {
        if (empty($responseData['CHECKSUM'])) {
            return false;
        }
        
        // Build checksum data (this may vary based on EPIC documentation)
        $checksumData = ($responseData['TRANS_ID'] ?? '') . 
                       ($responseData['STATUS'] ?? '') . 
                       ($responseData['AMOUNT'] ?? '');
        
        try {
            $expectedChecksum = $this->encrypter->encrypt($checksumData);
            return hash_equals($expectedChecksum, $responseData['CHECKSUM']);
        } catch (Exception $e) {
            $this->logError('Checksum validation error: ' . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Check if payment was successful
     */
    private function isSuccessfulPayment($responseData) 
    {
        $successCodes = ['00', '000', 'SUCCESS'];
        $status = $responseData['STATUS'] ?? '';
        $statusCode = $responseData['STATUS_CODE'] ?? '';
        
        return (strtoupper($status) === 'SUCCESS' || in_array($statusCode, $successCodes));
    }
    
    /**
     * Make HTTP request
     */
    private function makeHttpRequest($url, $data) 
    {
        $postData = http_build_query($data);
        
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => 'Content-Type: application/x-www-form-urlencoded',
                'content' => $postData,
                'timeout' => 30,
            ],
        ]);
        
        $response = file_get_contents($url, false, $context);
        
        if ($response === false) {
            throw new Exception('Failed to connect to EPIC gateway');
        }
        
        // Parse response (assuming form-encoded response)
        parse_str($response, $responseArray);
        return $responseArray;
    }
    
    /**
     * Log transaction
     */
    private function logTransaction($type, $data) 
    {
        if (!$this->config['enable_logging']) {
            return;
        }
        
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'type' => $type,
            'environment' => $this->environment,
            'data' => $this->sanitizeLogData($data),
        ];
        
        $logLine = json_encode($logEntry) . PHP_EOL;
        file_put_contents($this->config['log_file'], $logLine, FILE_APPEND | LOCK_EX);
    }
    
    /**
     * Log error
     */
    private function logError($message) 
    {
        $this->logTransaction('ERROR', ['message' => $message]);
    }
    
    /**
     * Sanitize log data (remove sensitive information)
     */
    private function sanitizeLogData($data) 
    {
        $sensitiveFields = ['CHECKSUM', 'api_key', 'pass_phrase'];
        $sanitized = $data;
        
        foreach ($sensitiveFields as $field) {
            if (isset($sanitized[$field])) {
                $sanitized[$field] = '***HIDDEN***';
            }
        }
        
        return $sanitized;
    }
}
```

## 🎯 **Usage Examples**

### **1. Payment Form (payment-form.php)**

```php
<?php
require_once 'lib/EpicPayment.php';

try {
    $epic = new EpicPayment();
    
    // Payment parameters
    $paymentParams = [
        'trans_id' => 'TXN' . date('YmdHis') . rand(1000, 9999),
        'amount' => 150.75,
        'payment_mode' => 'fpx',
        'response_url' => 'https://yourwebsite.com/payment-callback.php',
        'bank_code' => 'MBB0227', // Optional for FPX
        
        // DBKL-specific fields
        'kod_hasil' => 'KH001',
        'process_code' => 'PC001',
        'module_id' => 'MD001',
        'email' => 'customer@example.com',
        'cust_name' => 'John Doe',
        'cust_phone' => '0123456789',
    ];
    
    $paymentRequest = $epic->createPaymentRequest($paymentParams);
    
} catch (Exception $e) {
    die('Error: ' . $e->getMessage());
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>EPIC Payment</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .payment-container {
            max-width: 500px;
            margin: 50px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-family: Arial, sans-serif;
        }
        .amount { font-size: 24px; font-weight: bold; color: #2c5aa0; }
        .btn-pay {
            background: #28a745;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            width: 100%;
        }
        .btn-pay:hover { background: #218838; }
    </style>
</head>
<body>
    <div class="payment-container">
        <h2>🏛️ DBKL Payment Portal</h2>
        <p><strong>Transaction ID:</strong> <?= htmlspecialchars($paymentParams['trans_id']) ?></p>
        <p><strong>Amount:</strong> <span class="amount">RM <?= number_format($paymentParams['amount'], 2) ?></span></p>
        <p><strong>Payment Method:</strong> <?= strtoupper($paymentParams['payment_mode']) ?></p>
        
        <form method="POST" action="<?= $paymentRequest['url'] ?>">
            <?php foreach ($paymentRequest['data'] as $key => $value): ?>
                <input type="hidden" name="<?= htmlspecialchars($key) ?>" value="<?= htmlspecialchars($value) ?>">
            <?php endforeach; ?>
            
            <button type="submit" class="btn-pay">
                🔐 Proceed to Secure Payment
            </button>
        </form>
        
        <p><small>You will be redirected to EPIC secure payment gateway</small></p>
    </div>
</body>
</html>
```

### **2. Payment Callback Handler (payment-callback.php)**

```php
<?php
require_once 'lib/EpicPayment.php';

try {
    $epic = new EpicPayment();
    
    // Process the payment response
    $paymentResult = $epic->processResponse($_POST);
    
    // Store the result in your database
    savePaymentResult($paymentResult);
    
    if ($paymentResult['is_successful']) {
        // Payment successful
        redirectToSuccessPage($paymentResult);
    } else {
        // Payment failed
        redirectToFailurePage($paymentResult);
    }
    
} catch (Exception $e) {
    // Log error and redirect to error page
    error_log('Payment callback error: ' . $e->getMessage());
    redirectToErrorPage('Payment processing error');
}

function savePaymentResult($result) {
    // Your database logic here
    // Example with PDO:
    /*
    $pdo = new PDO($dsn, $username, $password);
    $stmt = $pdo->prepare("
        UPDATE payments 
        SET status = ?, payment_trans_id = ?, approval_code = ?, updated_at = NOW()
        WHERE trans_id = ?
    ");
    $stmt->execute([
        $result['status'],
        $result['payment_trans_id'],
        $result['approval_code'],
        $result['trans_id']
    ]);
    */
}

function redirectToSuccessPage($result) {
    $params = http_build_query([
        'status' => 'success',
        'trans_id' => $result['trans_id'],
        'amount' => $result['amount'],
    ]);
    header("Location: success.php?{$params}");
    exit;
}

function redirectToFailurePage($result) {
    $params = http_build_query([
        'status' => 'failed',
        'trans_id' => $result['trans_id'],
        'message' => $result['status_message'],
    ]);
    header("Location: failure.php?{$params}");
    exit;
}

function redirectToErrorPage($message) {
    $params = http_build_query(['error' => $message]);
    header("Location: error.php?{$params}");
    exit;
}
?>
```

### **3. Transaction Status Check (status-check.php)**

```php
<?php
require_once 'lib/EpicPayment.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['trans_id'])) {
    try {
        $epic = new EpicPayment();
        $transId = $_POST['trans_id'];
        
        $status = $epic->checkTransactionStatus($transId);
        
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'data' => $status
        ]);
        
    } catch (Exception $e) {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Transaction Status Check</title>
    <style>
        .container { max-width: 600px; margin: 50px auto; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        .result { margin-top: 20px; padding: 15px; border-radius: 5px; }
        .success { background: #d4edda; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; border: 1px solid #f5c6cb; }
    </style>
</head>
<body>
    <div class="container">
        <h2>🔍 Transaction Status Check</h2>
        
        <form id="statusForm">
            <div class="form-group">
                <label for="trans_id">Transaction ID:</label>
                <input type="text" id="trans_id" name="trans_id" required 
                       placeholder="Enter transaction ID" style="width: 100%; padding: 8px;">
            </div>
            <button type="submit">Check Status</button>
        </form>
        
        <div id="result" style="display: none;"></div>
    </div>

    <script>
    document.getElementById('statusForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const resultDiv = document.getElementById('result');
        
        try {
            const response = await fetch('status-check.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                const status = data.data;
                resultDiv.innerHTML = `
                    <div class="result ${status.is_successful ? 'success' : 'error'}">
                        <h3>Transaction Status</h3>
                        <p><strong>Status:</strong> ${status.status}</p>
                        <p><strong>Message:</strong> ${status.status_message}</p>
                        <p><strong>Payment ID:</strong> ${status.payment_trans_id}</p>
                        <p><strong>Amount:</strong> RM ${status.amount}</p>
                        <p><strong>Approval Code:</strong> ${status.approval_code}</p>
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `
                    <div class="result error">
                        <h3>Error</h3>
                        <p>${data.error}</p>
                    </div>
                `;
            }
            
            resultDiv.style.display = 'block';
            
        } catch (error) {
            resultDiv.innerHTML = `
                <div class="result error">
                    <h3>Error</h3>
                    <p>Failed to check transaction status</p>
                </div>
            `;
            resultDiv.style.display = 'block';
        }
    });
    </script>
</body>
</html>
```

## 🔒 **Security Best Practices**

### **1. Environment Configuration**
```php
// Use environment variables for sensitive data
$config = [
    'api_key' => $_ENV['EPIC_API_KEY'] ?? '',
    'pass_phrase' => $_ENV['EPIC_PASS_PHRASE'] ?? '',
    'merchant_code' => $_ENV['EPIC_MERCHANT_CODE'] ?? '',
];

// Validate configuration
if (empty($config['api_key'])) {
    throw new Exception('EPIC API key not configured');
}
```

### **2. Request Validation**
```php
// Validate all incoming data
function validateInput($data, $rules) {
    foreach ($rules as $field => $rule) {
        if ($rule['required'] && empty($data[$field])) {
            throw new InvalidArgumentException("Missing required field: {$field}");
        }
        
        if (!empty($data[$field]) && isset($rule['pattern'])) {
            if (!preg_match($rule['pattern'], $data[$field])) {
                throw new InvalidArgumentException("Invalid format for field: {$field}");
            }
        }
    }
}

$validationRules = [
    'trans_id' => ['required' => true, 'pattern' => '/^[A-Za-z0-9_-]{1,50}$/'],
    'amount' => ['required' => true, 'pattern' => '/^\d+(\.\d{2})?$/'],
    'email' => ['required' => false, 'pattern' => '/^[^\s@]+@[^\s@]+\.[^\s@]+$/'],
];
```

### **3. Error Handling**
```php
// Custom exception for EPIC-specific errors
class EpicPaymentException extends Exception {
    private $errorCode;
    
    public function __construct($message, $errorCode = null, $previous = null) {
        parent::__construct($message, 0, $previous);
        $this->errorCode = $errorCode;
    }
    
    public function getErrorCode() {
        return $this->errorCode;
    }
}

// Graceful error handling
try {
    $result = $epic->processPayment($params);
} catch (EpicPaymentException $e) {
    // Handle EPIC-specific errors
    $this->logError("EPIC Error [{$e->getErrorCode()}]: {$e->getMessage()}");
    $this->showUserFriendlyError('Payment service temporarily unavailable');
} catch (Exception $e) {
    // Handle general errors
    $this->logError("General Error: {$e->getMessage()}");
    $this->showUserFriendlyError('An unexpected error occurred');
}
```

---

:::tip Testing Your Integration
Use the staging environment for testing. The staging credentials will be provided separately by DBKL technical team.
:::

:::warning Security Notice
- Never commit API keys or passphrases to version control
- Use HTTPS for all payment-related pages
- Validate all input parameters
- Log all transactions for audit purposes
- Regularly rotate your API credentials
::: 
