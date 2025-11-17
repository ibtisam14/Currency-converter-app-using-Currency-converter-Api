// Currency data storage
let currencies = [];

// Get DOM elements
const baseSelect = document.getElementById('base');
const targetSelect = document.getElementById('target');
const convertBtn = document.getElementById('convertBtn');
const swapBtn = document.getElementById('swapBtn');
const amountInput = document.getElementById('amount');
const loading = document.getElementById('loading');
const resultDiv = document.getElementById('result');
const currencySymbol = document.querySelector('.currency-symbol');

// Enhanced currency names mapping
function getCurrencyName(code) {
    const currencyNames = {
        'USD': 'US Dollar', 'EUR': 'Euro', 'GBP': 'British Pound',
        'JPY': 'Japanese Yen', 'CAD': 'Canadian Dollar', 'AUD': 'Australian Dollar',
        'CHF': 'Swiss Franc', 'CNY': 'Chinese Yuan', 'INR': 'Indian Rupee',
        'PKR': 'Pakistani Rupee', 'AED': 'UAE Dirham', 'SAR': 'Saudi Riyal',
        'KRW': 'South Korean Won', 'BRL': 'Brazilian Real', 'RUB': 'Russian Ruble',
        'TRY': 'Turkish Lira', 'ZAR': 'South African Rand', 'MXN': 'Mexican Peso',
        'SGD': 'Singapore Dollar', 'NZD': 'New Zealand Dollar', 'SEK': 'Swedish Krona',
        'NOK': 'Norwegian Krone', 'DKK': 'Danish Krone', 'PLN': 'Polish Zloty',
        'THB': 'Thai Baht', 'IDR': 'Indonesian Rupiah', 'HKD': 'Hong Kong Dollar',
        'MYR': 'Malaysian Ringgit', 'PHP': 'Philippine Peso', 'CZK': 'Czech Koruna',
        'HUF': 'Hungarian Forint', 'ILS': 'Israeli Shekel', 'EGP': 'Egyptian Pound',
        'CLP': 'Chilean Peso', 'COP': 'Colombian Peso', 'PEN': 'Peruvian Sol',
        'VND': 'Vietnamese Dong', 'BDT': 'Bangladeshi Taka', 'NGN': 'Nigerian Naira',
        'ARS': 'Argentine Peso', 'QAR': 'Qatari Riyal', 'KWD': 'Kuwaiti Dinar',
        'OMR': 'Omani Rial', 'BHD': 'Bahraini Dinar', 'JOD': 'Jordanian Dinar',
        'LKR': 'Sri Lankan Rupee', 'NPR': 'Nepalese Rupee', 'UAH': 'Ukrainian Hryvnia',
        'RON': 'Romanian Leu', 'BGN': 'Bulgarian Lev', 'HRK': 'Croatian Kuna',
        'ISK': 'Icelandic Króna', 'RSD': 'Serbian Dinar', 'UYU': 'Uruguayan Peso'
    };
    return currencyNames[code] || code;
}

// Get currency symbol
function getCurrencySymbol(code) {
    const symbols = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': 'C$',
        'AUD': 'A$', 'CHF': 'CHF', 'CNY': '¥', 'INR': '₹', 'PKR': '₨',
        'AED': 'د.إ', 'SAR': '﷼', 'KRW': '₩', 'BRL': 'R$', 'RUB': '₽',
        'TRY': '₺', 'ZAR': 'R', 'MXN': '$', 'SGD': 'S$', 'NZD': 'NZ$',
        'SEK': 'kr', 'NOK': 'kr', 'DKK': 'kr', 'PLN': 'zł', 'THB': '฿',
        'IDR': 'Rp', 'HKD': 'HK$', 'MYR': 'RM', 'PHP': '₱', 'CZK': 'Kč',
        'HUF': 'Ft', 'ILS': '₪', 'EGP': 'E£', 'CLP': 'CLP$', 'COP': 'COL$',
        'PEN': 'S/', 'VND': '₫', 'BDT': '৳', 'NGN': '₦', 'ARS': 'AR$',
        'QAR': 'QR', 'KWD': 'KD', 'OMR': '﷼', 'BHD': 'BD', 'JOD': 'JD',
        'LKR': 'Rs', 'NPR': 'Rs', 'UAH': '₴', 'RON': 'lei', 'BGN': 'лв',
        'HRK': 'kn', 'ISK': 'kr', 'RSD': 'дин', 'UYU': '$U'
    };
    return symbols[code] || code;
}

