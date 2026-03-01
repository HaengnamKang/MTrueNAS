// System
export interface SystemInfo {
  version: string;
  hostname: string;
  uptime: string;
  uptime_seconds: number;
  loadavg: [number, number, number];
  physmem: number;
  model: string;
  cores: number;
  timezone: string;
  system_serial: string;
  system_product: string;
  system_manufacturer: string;
}

// Storage Pool
export interface Pool {
  id: number;
  name: string;
  guid: string;
  status: PoolStatus;
  path: string;
  scan: PoolScan;
  topology: PoolTopology;
  healthy: boolean;
  status_detail: string;
  size: number;
  allocated: number;
  free: number;
  freeing: number;
  fragmentation: number | null;
  autotrim: { value: string };
}

export type PoolStatus = 'ONLINE' | 'DEGRADED' | 'FAULTED' | 'OFFLINE' | 'REMOVED' | 'UNAVAIL';

export interface PoolScan {
  function: 'SCRUB' | 'RESILVER' | 'NONE';
  state: 'SCANNING' | 'FINISHED' | 'CANCELED' | 'NONE';
  start_time?: { $date: number };
  end_time?: { $date: number };
  percentage?: number;
  bytes_to_process?: number;
  bytes_processed?: number;
  errors?: number;
}

export interface PoolTopology {
  data: Vdev[];
  log: Vdev[];
  cache: Vdev[];
  spare: Vdev[];
  special: Vdev[];
  dedup: Vdev[];
}

export interface Vdev {
  name: string;
  type: string;
  path: string | null;
  guid: string;
  status: PoolStatus;
  stats: VdevStats;
  children: Vdev[];
}

export interface VdevStats {
  timestamp: number;
  read_errors: number;
  write_errors: number;
  checksum_errors: number;
  ops: number[];
  bytes: number[];
  size: number;
  allocated: number;
  fragmentation: number;
}

// Dataset
export interface Dataset {
  id: string;
  name: string;
  pool: string;
  type: 'FILESYSTEM' | 'VOLUME';
  used: DatasetProperty;
  available: DatasetProperty;
  quota: DatasetProperty;
  refquota: DatasetProperty;
  compression: { value: string };
  atime: { value: string };
  mountpoint: string;
  encrypted: boolean;
  snapshot_count: number;
  children: Dataset[];
}

export interface DatasetProperty {
  parsed: number;
  rawvalue: string;
  value: string;
  source: string;
}

// Disk
export interface Disk {
  identifier: string;
  name: string;
  serial: string;
  size: number;
  type: string;
  model: string;
  rotationrate: number | null;
  temperature: number | null;
  pool: string | null;
  hddstandby: string;
  togglesmart: boolean;
}

export interface SmartAttribute {
  id: number;
  name: string;
  value: number;
  worst: number;
  thresh: number;
  raw: { value: number; string: string };
  flags: string;
  type: string;
  updated: string;
  when_failed: string;
}

// Alert
export interface Alert {
  id: string;
  node: string;
  source: string;
  klass: string;
  args: unknown;
  key: string;
  datetime: { $date: number };
  last_occurrence: { $date: number };
  dismissed: boolean;
  mail: unknown;
  text: string;
  formatted: string;
  one_shot: boolean;
  level: AlertLevel;
}

export type AlertLevel =
  | 'INFO'
  | 'NOTICE'
  | 'WARNING'
  | 'ERROR'
  | 'CRITICAL'
  | 'ALERT'
  | 'EMERGENCY';

// Shares
export interface SmbShare {
  id: number;
  path: string;
  name: string;
  comment: string;
  enabled: boolean;
  browsable: boolean;
  ro: boolean;
  guestok: boolean;
  hostsallow: string[];
  hostsdeny: string[];
  locked: boolean;
}

export interface NfsShare {
  id: number;
  path: string;
  comment: string;
  enabled: boolean;
  networks: string[];
  hosts: string[];
  ro: boolean;
  maproot_user: string;
  maproot_group: string;
  mapall_user: string;
  mapall_group: string;
}

// Network
export interface NetworkInterface {
  id: string;
  name: string;
  type: string;
  state: {
    link_state: string;
    mtu: number;
    active_media_type: string;
    active_media_subtype: string;
  };
  aliases: NetworkAlias[];
  description: string;
}

export interface NetworkAlias {
  address: string;
  netmask: number;
  type: 'INET' | 'INET6' | 'LINK';
}

// Service
export interface Service {
  id: number;
  service: string;
  enable: boolean;
  state: 'RUNNING' | 'STOPPED';
  pids: number[];
}

// Snapshot
export interface Snapshot {
  id: string;
  name: string;
  dataset: string;
  pool: string;
  type: 'SNAPSHOT';
  properties: {
    creation: { parsed: string; rawvalue: string; value: string };
    referenced: DatasetProperty;
    used: DatasetProperty;
  };
}

// Reporting
export interface ReportingGraph {
  name: string;
  title: string;
  vertical_label: string;
  identifiers: string[] | null;
}

export interface GraphData {
  name: string;
  identifier: string;
  data: Array<{ timestamp: number; [key: string]: number }>;
  start: number;
  end: number;
  step: number;
  legend: string[];
}
