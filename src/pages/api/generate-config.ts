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


