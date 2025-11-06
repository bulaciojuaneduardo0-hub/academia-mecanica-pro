function generateCode(){
  const rnd = Array.from(crypto.getRandomValues(new Uint8Array(3)))
    .map(b => b.toString(16).padStart(2,'0')).join('').toUpperCase();
  const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
  return `AMP-${date}-${rnd}`;
}
exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const appsUrl = process.env.APPS_SCRIPT_URL;
    if(!appsUrl) return { statusCode:500, body:'APPS_SCRIPT_URL not set' };
    const code = generateCode();
    const record = { codigo: code, plan: (body?.external_reference)||'unknown', mp_payload: JSON.stringify(body), fecha: new Date().toISOString() };
    await fetch(appsUrl, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(record) });
    return { statusCode:200, body: JSON.stringify({ ok:true, code }) };
  } catch(err){
    return { statusCode:500, body: String(err) };
  }
};
