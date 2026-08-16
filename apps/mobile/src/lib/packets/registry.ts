import { ProviderPacket } from './types';
import { SwiggyPacket } from './swiggy';

// Define the central registry of all available provider packets
const packets: Record<string, ProviderPacket> = {
    [SwiggyPacket.metadata.id]: SwiggyPacket,
    // Future platforms like Zomato, IRCTC will be added here
};

export const getPacket = (providerId: string): ProviderPacket | undefined => {
    return packets[providerId];
};

export const getAllProvidersMetadata = () => {
    return Object.values(packets).map(packet => packet.metadata);
};
