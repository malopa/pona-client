interface PaymentMethod {
  name: string;
  logo: string;
}

interface CountryPricing {
  videoCost: string;
  phoneCost: string;
  subscription15: string;
  subscription30: string;
  currency: string;
  symbol: string;
  paymentMethods: PaymentMethod[];
  specialistVideoCost: string;
  specialistPhoneCost: string;
  specialistSubscription15: string;
  specialistSubscription30: string;
}

// Helper function to double the price for specialists
const getSpecialistPrice = (price: string): string => {
  const numericPrice = parseFloat(price.replace(/,/g, ''));
  return (numericPrice * 2).toLocaleString();
};

const basePricing: Record<string, Omit<CountryPricing, 'specialistVideoCost' | 'specialistPhoneCost' | 'specialistSubscription15' | 'specialistSubscription30'>> = {
  'USA': {
    videoCost: '60',
    phoneCost: '50',
    subscription15: '600',
    subscription30: '1,050',
    currency: 'USD',
    symbol: '$',
    paymentMethods: [
      { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
      { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
      { name: 'PayPal', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' },
      { name: 'Apple Pay', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg' },
      { name: 'Google Pay', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Google_Pay_Logo.svg' }
    ]
  },
  'Germany': {
    videoCost: '55',
    phoneCost: '45',
    subscription15: '550',
    subscription30: '962',
    currency: 'EUR',
    symbol: '€',
    paymentMethods: [
      { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
      { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
      { name: 'PayPal', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' }
    ]
  },
  'UAE': {
    videoCost: '220',
    phoneCost: '185',
    subscription15: '2,200',
    subscription30: '3,850',
    currency: 'AED',
    symbol: 'AED',
    paymentMethods: [
      { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
      { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
      { name: 'PayPal', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' },
      { name: 'Apple Pay', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg' }
    ]
  },
  'South Africa': {
    videoCost: '270',
    phoneCost: '225',
    subscription15: '2,700',
    subscription30: '4,725',
    currency: 'ZAR',
    symbol: 'R',
    paymentMethods: [
      { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
      { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
      { name: 'PayPal', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' },
      { name: 'Instant EFT', logo: '' },
      { name: 'SnapScan', logo: '' }
    ]
  },
  'UK': {
    videoCost: '50',
    phoneCost: '40',
    subscription15: '500',
    subscription30: '875',
    currency: 'GBP',
    symbol: '£',
    paymentMethods: [
      { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
      { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
      { name: 'PayPal', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg' },
      { name: 'Apple Pay', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg' },
      { name: 'Google Pay', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Google_Pay_Logo.svg' }
    ]
  },
  'Kenya': {
    videoCost: '900',
    phoneCost: '750',
    subscription15: '9,000',
    subscription30: '15,750',
    currency: 'KES',
    symbol: 'KSh',
    paymentMethods: [
      { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
      { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
      { name: 'M-Pesa', logo: '' },
      { name: 'Airtel Money', logo: '' }
    ]
  },
  'Tanzania': {
    videoCost: '6,000',
    phoneCost: '5,000',
    subscription15: '60,000',
    subscription30: '105,000',
    currency: 'TZS',
    symbol: 'TSh',
    paymentMethods: [
      { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
      { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
      { name: 'M-Pesa', logo: '' },
      { name: 'Tigo Pesa', logo: '' },
      { name: 'Airtel Money', logo: '' }
    ]
  },
  'Uganda': {
    videoCost: '8,880',
    phoneCost: '7,400',
    subscription15: '88,800',
    subscription30: '155,400',
    currency: 'UGX',
    symbol: 'USh',
    paymentMethods: [
      { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
      { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
      { name: 'MTN', logo: '' },
      { name: 'Airtel Money', logo: '' }
    ]
  },
  'Rwanda': {
    videoCost: '4,800',
    phoneCost: '4,000',
    subscription15: '48,000',
    subscription30: '84,000',
    currency: 'RWF',
    symbol: 'RF',
    paymentMethods: [
      { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
      { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
      { name: 'MTN', logo: '' },
      { name: 'Airtel Money', logo: '' }
    ]
  },
  'Burundi': {
    videoCost: '5,920',
    phoneCost: '4,933',
    subscription15: '59,200',
    subscription30: '103,275',
    currency: 'BIF',
    symbol: 'FBu',
    paymentMethods: [
      { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
      { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' },
      { name: 'EcoCash', logo: '' },
      { name: 'Lumicash', logo: '' }
    ]
  }
};

// Create pricing object that includes specialist pricing
export const countryPricing: Record<string, CountryPricing> = Object.fromEntries(
  Object.entries(basePricing).map(([country, pricing]) => [
    country,
    {
      ...pricing,
      specialistVideoCost: getSpecialistPrice(pricing.videoCost),
      specialistPhoneCost: getSpecialistPrice(pricing.phoneCost),
      specialistSubscription15: getSpecialistPrice(pricing.subscription15),
      specialistSubscription30: getSpecialistPrice(pricing.subscription30),
    }
  ])
);