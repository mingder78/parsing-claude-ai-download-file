import type { Libp2pConfig, GeneratedConfig } from '../types/libp2p';

export const TRANSPORT_OPTIONS = [
  {
    value: 'tcp',
    import: 'tcp',
    config: 'tcp()',
    name: 'TCP',
    description: 'Traditional TCP transport for reliable connections'
  },
  {
    value: 'websockets',
    import: 'webSockets',
    config: 'webSockets()',
    name: 'WebSockets',
    description: 'WebSocket transport for browser compatibility'
  },
  {
    value: 'webrtc',
    import: 'webRTC',
    config: 'webRTC()',
    name: 'WebRTC',
    description: 'Direct peer-to-peer communication'
  },
  {
    value: 'quic',
    import: 'quic',
    config: 'quic()',
    name: 'QUIC',
    description: 'Fast, secure transport protocol'
  }
];

export const MULTIPLEXER_OPTIONS = [
  {
    value: 'yamux',
    import: 'yamux',
    config: 'yamux()',
    name: 'Yamux',
    description: 'Efficient stream multiplexer (recommended)'
  },
  {
    value: 'mplex',
    import: 'mplex',
    config: 'mplex()',
    name: 'Mplex',
    description: 'Legacy multiplexer for compatibility'
  }
];

export const ENCRYPTION_OPTIONS = [
  {
    value: 'noise',
    import: 'noise',
    config: 'noise()',
    name: 'Noise Protocol',
    description: 'Modern cryptographic protocol (recommended)'
  },
  {
    value: 'tls',
    import: 'tls',
    config: 'tls()',
    name: 'TLS',
    description: 'Standard TLS encryption'
  }
];

export const DISCOVERY_OPTIONS = [
  {
    value: 'bootstrap',
    import: 'bootstrap',
    config: 'bootstrap({ list: [] })',
    name: 'Bootstrap',
    description: 'Connect to known bootstrap nodes'
  },
  {
    value: 'mdns',
    import: 'mdnsDiscovery',
    config: 'mdnsDiscovery()',
    name: 'mDNS Discovery',
    description: 'Discover peers on local network'
  }
];

export const PROTOCOL_OPTIONS = [
  {
    value: 'identify',
    import: 'identify',
    config: 'identify()',
    name: 'Identify Protocol',
    description: 'Protocol identification',
    packageName: '@libp2p/identify'
  },
  {
    value: 'ping',
    import: 'ping',
    config: 'ping()',
    name: 'Ping Protocol',
    description: 'Ping/pong protocol',
    packageName: '@libp2p/ping'
  },
  {
    value: 'dht',
    import: 'kadDHT',
    config: 'kadDHT()',
    name: 'Kademlia DHT',
    description: 'Distributed hash table',
    packageName: '@libp2p/kad-dht'
  },
  {
    value: 'pubsub',
    import: 'gossipsub',
    config: 'gossipsub()',
    name: 'GossipSub PubSub',
    description: 'Publish-subscribe messaging',
    packageName: '@libp2p/gossipsub'
  }
];

export function generateLibp2pConfig(config: Libp2pConfig): GeneratedConfig {
  const imports = new Set<string>();
  const packages = new Set<string>(['libp2p']);
  
  imports.add("import { createLibp2p } from 'libp2p'");

  // Process transports
  const transports: string[] = [];
  config.transports.forEach(transport => {
    const option = TRANSPORT_OPTIONS.find(t => t.value === transport);
    if (option) {
      imports.add(`import { ${option.import} } from '@libp2p/${option.value}'`);
      packages.add(`@libp2p/${option.value}`);
      transports.push(option.config);
    }
  });

  // Process multiplexers
  const streamMuxers: string[] = [];
  config.streamMuxers.forEach(muxer => {
    const option = MULTIPLEXER_OPTIONS.find(m => m.value === muxer);
    if (option) {
      imports.add(`import { ${option.import} } from '@libp2p/${option.value}'`);
      packages.add(`@libp2p/${option.value}`);
      streamMuxers.push(option.config);
    }
  });

  // Process encryption
  const connectionEncryption: string[] = [];
  config.connectionEncryption.forEach(encryption => {
    const option = ENCRYPTION_OPTIONS.find(e => e.value === encryption);
    if (option) {
      imports.add(`import { ${option.import} } from '@libp2p/${option.value}'`);
      packages.add(`@libp2p/${option.value}`);
      connectionEncryption.push(option.config);
    }
  });

  // Process discovery
  const peerDiscovery: string[] = [];
  config.peerDiscovery.forEach(discovery => {
    const option = DISCOVERY_OPTIONS.find(d => d.value === discovery);
    if (option) {
      const packageName = discovery === 'mdns' ? '@libp2p/mdns' : '@libp2p/bootstrap';
      imports.add(`import { ${option.import} } from '${packageName}'`);
      packages.add(packageName);
      peerDiscovery.push(option.config);
    }
  });

  // Process protocols
  const services: Record<string, string> = {};
  config.protocols.forEach(protocol => {
    const option = PROTOCOL_OPTIONS.find(p => p.value === protocol);
    if (option) {
      imports.add(`import { ${option.import} } from '${option.packageName}'`);
      packages.add(option.packageName);
      services[protocol] = option.config;
    }
  });

  // Generate TypeScript code
  let code = Array.from(imports).sort().join('\n') + '\n\n';
  
  code += 'export async function createNode() {\n';
  code += '  const node = await createLibp2p({\n';
  
  if (transports.length > 0) {
    code += '    transports: [\n';
    transports.forEach(transport => {
      code += `      ${transport},\n`;
    });
    code += '    ],\n';
  }
  
  if (streamMuxers.length > 0) {
    code += '    streamMuxers: [\n';
    streamMuxers.forEach(muxer => {
      code += `      ${muxer},\n`;
    });
    code += '    ],\n';
  }
  
  if (connectionEncryption.length > 0) {
    code += '    connectionEncryption: [\n';
    connectionEncryption.forEach(encryption => {
      code += `      ${encryption},\n`;
    });
    code += '    ],\n';
  }
  
  if (peerDiscovery.length > 0) {
    code += '    peerDiscovery: [\n';
    peerDiscovery.forEach(discovery => {
      code += `      ${discovery},\n`;
    });
    code += '    ],\n';
  }
  
  if (Object.keys(services).length > 0) {
    code += '    services: {\n';
    Object.entries(services).forEach(([name, serviceConfig]) => {
      code += `      ${name}: ${serviceConfig},\n`;
    });
    code += '    },\n';
  }
  
  code += '    connectionManager: {\n';
  code += `      maxConnections: ${config.maxConnections},\n`;
  code += `      minConnections: ${Math.floor(config.maxConnections / 4)}\n`;
  code += '    }\n';
  
  code += '  })\n\n';
  code += '  return node\n';
  code += '}\n\n';
  code += '// Usage example:\n';
  code += '// const node = await createNode()\n';
  code += '// await node.start()\n';
  code += '// console.log("Libp2p node started with ID:", node.peerId.toString())';

  return {
    code,
    packages: Array.from(packages),
    installCommand: `npm install ${Array.from(packages).join(' ')}`
  };
}


