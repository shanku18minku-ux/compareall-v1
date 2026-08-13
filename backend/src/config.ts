import dotenv from 'dotenv';
import { CompareAllConfig } from '@compareall/shared-types';

dotenv.config();

const apiModeRaw = process.env.API_MODE || 'mock';

export const config: CompareAllConfig = {
  apiMode: apiModeRaw === 'live' ? 'live' : 'mock'
};
