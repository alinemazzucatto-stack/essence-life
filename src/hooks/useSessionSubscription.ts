import { useEffect, useState } from 'react';
import { readEntitlement, restoreOnlineSession } from '../modules/auth/auth-api';
import type { LocalSession } from '../shared/app.types';
import { readSubscription } from '../shared/access-control';
import type { Subscription } from '../shared/access-control';

const mergeSavedProfile=(user:{name:string;email:string}):LocalSession=>{try{const saved=JSON.parse(localStorage.getItem('essence:profile')||localStorage.getItem('essence:session')||'null') as LocalSession|null;if(saved?.email?.toLowerCase()===user.email.toLowerCase())return {...user,name:saved.name||user.name,avatar:saved.avatar||undefined}}catch{}return user};
export function useSessionSubscription(){const [session,setSession]=useState<LocalSession|null>(()=>{try{const online=JSON.parse(localStorage.getItem('essence:online-session')||'null');return online?.user?mergeSavedProfile({name:online.user.name,email:online.user.email}):null}catch{return null}});const [subscription,setSubscription]=useState<Subscription>(readSubscription);const [planChecked,setPlanChecked]=useState(false);
useEffect(()=>{restoreOnlineSession().then(async online=>{if(!online){setSession(null);setPlanChecked(true);return}setSession(mergeSavedProfile({name:online.user.name,email:online.user.email}));const plan=await readEntitlement(online);setSubscription(current=>({...current,plan}));setPlanChecked(true)})},[]);
useEffect(()=>{if(session){localStorage.setItem('essence:session',JSON.stringify(session));localStorage.setItem('essence:profile',JSON.stringify(session))}},[session]);
useEffect(()=>{localStorage.setItem('essence:subscription',JSON.stringify(subscription))},[subscription]);
return {session,setSession,subscription,planChecked};}
