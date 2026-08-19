// @ts-nocheck
import { ZomatoPacket } from './food/zomato';
import { SwiggyPacket } from './food/swiggy';
import { EatSurePacket } from './food/eatsure';
import { EatClubPacket } from './food/eatclub';
import { ToingPacket } from './food/toing';
import { OwnlyPacket } from './food/ownly';

// Normalize everything to have top-level metadata properties for UI
const normalize = (packet) => {
    if (packet.metadata) {
        return {
            ...packet,
            id: packet.metadata.id,
            name: packet.metadata.name,
            category: packet.metadata.category,
            icon: packet.metadata.icon,
            loginUrl: packet.metadata.loginUrl
        };
    }
    return packet;
};

export const PROVIDERS = [
    normalize(ZomatoPacket),
    normalize(SwiggyPacket),
    normalize(EatSurePacket),
    normalize(EatClubPacket),
    normalize(ToingPacket),
    normalize(OwnlyPacket)
];

export const getPacket = (id) => PROVIDERS.find(p => p.id === id);
export const getFilteredProviders = () => PROVIDERS;
