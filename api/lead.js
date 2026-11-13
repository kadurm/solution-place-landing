// Encaminha o lead do formulário para o CRM do KrM Ads (server-to-server; a chave nunca vai ao navegador)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const url = process.env.CRM_INGEST_URL;
  const key = process.env.CRM_INGEST_SECRET;
  if (!url || !key) {
    console.error('CRM ingest não configurado (CRM_INGEST_URL / CRM_INGEST_SECRET)');
    return res.status(500).json({ error: 'CRM não configurado' });
  }

  try {
    const { nome, telefone, veiculo, ano, utm, pagina } = req.body || {};
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-ingest-key': key },
      body: JSON.stringify({
        cliente: 'solutionplace',
        origem: 'SITE',
        conversao: 'Landing Page',
        nome, telefone, veiculo, ano, utm, pagina,
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) console.error('CRM ingest falhou:', r.status, data);
    return res.status(r.ok ? 200 : 502).json({ success: !!r.ok });
  } catch (error) {
    console.error('CRM ingest erro:', error);
    return res.status(502).json({ success: false });
  }
}
