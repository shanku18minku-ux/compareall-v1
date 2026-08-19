import { ZomatoPacket } from './food/zomato';
import { SwiggyPacket } from './food/swiggy';
import { EatSurePacket } from './food/eatsure';
import { EatClubPacket } from './food/eatclub';
import { ToingPacket } from './food/toing';
import { OwnlyPacket } from './food/ownly';

export const PROVIDERS = [
    ZomatoPacket,
    SwiggyPacket,
    EatSurePacket,
    EatClubPacket,
    ToingPacket,
    OwnlyPacket
];

export const getPacket = (id: string) => PROVIDERS.find(p => p.id === id);

export const getFilteredProviders = () => PROVIDERS;
