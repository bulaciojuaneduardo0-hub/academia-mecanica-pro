exports.handler = async () => ({
  statusCode: 200,
  body: JSON.stringify({ ok: true, msg: 'Configurar MP_ACCESS_TOKEN en Netlify para activar pagos.' })
});
