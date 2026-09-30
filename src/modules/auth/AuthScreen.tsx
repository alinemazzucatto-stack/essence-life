import { useState } from 'react';
import type { FormEvent } from 'react';
import { requestPasswordReset, signIn, signUp } from './auth-api';

type Session={name:string;email:string;avatar?:string};

export default function AuthScreen({onSignedIn}:{onSignedIn:(session:Session)=>void}){
  const[mode,setMode]=useState<'login'|'register'|'recovery'>('login');
  const[message,setMessage]=useState('');
  const[busy,setBusy]=useState(false);
  const[showPassword,setShowPassword]=useState(false);
  const submit=async(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();setMessage('');setBusy(true);
    const formElement=event.currentTarget;const form=new FormData(formElement);
    const name=String(form.get('name')||'').trim();const email=String(form.get('email')||'').trim().toLowerCase();const password=String(form.get('password')||'');
    try{
      if(mode==='recovery'){await requestPasswordReset(email);setMessage('Se existir uma conta com este e-mail, enviaremos um link seguro para criar uma nova senha.');return}
      if(mode==='register'){
        if(!name)throw new Error('Informe como prefere ser chamada.');
        const session=await signUp(name,email,password);
        if(!session){setMessage('Conta criada! Abra o e-mail de confirmação e depois volte para entrar.');setMode('login');formElement.reset();return}
        onSignedIn({name:session.user.name,email:session.user.email});location.reload();
      }else{const session=await signIn(email,password);onSignedIn({name:session.user.name,email:session.user.email});location.reload()}
    }catch(reason){const text=reason instanceof Error?reason.message:'Não foi possível concluir.';setMessage(text.toLowerCase().includes('invalid login')?'E-mail ou senha incorretos.':text)}finally{setBusy(false)}
  };
  const title=mode==='login'?'Que bom ter você aqui':mode==='register'?'Vamos começar com leveza':'Recupere seu acesso';
  const copy=mode==='login'?'Entre com sua conta segura.':mode==='register'?'Crie seu acesso e confirme o e-mail para continuar.':'Informe seu e-mail para receber um link seguro.';
  return <main className="auth-page"><section className="auth-panel"><div className="auth-brand"><img src="/essence-life-logo.png" alt=""/><span>Essence Life</span></div><div className="auth-copy"><img className="auth-logo" src="/essence-life-logo.png" alt="Logo Essence Life"/><h1>{title}</h1><p>{copy}</p></div><form className="auth-form" onSubmit={submit}>{mode==='register'&&<label>Como prefere ser chamada?<input name="name" autoComplete="name" placeholder="Ex.: Aline" required/></label>}<label>E-mail<input name="email" type="email" autoComplete="email" placeholder="seuemail@exemplo.com" required/></label>{mode!=='recovery'&&<label>Senha<div className="password-field"><input name="password" type={showPassword?'text':'password'} autoComplete={mode==='login'?'current-password':'new-password'} minLength={10} placeholder="10+ caracteres, com número e símbolo" required/><button type="button" onClick={()=>setShowPassword(value=>!value)}>{showPassword?'Ocultar':'Mostrar'}</button></div></label>}{mode==='login'&&<button className="auth-forgot" type="button" onClick={()=>{setMode('recovery');setMessage('')}}>Esqueci minha senha</button>}{message&&<p className="auth-message" role="status">{message}</p>}<button className="primary auth-submit" disabled={busy}>{busy?'Aguarde...':mode==='login'?'Entrar':mode==='register'?'Criar minha conta':'Enviar link de recuperação'}</button></form>{mode==='recovery'?<p className="auth-switch"><button type="button" onClick={()=>{setMode('login');setMessage('')}}>Voltar para entrar</button></p>:<p className="auth-switch">{mode==='login'?'Ainda não tem conta?':'Já possui uma conta?'} <button type="button" onClick={()=>{setMode(mode==='login'?'register':'login');setMessage('')}}>{mode==='login'?'Criar conta':'Entrar'}</button></p>}<small className="auth-note">Seu acesso é protegido e vinculado ao e-mail usado na compra.</small></section></main>
}