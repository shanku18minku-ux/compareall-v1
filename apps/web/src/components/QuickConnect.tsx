"use client";

import React, { useState } from 'react';
import { useStorage } from '../hooks/useStorage';
import OTPModal from './OTPModal';
import { motion, AnimatePresence } from 'framer-motion';

const FOOD_PROVIDERS = [
  // 1. Aggregators
  { id: 'food-zomato', name: 'Zomato', icon: '🍕', color: '#e23744', subcat: 'Food Delivery', tier: 'all' },
  { id: 'food-swiggy', name: 'Swiggy', icon: '🍔', color: '#fc8019', subcat: 'Food Delivery', tier: 'all' },
  { id: 'food-magicpin', name: 'Magicpin', icon: '📍', color: '#f50057', subcat: 'Food Delivery', tier: 'tier1' },
  { id: 'food-eatsure', name: 'EatSure', icon: '🍽️', color: '#5e35b1', subcat: 'Food Delivery', tier: 'tier1' },
  { id: 'food-pincode', name: 'Pincode', icon: '📍', color: '#00838f', subcat: 'ONDC Food', tier: 'tier1' },
  { id: 'food-mystore', name: 'Mystore', icon: '🏪', color: '#d84315', subcat: 'ONDC Food', tier: 'tier1' },
  { id: 'food-paytm-ondc', name: 'Paytm Food', icon: '📱', color: '#0277bd', subcat: 'ONDC Food', tier: 'tier2' },
  { id: 'food-ola-ondc', name: 'Ola Food', icon: '🚕', color: '#000000', subcat: 'ONDC Food', tier: 'tier1' },
  { id: 'food-spicemoney', name: 'Spice Money', icon: '🌶️', color: '#e65100', subcat: 'ONDC Food', tier: 'tier2' },

  // 2. Direct Restaurant
  { id: 'food-dominos', name: 'Domino\'s', icon: '🍕', color: '#1565c0', subcat: 'Restaurant Direct', tier: 'tier2' },
  { id: 'food-pizzahut', name: 'Pizza Hut', icon: '🍕', color: '#c62828', subcat: 'Restaurant Direct', tier: 'tier2' },
  { id: 'food-lapinoz', name: 'La Pino\'z', icon: '🍕', color: '#2e7d32', subcat: 'Restaurant Direct', tier: 'tier1' },
  { id: 'food-ovenstory', name: 'OvenStory', icon: '🍕', color: '#c2185b', subcat: 'Restaurant Direct', tier: 'tier1' },
  { id: 'food-mojopizza', name: 'MojoPizza', icon: '🍕', color: '#b71c1c', subcat: 'Restaurant Direct', tier: 'tier1' },
  { id: 'food-chicagopizza', name: 'Chicago Pizza', icon: '🍕', color: '#ff8f00', subcat: 'Restaurant Direct', tier: 'tier1' },
  { id: 'food-mcdonalds', name: 'McDonald\'s', icon: '🍔', color: '#fbc02d', subcat: 'Restaurant Direct', tier: 'tier2' },
  { id: 'food-burgerking', name: 'Burger King', icon: '🍔', color: '#e65100', subcat: 'Restaurant Direct', tier: 'tier2' },
  { id: 'food-kfc', name: 'KFC', icon: '🍗', color: '#d32f2f', subcat: 'Restaurant Direct', tier: 'tier2' },
  { id: 'food-subway', name: 'Subway', icon: '🥪', color: '#2e7d32', subcat: 'Restaurant Direct', tier: 'tier2' },
  { id: 'food-wendys', name: 'Wendy\'s', icon: '🍔', color: '#1565c0', subcat: 'Restaurant Direct', tier: 'tier1' },

  // 3. Indian / Biryani
  { id: 'food-faasos', name: 'Faasos', icon: '🌯', color: '#512da8', subcat: 'Biryani & Indian', tier: 'tier1' },
  { id: 'food-behrouz', name: 'Behrouz', icon: '🍛', color: '#4a148c', subcat: 'Biryani & Indian', tier: 'tier1' },
  { id: 'food-biryaniblues', name: 'Biryani Blues', icon: '🍛', color: '#0277bd', subcat: 'Biryani & Indian', tier: 'tier1' },
  { id: 'food-bbk', name: 'Biryani By Kilo', icon: '🥘', color: '#b71c1c', subcat: 'Biryani & Indian', tier: 'tier1' },
  { id: 'food-box8', name: 'BOX8', icon: '🍱', color: '#d84315', subcat: 'Biryani & Indian', tier: 'tier1' },
  { id: 'food-haldirams', name: 'Haldiram\'s', icon: '🧆', color: '#d32f2f', subcat: 'Biryani & Indian', tier: 'tier2' },

  // 4. Bakery / Sweets
  { id: 'food-mioamore', name: 'Mio Amore', icon: '🍰', color: '#c2185b', subcat: 'Bakery & Sweets', tier: 'tier1' },
  { id: 'food-monginis', name: 'Monginis', icon: '🎂', color: '#ad1457', subcat: 'Bakery & Sweets', tier: 'tier2' },
  { id: 'food-theobroma', name: 'Theobroma', icon: '🧁', color: '#880e4f', subcat: 'Bakery & Sweets', tier: 'tier1' },
  { id: 'food-bakingo', name: 'Bakingo', icon: '🍰', color: '#ec407a', subcat: 'Bakery & Sweets', tier: 'tier1' },
  { id: 'food-baskin', name: 'Baskin-Robbins', icon: '🍨', color: '#0288d1', subcat: 'Bakery & Sweets', tier: 'tier2' },
  { id: 'food-fnp', name: 'FNP Cakes', icon: '🎂', color: '#2e7d32', subcat: 'Bakery & Sweets', tier: 'tier1' },

  // 5. Coffee / Snacks
  { id: 'food-starbucks', name: 'Starbucks', icon: '☕', color: '#1b5e20', subcat: 'Coffee & Snacks', tier: 'tier1' },
  { id: 'food-chaayos', name: 'Chaayos', icon: '🫖', color: '#f57f17', subcat: 'Coffee & Snacks', tier: 'tier1' },
  { id: 'food-chaipoint', name: 'Chai Point', icon: '☕', color: '#ffb300', subcat: 'Coffee & Snacks', tier: 'tier1' },
  { id: 'food-thirdwave', name: 'Third Wave', icon: '☕', color: '#3e2723', subcat: 'Coffee & Snacks', tier: 'tier1' },
  { id: 'food-wowmomo', name: 'Wow! Momo', icon: '🥟', color: '#fbc02d', subcat: 'Coffee & Snacks', tier: 'tier2' },

  // 6. Healthy
  { id: 'food-eatfit', name: 'EatFit', icon: '🥗', color: '#4caf50', subcat: 'Healthy & Diet', tier: 'tier1' },
  { id: 'food-freshmenu', name: 'FreshMenu', icon: '🥗', color: '#d32f2f', subcat: 'Healthy & Diet', tier: 'tier1' },
  { id: 'food-saladdays', name: 'Salad Days', icon: '🥗', color: '#689f38', subcat: 'Healthy & Diet', tier: 'tier1' },
  { id: 'food-curefoods', name: 'Curefoods', icon: '🥦', color: '#00796b', subcat: 'Healthy & Diet', tier: 'tier1' },

  // 7. Cloud Kitchen
  { id: 'food-eatclub', name: 'EatClub', icon: '🍴', color: '#d84315', subcat: 'Cloud Kitchens', tier: 'tier1' },
  { id: 'food-rebelfoods', name: 'Rebel Foods', icon: '🍳', color: '#b71c1c', subcat: 'Cloud Kitchens', tier: 'tier1' },

  // 8. Quick Food
  { id: 'food-zeptocafe', name: 'Zepto Cafe', icon: '⏱️', color: '#7e57c2', subcat: 'Quick Food', tier: 'tier1' },
  { id: 'food-swiggybolt', name: 'Swiggy Bolt', icon: '⚡', color: '#ff6d00', subcat: 'Quick Food', tier: 'tier1' },
  { id: 'food-blinkitbistro', name: 'Blinkit Bistro', icon: '🛍️', color: '#f8cb46', subcat: 'Quick Food', tier: 'tier1' },
  { id: 'food-swish', name: 'Swish', icon: '💨', color: '#26c6da', subcat: 'Quick Food', tier: 'tier1' },
  { id: 'food-toing', name: 'Toing', icon: '🍟', color: '#ffca28', subcat: 'Quick Food', tier: 'tier1' },

  // 9. Travel Food
  { id: 'food-irctc', name: 'IRCTC eCatering', icon: '🚂', color: '#1a237e', subcat: 'Train Food', tier: 'all' },
  { id: 'food-zoop', name: 'Zoop', icon: '🍱', color: '#f57c00', subcat: 'Train Food', tier: 'all' },
  { id: 'food-railrestro', name: 'RailRestro', icon: '🍛', color: '#c2185b', subcat: 'Train Food', tier: 'all' },
  { id: 'food-travelkhana', name: 'Travelkhana', icon: '🚂', color: '#ff8f00', subcat: 'Train Food', tier: 'all' },
  { id: 'food-tfs', name: 'Travel Food Svs', icon: '✈️', color: '#01579b', subcat: 'Airport Food', tier: 'tier1' },

  // 10. Regional
  { id: 'food-chowman', name: 'Chowman', icon: '🍜', color: '#d32f2f', subcat: 'Regional', tier: 'tier1' },
  { id: 'food-yummycloud', name: 'Yummy Cloud', icon: '☁️', color: '#0288d1', subcat: 'Regional', tier: 'tier1' }
];

