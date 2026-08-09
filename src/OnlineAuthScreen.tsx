import { useState } from 'react';
import { signIn, signUp } from './supabase';

type Session={name:string;email:string;avatar?:string};

export default function OnlineAuthScreen({onSignedIn}:{onSignedIn:(session:Session)=>void}){
  const[mode,setMode]=useState<'login'|'register'>('login');
  const[message,setMessage]=useState('');
  const[busy,setBusy]=useState(false);
  const[showPassword,setShowPassword]=useState(false);
  const submit=async(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();setMessage('');setBusy(true);
    const formElement=event.currentTarget;
    const form=new FormData(formElement);
    const name=String(form.get('name')||'').trim();
    const email=String(form.get('email')||'').trim().toLowerCase();
    const password=String(form.get('password')||'');
    try{
      if(mode==='register'){
        if(!name)throw new Error('Informe como prefere ser chamada.');
        const session=await signUp(name,email,password);
        if(!session){setMessage('Conta criada! Abra o e-mail de confirmação e depois volte para entrar.');setMode('login');formElement.reset();return}
        onSignedIn({name:session.user.name,email:session.user.email});location.reload();
      }else{
        const session=await signIn(email,password);
        onSignedIn({name:session.user.name,email:session.user.email});location.reload();
      }
    }catch(reason){
      const text=reason instanceof Error?reason.message:'Não foi possível concluir.';
      setMessage(text.toLowerCase().includes('invalid login')?'E-mail ou senha incorretos.':text);
    }finally{setBusy(false)}
  };
  return <main className="auth-page"><section className="auth-panel"><div className="auth-brand">✦ Essence Life</div><div className="auth-copy"><span>✦</span><h1>{mode==='login'?'Que bom ter você aqui':'Vamos começar com leveza'}</h1><p>{mode==='login'?'Entre com sua conta segura.':'Crie seu acesso e confirme o e-mail para continuar.'}</p></div><form className="auth-form" onSubmit={submit}>{mode==='register'&&<label>Como prefere ser chamada?<input name="name" autoComplete="name" placeholder="Ex.: Aline" required/></label>}<label>E-mail<input name="email" type="email" autoComplete="email" placeholder="seuemail@exemplo.com" required/></label><label>Senha<div className="password-field"><input name="password" type={showPassword?'text':'password'} autoComplete={mode==='login'?'current-password':'new-password'} minLength={6} placeholder="Mínimo de 6 caracteres" required/><button type="button" onClick={()=>setShowPassword(value=>!value)}>{showPassword?'Ocultar':'Mostrar'}</button></div></label>{message&&<p className="auth-message" role="status">{message}</p>}<button className="primary auth-submit" disabled={busy}>{busy?'Aguarde...':mode==='login'?'Entrar':'Criar minha conta'}</button></form><p className="auth-switch">{mode==='login'?'Ainda não tem conta?':'Já possui uma conta?'} <button type="button" onClick={()=>{setMode(mode==='login'?'register':'login');setMessage('')}}>{mode==='login'?'Criar conta':'Entrar'}</button></p><small className="auth-note">Seu acesso é protegido e vinculado ao e-mail usado na compra.</small></section></main>
}
