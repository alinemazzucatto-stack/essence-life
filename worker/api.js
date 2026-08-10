async function handleApi(request,env){
  const url=new URL(request.url);
  if(url.pathname==='/api/nutrition/menu'){
    if(request.method!=='POST')return new Response('Method not allowed',{status:405});
    if(!env.OPENAI_API_KEY)return Response.json({error:'A geração com IA ainda não está configurada.'},{status:503});
    let body;try{body=await request.json()}catch{return Response.json({error:'Dados inválidos.'},{status:400})}
    const goal=String(body?.goal||'Saúde e bem-estar').slice(0,80);
    const restrictions=String(body?.restrictions||'Nenhuma informada').slice(0,500);
    const meals=Math.max(3,Math.min(6,Number(body?.meals)||3));
    const days=Math.max(1,Math.min(3,Number(body?.days)||1));
    const extra=String(body?.extra||'').slice(0,300);
    const clinical=/diabet|renal|rim|gesta|grávid|gravidez|transtorno alimentar|anorex|bulimi|alergia grave|anafilax/i.test(restrictions+' '+extra);
    if(clinical)return Response.json({error:'Para condições clínicas, gestação, transtornos alimentares ou alergias graves, procure orientação de nutricionista ou médico antes de gerar sugestões.'},{status:422});
    const prompt=`Crie sugestões alimentares gerais, variadas, simples e acessíveis em português do Brasil. Objetivo declarado: ${goal}. Refeições por dia: ${meals}. Dias: ${days}. Preferências, restrições ou alergias declaradas: ${restrictions}. Contexto opcional: ${extra||'nenhum'}. Não prescreva tratamento, calorias, macros, suplementos, dietas extremas ou perda rápida de peso. Respeite rigorosamente as restrições declaradas. Responda SOMENTE JSON válido neste formato: {"summary":"texto curto","items":[{"day":1,"mealType":"Café da manhã","title":"nome curto","ingredients":["item 1","item 2"],"note":"troca ou preparo curto"}]}. Gere exatamente ${meals*days} itens.`;
    const ai=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{authorization:`Bearer ${env.OPENAI_API_KEY}`,'content-type':'application/json'},body:JSON.stringify({model:'gpt-5.6-luna',input:prompt,reasoning:{effort:'low'},text:{verbosity:'low'},max_output_tokens:3000})});
    if(!ai.ok){const status=ai.status===429?429:502;return Response.json({error:ai.status===429?'Muitas solicitações agora. Aguarde um pouco e tente novamente.':'Não foi possível gerar as sugestões agora.'},{status})}
    const result=await ai.json();
    const output=String(result.output_text||result.output?.flatMap(item=>item.content||[]).find(item=>item.type==='output_text')?.text||'').trim().replace(/^```json\s*/i,'').replace(/```$/,'').trim();
    let menu;try{menu=JSON.parse(output)}catch{return Response.json({error:'A IA retornou um formato inesperado. Tente novamente.'},{status:502})}
    if(!Array.isArray(menu.items)||!menu.items.length)return Response.json({error:'Nenhuma sugestão foi gerada. Tente novamente.'},{status:502});
    const items=menu.items.slice(0,18).map((item,index)=>({id:`ai-${Date.now()}-${index}`,day:Math.max(1,Math.min(days,Number(item.day)||1)),mealType:String(item.mealType||'Refeição').slice(0,40),title:String(item.title||'Sugestão').slice(0,100),ingredients:(Array.isArray(item.ingredients)?item.ingredients:[]).map(value=>String(value).slice(0,80)).slice(0,12),note:String(item.note||'').slice(0,160)}));
    return Response.json({summary:String(menu.summary||'Sugestões criadas para você adaptar à sua rotina.').slice(0,220),items});
  }
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
  const response=await fetch(`${env.SUPABASE_URL}/rest/v1/entitlements?on_conflict=email`,{method:'POST',headers:{apikey:env.SUPABASE_SECRET_KEY,'user-agent':'essence-life-server/1.0','content-type':'application/json',prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({email,plan,status:revoked?'revoked':'active',transaction_id:transactionId||null,product_name:productName,updated_at:new Date().toISOString()})});
  if(!response.ok)return new Response('Could not update entitlement',{status:502});
  return new Response('ok',{status:200});
}