// Other categories (Groceries, Cabs, etc.)
const SHOPPING_PROVIDERS = [
  // 1. General
  { id: 'shop-amazon', name: 'Amazon', icon: '📦', color: '#ff9900', subcat: 'General Shopping', tier: 'all' },
  { id: 'shop-flipkart', name: 'Flipkart', icon: '🛍️', color: '#2874f0', subcat: 'General Shopping', tier: 'all' },
  { id: 'shop-meesho', name: 'Meesho', icon: '👚', color: '#f43397', subcat: 'General Shopping', tier: 'all' },
  { id: 'shop-snapdeal', name: 'Snapdeal', icon: '🛒', color: '#e91e63', subcat: 'General Shopping', tier: 'all' },
  { id: 'shop-shopclues', name: 'ShopClues', icon: '🛒', color: '#3f51b5', subcat: 'General Shopping', tier: 'all' },
  { id: 'shop-jiomart', name: 'JioMart', icon: '🛍️', color: '#01579b', subcat: 'General Shopping', tier: 'all' },
  { id: 'shop-tataneu', name: 'Tata Neu', icon: '📱', color: '#e65100', subcat: 'General Shopping', tier: 'all' },
  { id: 'shop-tatacliq', name: 'Tata CLiQ', icon: '💎', color: '#000000', subcat: 'General Shopping', tier: 'all' },
  { id: 'shop-shopsy', name: 'Shopsy', icon: '🛍️', color: '#1976d2', subcat: 'General Shopping', tier: 'all' },

  // 2. Fashion
  { id: 'shop-myntra', name: 'Myntra', icon: '👕', color: '#ff3f6c', subcat: 'Fashion & Clothing', tier: 'all' },
  { id: 'shop-ajio', name: 'AJIO', icon: '👗', color: '#2c3e50', subcat: 'Fashion & Clothing', tier: 'all' },
  { id: 'shop-nykaafashion', name: 'Nykaa Fashion', icon: '👗', color: '#e91e63', subcat: 'Fashion & Clothing', tier: 'all' },
  { id: 'shop-urbanic', name: 'Urbanic', icon: '👗', color: '#ff8f00', subcat: 'Fashion & Clothing', tier: 'all' },
  { id: 'shop-hm', name: 'H&M', icon: '👕', color: '#b71c1c', subcat: 'Fashion & Clothing', tier: 'tier1' },
  { id: 'shop-zara', name: 'Zara', icon: '👗', color: '#000000', subcat: 'Fashion & Clothing', tier: 'tier1' },
  { id: 'shop-westside', name: 'Westside', icon: '👕', color: '#4a148c', subcat: 'Fashion & Clothing', tier: 'tier2' },
  { id: 'shop-pantaloons', name: 'Pantaloons', icon: '👗', color: '#00838f', subcat: 'Fashion & Clothing', tier: 'tier2' },
  { id: 'shop-shoppersstop', name: 'Shoppers Stop', icon: '👕', color: '#000000', subcat: 'Fashion & Clothing', tier: 'tier2' },
  { id: 'shop-max', name: 'Max Fashion', icon: '👕', color: '#1565c0', subcat: 'Fashion & Clothing', tier: 'tier2' },

  // 3. Shoes
  { id: 'shop-bata', name: 'Bata', icon: '👞', color: '#b71c1c', subcat: 'Footwear', tier: 'all' },
  { id: 'shop-metro', name: 'Metro Shoes', icon: '👠', color: '#880e4f', subcat: 'Footwear', tier: 'tier2' },
  { id: 'shop-woodland', name: 'Woodland', icon: '🥾', color: '#33691e', subcat: 'Footwear', tier: 'all' },
  { id: 'shop-redtape', name: 'Red Tape', icon: '👟', color: '#d32f2f', subcat: 'Footwear', tier: 'all' },
  { id: 'shop-campus', name: 'Campus', icon: '👟', color: '#b71c1c', subcat: 'Footwear', tier: 'all' },
  { id: 'shop-puma', name: 'Puma', icon: '👟', color: '#000000', subcat: 'Footwear', tier: 'all' },
  { id: 'shop-adidas', name: 'Adidas', icon: '👟', color: '#000000', subcat: 'Footwear', tier: 'all' },
  { id: 'shop-nike', name: 'Nike', icon: '👟', color: '#000000', subcat: 'Footwear', tier: 'all' },

  // 4. Beauty
  { id: 'shop-nykaa', name: 'Nykaa', icon: '💄', color: '#e91e63', subcat: 'Beauty & Cosmetics', tier: 'all' },
  { id: 'shop-purplle', name: 'Purplle', icon: '💄', color: '#8e24aa', subcat: 'Beauty & Cosmetics', tier: 'all' },
  { id: 'shop-tira', name: 'Tira', icon: '💄', color: '#000000', subcat: 'Beauty & Cosmetics', tier: 'tier1' },
  { id: 'shop-sephora', name: 'Sephora', icon: '💄', color: '#000000', subcat: 'Beauty & Cosmetics', tier: 'tier1' },
  { id: 'shop-sugar', name: 'Sugar Cosmetics', icon: '💄', color: '#000000', subcat: 'Beauty & Cosmetics', tier: 'all' },
  { id: 'shop-mamaearth', name: 'Mamaearth', icon: '🌿', color: '#388e3c', subcat: 'Beauty & Cosmetics', tier: 'all' },
  { id: 'shop-plum', name: 'Plum', icon: '🌿', color: '#512da8', subcat: 'Beauty & Cosmetics', tier: 'all' },

  // 5. Electronics
  { id: 'shop-croma', name: 'Croma', icon: '📺', color: '#00838f', subcat: 'Electronics & Gadgets', tier: 'all' },
  { id: 'shop-reliancedigital', name: 'Reliance Digital', icon: '📱', color: '#d32f2f', subcat: 'Electronics & Gadgets', tier: 'all' },
  { id: 'shop-vijaysales', name: 'Vijay Sales', icon: '📺', color: '#d32f2f', subcat: 'Electronics & Gadgets', tier: 'all' },
  { id: 'shop-apple', name: 'Apple', icon: '💻', color: '#000000', subcat: 'Electronics & Gadgets', tier: 'all' },
  { id: 'shop-samsung', name: 'Samsung', icon: '📱', color: '#1565c0', subcat: 'Electronics & Gadgets', tier: 'all' },
  { id: 'shop-dell', name: 'Dell', icon: '💻', color: '#1565c0', subcat: 'Electronics & Gadgets', tier: 'all' },
  { id: 'shop-lenovo', name: 'Lenovo', icon: '💻', color: '#e65100', subcat: 'Electronics & Gadgets', tier: 'all' },
  { id: 'shop-asus', name: 'ASUS', icon: '💻', color: '#1a237e', subcat: 'Electronics & Gadgets', tier: 'all' },
  { id: 'shop-lg', name: 'LG', icon: '📺', color: '#b71c1c', subcat: 'Electronics & Gadgets', tier: 'all' },

  // 8. Furniture
  { id: 'shop-pepperfry', name: 'Pepperfry', icon: '🛋️', color: '#f57c00', subcat: 'Furniture & Home', tier: 'tier2' },
  { id: 'shop-urbanladder', name: 'Urban Ladder', icon: '🪑', color: '#f57c00', subcat: 'Furniture & Home', tier: 'tier2' },
  { id: 'shop-ikea', name: 'IKEA', icon: '🪑', color: '#01579b', subcat: 'Furniture & Home', tier: 'tier1' },
  { id: 'shop-homecentre', name: 'Home Centre', icon: '🛋️', color: '#e65100', subcat: 'Furniture & Home', tier: 'tier1' },
  { id: 'shop-wakefit', name: 'Wakefit', icon: '🛏️', color: '#1565c0', subcat: 'Furniture & Home', tier: 'all' },
  { id: 'shop-woodenstreet', name: 'WoodenStreet', icon: '🛋️', color: '#d32f2f', subcat: 'Furniture & Home', tier: 'tier2' },
  { id: 'shop-sleepycat', name: 'SleepyCat', icon: '🛏️', color: '#ffb300', subcat: 'Furniture & Home', tier: 'all' },

  // 12. Kids
  { id: 'shop-firstcry', name: 'FirstCry', icon: '👶', color: '#0288d1', subcat: 'Baby & Kids', tier: 'all' },
  { id: 'shop-hopscotch', name: 'Hopscotch', icon: '👶', color: '#f57c00', subcat: 'Baby & Kids', tier: 'all' },
  { id: 'shop-mothercare', name: 'Mothercare', icon: '👶', color: '#1565c0', subcat: 'Baby & Kids', tier: 'tier1' },

  // 13. Jewellery
  { id: 'shop-tanishq', name: 'Tanishq', icon: '💎', color: '#880e4f', subcat: 'Jewellery', tier: 'tier2' },
  { id: 'shop-caratlane', name: 'CaratLane', icon: '💎', color: '#ad1457', subcat: 'Jewellery', tier: 'all' },
  { id: 'shop-bluestone', name: 'Bluestone', icon: '💎', color: '#0288d1', subcat: 'Jewellery', tier: 'all' },
  { id: 'shop-kalyan', name: 'Kalyan Jewellers', icon: '💎', color: '#b71c1c', subcat: 'Jewellery', tier: 'tier2' },

  // 14. Eyewear
  { id: 'shop-lenskart', name: 'Lenskart', icon: '👓', color: '#00838f', subcat: 'Eyewear', tier: 'all' },
  { id: 'shop-titaneye', name: 'Titan Eye+', icon: '👓', color: '#000000', subcat: 'Eyewear', tier: 'all' },

  // 15. Bags
  { id: 'shop-safari', name: 'Safari', icon: '🎒', color: '#000000', subcat: 'Bags & Luggage', tier: 'all' },
  { id: 'shop-americantourister', name: 'American Tourister', icon: '🧳', color: '#1565c0', subcat: 'Bags & Luggage', tier: 'all' },
  { id: 'shop-mokobara', name: 'Mokobara', icon: '🎒', color: '#e65100', subcat: 'Bags & Luggage', tier: 'tier1' },
  { id: 'shop-dailyobjects', name: 'DailyObjects', icon: '👜', color: '#000000', subcat: 'Bags & Luggage', tier: 'all' },

  // Niche
  { id: 'shop-decathlon', name: 'Decathlon', icon: '⚽', color: '#1565c0', subcat: 'Sports & Fitness', tier: 'all' },
  { id: 'shop-indiamart', name: 'IndiaMART', icon: '🏭', color: '#1565c0', subcat: 'B2B & Tools', tier: 'all' },
  { id: 'shop-moglix', name: 'Moglix', icon: '🔧', color: '#d32f2f', subcat: 'B2B & Tools', tier: 'all' },
  { id: 'shop-udaan', name: 'Udaan', icon: '📦', color: '#0288d1', subcat: 'B2B & Tools', tier: 'all' },
  { id: 'shop-crossword', name: 'Crossword', icon: '📚', color: '#ffb300', subcat: 'Books & Stationery', tier: 'all' },
  { id: 'shop-gamestheshop', name: 'Games The Shop', icon: '🎮', color: '#d32f2f', subcat: 'Gaming', tier: 'all' },
  { id: 'shop-steam', name: 'Steam', icon: '🎮', color: '#1a237e', subcat: 'Gaming', tier: 'all' },
  { id: 'shop-huft', name: 'Heads Up For Tails', icon: '🐕', color: '#b71c1c', subcat: 'Pets', tier: 'tier1' },
  { id: 'shop-supertails', name: 'Supertails', icon: '🐕', color: '#1565c0', subcat: 'Pets', tier: 'all' },
  { id: 'shop-ugaoo', name: 'Ugaoo', icon: '🌱', color: '#388e3c', subcat: 'Gardening', tier: 'all' }
];

