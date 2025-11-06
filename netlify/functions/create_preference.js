exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const plan = body.plan || 'monthly';
    const amounts = { monthly: 10000, annual: 100000 }; // ARS
    const amount = amounts[plan] || amounts.monthly;
    const mpToken = process.env.MP_ACCESS_TOKEN;
    if(!mpToken) return { statusCode: 500, body: 'MP token not set' };

    const preference = {
      items: [{ title: "Suscripción Academia de Mecánica Pro", quantity:1, currency_id:"ARS", unit_price: Number(amount) }],
      back_urls: {
        success: (process.env.SITE_URL||'') + '/index.html',
        pending: (process.env.SITE_URL||'') + '/index.html',
        failure: (process.env.SITE_URL||'') + '/index.html'
      },
      auto_return: "approved",
      external_reference: JSON.stringify({ plan })
    };

    const res = await fetch(`https://api.mercadopago.com/checkout/preferences?access_token=${mpToken}`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(preference)
    });
    const data = await res.json();
    return { statusCode:200, body: JSON.stringify({ init_point: data.init_point, preference_id: data.id }) };
  } catch(err) {
    return { statusCode:500, body: String(err) };
  }
};
