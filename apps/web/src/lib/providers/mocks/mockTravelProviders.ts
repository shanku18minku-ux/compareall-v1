import { SearchQuery, NormalizedResult } from '@compareall/shared-types';
import { TravelProvider } from '../categories/TravelProvider';
import { createMockResult, calculateFinalPrice } from './mockUtils';

export class GenericTravelProvider extends TravelProvider {
  constructor(
    id: string, 
    name: string, 
    private baseFee: number,
    private supportedKeywords: string[] = [] // if empty, matches anything (used for OTAs)
  ) {
    super(id, name);
  }

  async fetchTravelOptions(query: SearchQuery): Promise<NormalizedResult[]> {
    const term = query.term.toLowerCase();
    
    // Keyword Matching
    if (this.supportedKeywords.length > 0 && term.trim() !== '') {
      const matches = this.supportedKeywords.some(k => term.includes(k));
      if (!matches && !term.includes(this.config.name.toLowerCase())) {
        return [];
      }
    }

    const isConnected = query.connectedProviders?.includes(this.config.id);
    
    // Mock Pricing Logic based on keywords
    let basePrice = 2500;
    if (term.includes('flight') || term.includes('air')) basePrice = 5500;
    if (term.includes('train') || term.includes('rail')) basePrice = 800;
    if (term.includes('bus') || term.includes('volvo')) basePrice = 1200;
    if (term.includes('hotel') || term.includes('stay') || term.includes('room')) basePrice = 3000;
    if (term.includes('villa') || term.includes('resort')) basePrice = 8500;
    if (term.includes('cab') || term.includes('taxi') || term.includes('ride')) basePrice = 450;
    if (term.includes('bike') || term.includes('scooter')) basePrice = 150;
    if (term.includes('metro') || term.includes('public')) basePrice = 40;
    if (term.includes('rent') || term.includes('drive')) basePrice = 2000;
    
    const variation = (this.config.name.length * 97) % (basePrice * 0.2) - (basePrice * 0.1); 
    const finalPrice = Math.max(20, Math.floor(basePrice + variation));
    
    const convenienceFee = isConnected ? 0 : this.baseFee;
    const discount = isConnected ? Math.floor(finalPrice * 0.15) : 0;
    
    await new Promise(r => setTimeout(r, 200 + Math.random() * 300));

    return [
      createMockResult(this.config.id, this.config.name, `${this.config.id}-1`, {
        title: `${query.term.charAt(0).toUpperCase() + query.term.slice(1) || 'Travel Booking'}`,
        description: `Booked via ${this.config.name}`,
        category: 'travel',
        price: calculateFinalPrice(finalPrice, convenienceFee, 0, 0, discount, 0, 0),
        originalPrice: finalPrice,
        rating: 3.5 + ((this.config.name.length % 15) / 10),
        accountBenefits: isConnected ? [`${this.config.name} Elite: Zero Convenience Fee`] : [],
        deepLinkUrl: `https://${this.config.name.toLowerCase().replace(/[^a-z]/g, '')}.com/search?q=${encodeURIComponent(term)}`
      })
    ];
  }
}

// Keyword groups
const flightKeywords = ['flight', 'plane', 'air', 'ticket'];
const trainKeywords = ['train', 'rail', 'irctc', 'ticket'];
const busKeywords = ['bus', 'volvo', 'sleeper', 'ticket'];
const hotelKeywords = ['hotel', 'room', 'stay', 'resort'];
const villaKeywords = ['villa', 'homestay', 'home', 'vacation', 'stay'];
const cabKeywords = ['cab', 'taxi', 'ride', 'auto', 'uber', 'ola'];
const selfDriveKeywords = ['car', 'rent', 'drive', 'self'];
const bikeKeywords = ['bike', 'scooter', 'rent', 'ride'];
const metroKeywords = ['metro', 'local', 'bus', 'public', 'transport'];

// 1. Flight Booking (OTAs often support multiple, so some have no keywords, some are flight only)
const MMTProvider = new GenericTravelProvider('travel-mmt', 'MakeMyTrip', 250); // General OTA
const GoibiboProvider = new GenericTravelProvider('travel-goibibo', 'Goibibo', 250);
const IxigoProvider = new GenericTravelProvider('travel-ixigo', 'ixigo', 150);
const EMTProvider = new GenericTravelProvider('travel-emt', 'EaseMyTrip', 50);
const CleartripProvider = new GenericTravelProvider('travel-cleartrip', 'Cleartrip', 200);
const YatraProvider = new GenericTravelProvider('travel-yatra', 'Yatra', 200);
const HappyFaresProvider = new GenericTravelProvider('travel-happyfares', 'HappyFares', 100, flightKeywords);
const PaytmTravelProvider = new GenericTravelProvider('travel-paytm', 'Paytm Travel', 150);
const GoogleFlightsProvider = new GenericTravelProvider('travel-google', 'Google Flights', 0, flightKeywords);
const SkyscannerProvider = new GenericTravelProvider('travel-skyscanner', 'Skyscanner', 0, flightKeywords);
const WegoProvider = new GenericTravelProvider('travel-wego', 'Wego', 0, flightKeywords);
const BookingComProvider = new GenericTravelProvider('travel-booking', 'Booking.com', 0, hotelKeywords); // Mostly hotels
const AgodaProvider = new GenericTravelProvider('travel-agoda', 'Agoda', 0, hotelKeywords);
const ExpediaProvider = new GenericTravelProvider('travel-expedia', 'Expedia', 0);
const KayakProvider = new GenericTravelProvider('travel-kayak', 'Kayak', 0);
const TripComProvider = new GenericTravelProvider('travel-trip', 'Trip.com', 0);