const TRAVEL_PROVIDERS = [
  // 1. Flights
  { id: 'travel-mmt', name: 'MakeMyTrip', icon: '✈️', color: '#d8232a', subcat: 'Flight Booking', tier: 'all' },
  { id: 'travel-goibibo', name: 'Goibibo', icon: '✈️', color: '#2274e0', subcat: 'Flight Booking', tier: 'all' },
  { id: 'travel-ixigo', name: 'ixigo', icon: '✈️', color: '#ec5b24', subcat: 'Flight Booking', tier: 'all' },
  { id: 'travel-emt', name: 'EaseMyTrip', icon: '✈️', color: '#008cff', subcat: 'Flight Booking', tier: 'all' },
  { id: 'travel-cleartrip', name: 'Cleartrip', icon: '✈️', color: '#336699', subcat: 'Flight Booking', tier: 'all' },
  { id: 'travel-yatra', name: 'Yatra', icon: '✈️', color: '#ea2330', subcat: 'Flight Booking', tier: 'all' },
  { id: 'travel-happyfares', name: 'HappyFares', icon: '✈️', color: '#fbc02d', subcat: 'Flight Booking', tier: 'tier2' },
  { id: 'travel-paytm', name: 'Paytm Travel', icon: '✈️', color: '#0277bd', subcat: 'Flight Booking', tier: 'tier2' },
  { id: 'travel-google', name: 'Google Flights', icon: '✈️', color: '#4285f4', subcat: 'Flight Booking', tier: 'all' },
  { id: 'travel-skyscanner', name: 'Skyscanner', icon: '✈️', color: '#0288d1', subcat: 'Flight Booking', tier: 'all' },
  { id: 'travel-wego', name: 'Wego', icon: '✈️', color: '#4caf50', subcat: 'Flight Booking', tier: 'all' },
  { id: 'travel-airindia', name: 'Air India', icon: '✈️', color: '#d32f2f', subcat: 'Airline Direct', tier: 'all' },
  { id: 'travel-indigo', name: 'IndiGo', icon: '✈️', color: '#1565c0', subcat: 'Airline Direct', tier: 'all' },
  { id: 'travel-akasa', name: 'Akasa Air', icon: '✈️', color: '#ff8f00', subcat: 'Airline Direct', tier: 'tier1' },
  { id: 'travel-spicejet', name: 'SpiceJet', icon: '✈️', color: '#c62828', subcat: 'Airline Direct', tier: 'tier2' },

  // 2. Trains
  { id: 'travel-irctc', name: 'IRCTC', icon: '🚂', color: '#1a237e', subcat: 'Train Booking', tier: 'all' },
  { id: 'travel-confirmtkt', name: 'ConfirmTkt', icon: '🚂', color: '#00796b', subcat: 'Train Booking', tier: 'all' },
  { id: 'travel-trainman', name: 'Trainman', icon: '🚂', color: '#b71c1c', subcat: 'Train Booking', tier: 'all' },
  { id: 'travel-railyatri', name: 'RailYatri', icon: '🚂', color: '#0288d1', subcat: 'Train Booking', tier: 'all' },
  { id: 'travel-redrail', name: 'redRail', icon: '🚂', color: '#d84e55', subcat: 'Train Booking', tier: 'all' },
  { id: 'travel-wimt', name: 'Where Is My Train', icon: '🚂', color: '#1565c0', subcat: 'Train Booking', tier: 'all' },
  { id: 'travel-tripozo', name: 'Tripozo', icon: '🚂', color: '#e65100', subcat: 'Train Booking', tier: 'all' },

  // 3. Buses
  { id: 'travel-redbus', name: 'redBus', icon: '🚌', color: '#d84e55', subcat: 'Bus Booking', tier: 'all' },
  { id: 'travel-abhibus', name: 'AbhiBus', icon: '🚌', color: '#c7222a', subcat: 'Bus Booking', tier: 'all' },
  { id: 'travel-intrcity', name: 'IntrCity', icon: '🚌', color: '#2e7d32', subcat: 'Bus Booking', tier: 'tier2' },
  { id: 'travel-flixbus', name: 'FlixBus', icon: '🚌', color: '#8bc34a', subcat: 'Bus Booking', tier: 'tier2' },
  { id: 'travel-zingbus', name: 'Zingbus', icon: '🚌', color: '#fbc02d', subcat: 'Bus Booking', tier: 'tier2' },
  { id: 'travel-tsrtc', name: 'TSRTC', icon: '🚌', color: '#1565c0', subcat: 'State Transport', tier: 'tier1' },
  { id: 'travel-ksrtc', name: 'KSRTC', icon: '🚌', color: '#b71c1c', subcat: 'State Transport', tier: 'tier1' },
  { id: 'travel-upsrtc', name: 'UPSRTC', icon: '🚌', color: '#00796b', subcat: 'State Transport', tier: 'tier1' },
  { id: 'travel-hrtc', name: 'HRTC', icon: '🚌', color: '#0288d1', subcat: 'State Transport', tier: 'tier1' },

  // 4. Hotels
  { id: 'travel-oyo', name: 'OYO', icon: '🏨', color: '#d32f2f', subcat: 'Hotel Booking', tier: 'all' },
  { id: 'travel-booking', name: 'Booking.com', icon: '🏨', color: '#003580', subcat: 'Hotel Booking', tier: 'all' },
  { id: 'travel-agoda', name: 'Agoda', icon: '🏨', color: '#e65100', subcat: 'Hotel Booking', tier: 'all' },
  { id: 'travel-expedia', name: 'Expedia', icon: '🏨', color: '#00005e', subcat: 'Hotel Booking', tier: 'tier2' },
  { id: 'travel-kayak', name: 'Kayak', icon: '🏨', color: '#ff6d00', subcat: 'Hotel Booking', tier: 'tier2' },
  { id: 'travel-trip', name: 'Trip.com', icon: '🏨', color: '#1565c0', subcat: 'Hotel Booking', tier: 'tier2' },
  { id: 'travel-hotelscom', name: 'Hotels.com', icon: '🏨', color: '#b71c1c', subcat: 'Hotel Booking', tier: 'tier2' },
  { id: 'travel-trivago', name: 'Trivago', icon: '🏨', color: '#0288d1', subcat: 'Hotel Booking', tier: 'tier2' },
  { id: 'travel-hostelworld', name: 'Hostelworld', icon: '🛏️', color: '#f57c00', subcat: 'Hotel Booking', tier: 'tier1' },
  { id: 'travel-fabhotels', name: 'FabHotels', icon: '🏨', color: '#2e7d32', subcat: 'Hotel Booking', tier: 'tier1' },
  { id: 'travel-treebo', name: 'Treebo', icon: '🏨', color: '#c2185b', subcat: 'Hotel Booking', tier: 'tier1' },
  { id: 'travel-taj', name: 'Taj Hotels', icon: '🏨', color: '#880e4f', subcat: 'Premium Hotels', tier: 'tier1' },
  { id: 'travel-marriott', name: 'Marriott', icon: '🏨', color: '#000000', subcat: 'Premium Hotels', tier: 'tier1' },

  // 5. Homestay / Villa
  { id: 'travel-airbnb', name: 'Airbnb', icon: '🏡', color: '#ff5a5f', subcat: 'Villas & Homestays', tier: 'tier2' },
  { id: 'travel-stayvista', name: 'StayVista', icon: '🏡', color: '#2e7d32', subcat: 'Villas & Homestays', tier: 'tier1' },
  { id: 'travel-saffronstays', name: 'SaffronStays', icon: '🏡', color: '#c2185b', subcat: 'Villas & Homestays', tier: 'tier1' },
  { id: 'travel-vrbo', name: 'Vrbo', icon: '🏡', color: '#1565c0', subcat: 'Villas & Homestays', tier: 'tier2' },
  { id: 'travel-zostel', name: 'Zostel', icon: '🏕️', color: '#f57f17', subcat: 'Villas & Homestays', tier: 'tier2' },

  // 6. Cabs
  { id: 'travel-uber', name: 'Uber', icon: '🚕', color: '#000000', subcat: 'Cabs & Taxis', tier: 'tier1' },
  { id: 'travel-ola', name: 'Ola', icon: '🚕', color: '#8bc34a', subcat: 'Cabs & Taxis', tier: 'tier1' },
  { id: 'travel-rapido', name: 'Rapido', icon: '🛵', color: '#ffc107', subcat: 'Cabs & Taxis', tier: 'tier1' },
  { id: 'travel-indrive', name: 'inDrive', icon: '🚕', color: '#8bc34a', subcat: 'Cabs & Taxis', tier: 'tier1' },
  { id: 'travel-blusmart', name: 'BluSmart', icon: '🚕', color: '#1976d2', subcat: 'Cabs & Taxis', tier: 'tier1' },
  { id: 'travel-nammayatri', name: 'Namma Yatri', icon: '🚕', color: '#f57c00', subcat: 'Cabs & Taxis', tier: 'tier1' },
  { id: 'travel-yatrisathi', name: 'Yatri Sathi', icon: '🚕', color: '#fbc02d', subcat: 'Cabs & Taxis', tier: 'tier1' },
  { id: 'travel-savaari', name: 'Savaari', icon: '🚕', color: '#c2185b', subcat: 'Cabs & Taxis', tier: 'tier2' },

  // 7. Self-drive
  { id: 'travel-zoomcar', name: 'Zoomcar', icon: '🚗', color: '#2e7d32', subcat: 'Self-Drive', tier: 'tier1' },
  { id: 'travel-revv', name: 'Revv', icon: '🚗', color: '#00796b', subcat: 'Self-Drive', tier: 'tier1' },
  { id: 'travel-myles', name: 'Myles', icon: '🚗', color: '#1565c0', subcat: 'Self-Drive', tier: 'tier1' },
  { id: 'travel-drivezy', name: 'Drivezy', icon: '🚗', color: '#c2185b', subcat: 'Self-Drive', tier: 'tier1' },
  { id: 'travel-avis', name: 'Avis', icon: '🚗', color: '#d32f2f', subcat: 'Self-Drive', tier: 'tier1' },

  // 8. Bike/Scooter
  { id: 'travel-royalbros', name: 'Royal Brothers', icon: '🏍️', color: '#fbc02d', subcat: 'Bike Rentals', tier: 'tier1' },
  { id: 'travel-vogo', name: 'Vogo', icon: '🛵', color: '#ffb300', subcat: 'Bike Rentals', tier: 'tier1' },
  { id: 'travel-bounce', name: 'Bounce', icon: '🛵', color: '#f57f17', subcat: 'Bike Rentals', tier: 'tier1' },
  { id: 'travel-yulu', name: 'Yulu', icon: '🛴', color: '#03a9f4', subcat: 'Bike Rentals', tier: 'tier1' },
  { id: 'travel-zypp', name: 'Zypp', icon: '🛴', color: '#8bc34a', subcat: 'Bike Rentals', tier: 'tier1' },

  // 9. Metros
  { id: 'travel-chalo', name: 'Chalo', icon: '🚌', color: '#ff8f00', subcat: 'Local Transport', tier: 'tier1' },
  { id: 'travel-moovit', name: 'Moovit', icon: '🚇', color: '#ff6f00', subcat: 'Local Transport', tier: 'tier1' },
  { id: 'travel-delhimetro', name: 'Delhi Metro', icon: '🚇', color: '#d32f2f', subcat: 'Local Transport', tier: 'tier1' },
  { id: 'travel-mumbaione', name: 'Mumbai One', icon: '🚇', color: '#1565c0', subcat: 'Local Transport', tier: 'tier1' },
  { id: 'travel-nammametro', name: 'Namma Metro', icon: '🚇', color: '#512da8', subcat: 'Local Transport', tier: 'tier1' }
];

