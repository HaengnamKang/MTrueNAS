import axios, { type AxiosInstance } from 'axios';
import { buildRestBaseUrl } from '../../shared/utils/validators';
import { API } from '../../shared/utils/constants';
import type { SystemInfo, Pool, Alert } from '../../shared/types/truenas';

export class RestFallbackClient {
  private client: AxiosInstance;

  constructor(host: string, port: number, useTls: boolean, apiKey: string) {
    const baseURL = buildRestBaseUrl(host, port, useTls, API.REST_BASE_PATH);

    this.client = axios.create({
      baseURL,
      timeout: API.REQUEST_TIMEOUT_MS,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getSystemInfo(): Promise<SystemInfo> {
    const { data } = await this.client.get<SystemInfo>('/system/info');
    return data;
  }

  async getPools(): Promise<Pool[]> {
    const { data } = await this.client.get<Pool[]>('/pool');
    return data;
  }

  async getAlerts(): Promise<Alert[]> {
    const { data } = await this.client.get<Alert[]>('/alert/list');
    return data;
  }

  async ping(): Promise<boolean> {
    try {
      await this.client.get('/system/info');
      return true;
    } catch {
      return false;
    }
  }
}
