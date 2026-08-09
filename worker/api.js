async function handleApi(request,env){
  const url=new URL(request.url);
  if(url.pathname!=='/api/kiwify/webhook')return null;
  if(request.method!=='POST')return new Response('Method not allowed',{status:405});
  const supplied=url.searchParams.get('token')||request.headers.get('x-webhook-secret')||'';
  if(!env.KIWIFY_WEBHOOK_SECRET||supplied!==env.KIWIFY_WEBHOOK_SECRET)return new Response('Unauthorized',{status:401});
  if(!env.SUPABASE_SECRET_KEY||!env.SUPABASE_URL)return new Response('Integration not configured',{status:503});
  let payload;try{payload=await request.json()}catch{return new Response('Invalid JSON',{status:400})}
  const customer=payload.Customer||payload.customer||payload.buyer||{};
  const product=payload.Product||payload.product||{};
  const email=String(customer.email||payload.customer_email||payload.email||'').trim().toLowerCase();
  const productName=String(product.product_name||product.name||payload.product_name||'');
  const event=String(payload.webhook_event_type||payload.event_type||payload.order_status||payload.status||'').toLowerCase();
  const transactionId=String(payload.order_id||payload.transaction_id||payload.id||'');
  if(!email||!email.includes('@'))return new Response('Customer email missing',{status:422});
  const normalized=productName.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const plan=normalized.includes('pro')?'pro':normalized.includes('essencial')?'essential':null;
  if(!plan)return new Response('Unknown product',{status:422});
  const revoked=/refund|refunded|chargeback|chargedback|reembolso/.test(event);
  const approved=/approved|paid|complete|aprovad|pago/.test(event);
  if(!approved&&!revoked)return new Response('Event ignored',{status:200});
  const response=await fetch(`${env.SUPABASE_URL}/rest/v1/entitlements?on_conflict=email`,{method:'POST',headers:{apikey:env.SUPABASE_SECRET_KEY,authorization:`Bearer ${env.SUPABASE_SECRET_KEY}`,'content-type':'application/json',prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({email,plan,status:revoked?'revoked':'active',transaction_id:transactionId||null,product_name:productName,updated_at:new Date().toISOString()})});
  if(!response.ok)return new Response('Could not update entitlement',{status:502});
  return new Response('ok',{status:200});
}
