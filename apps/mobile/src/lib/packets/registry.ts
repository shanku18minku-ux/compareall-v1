import { PlatformPacket } from './types';
import { swiggyPacket } from './swiggy';

class PlatformRegistryClass {
  private packets: Map<string, PlatformPacket> = new Map();

  constructor() {
    this.register(swiggyPacket);
  }

  register(packet: PlatformPacket) {
    this.packets.set(packet.metadata.id, packet);
  }

  get(id: string): PlatformPacket | undefined {
    return this.packets.get(id);
  }

  getAll(): PlatformPacket[] {
    return Array.from(this.packets.values());
  }
}

export const PlatformRegistry = new PlatformRegistryClass();
