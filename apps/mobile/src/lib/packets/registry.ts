import { ProviderPacket, ProviderMetadata } from './types';
import { SwiggyPacket } from './swiggy';

// Generic login detection helper
const defaultLoginDetection = () => `
  (function() {
    if (document.body && !window.location.href.includes('/login') && !window.location.href.includes('/auth')) {
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
    }
  })();
  true;
`;

const defaultExtractor = () => `true;`;

// Comprehensive catalog of all integrated platforms across categories
export const ALL_INTEGRATED_PROVIDERS: ProviderMetadata[] = [
    // 🍔 Food Delivery
    SwiggyPacket.metadata,
    {
        id: 'food-b',
        name: 'Zomato',
        category: 'Food',
        subcategory: 'Food Delivery',
        icon: '🔴',
        brandColor: '#cb202d',
        authType: 'otp',
        url: 'https://www.zomato.com',
        loginUrl: 'https://www.zomato.com',
        checkoutUrl: 'https://www.zomato.com/cart',
        actionTitle: 'Order on Zomato',
        desc: 'Restaurant delivery and discounts across India.',
        regions: ['all']
    },
    {
        id: 'food-c',
        name: 'EatClub',
        category: 'Food',
        subcategory: 'Cloud Kitchens',
        icon: '🥗',
        brandColor: '#10b981',
        authType: 'otp',
        url: 'https://eatclub.com',
        loginUrl: 'https://eatclub.com',
        checkoutUrl: 'https://eatclub.com/cart',
        actionTitle: 'Order on EatClub',
        desc: 'Flat 30% OFF with no delivery or packaging charges.',
        regions: ['delhi', 'ncr', 'gurgaon', 'noida', 'mumbai', 'bangalore', 'pune', 'hyderabad']
    },
    {
        id: 'food-train-1',
        name: 'RailRestro',
        category: 'Food',
        subcategory: 'Train Food Delivery',
        icon: '🚆',
        brandColor: '#f97316',
        authType: 'otp',
        url: 'https://www.railrestro.com',
        loginUrl: 'https://www.railrestro.com',
        checkoutUrl: 'https://www.railrestro.com/checkout',
        actionTitle: 'Order on RailRestro',
        desc: 'Delivers warm food right to your train seat.',
        regions: ['station', 'railway', 'junction', 'cantt', 'terminal']
    },
    {
        id: 'food-train-2',
        name: 'IRCTC eCatering',
        category: 'Food',
        subcategory: 'Train Food Delivery',
        icon: '🍲',
        brandColor: '#1d4ed8',
        authType: 'otp',
        url: 'https://www.ecatering.irctc.co.in',
        loginUrl: 'https://www.ecatering.irctc.co.in',
        checkoutUrl: 'https://www.ecatering.irctc.co.in/cart',
        actionTitle: 'Order on IRCTC',
        desc: 'Official IRCTC Food on Track at Railway Stations.',
        regions: ['station', 'railway', 'junction', 'cantt', 'terminal']
    },

    // 🚗 Commute & Cabs
    {
        id: 'cab-a',
        name: 'Rapido',
        category: 'Commute',
        subcategory: 'Bike & Auto Taxi',
        icon: '🛵',
        brandColor: '#facc15',
        authType: 'otp',
        url: 'https://www.rapido.bike',
        loginUrl: 'https://www.rapido.bike',
        checkoutUrl: 'https://www.rapido.bike',
        actionTitle: 'Book on Rapido',
        desc: 'Lowest fare bike and auto rides across 100+ cities.',
        regions: ['all']
    },
    {
        id: 'cab-b',
        name: 'Ola Cabs',
        category: 'Commute',
        subcategory: 'Cabs & Auto',
        icon: '🚖',
        brandColor: '#22c55e',
        authType: 'otp',
        url: 'https://book.olacabs.com',
        loginUrl: 'https://book.olacabs.com',
        checkoutUrl: 'https://book.olacabs.com',
        actionTitle: 'Book on Ola',
        desc: 'Auto, Mini, Prime, and Outstation rides.',
        regions: ['all']
    },
    {
        id: 'cab-c',
        name: 'Uber',
        category: 'Commute',
        subcategory: 'Cabs & Auto',
        icon: '⬛',
        brandColor: '#000000',
        authType: 'otp',
        url: 'https://m.uber.com',
        loginUrl: 'https://m.uber.com',
        checkoutUrl: 'https://m.uber.com',
        actionTitle: 'Book on Uber',
        desc: 'Global ride-hailing across major Indian cities.',
        regions: ['delhi', 'ncr', 'mumbai', 'bangalore', 'kolkata', 'hyderabad', 'chennai', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'chandigarh', 'patna', 'ranchi']
    },
    {
        id: 'cab-d',
        name: 'BluSmart',
        category: 'Commute',
        subcategory: 'EV Cabs',
        icon: '⚡',
        brandColor: '#0ea5e9',
        authType: 'otp',
        url: 'https://blu-smart.com',
        loginUrl: 'https://blu-smart.com',
        checkoutUrl: 'https://blu-smart.com',
        actionTitle: 'Book on BluSmart',
        desc: '100% Electric, Zero Surge, Zero Cancellations.',
        regions: ['delhi', 'ncr', 'gurgaon', 'noida', 'bangalore']
    },
    {
        id: 'cab-e',
        name: 'InDrive',
        category: 'Commute',
        subcategory: 'Fare Bidding',
        icon: '🚙',
        brandColor: '#84cc16',
        authType: 'otp',
        url: 'https://indrive.com',
        loginUrl: 'https://indrive.com',
        checkoutUrl: 'https://indrive.com',
        actionTitle: 'Book on InDrive',
        desc: 'Set your own fare and choose your driver.',
        regions: ['delhi', 'ncr', 'mumbai', 'bangalore', 'kolkata', 'patna', 'ranchi', 'lucknow', 'chandigarh', 'pune']
    },

    // ⚡ Quick Groceries (10 min)
    {
        id: 'groc-a',
        name: 'Swiggy Instamart',
        category: 'Groceries',
        subcategory: '10-Min Groceries',
        icon: '🥦',
        brandColor: '#ff5200',
        authType: 'otp',
        url: 'https://www.swiggy.com/instamart',
        loginUrl: 'https://www.swiggy.com/auth',
        checkoutUrl: 'https://www.swiggy.com/instamart/cart',
        actionTitle: 'Order on Instamart',
        desc: 'Groceries delivered in 10-15 minutes.',
        regions: ['all']
    },
    {
        id: 'groc-b',
        name: 'Blinkit',
        category: 'Groceries',
        subcategory: '10-Min Groceries',
        icon: '🟡',
        brandColor: '#facc15',
        authType: 'otp',
        url: 'https://blinkit.com',
        loginUrl: 'https://blinkit.com',
        checkoutUrl: 'https://blinkit.com/cart',
        actionTitle: 'Order on Blinkit',
        desc: 'Instant 10-minute grocery delivery by Zomato.',
        regions: ['delhi', 'ncr', 'mumbai', 'bangalore', 'kolkata', 'hyderabad', 'pune', 'jaipur', 'chandigarh', 'lucknow', 'patna', 'ranchi']
    },
    {
        id: 'groc-c',
        name: 'Zepto',
        category: 'Groceries',
        subcategory: '10-Min Groceries',
        icon: '🟣',
        brandColor: '#8b5cf6',
        authType: 'otp',
        url: 'https://zeptonow.com',
        loginUrl: 'https://zeptonow.com',
        checkoutUrl: 'https://zeptonow.com/cart',
        actionTitle: 'Order on Zepto',
        desc: 'Fast 10-minute delivery of milk, vegetables & more.',
        regions: ['delhi', 'ncr', 'mumbai', 'bangalore', 'hyderabad', 'chennai', 'pune', 'kolkata']
    },
    {
        id: 'groc-d',
        name: 'BigBasket Now',
        category: 'Groceries',
        subcategory: 'Quick Supermarket',
        icon: '🥬',
        brandColor: '#dc2626',
        authType: 'otp',
        url: 'https://www.bigbasket.com',
        loginUrl: 'https://www.bigbasket.com',
        checkoutUrl: 'https://www.bigbasket.com/basket',
        actionTitle: 'Order on BigBasket',
        desc: 'Tata enterprise grocery delivery with massive discounts.',
        regions: ['delhi', 'ncr', 'mumbai', 'bangalore', 'hyderabad', 'kolkata', 'pune', 'chennai', 'ahmedabad']
    },

    // 🛍️ Shopping & E-Commerce
    {
        id: 'shop-a',
        name: 'Amazon India',
        category: 'Shopping',
        subcategory: 'E-Commerce',
        icon: '📦',
        brandColor: '#f59e0b',
        authType: 'otp',
        url: 'https://www.amazon.in',
        loginUrl: 'https://www.amazon.in/ap/signin',
        checkoutUrl: 'https://www.amazon.in/gp/cart/view.html',
        actionTitle: 'Shop on Amazon',
        desc: 'India\'s largest selection with Prime delivery.',
        regions: ['all']
    },
    {
        id: 'shop-b',
        name: 'Flipkart',
        category: 'Shopping',
        subcategory: 'E-Commerce',
        icon: '🛍️',
        brandColor: '#2563eb',
        authType: 'otp',
        url: 'https://www.flipkart.com',
        loginUrl: 'https://www.flipkart.com/account/login',
        checkoutUrl: 'https://www.flipkart.com/viewcart',
        actionTitle: 'Shop on Flipkart',
        desc: 'Top electronics, fashion & daily essentials.',
        regions: ['all']
    },
    {
        id: 'shop-c',
        name: 'Myntra',
        category: 'Shopping',
        subcategory: 'Fashion & Apparel',
        icon: '👗',
        brandColor: '#ec4899',
        authType: 'otp',
        url: 'https://www.myntra.com',
        loginUrl: 'https://www.myntra.com/login',
        checkoutUrl: 'https://www.myntra.com/checkout/cart',
        actionTitle: 'Shop on Myntra',
        desc: 'India\'s leading fashion and lifestyle store.',
        regions: ['all']
    },
    {
        id: 'shop-d',
        name: 'Meesho',
        category: 'Shopping',
        subcategory: 'Budget Shopping',
        icon: '🏷️',
        brandColor: '#d946ef',
        authType: 'otp',
        url: 'https://www.meesho.com',
        loginUrl: 'https://www.meesho.com/auth',
        checkoutUrl: 'https://www.meesho.com/cart',
        actionTitle: 'Shop on Meesho',
        desc: 'Lowest wholesale prices directly from suppliers.',
        regions: ['all']
    },

    // 💊 Medicine & Pharmacy
    {
        id: 'med-a',
        name: 'Tata 1mg',
        category: 'Medicine',
        subcategory: 'Online Pharmacy',
        icon: '💊',
        brandColor: '#ea580c',
        authType: 'otp',
        url: 'https://www.1mg.com',
        loginUrl: 'https://www.1mg.com/login',
        checkoutUrl: 'https://www.1mg.com/cart',
        actionTitle: 'Order on Tata 1mg',
        desc: 'Genuine medicines, lab tests and doctors.',
        regions: ['all']
    },
    {
        id: 'med-b',
        name: 'Apollo 24/7',
        category: 'Medicine',
        subcategory: 'Online Pharmacy',
        icon: '🩺',
        brandColor: '#059669',
        authType: 'otp',
        url: 'https://www.apollo247.com',
        loginUrl: 'https://www.apollo247.com/login',
        checkoutUrl: 'https://www.apollo247.com/cart',
        actionTitle: 'Order on Apollo',
        desc: '2-Hour medicine delivery from Apollo Pharmacy.',
        regions: ['all']
    },
    {
        id: 'med-c',
        name: 'PharmEasy',
        category: 'Medicine',
        subcategory: 'Online Pharmacy',
        icon: '🧪',
        brandColor: '#0d9488',
        authType: 'otp',
        url: 'https://pharmeasy.in',
        loginUrl: 'https://pharmeasy.in/login',
        checkoutUrl: 'https://pharmeasy.in/cart',
        actionTitle: 'Order on PharmEasy',
        desc: 'Flat 20% discount on healthcare orders.',
        regions: ['all']
    },

    // ✈️ Travel & Bookings
    {
        id: 'trav-a',
        name: 'MakeMyTrip',
        category: 'Travel',
        subcategory: 'Flights & Hotels',
        icon: '✈️',
        brandColor: '#ef4444',
        authType: 'otp',
        url: 'https://www.makemytrip.com',
        loginUrl: 'https://www.makemytrip.com',
        checkoutUrl: 'https://www.makemytrip.com',
        actionTitle: 'Book on MakeMyTrip',
        desc: 'Best flight, train & hotel booking offers.',
        regions: ['all']
    },
    {
        id: 'trav-b',
        name: 'EaseMyTrip',
        category: 'Travel',
        subcategory: 'Flights & Trains',
        icon: '🛫',
        brandColor: '#0284c7',
        authType: 'otp',
        url: 'https://www.easemytrip.com',
        loginUrl: 'https://www.easemytrip.com',
        checkoutUrl: 'https://www.easemytrip.com',
        actionTitle: 'Book on EaseMyTrip',
        desc: 'Zero convenience fee flight bookings.',
        regions: ['all']
    }
];

// Define the central registry of all available provider packets
const packets: Record<string, ProviderPacket> = {
    [SwiggyPacket.metadata.id]: SwiggyPacket,
};

// Auto-register mock/generic packets for metadata without full packet yet
ALL_INTEGRATED_PROVIDERS.forEach(meta => {
    if (!packets[meta.id]) {
        packets[meta.id] = {
            metadata: meta,
            getLoginDetectionScript: defaultLoginDetection,
            getExtractorInjection: defaultExtractor,
            getSearchUrl: (q: string) => `${meta.url}/search?query=${encodeURIComponent(q)}`,
        };
    }
});

export const getPacket = (providerId: string): ProviderPacket | undefined => {
    return packets[providerId];
};

export const getAllProvidersMetadata = (): ProviderMetadata[] => {
    return ALL_INTEGRATED_PROVIDERS;
};