// Format currency amount
function formatCurrency(amount, currencyCode) {
    const symbol = getCurrencySymbol(currencyCode);
    const formattedAmount = parseFloat(amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return `${symbol}${formattedAmount}`;
}

// Update currency symbol when base currency changes
function updateCurrencySymbol() {
    const baseCurrency = baseSelect.value;
    if (baseCurrency && getCurrencySymbol(baseCurrency)) {
        currencySymbol.textContent = getCurrencySymbol(baseCurrency);
    }
}

// Fetch available currencies from public API
async function fetchCurrencies() {
    try {
        // Show loading state initially
        baseSelect.innerHTML = '<option value="">Loading currencies...</option>';
        targetSelect.innerHTML = '<option value="">Loading currencies...</option>';

        // Using a more reliable API for currency codes
        const response = await fetch('https://api.frankfurter.app/currencies');
        if (!response.ok) throw new Error('API not available');

        const data = await response.json();

        // Convert the API response to our format
        currencies = Object.keys(data).map(code => ({
            code: code,
            name: data[code] || getCurrencyName(code)
        }));

        // Sort currencies alphabetically by code
        currencies.sort((a, b) => a.code.localeCompare(b.code));

        populateCurrencyDropdowns();

    } catch (error) {
        console.error('Error fetching currencies:', error);
        // Enhanced fallback to major currencies if API fails
        currencies = [
            { code: 'USD', name: 'US Dollar' }, { code: 'EUR', name: 'Euro' },
            { code: 'GBP', name: 'British Pound' }, { code: 'JPY', name: 'Japanese Yen' },
            { code: 'CAD', name: 'Canadian Dollar' }, { code: 'AUD', name: 'Australian Dollar' },
            { code: 'CHF', name: 'Swiss Franc' }, { code: 'CNY', name: 'Chinese Yuan' },
            { code: 'INR', name: 'Indian Rupee' }, { code: 'PKR', name: 'Pakistani Rupee' },
            { code: 'AED', name: 'UAE Dirham' }, { code: 'SAR', name: 'Saudi Riyal' },
            { code: 'SGD', name: 'Singapore Dollar' }, { code: 'KRW', name: 'South Korean Won' },
            { code: 'TRY', name: 'Turkish Lira' }, { code: 'RUB', name: 'Russian Ruble' },
            { code: 'BRL', name: 'Brazilian Real' }, { code: 'ZAR', name: 'South African Rand' },
            { code: 'MXN', name: 'Mexican Peso' }, { code: 'NZD', name: 'New Zealand Dollar' },
            { code: 'SEK', name: 'Swedish Krona' }, { code: 'NOK', name: 'Norwegian Krone' }
        ];
        populateCurrencyDropdowns();
    }
}

// Populate both dropdown menus with currencies
function populateCurrencyDropdowns() {
    // Clear existing options
    baseSelect.innerHTML = '';
    targetSelect.innerHTML = '';

    // Add default option
    const defaultOption = new Option('Select currency...', '');
    baseSelect.add(defaultOption.cloneNode(true));
    targetSelect.add(defaultOption.cloneNode(true));

    // Add options to both dropdowns
    currencies.forEach(currency => {
        const baseOption = new Option(`${currency.code} - ${currency.name}`, currency.code);
        const targetOption = new Option(`${currency.code} - ${currency.name}`, currency.code);

        baseSelect.add(baseOption);
        targetSelect.add(targetOption);
    });

    // Set default values
    baseSelect.value = 'USD';
    targetSelect.value = 'PKR';

    // Update currency symbol
    updateCurrencySymbol();
}

// Swap currencies function
function swapCurrencies() {
    const baseValue = baseSelect.value;
    const targetValue = targetSelect.value;

    if (baseValue && targetValue) {
        baseSelect.value = targetValue;
        targetSelect.value = baseValue;
        updateCurrencySymbol();

        // If there's a result, trigger conversion immediately
        if (resultDiv.innerHTML) {
            convertCurrency();
        }
    }
}

// Get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

// Main conversion function
async function convertCurrency() {
    // Get values
    const base = baseSelect.value || 'USD';
    const target = targetSelect.value || 'PKR';
    const amount = parseFloat(amountInput.value) || 1;

    // Validate selection
    if (!base || !target) {
        resultDiv.innerHTML = `
            <div class="error-card">
                <div class="error-header">
                    <span class="error-icon">❌</span>
                    <h3 class="error-title">Selection Required</h3>
                </div>
                <p>Please select both source and target currencies to continue.</p>
            </div>`;
        return;
    }

    if (base === target) {
        resultDiv.innerHTML = `
            <div class="error-card">
                <div class="error-header">
                    <span class="error-icon">⚠️</span>
                    <h3 class="error-title">Same Currency</h3>
                </div>
                <p>Please select different currencies for conversion.</p>
            </div>`;
        return;
    }

    if (!amount || amount <= 0) {
        resultDiv.innerHTML = `
            <div class="error-card">
                <div class="error-header">
                    <span class="error-icon">💰</span>
                    <h3 class="error-title">Invalid Amount</h3>
                </div>
                <p>Please enter a valid positive amount to convert.</p>
            </div>`;
        return;
    }

    // Show loading state
    loading.style.display = 'block';
    convertBtn.disabled = true;
    convertBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Converting...</span>';
    resultDiv.innerHTML = '';

    try {
        const response = await fetch('/exchange/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                base: base,
                target: target,
                amount: amount
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'success') {
            showResult(data);
        } else {
            showError(data.message || 'Unable to fetch exchange rates. Please try again.');
        }
    } catch (error) {
        console.error('Conversion error:', error);
        showError('Network error. Please check your connection and try again.');
    } finally {
        // Hide loading state
        loading.style.display = 'none';
        convertBtn.disabled = false;
        convertBtn.innerHTML = '<span class="btn-icon">🚀</span><span class="btn-text">Convert Now</span>';
    }
}

// Show conversion result
function showResult(data) {
    const originalAmount = formatCurrency(data.amount, data.base_currency);
    const convertedAmount = formatCurrency(data.converted_amount, data.target_currency);

    resultDiv.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <h3 class="result-title">
                    <span class="result-icon">💫</span>
                    Conversion Complete
                </h3>
            </div>
            <div class="result-grid">
                <div class="result-item">
                    <span class="result-label">Source Currency:</span>
                    <span class="result-value">${data.base_currency} - ${getCurrencyName(data.base_currency)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Target Currency:</span>
                    <span class="result-value">${data.target_currency} - ${getCurrencyName(data.target_currency)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Exchange Rate:</span>
                    <span class="result-value">1 ${data.base_currency} = ${parseFloat(data.exchange_rate).toFixed(6)} ${data.target_currency}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Original Amount:</span>
                    <span class="result-value">${originalAmount}</span>
                </div>
                <div class="result-item" style="margin-top: 16px; padding-top: 16px; border-top: 2px solid rgba(255,255,255,0.2);">
                    <span class="result-label" style="font-size: 16px; font-weight: 600;">Converted Amount:</span>
                    <div class="result-highlight">${convertedAmount}</div>
                </div>
            </div>
        </div>`;
}

// Show error message
function showError(message) {
    resultDiv.innerHTML = `
        <div class="error-card">
            <div class="error-header">
                <span class="error-icon">🌐</span>
                <h3 class="error-title">Conversion Failed</h3>
            </div>
            <p>${message}</p>
        </div>`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the currency dropdowns when page loads
    fetchCurrencies();

    // Add click event to convert button
    convertBtn.addEventListener('click', convertCurrency);

    // Add click event to swap button
    swapBtn.addEventListener('click', swapCurrencies);

    // Update currency symbol when base currency changes
    baseSelect.addEventListener('change', updateCurrencySymbol);

    // Allow Enter key to trigger conversion
    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            convertCurrency();
        }
    });

    // Real-time validation for amount input
    amountInput.addEventListener('input', function () {
        if (this.value < 0) {
            this.value = 0.01;
        }
        // Format the value to 2 decimal places
        if (this.value.includes('.')) {
            const parts = this.value.split('.');
            if (parts[1].length > 2) {
                this.value = parseFloat(this.value).toFixed(2);
            }
        }
    });

    // Add focus effects
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function () {
            this.parentElement.classList.remove('focused');
        });
    });
});

// Add some utility CSS via JavaScript
const style = document.createElement('style');
style.textContent = `
    .focused {
        transform: translateY(-1px);
    }
    
    .select-wrapper.focused .currency-select {
        border-color: #4299e1;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    }
    
    .amount-input-wrapper.focused .amount-input {
        border-color: #4299e1;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    }
`;
document.head.appendChild(style);