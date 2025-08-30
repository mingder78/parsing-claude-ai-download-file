// 📁 Project Structure:
// src/
//   ├── components/
//   │   ├── WizardStep.astro
//   │   ├── ProgressBar.astro
//   │   ├── CodeOutput.astro
//   │   └── NavigationButtons.astro
//   ├── layouts/
//   │   └── Layout.astro
//   ├── pages/
//   │   ├── index.astro
//   │   └── api/
//   │       └── generate-config.ts
//   ├── types/
//   │   └── libp2p.ts
//   └── utils/
//       └── config-generator.ts

// 📄 src/types/libp2p.ts
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

// 📄 src/utils/config-generator.ts
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

// 📄 src/layouts/Layout.astro
---
export interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content="Generate custom libp2p configurations with TypeScript" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      .wizard-step {
        display: none;
      }
      .wizard-step.active {
        display: block;
      }
      .code-output {
        background: #1e1e1e;
        color: #d4d4d4;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      }
    </style>
  </head>
  <body class="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
    <slot />
  </body>
</html>

// 📄 src/components/ProgressBar.astro
---
export interface Props {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
}

const { currentStep, totalSteps, stepTitle } = Astro.props;
const progress = (currentStep / totalSteps) * 100;
---

<div class="bg-gray-50 px-6 py-4 border-b">
  <div class="flex items-center justify-between mb-2">
    <span class="text-sm font-medium text-gray-600">
      Step <span id="current-step">{currentStep}</span> of {totalSteps}
    </span>
    <span class="text-sm text-gray-500" id="step-title">{stepTitle}</span>
  </div>
  <div class="w-full bg-gray-200 rounded-full h-2">
    <div 
      id="progress-bar" 
      class="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
      style={`width: ${progress}%`}
    ></div>
  </div>
</div>

// 📄 src/components/WizardStep.astro
---
export interface Props {
  stepNumber: number;
  title: string;
  description: string;
  isActive?: boolean;
}

const { stepNumber, title, description, isActive = false } = Astro.props;
---

<div 
  class={`wizard-step p-6 ${isActive ? 'active' : ''}`} 
  id={`step-${stepNumber}`}
>
  <h2 class="text-2xl font-semibold mb-6 text-gray-800">{title}</h2>
  <p class="text-gray-600 mb-6">{description}</p>
  <slot />
</div>

// 📄 src/components/CodeOutput.astro
---
export interface Props {
  code?: string;
  packages?: string[];
  installCommand?: string;
}

const { code = '', packages = [], installCommand = '' } = Astro.props;
---

<div class="wizard-step p-6" id="output-step">
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-semibold text-gray-800">Generated Configuration</h2>
    <button 
      id="copy-button" 
      class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
    >
      Copy Code
    </button>
  </div>
  
  <div class="code-output rounded-lg p-4 overflow-x-auto">
    <pre id="generated-code" class="text-sm leading-relaxed">{code}</pre>
  </div>
  
  <div class="mt-6 p-4 bg-blue-50 rounded-lg">
    <h3 class="font-medium text-blue-800 mb-2">Installation Instructions</h3>
    <p class="text-blue-700 text-sm mb-2">Install the required dependencies:</p>
    <code 
      class="block bg-blue-100 text-blue-800 p-2 rounded text-sm font-mono" 
      id="install-command"
    >
      {installCommand}
    </code>
  </div>
</div>

// 📄 src/components/NavigationButtons.astro
---
export interface Props {
  currentStep: number;
  totalSteps: number;
}

const { currentStep, totalSteps } = Astro.props;
---

<div class="bg-gray-50 px-6 py-4 border-t flex justify-between">
  <button 
    id="prev-button" 
    class="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
    style={currentStep === 1 ? 'display: none;' : ''}
  >
    ← Previous
  </button>
  <div class="flex-1"></div>
  <button 
    id="next-button" 
    class="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-colors"
    style={currentStep === totalSteps ? 'display: none;' : ''}
  >
    Next →
  </button>
  <button 
    id="generate-button" 
    class="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-colors"
    style={currentStep !== totalSteps ? 'display: none;' : ''}
  >
    Generate Code
  </button>
</div>

// 📄 src/pages/api/generate-config.ts
import type { APIRoute } from 'astro';
import { generateLibp2pConfig } from '../../utils/config-generator';
import type { Libp2pConfig } from '../../types/libp2p';

export const POST: APIRoute = async ({ request }) => {
  try {
    const config: Libp2pConfig = await request.json();
    const result = generateLibp2pConfig(config);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid configuration' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// 📄 src/pages/index.astro
---
import Layout from '../layouts/Layout.astro';
import ProgressBar from '../components/ProgressBar.astro';
import WizardStep from '../components/WizardStep.astro';
import CodeOutput from '../components/CodeOutput.astro';
import NavigationButtons from '../components/NavigationButtons.astro';
import { 
  TRANSPORT_OPTIONS, 
  MULTIPLEXER_OPTIONS, 
  ENCRYPTION_OPTIONS, 
  DISCOVERY_OPTIONS, 
  PROTOCOL_OPTIONS 
} from '../utils/config-generator';

const currentStep = 1;
const totalSteps = 4;
---

<Layout title="Libp2p Configuration Wizard">
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <header class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Libp2p Configuration Wizard</h1>
      <p class="text-lg text-gray-600">Generate custom libp2p configurations with TypeScript</p>
    </header>

    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <ProgressBar 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
        stepTitle="Choose Transport Protocols" 
      />

      <!-- Step 1: Transport Protocols -->
      <WizardStep 
        stepNumber={1}
        title="Choose Transport Protocols"
        description="Select the transport protocols your libp2p node will support:"
        isActive={true}
      >
        <div class="grid md:grid-cols-2 gap-4">
          {TRANSPORT_OPTIONS.map((option) => (
            <label class="flex items-start p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
              <input 
                type="checkbox" 
                class="transport-option mt-1 mr-3" 
                value={option.value}
                data-import={option.import}
                data-config={option.config}
              />
              <div>
                <div class="font-semibold text-gray-800">{option.name}</div>
                <div class="text-sm text-gray-600">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </WizardStep>

      <!-- Step 2: Stream Multiplexer -->
      <WizardStep 
        stepNumber={2}
        title="Stream Multiplexer"
        description="Choose how to multiplex streams over connections:"
      >
        <div class="space-y-4">
          {MULTIPLEXER_OPTIONS.map((option) => (
            <label class="flex items-start p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
              <input 
                type="radio" 
                name="multiplexer" 
                class="mt-1 mr-3" 
                value={option.value}
                data-import={option.import}
                data-config={option.config}
              />
              <div>
                <div class="font-semibold text-gray-800">{option.name}</div>
                <div class="text-sm text-gray-600">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </WizardStep>

      <!-- Step 3: Security & Encryption -->
      <WizardStep 
        stepNumber={3}
        title="Security & Encryption"
        description="Configure connection security and encryption:"
      >
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-medium mb-4 text-gray-800">Connection Encryption</h3>
            <div class="space-y-4">
              {ENCRYPTION_OPTIONS.map((option) => (
                <label class="flex items-start p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    class="encryption-option mt-1 mr-3" 
                    value={option.value}
                    data-import={option.import}
                    data-config={option.config}
                  />
                  <div>
                    <div class="font-semibold text-gray-800">{option.name}</div>
                    <div class="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-medium mb-4 text-gray-800">Peer Discovery</h3>
            <div class="space-y-4">
              {DISCOVERY_OPTIONS.map((option) => (
                <label class="flex items-start p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    class="discovery-option mt-1 mr-3" 
                    value={option.value}
                    data-import={option.import}
                    data-config={option.config}
                  />
                  <div>
                    <div class="font-semibold text-gray-800">{option.name}</div>
                    <div class="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </WizardStep>

      <!-- Step 4: Configuration Options -->
      <WizardStep 
        stepNumber={4}
        title="Additional Options"
        description="Configure additional libp2p features:"
      >
        <div class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max Connections</label>
              <input 
                type="number" 
                id="max-connections" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
                value="100" 
                min="1"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Connection Manager</label>
              <select 
                id="connection-manager" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="basic">Basic Connection Manager</option>
                <option value="advanced">Advanced Connection Manager</option>
              </select>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-medium mb-4 text-gray-800">Protocol Support</h3>
            <div class="grid md:grid-cols-2 gap-4">
              {PROTOCOL_OPTIONS.map((option) => (
                <label class="flex items-center p-3 border border-gray-200 rounded-lg">
                  <input 
                    type="checkbox" 
                    class="protocol-option mr-3" 
                    value={option.value}
                    data-import={option.import}
                    data-config={option.config}
                  />
                  <span class="text-sm">{option.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </WizardStep>

      <CodeOutput />

      <NavigationButtons currentStep={currentStep} totalSteps={totalSteps} />
    </div>
  </div>

  <script>
    import { generateLibp2pConfig } from '../utils/config-generator';
    import type { Libp2pConfig } from '../types/libp2p';

    let currentStep = 1;
    const totalSteps = 4;
    
    const stepTitles = {
      1: 'Choose Transport Protocols',
      2: 'Stream Multiplexer',
      3: 'Security & Encryption',
      4: 'Additional Options'
    };

    function updateProgress() {
      const progress = (currentStep / totalSteps) * 100;
      const progressBar = document.getElementById('progress-bar');
      const currentStepEl = document.getElementById('current-step');
      const stepTitleEl = document.getElementById('step-title');
      
      if (progressBar) progressBar.style.width = progress + '%';
      if (currentStepEl) currentStepEl.textContent = currentStep.toString();
      if (stepTitleEl) stepTitleEl.textContent = stepTitles[currentStep as keyof typeof stepTitles];
    }

    function showStep(step: number) {
      document.querySelectorAll('.wizard-step').forEach(el => {
        el.classList.remove('active');
      });
      
      const stepEl = document.getElementById(`step-${step}`);
      if (stepEl) stepEl.classList.add('active');
      
      // Update navigation buttons
      const prevButton = document.getElementById('prev-button');
      const nextButton = document.getElementById('next-button');
      const generateButton = document.getElementById('generate-button');
      
      if (prevButton) prevButton.style.display = step === 1 ? 'none' : 'block';
      
      if (step === totalSteps) {
        if (nextButton) nextButton.style.display = 'none';
        if (generateButton) generateButton.style.display = 'block';
      } else {
        if (nextButton) nextButton.style.display = 'block';
        if (generateButton) generateButton.style.display = 'none';
      }
    }

    async function generateConfiguration() {
      const config: Libp2pConfig = {
        transports: Array.from(document.querySelectorAll('.transport-option:checked')).map(el => (el as HTMLInputElement).value),
        streamMuxers: Array.from(document.querySelectorAll('input[name="multiplexer"]:checked')).map(el => (el as HTMLInputElement).value),
        connectionEncryption: Array.from(document.querySelectorAll('.encryption-option:checked')).map(el => (el as HTMLInputElement).value),
        peerDiscovery: Array.from(document.querySelectorAll('.discovery-option:checked')).map(el => (el as HTMLInputElement).value),
        protocols: Array.from(document.querySelectorAll('.protocol-option:checked')).map(el => (el as HTMLInputElement).value),
        maxConnections: parseInt((document.getElementById('max-connections') as HTMLInputElement)?.value) || 100,
        connectionManager: (document.getElementById('connection-manager') as HTMLSelectElement)?.value || 'basic'
      };

      try {
        const response = await fetch('/api/generate-config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(config)
        });

        const result = await response.json();
        
        const codeEl = document.getElementById('generated-code');
        const installEl = document.getElementById('install-command');
        
        if (codeEl) codeEl.textContent = result.code;
        if (installEl) installEl.textContent = result.installCommand;
        
        // Show output step
        document.querySelectorAll('.wizard-step').forEach(el => {
          el.classList.remove('active');
        });
        
        const outputStep = document.getElementById('output-step');
        if (outputStep) outputStep.classList.add('active');
        
        // Update progress
        const progressBar = document.getElementById('progress-bar');
        const stepTitle = document.getElementById('step-title');
        if (progressBar) progressBar.style.width = '100%';
        if (stepTitle) stepTitle.textContent = 'Generated Configuration';
        
      } catch (error) {
        console.error('Failed to generate configuration:', error);
      }
    }

    // Event listeners
    document.addEventListener('DOMContentLoaded', () => {
      const nextButton = document.getElementById('next-button');
      const prevButton = document.getElementById('prev-button');
      const generateButton = document.getElementById('generate-button');
      const copyButton = document.getElementById('copy-button');

      nextButton?.addEventListener('click', () => {
        if (currentStep < totalSteps) {
          currentStep++;
          showStep(currentStep);
          updateProgress();
        }
      });

      prevButton?.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          showStep(currentStep);
          updateProgress();
        }
      });

      generateButton?.addEventListener('click', generateConfiguration);

      copyButton?.addEventListener('click', async () => {
        const codeEl = document.getElementById('generated-code');
        const code = codeEl?.textContent || '';
        
        try {
          await navigator.clipboard.writeText(code);
          const button = copyButton;
          