const GROCERY_PROVIDERS = [
  // National & Quick Commerce
  { id: 'groc-blinkit', name: 'Blinkit', icon: '🛒', color: '#f8cb46', subcat: 'Quick Commerce', tier: 'tier1' },
  { id: 'groc-zepto', name: 'Zepto', icon: '⏱️', color: '#7e57c2', subcat: 'Quick Commerce', tier: 'tier1' },
  { id: 'groc-instamart', name: 'Swiggy Instamart', icon: '⚡', color: '#fc8019', subcat: 'Quick Commerce', tier: 'tier1' },
  { id: 'groc-bigbasket', name: 'BigBasket', icon: '🥬', color: '#689f38', subcat: 'National Grocery', tier: 'tier2' },
  { id: 'groc-bbnow', name: 'BB Now', icon: '🚀', color: '#8bc34a', subcat: 'Quick Commerce', tier: 'tier1' },
  { id: 'groc-jiomart', name: 'JioMart', icon: '🛍️', color: '#01579b', subcat: 'National Grocery', tier: 'all' },
  { id: 'groc-amazon-fresh', name: 'Amazon Fresh', icon: '📦', color: '#ff9900', subcat: 'National Grocery', tier: 'tier2' },
  { id: 'groc-flipkart-groc', name: 'Flipkart Grocery', icon: '🛒', color: '#2874f0', subcat: 'National Grocery', tier: 'tier2' },
  { id: 'groc-flipkart-min', name: 'Flipkart Minutes', icon: '⏱️', color: '#1976d2', subcat: 'Quick Commerce', tier: 'tier1' },
  { id: 'groc-dmart', name: 'DMart Ready', icon: '🏪', color: '#2e7d32', subcat: 'Supermarket', tier: 'tier2' },
  { id: 'groc-tataneu', name: 'Tata Neu', icon: '🔮', color: '#4a148c', subcat: 'National Grocery', tier: 'tier2' },
  
  // Supermarkets
  { id: 'groc-spencers', name: 'Spencer\'s', icon: '🏪', color: '#d32f2f', subcat: 'Supermarket', tier: 'tier2' },
  { id: 'groc-starquik', name: 'StarQuik', icon: '⭐', color: '#fbc02d', subcat: 'Supermarket', tier: 'tier1' },
  { id: 'groc-naturesbasket', name: 'Nature\'s Basket', icon: '🧺', color: '#558b2f', subcat: 'Supermarket', tier: 'tier1' },
  { id: 'groc-reliancesmart', name: 'Reliance Smart', icon: '🏬', color: '#0277bd', subcat: 'Supermarket', tier: 'tier2' },
  { id: 'groc-more', name: 'More Retail', icon: '🍎', color: '#e65100', subcat: 'Supermarket', tier: 'tier2' },
  
  // Milk & Essentials
  { id: 'groc-milkbasket', name: 'Milkbasket', icon: '🥛', color: '#1565c0', subcat: 'Milk & Essentials', tier: 'tier1' },
  { id: 'groc-countrydelight', name: 'Country Delight', icon: '🐄', color: '#c62828', subcat: 'Milk & Essentials', tier: 'tier1' },
  { id: 'groc-bbdaily', name: 'BB Daily', icon: '🍞', color: '#689f38', subcat: 'Milk & Essentials', tier: 'tier2' },
  { id: 'groc-suprdaily', name: 'Supr Daily', icon: '🥚', color: '#f57c00', subcat: 'Milk & Essentials', tier: 'tier1' },
  { id: 'groc-akshayakalpa', name: 'Akshayakalpa', icon: '🥛', color: '#00695c', subcat: 'Milk & Essentials', tier: 'tier1' },
  
  // Fresh & Meat
  { id: 'groc-otipy', name: 'Otipy', icon: '🥦', color: '#2e7d32', subcat: 'Fresh & Meat', tier: 'tier1' },
  { id: 'groc-freshtohome', name: 'FreshToHome', icon: '🐟', color: '#e65100', subcat: 'Fresh & Meat', tier: 'tier1' },
  { id: 'groc-licious', name: 'Licious', icon: '🍗', color: '#d32f2f', subcat: 'Fresh & Meat', tier: 'tier1' },
  { id: 'groc-meatigo', name: 'Meatigo', icon: '🥩', color: '#b71c1c', subcat: 'Fresh & Meat', tier: 'tier1' },
  { id: 'groc-tendercuts', name: 'TenderCuts', icon: '🔪', color: '#c62828', subcat: 'Fresh & Meat', tier: 'tier1' },
  
  // ONDC & B2B
  { id: 'groc-pincode', name: 'Pincode (ONDC)', icon: '📍', color: '#00838f', subcat: 'ONDC', tier: 'tier1' },
  { id: 'groc-paytmondc', name: 'Paytm ONDC', icon: '📱', color: '#0277bd', subcat: 'ONDC', tier: 'all' },
  { id: 'groc-mystore', name: 'Mystore', icon: '🏪', color: '#d84315', subcat: 'ONDC', tier: 'tier1' },
  { id: 'groc-udaan', name: 'Udaan (B2B)', icon: '📦', color: '#1565c0', subcat: 'B2B & Wholesale', tier: 'tier2' },
  { id: 'groc-jumbotail', name: 'Jumbotail', icon: '🏬', color: '#f57c00', subcat: 'B2B & Wholesale', tier: 'tier2' },
  { id: 'groc-ninjacart', name: 'Ninjacart', icon: '🥬', color: '#43a047', subcat: 'B2B & Wholesale', tier: 'tier2' }
];

