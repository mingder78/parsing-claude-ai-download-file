export interface TransportOption {
  value: string;
  import: string;
  config: string;
  name: string;
  description: string;
}

export interface MultiplexerOption {
  value: string;
  import: string;
  config: string;
  name: string;
  description: string;
}

export interface EncryptionOption {
  value: string;
  import: string;
  config: string;
  name: string;
  description: string;
}

export interface DiscoveryOption {
  value: string;
  import: string;
  config: string;
  name: string;
  description: string;
}

export interface ProtocolOption {
  value: string;
  import: string;
  config: string;
  name: string;
  description: string;
  packageName: string;
}

export interface Libp2pConfig {
  transports: string[];
  streamMuxers: string[];
  connectionEncryption: string[];
  peerDiscovery: string[];
  protocols: string[];
  maxConnections: number;
  connectionManager: string;
}

export interface GeneratedConfig {
  code: string;
  packages: string[];
  installCommand: string;
}


