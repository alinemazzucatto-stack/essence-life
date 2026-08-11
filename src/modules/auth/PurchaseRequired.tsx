import { signOut } from './auth-api';

export default function PurchaseRequired({email}:{email:string}){
  const leave=async()=>{await signOut();localStorage.removeItem('essence:session');location.assign('/')};
  return <main className="auth-page"><section className="auth-panel"><div className="auth-brand"><img src="/essence-life-logo.png" alt=""/><span>Essence Life</span></div><div className="auth-copy"><img className="auth-logo" src="/essence-life-logo.png" alt="Logo Essence Life"/><h1>Escolha seu acesso</h1><p>Seu cadastro está pronto. Para abrir o Essence Life, escolha o plano que combina com seu momento.</p></div><div className="purchase-required-plans"><a className="primary auth-submit" href="https://pay.kiwify.com.br/l744PMU">Quero o Essencial</a><a className="primary auth-submit" href="https://pay.kiwify.com.br/qBamiP3">Quero o Pro</a></div><p className="auth-note">Use na compra o mesmo e-mail da sua conta: <b>{email}</b>. O acesso é liberado após a confirmação do pagamento.</p><button type="button" className="logout" onClick={leave}>Sair e voltar à página de vendas</button></section></main>
}