const MEDICINE_PROVIDERS = [
  // National
  { id: 'med-apollo', name: 'Apollo 24|7', icon: '💊', color: '#00539f', subcat: 'Pharmacy', tier: 'all' },
  { id: 'med-netmeds', name: 'Netmeds', icon: '💊', color: '#00c6d7', subcat: 'Pharmacy', tier: 'all' },
  { id: 'med-1mg', name: 'Tata 1mg', icon: '💊', color: '#ff6f61', subcat: 'Pharmacy', tier: 'all' },
  { id: 'med-pharmeasy', name: 'PharmEasy', icon: '💊', color: '#10847e', subcat: 'Pharmacy', tier: 'all' },
  { id: 'med-flipkarthealth', name: 'Flipkart Health+', icon: '💊', color: '#2874f0', subcat: 'Pharmacy', tier: 'all' },
  { id: 'med-amazonpharmacy', name: 'Amazon Pharmacy', icon: '💊', color: '#ff9900', subcat: 'Pharmacy', tier: 'all' },
  { id: 'med-medplus', name: 'MedPlus', icon: '💊', color: '#1565c0', subcat: 'Pharmacy', tier: 'all' },

  // Generic
  { id: 'med-truemeds', name: 'Truemeds', icon: '💊', color: '#4a90e2', subcat: 'Generic Medicine', tier: 'all' },
  { id: 'med-genericart', name: 'Genericart', icon: '💊', color: '#2e7d32', subcat: 'Generic Medicine', tier: 'all' },
  { id: 'med-davaindia', name: 'Davaindia', icon: '💊', color: '#d32f2f', subcat: 'Generic Medicine', tier: 'all' },
  { id: 'med-medkart', name: 'Medkart', icon: '💊', color: '#ff8f00', subcat: 'Generic Medicine', tier: 'all' },
  { id: 'med-genericaadhaar', name: 'Generic Aadhaar', icon: '💊', color: '#1976d2', subcat: 'Generic Medicine', tier: 'all' },
  { id: 'med-zenerics', name: 'Zenerics', icon: '💊', color: '#c2185b', subcat: 'Generic Medicine', tier: 'all' },
  { id: 'med-pharmarack', name: 'Pharmarack', icon: '💊', color: '#00796b', subcat: 'Generic Medicine', tier: 'tier2' },
  { id: 'med-platinumrx', name: 'PlatinumRx', icon: '💊', color: '#689f38', subcat: 'Generic Medicine', tier: 'all' },
  { id: 'med-sastasundar', name: 'SastaSundar', icon: '💊', color: '#0288d1', subcat: 'Generic Medicine', tier: 'tier2' },
  { id: 'med-healthmug', name: 'Healthmug', icon: '💊', color: '#d84315', subcat: 'Generic Medicine', tier: 'all' },
  { id: 'med-pharmacybazar', name: 'Pharmacy Bazar', icon: '💊', color: '#4a148c', subcat: 'Generic Medicine', tier: 'all' },
  { id: 'med-positrarx', name: 'Positra Rx', icon: '💊', color: '#00838f', subcat: 'Generic Medicine', tier: 'all' },
  { id: 'med-pulsepharmacy', name: 'Pulse Pharmacy', icon: '💊', color: '#ad1457', subcat: 'Generic Medicine', tier: 'all' },
  { id: 'med-schwabe', name: 'Schwabe', icon: '💊', color: '#283593', subcat: 'Generic Medicine', tier: 'all' },
  { id: 'med-ayushcare', name: 'AyushCare', icon: '🌿', color: '#558b2f', subcat: 'Generic Medicine', tier: 'all' },
  { id: 'med-frankross', name: 'Frank Ross', icon: '💊', color: '#c62828', subcat: 'Generic Medicine', tier: 'tier2' },

  // Quick
  { id: 'med-blinkit', name: 'Blinkit', icon: '⏱️', color: '#f8cb46', subcat: 'Quick Delivery', tier: 'tier1' },
  { id: 'med-zepto', name: 'Zepto', icon: '⏱️', color: '#7e57c2', subcat: 'Quick Delivery', tier: 'tier1' },
  { id: 'med-instamart', name: 'Swiggy Instamart', icon: '⚡', color: '#fc8019', subcat: 'Quick Delivery', tier: 'tier1' },
  { id: 'med-medstown', name: 'Medstown', icon: '⏱️', color: '#0277bd', subcat: 'Quick Delivery', tier: 'tier1' }
];

