// @ts-nocheck
import { ZomatoPacket } from './food/zomato';
import { SwiggyPacket } from './food/swiggy';
import { EatSurePacket } from './food/eatsure';
import { EatClubPacket } from './food/eatclub';
import { MagicpinPacket } from './food/magicpin';

// ── New Brand Packets ─────────────────────────────────────────────────────────
import {
    McDonaldsPacket, KFCPacket, BurgerKingPacket,
    SubwayPacket, TacoBellPacket, WowMomoPacket
} from './food/brands_qsr';
import { DominosPacket, PizzaHutPacket, OvenStoryPacket } from './food/brands_pizza';
import { ChaayosPacket, ChaiPointPacket, BaristaPacket } from './food/brands_cafe';
import {
    HaldiramsPacket, BikanervalaPacket, NirulasPacket,
    GoliVadaPavPacket, JumboKingPacket
} from './food/brands_indian';
import {
    FaasosPacket, RollsKingPacket, LunchBoxPacket,
    TheGoodBowlPacket, FreshMenuPacket
} from './food/brands_rolls';
import {
    BehrouzPacket, BarbequeNationPacket, AbsoluteBarbecuesPacket
} from './food/brands_biryani_dining';

// Normalize everything to have top-level metadata properties for UI
const normalize = (packet) => {
    if (packet.metadata) {
        return {
            ...packet,
            id: packet.metadata.id,
            name: packet.metadata.name,
            category: packet.metadata.category,
            subcategory: packet.metadata.subcategory || 'Food Delivery',
            icon: packet.metadata.icon,
            brandColor: packet.metadata.brandColor,
            loginUrl: packet.metadata.loginUrl,
            connectionType: packet.connectionType || 'WEBVIEW_LOGIN',
        };
    }
    return packet;
};

// ── Brand Registry ────────────────────────────────────────────────────────────
// Order: Food Delivery platforms first (have WebView login + real extraction)
// Then grouped by subcategory (OFFICIAL_WEB / direct ordering)
export const PROVIDERS = [
    // Food Delivery (full account integration)
    normalize(ZomatoPacket),
    normalize(SwiggyPacket),
    normalize(EatSurePacket),
    normalize(EatClubPacket),
    normalize(MagicpinPacket), // Public deals aggregator — shows Domino's/KFC/McDonald's real deals

    // Fast Food / QSR
    normalize(McDonaldsPacket),
    normalize(KFCPacket),
    normalize(BurgerKingPacket),
    normalize(SubwayPacket),
    normalize(TacoBellPacket),
    normalize(WowMomoPacket),

    // Pizza
    normalize(DominosPacket),
    normalize(PizzaHutPacket),
    normalize(OvenStoryPacket),

    // Cafe
    normalize(ChaayosPacket),
    normalize(ChaiPointPacket),
    normalize(BaristaPacket),

    // Indian Food / Snacks
    normalize(HaldiramsPacket),
    normalize(BikanervalaPacket),
    normalize(NirulasPacket),
    normalize(GoliVadaPavPacket),
    normalize(JumboKingPacket),

    // Rolls / Meals
    normalize(FaasosPacket),
    normalize(RollsKingPacket),
    normalize(LunchBoxPacket),
    normalize(TheGoodBowlPacket),
    normalize(FreshMenuPacket),

    // Biryani
    normalize(BehrouzPacket),

    // Dining
    normalize(BarbequeNationPacket),
    normalize(AbsoluteBarbecuesPacket),
];

export const getPacket = (id) => PROVIDERS.find(p => p.id === id);
export const getFilteredProviders = () => PROVIDERS;

// ── Subcategory order for UI grouping ─────────────────────────────────────────
export const FOOD_SUBCATEGORY_ORDER = [
    'Food Delivery',
    'Fast Food / QSR',
    'Pizza',
    'Cafe',
    'Indian Food / Snacks',
    'Rolls / Meals',
    'Biryani',
    'Dining',
];