// Airline Direct
const AirIndiaProvider = new GenericTravelProvider('travel-airindia', 'Air India', 0, flightKeywords);
const IndigoProvider = new GenericTravelProvider('travel-indigo', 'IndiGo', 0, flightKeywords);
const AkasaProvider = new GenericTravelProvider('travel-akasa', 'Akasa Air', 0, flightKeywords);
const SpiceJetProvider = new GenericTravelProvider('travel-spicejet', 'SpiceJet', 0, flightKeywords);

// 2. Train Booking
const IRCTCProvider = new GenericTravelProvider('travel-irctc', 'IRCTC Rail Connect', 0, trainKeywords);
const ConfirmTktProvider = new GenericTravelProvider('travel-confirmtkt', 'ConfirmTkt', 20, trainKeywords);
const TrainmanProvider = new GenericTravelProvider('travel-trainman', 'Trainman', 20, trainKeywords);
const RailYatriProvider = new GenericTravelProvider('travel-railyatri', 'RailYatri', 20, trainKeywords);
const RedRailProvider = new GenericTravelProvider('travel-redrail', 'redRail', 15, trainKeywords);
const WhereIsMyTrainProvider = new GenericTravelProvider('travel-wimt', 'Where Is My Train', 0, trainKeywords);
const TripozoProvider = new GenericTravelProvider('travel-tripozo', 'Tripozo', 10, trainKeywords);

// 3. Bus Booking
const RedBusProvider = new GenericTravelProvider('travel-redbus', 'redBus', 30, busKeywords);
const AbhiBusProvider = new GenericTravelProvider('travel-abhibus', 'AbhiBus', 25, busKeywords);
const IntrCityProvider = new GenericTravelProvider('travel-intrcity', 'IntrCity SmartBus', 20, busKeywords);
const FlixBusProvider = new GenericTravelProvider('travel-flixbus', 'FlixBus India', 25, busKeywords);
const ZingbusProvider = new GenericTravelProvider('travel-zingbus', 'Zingbus', 20, busKeywords);
const TSRTCProvider = new GenericTravelProvider('travel-tsrtc', 'TSRTC', 0, busKeywords);
const KSRTCProvider = new GenericTravelProvider('travel-ksrtc', 'KSRTC', 0, busKeywords);
const UPSRTCProvider = new GenericTravelProvider('travel-upsrtc', 'UPSRTC', 0, busKeywords);
const HRTCProvider = new GenericTravelProvider('travel-hrtc', 'HRTC', 0, busKeywords);

// 4. Hotel Booking
const OYOProvider = new GenericTravelProvider('travel-oyo', 'OYO', 50, hotelKeywords);
const HotelsComProvider = new GenericTravelProvider('travel-hotelscom', 'Hotels.com', 0, hotelKeywords);
const TrivagoProvider = new GenericTravelProvider('travel-trivago', 'Trivago', 0, hotelKeywords);
const HostelworldProvider = new GenericTravelProvider('travel-hostelworld', 'Hostelworld', 0, hotelKeywords);
const FabHotelsProvider = new GenericTravelProvider('travel-fabhotels', 'FabHotels', 30, hotelKeywords);
const TreeboProvider = new GenericTravelProvider('travel-treebo', 'Treebo', 30, hotelKeywords);
const TajHotelsProvider = new GenericTravelProvider('travel-taj', 'Taj Hotels', 0, hotelKeywords);
const MarriottProvider = new GenericTravelProvider('travel-marriott', 'Marriott', 0, hotelKeywords);

// 5. Homestay / Villa
const AirbnbProvider = new GenericTravelProvider('travel-airbnb', 'Airbnb', 400, villaKeywords);
const StayVistaProvider = new GenericTravelProvider('travel-stayvista', 'StayVista', 500, villaKeywords);
const SaffronStaysProvider = new GenericTravelProvider('travel-saffronstays', 'SaffronStays', 500, villaKeywords);
const VrboProvider = new GenericTravelProvider('travel-vrbo', 'Vrbo', 400, villaKeywords);
const ZostelProvider = new GenericTravelProvider('travel-zostel', 'Zostel', 50, villaKeywords);

