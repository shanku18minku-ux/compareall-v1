export type SearchType = 'single' | 'commute_route' | 'travel_route' | 'medicine' | 'service';

export interface SearchFieldConfig {
  key: string;
  label: string;
  placeholder: string;
  icon: string;
  type: 'text' | 'location';
}

export interface CategorySearchSchema {
  category: string;
  searchType: SearchType;
  title: string;
  actionText: string;
  fields: SearchFieldConfig[];
  quickSuggestions: string[];
}

export const SEARCH_SCHEMAS: { [category: string]: CategorySearchSchema } = {
  Food: {
    category: 'Food',
    searchType: 'single',
    title: 'Food Delivery',
    actionText: 'Search Food',
    fields: [
      {
        key: 'query',
        label: 'Dish or Restaurant',
        placeholder: 'Search dishes, restaurants (e.g. Biryani, Paneer Tikka)...',
        icon: '🍽️',
        type: 'text',
      }
    ],
    quickSuggestions: ['Paneer Tikka', 'Chicken Biryani', 'Pizza', 'Burger', 'Momos', 'Dosa', 'Thali'],
  },

  Commute: {
    category: 'Commute',
    searchType: 'commute_route',
    title: 'Cab & Ride Comparison',
    actionText: 'Compare Fares',
    fields: [
      {
        key: 'pickup',
        label: 'Pickup Location',
        placeholder: 'Pickup location (Current GPS Location)',
        icon: '🟢',
        type: 'location',
      },
      {
        key: 'drop',
        label: 'Where to?',
        placeholder: 'Enter drop destination (e.g. Railway Station, Airport)...',
        icon: '🔴',
        type: 'text',
      }
    ],
    quickSuggestions: ['Railway Station', 'Bus Stand', 'Airport', 'Main Chowk', 'City Center', 'Hospital'],
  },

  Groceries: {
    category: 'Groceries',
    searchType: 'single',
    title: 'Quick Commerce & Groceries',
    actionText: 'Find Lowest Price',
    fields: [
      {
        key: 'query',
        label: 'Item Name',
        placeholder: 'Search milk, bread, fruits, veggies, snacks...',
        icon: '🥦',
        type: 'text',
      }
    ],
    quickSuggestions: ['Amul Milk', 'Brown Bread', 'Eggs (Pack of 6)', 'Atta 5kg', 'Onion 1kg', 'Maggi Noodles', 'Cold Drinks'],
  },

  Travel: {
    category: 'Travel',
    searchType: 'travel_route',
    title: 'Travel & Ticket Booking',
    actionText: 'Compare Tickets',
    fields: [
      {
        key: 'from',
        label: 'From City/Station',
        placeholder: 'Enter origin city or station...',
        icon: '🛫',
        type: 'text',
      },
      {
        key: 'to',
        label: 'To City/Station',
        placeholder: 'Enter destination city or station...',
        icon: '🛬',
        type: 'text',
      }
    ],
    quickSuggestions: ['Delhi to Mumbai', 'Bangalore to Goa', 'Ranchi to Patna', 'Kolkata to Puri', 'Jaipur to Delhi'],
  },

  Medicine: {
    category: 'Medicine',
    searchType: 'medicine',
    title: 'Pharmacy & Health',
    actionText: 'Compare Medicines',
    fields: [
      {
        key: 'query',
        label: 'Medicine or Salt Name',
        placeholder: 'Search medicine name, generic salt, health care...',
        icon: '💊',
        type: 'text',
      }
    ],
    quickSuggestions: ['Paracetamol 650', 'Cetirizine 10mg', 'Vitamin D3', 'Band-Aid', 'ORS Sachet', 'Digene Gel'],
  },

  Shopping: {
    category: 'Shopping',
    searchType: 'single',
    title: 'E-Commerce & Fashion',
    actionText: 'Compare Deals',
    fields: [
      {
        key: 'query',
        label: 'Product Name',
        placeholder: 'Search electronics, clothes, smartphones, shoes...',
        icon: '🛍️',
        type: 'text',
      }
    ],
    quickSuggestions: ['iPhone 15', 'Wireless Earbuds', 'Sneakers', 'Smart Watch', 'Backpack', 'Power Bank'],
  },

  Services: {
    category: 'Services',
    searchType: 'service',
    title: 'Home & Professional Services',
    actionText: 'Find Service',
    fields: [
      {
        key: 'query',
        label: 'Service Name',
        placeholder: 'Search AC repair, deep cleaning, salon, plumber...',
        icon: '🔧',
        type: 'text',
      }
    ],
    quickSuggestions: ['AC Service', 'Bathroom Cleaning', 'Men Salon', 'Plumber Visit', 'Electrician', 'Pest Control'],
  },
};

export const getSearchSchema = (category: string): CategorySearchSchema => {
  return SEARCH_SCHEMAS[category] || SEARCH_SCHEMAS.Food;
};