const SERVICES_PROVIDERS = [
  { id: 'service-uc', name: 'Urban Company', icon: '🔧', color: '#000000', subcat: 'Home Services', tier: 'tier1' },
  { id: 'service-jd', name: 'Justdial', icon: '🔧', color: '#e65100', subcat: 'Home Services', tier: 'all' },
  { id: 'service-nobroker', name: 'NoBroker Services', icon: '🔧', color: '#d32f2f', subcat: 'Home Services', tier: 'tier1' },
  { id: 'service-yesmadam', name: 'Yes Madam', icon: '🔧', color: '#c2185b', subcat: 'Home Services', tier: 'tier1' },
  { id: 'service-helpr', name: 'Helpr', icon: '🔧', color: '#1565c0', subcat: 'Home Services', tier: 'tier2' },
  { id: 'service-digitallaborchowk', name: 'Digital Labor Chowk', icon: '👷', color: '#f57f17', subcat: 'Home Services', tier: 'all' }
];

export default function QuickConnect() {
  const { connections, actions, isHydrated, location } = useStorage();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<{id: string, name: string} | null>(null);
  const [activeTab, setActiveTab] = useState<'food' | 'grocery' | 'shopping' | 'travel' | 'medicine' | 'services'>('food');

  if (!isHydrated) return null;

  const handleConnectClick = (providerId: string, providerName: string) => {
    const isConnected = connections.some(c => c.providerId === providerId && c.status === 'connected');
    
    if (isConnected) {
      actions.disconnectProvider(providerId);
    } else {
      setSelectedProvider({ id: providerId, name: providerName });
      setModalOpen(true);
    }
  };

  const handleOtpSuccess = () => {
    if (selectedProvider) {
      actions.connectProvider(selectedProvider.id);
      setModalOpen(false);
    }
  };

  // Location filtering logic
  const city = (location?.label || '').toLowerCase();
  
  let userTier = 'tier1';
  
  // Check for both English and Hindi variations of the location
  if (
    city.includes('medininagar') || 
    city.includes('daltonganj') || 
    city.includes('मेदिनीनगर') || 
    city.includes('डाल्टनगंज') ||
    city.includes('mdr118')
  ) {
    userTier = 'restricted';
  } else if (
    city.includes('ranchi') || 
    city.includes('patna') ||
    city.includes('रांची') ||
    city.includes('पटना')
  ) {
    userTier = 'tier2';
  }

  const availableFoodProviders = FOOD_PROVIDERS.filter(p => {
    if (userTier === 'restricted') return p.tier === 'all';
    if (userTier === 'tier2') return p.tier === 'all' || p.tier === 'tier2';
    return true; 
  });

  const availableGroceryProviders = GROCERY_PROVIDERS.filter(p => {
    if (userTier === 'restricted') return p.tier === 'all'; // Medininagar only gets JioMart, Paytm ONDC, etc.
    if (userTier === 'tier2') return p.tier === 'all' || p.tier === 'tier2';
    return true; 
  });

  const foodGroups = availableFoodProviders.reduce((acc, p) => {
    if (!acc[p.subcat]) acc[p.subcat] = [];
    acc[p.subcat].push(p);
    return acc;
  }, {} as Record<string, typeof FOOD_PROVIDERS>);

  const groceryGroups = availableGroceryProviders.reduce((acc, p) => {
    if (!acc[p.subcat]) acc[p.subcat] = [];
    acc[p.subcat].push(p);
    return acc;
  }, {} as Record<string, typeof GROCERY_PROVIDERS>);

  const availableMedicineProviders = MEDICINE_PROVIDERS.filter(p => {
    if (userTier === 'restricted') return p.tier === 'all'; 
    if (userTier === 'tier2') return p.tier === 'all' || p.tier === 'tier2';
    return true; 
  });

  const medicineGroups = availableMedicineProviders.reduce((acc, p) => {
    if (!acc[p.subcat]) acc[p.subcat] = [];
    acc[p.subcat].push(p);
    return acc;
  }, {} as Record<string, typeof MEDICINE_PROVIDERS>);

  const availableServiceProviders = SERVICES_PROVIDERS.filter(p => {
    if (userTier === 'restricted') return p.tier === 'all'; 
    if (userTier === 'tier2') return p.tier === 'all' || p.tier === 'tier2';
    return true; 
  });

  const ProviderButton = ({ provider }: { provider: any }) => {
    const isConnected = connections.some(c => c.providerId === provider.id && c.status === 'connected');
    return (
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        key={provider.id}
        onClick={() => handleConnectClick(provider.id, provider.name)}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: '0.5rem',
          padding: '0.75rem 0.25rem',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px', background: isConnected ? `${provider.color}20` : '#f1f5f9', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.75rem', border: `1px solid ${isConnected ? provider.color : 'transparent'}`
        }}>
          {provider.icon}
        </div>
        <div style={{textAlign: 'center'}}>
          <div style={{fontWeight: 600, fontSize: '0.75rem', color: 'var(--foreground)', lineHeight: 1.2, marginBottom: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{provider.name}</div>
          <div style={{fontSize: '0.6rem', color: 'white', background: isConnected ? 'var(--success)' : 'var(--primary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, display: 'inline-block'}}>
            {isConnected ? 'LINKED' : 'LINK NOW'}
          </div>
        </div>
      </motion.button>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const tabs = [
    { id: 'food', label: 'Food', icon: '🍔' },
    { id: 'grocery', label: 'Groceries', icon: '🛒' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'medicine', label: 'Medicine', icon: '💊' },
    { id: 'services', label: 'Services', icon: '🔧' },
    { id: 'travel', label: 'Travel', icon: '✈️' }
  ];

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', background: 'white' }}>
      
      {/* Left Sidebar (Categories Menu) */}
      <div style={{ width: '85px', background: '#f8fafc', borderRight: '1px solid var(--border)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)} 
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
              height: '80px', width: '100%', background: activeTab === tab.id ? 'white' : 'transparent',
              border: 'none', borderLeft: activeTab === tab.id ? '4px solid var(--primary)' : '4px solid transparent',
              cursor: 'pointer', transition: 'all 0.2s', padding: '0 0.25rem'
            }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', 
              background: activeTab === tab.id ? '#eff6ff' : 'transparent', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem'
            }}>
              {tab.icon}
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: activeTab === tab.id ? 700 : 500, color: activeTab === tab.id ? 'var(--primary)' : 'var(--muted)', textAlign: 'center' }}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
      
      {/* Right Content Pane */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', paddingBottom: '6rem', background: 'white' }}>
        
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
          <h3 style={{margin: 0, fontSize: '1.2rem', fontWeight: 700}}>Link Accounts</h3>
          <div style={{fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
            <span>📍</span>
            <span style={{maxWidth: '80px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{city || 'Locating...'}</span>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {activeTab === 'food' && (
            <motion.div key="food" variants={containerVariants} initial="hidden" animate="show" exit="hidden" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              {Object.entries(foodGroups).map(([subcat, providers]) => (
                <div key={subcat}>
                  <h4 style={{margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)'}}>{subcat}</h4>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem'}}>
                    {providers.map(p => <ProviderButton key={p.id} provider={p} />)}
                  </div>
                </div>
              ))}
              {availableFoodProviders.length === 0 && (
                 <div style={{color: 'var(--muted)', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0'}}>Not available in your location.</div>
              )}
            </motion.div>
          )}

          {activeTab === 'grocery' && (
            <motion.div key="grocery" variants={containerVariants} initial="hidden" animate="show" exit="hidden" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              {Object.entries(groceryGroups).map(([subcat, providers]) => (
                <div key={subcat}>
                  <h4 style={{margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)'}}>{subcat}</h4>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem'}}>
                    {providers.map(p => <ProviderButton key={p.id} provider={p} />)}
                  </div>
                </div>
              ))}
              {availableGroceryProviders.length === 0 && (
                 <div style={{color: 'var(--muted)', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0'}}>Not available in your location.</div>
              )}
            </motion.div>
          )}

          {activeTab === 'shopping' && (
            <motion.div key="shopping" variants={containerVariants} initial="hidden" animate="show" exit="hidden">
               <h4 style={{margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)'}}>Top Stores</h4>
               <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem'}}>
                 {SHOPPING_PROVIDERS.map(p => <ProviderButton key={p.id} provider={p} />)}
               </div>
            </motion.div>
          )}

          {activeTab === 'travel' && (
            <motion.div key="travel" variants={containerVariants} initial="hidden" animate="show" exit="hidden">
               <h4 style={{margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)'}}>Top Bookings</h4>
               <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem'}}>
                 {TRAVEL_PROVIDERS.map(p => <ProviderButton key={p.id} provider={p} />)}
               </div>
            </motion.div>
          )}

          {activeTab === 'medicine' && (
            <motion.div key="medicine" variants={containerVariants} initial="hidden" animate="show" exit="hidden" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              {Object.entries(medicineGroups).map(([subcat, providers]) => (
                <div key={subcat}>
                  <h4 style={{margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)'}}>{subcat}</h4>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem'}}>
                    {providers.map(p => <ProviderButton key={p.id} provider={p} />)}
                  </div>
                </div>
              ))}
              {availableMedicineProviders.length === 0 && (
                 <div style={{color: 'var(--muted)', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0'}}>Not available in your location.</div>
              )}
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div key="services" variants={containerVariants} initial="hidden" animate="show" exit="hidden">
               <h4 style={{margin: '0 0 0.75rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--foreground)'}}>Local Pros</h4>
               <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem'}}>
                 {availableServiceProviders.map(p => <ProviderButton key={p.id} provider={p} />)}
               </div>
               {availableServiceProviders.length === 0 && (
                 <div style={{color: 'var(--muted)', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0'}}>Not available in your location.</div>
               )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>


      {selectedProvider && (
        <OTPModal 
          providerName={selectedProvider.name}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleOtpSuccess}
        />
      )}
    </div>
  );
}