// 6. Cab / Taxi
const UberProvider = new GenericTravelProvider('travel-uber', 'Uber', 10, cabKeywords);
const OlaProvider = new GenericTravelProvider('travel-ola', 'Ola', 10, cabKeywords);
const RapidoProvider = new GenericTravelProvider('travel-rapido', 'Rapido', 5, cabKeywords);
const InDriveProvider = new GenericTravelProvider('travel-indrive', 'inDrive', 0, cabKeywords);
const BluSmartProvider = new GenericTravelProvider('travel-blusmart', 'BluSmart', 10, cabKeywords);
const NammaYatriProvider = new GenericTravelProvider('travel-nammayatri', 'Namma Yatri', 0, cabKeywords);
const YatriSathiProvider = new GenericTravelProvider('travel-yatrisathi', 'Yatri Sathi', 0, cabKeywords);
const SavaariProvider = new GenericTravelProvider('travel-savaari', 'Savaari', 100, cabKeywords);

// 7. Self-drive
const ZoomcarProvider = new GenericTravelProvider('travel-zoomcar', 'Zoomcar', 200, selfDriveKeywords);
const RevvProvider = new GenericTravelProvider('travel-revv', 'Revv', 150, selfDriveKeywords);
const MylesProvider = new GenericTravelProvider('travel-myles', 'Myles', 150, selfDriveKeywords);
const DrivezyProvider = new GenericTravelProvider('travel-drivezy', 'Drivezy', 100, selfDriveKeywords);
const AvisProvider = new GenericTravelProvider('travel-avis', 'Avis India', 300, selfDriveKeywords);

// 8. Bike / Scooter
const RoyalBrothersProvider = new GenericTravelProvider('travel-royalbros', 'Royal Brothers', 50, bikeKeywords);
const VogoProvider = new GenericTravelProvider('travel-vogo', 'Vogo', 20, bikeKeywords);
const BounceProvider = new GenericTravelProvider('travel-bounce', 'Bounce', 20, bikeKeywords);
const YuluProvider = new GenericTravelProvider('travel-yulu', 'Yulu', 10, bikeKeywords);
const ZyppProvider = new GenericTravelProvider('travel-zypp', 'Zypp', 15, bikeKeywords);

// 9. Local Bus / Metro
const ChaloProvider = new GenericTravelProvider('travel-chalo', 'Chalo', 0, metroKeywords);
const MoovitProvider = new GenericTravelProvider('travel-moovit', 'Moovit', 0, metroKeywords);
const DelhiMetroProvider = new GenericTravelProvider('travel-delhimetro', 'Delhi Metro', 0, metroKeywords);
const MumbaiOneProvider = new GenericTravelProvider('travel-mumbaione', 'Mumbai One', 0, metroKeywords);
const NammaMetroProvider = new GenericTravelProvider('travel-nammametro', 'Namma Metro', 0, metroKeywords);

export const extendedTravelProviders = [
  MMTProvider, GoibiboProvider, IxigoProvider, EMTProvider, CleartripProvider, YatraProvider,
  HappyFaresProvider, PaytmTravelProvider, GoogleFlightsProvider, SkyscannerProvider, WegoProvider,
  BookingComProvider, AgodaProvider, ExpediaProvider, KayakProvider, TripComProvider,
  AirIndiaProvider, IndigoProvider, AkasaProvider, SpiceJetProvider,
  
  IRCTCProvider, ConfirmTktProvider, TrainmanProvider, RailYatriProvider, RedRailProvider,
  WhereIsMyTrainProvider, TripozoProvider,
  
  RedBusProvider, AbhiBusProvider, IntrCityProvider, FlixBusProvider, ZingbusProvider,
  TSRTCProvider, KSRTCProvider, UPSRTCProvider, HRTCProvider,
  
  OYOProvider, HotelsComProvider, TrivagoProvider, HostelworldProvider, FabHotelsProvider,
  TreeboProvider, TajHotelsProvider, MarriottProvider,
  
  AirbnbProvider, StayVistaProvider, SaffronStaysProvider, VrboProvider, ZostelProvider,
  
  UberProvider, OlaProvider, RapidoProvider, InDriveProvider, BluSmartProvider,
  NammaYatriProvider, YatriSathiProvider, SavaariProvider,
  
  ZoomcarProvider, RevvProvider, MylesProvider, DrivezyProvider, AvisProvider,
  
  RoyalBrothersProvider, VogoProvider, BounceProvider, YuluProvider, ZyppProvider,
  
  ChaloProvider, MoovitProvider, DelhiMetroProvider, MumbaiOneProvider, NammaMetroProvider
];
