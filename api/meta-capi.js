import crypto from 'crypto';

export default async function handler(req, res) {
  // Configuração de CORS se necessário
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { event_name = 'Lead', event_id, user_data = {}, custom_data = {}, event_source_url } = req.body || {};

    const sha256 = (str) => {
      if (!str) return null;
      return crypto.createHash('sha256').update(String(str).trim().toLowerCase()).digest('hex');
    };

    // Obter IP do cliente e User Agent para alta pontuação de correspondência (EMQ)
    const client_ip_address = req.headers['x-forwarded-for'] 
      ? req.headers['x-forwarded-for'].split(',')[0].trim() 
      : req.socket?.remoteAddress;
    const client_user_agent = req.headers['user-agent'] || '';

    // Normalização rigorosa do telefone (E.164: código do país + DDD + número sem caracteres especiais)
    let rawPhone = user_data.phone ? String(user_data.phone).replace(/\D/g, '') : '';
    if (rawPhone && !rawPhone.startsWith('55') && (rawPhone.length === 10 || rawPhone.length === 11)) {
      rawPhone = '55' + rawPhone;
    }

    const payload = {
      data: [
        {
          event_name: event_name,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_source_url: event_source_url || 'https://lp.solutionplaceblindagem.com.br/',
          event_id: event_id || `srv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          user_data: {
            client_ip_address: client_ip_address || undefined,
            client_user_agent: client_user_agent || undefined,
            fn: user_data.first_name ? [sha256(user_data.first_name)] : undefined,
            ln: user_data.last_name ? [sha256(user_data.last_name)] : undefined,
            ph: rawPhone ? [sha256(rawPhone)] : undefined,
            em: user_data.email ? [sha256(user_data.email)] : undefined,
          },
          custom_data: {
            ...custom_data,
            currency: 'BRL',
          }
        }
      ]
    };

    const pixelId = '2556496231513472';
    const accessToken = process.env.META_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('Meta CAPI: META_ACCESS_TOKEN não configurado');
      return res.status(500).json({ error: 'CAPI não configurada' });
    }

    const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Meta CAPI Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
