import { WebSocketService } from '../websocket/WebSocketService';
import type {
  SystemInfo,
  Pool,
  Dataset,
  Disk,
  SmartAttribute,
  Alert,
  SmbShare,
  NfsShare,
  NetworkInterface,
  Service,
  Snapshot,
  ReportingGraph,
  GraphData,
} from '../../shared/types/truenas';

export class TrueNasClient {
  private ws: WebSocketService;

  constructor(ws?: WebSocketService) {
    this.ws = ws ?? WebSocketService.getInstance();
  }

  // System
  async getSystemInfo(): Promise<SystemInfo> {
    return this.ws.call<SystemInfo>('system.info');
  }

  async ping(): Promise<string> {
    return this.ws.call<string>('core.ping');
  }

  // Storage Pools
  async getPools(): Promise<Pool[]> {
    return this.ws.call<Pool[]>('pool.query');
  }

  async getPool(id: number): Promise<Pool> {
    return this.ws.call<Pool>('pool.query', [[['id', '=', id]], { get: true }]);
  }

  // Datasets
  async getDatasets(): Promise<Dataset[]> {
    return this.ws.call<Dataset[]>('pool.dataset.details');
  }

  async getDatasetsByPool(poolName: string): Promise<Dataset[]> {
    return this.ws.call<Dataset[]>('pool.dataset.query', [[['pool', '=', poolName]]]);
  }

  async getDataset(id: string): Promise<Dataset> {
    return this.ws.call<Dataset>('pool.dataset.query', [[['id', '=', id]], { get: true }]);
  }

  // Disks
  async getDisks(): Promise<Disk[]> {
    return this.ws.call<Disk[]>('disk.query');
  }

  async getDiskSmartAttributes(diskName: string): Promise<SmartAttribute[]> {
    return this.ws.call<SmartAttribute[]>('disk.smart_attributes', [diskName]);
  }

  async getDiskTemperatures(): Promise<Record<string, number | null>> {
    const disks = await this.getDisks();
    const temps: Record<string, number | null> = {};
    for (const disk of disks) {
      temps[disk.name] = disk.temperature;
    }
    return temps;
  }

  // Snapshots
  async getSnapshots(datasetId?: string): Promise<Snapshot[]> {
    const filters = datasetId ? [[['dataset', '=', datasetId]]] : [];
    return this.ws.call<Snapshot[]>('zfs.snapshot.query', filters);
  }

  async createSnapshot(dataset: string, name: string, recursive = false): Promise<Snapshot> {
    return this.ws.call<Snapshot>('zfs.snapshot.create', [{ dataset, name, recursive }]);
  }

  async deleteSnapshot(id: string): Promise<boolean> {
    return this.ws.call<boolean>('zfs.snapshot.delete', [id]);
  }

  async rollbackSnapshot(id: string): Promise<boolean> {
    return this.ws.call<boolean>('zfs.snapshot.rollback', [id]);
  }

  // Shares
  async getSmbShares(): Promise<SmbShare[]> {
    return this.ws.call<SmbShare[]>('sharing.smb.query');
  }

  async getNfsShares(): Promise<NfsShare[]> {
    return this.ws.call<NfsShare[]>('sharing.nfs.query');
  }

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    return this.ws.call<Alert[]>('alert.list');
  }

  async dismissAlert(id: string): Promise<void> {
    await this.ws.call('alert.dismiss', [id]);
  }

  // Services
  async getServices(): Promise<Service[]> {
    return this.ws.call<Service[]>('service.query');
  }

  // Network
  async getNetworkInterfaces(): Promise<NetworkInterface[]> {
    return this.ws.call<NetworkInterface[]>('interface.query');
  }

  // Reporting
  async getReportingGraphs(): Promise<ReportingGraph[]> {
    return this.ws.call<ReportingGraph[]>('reporting.graphs');
  }

  async getGraphData(
    graphs: Array<{ name: string; identifier?: string }>,
    params?: { start?: string; end?: string; aggregate?: boolean },
  ): Promise<GraphData[]> {
    return this.ws.call<GraphData[]>('reporting.get_data', [graphs, params ?? {}]);
  }

  // Subscriptions (real-time events)
  subscribeToAlerts(callback: (data: unknown) => void): () => void {
    return this.ws.subscribe('alert.list', callback);
  }

  subscribeToDiskChanges(callback: (data: unknown) => void): () => void {
    return this.ws.subscribe('disk.query', callback);
  }

  subscribeToPoolChanges(callback: (data: unknown) => void): () => void {
    return this.ws.subscribe('pool.query', callback);
  }
}

// Singleton accessor
let clientInstance: TrueNasClient | null = null;

export function getTrueNasClient(): TrueNasClient {
  if (!clientInstance) {
    clientInstance = new TrueNasClient();
  }
  return clientInstance;
}
