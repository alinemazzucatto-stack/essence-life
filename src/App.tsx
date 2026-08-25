import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import './App.css';
import { AuthScreen, PurchaseRequired } from './modules/auth';
import { signOut } from './modules/auth/auth-api';

import { createId as id, today } from './shared/app-utils';
import AccessGate from './components/AccessGate';
import Agenda from './modules/agenda/Agenda';
import Pomodoro from './modules/pomodoro/Pomodoro';
import Routine from './modules/routine/Routine';
import Cycle from './modules/cycle/Cycle';
import { Finance } from './modules/Finance';
import House from './modules/house/House';
import Nutrition from './modules/nutrition/Nutrition';
import SleepModule from './modules/sleep/Sleep';
import Diary from './modules/diary/Diary';
import Workouts from './modules/workouts/Workouts';
import BeautyCare from './modules/beauty/BeautyCare';
import Profile from './modules/profile/Profile';
import Settings from './modules/settings/Settings';
import Insights from './modules/insights/Insights';
import { applyAppSettings, readAppSettings } from './shared/app-settings';
import Onboarding from './modules/onboarding/Onboarding';
import Home from './modules/home/Home';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import { useSessionSubscription } from './hooks/useSessionSubscription';
import { usePwaInstall } from './hooks/usePwaInstall';
import { useReminderNotifications } from './hooks/useReminderNotifications';
import { readStoredArray } from './shared/storage';
import { removeAppReminder } from './shared/reminders';
import DiscoveryQuiz from './modules/public/DiscoveryQuiz';
import Checkout from './modules/public/Checkout';
import { pageMeta, planMeets, requiredPlanForPage } from './shared/access-control';
import type { AppPage, GatedPage, SubscriptionPlan } from './shared/access-control';
function EssenceApp(){const {session,setSession,subscription,planChecked}=useSessionSubscription();const [onboardingDone,setOnboardingDone]=useState(()=>{try{return JSON.parse(localStorage.getItem('essence:onboarding')||'null')?.completed===true}catch{return false}});const {installPrompt,isInstalled,installApp}=usePwaInstall();const [mobileNavOpen,setMobileNavOpen]=useState(false);const [page,setPage]=useState<AppPage>(()=>localStorage.getItem('essence:open-password-recovery')==='true'?'profile':readAppSettings().startPage as AppPage);const [checkedIn]=useState(()=>localStorage.getItem('essence:checkin-date')===today());const [water,setWater]=useState(()=>{try{return (JSON.parse(localStorage.getItem('essence:water-entries')||'[]') as {date:string;ml:number}[]).filter(entry=>entry.date===today()).reduce((sum,entry)=>sum+entry.ml,0)}catch{return 0}});const [homeTasks,setHomeTasks]=useState<{id:string;title:string;date:string;time?:string;category?:string;priority:string;done:boolean}[]>(()=>readStoredArray('essence:tasks'));const [homeHabits,setHomeHabits]=useState<{id:string;name:string;time:string;category:string;days:string[];done:boolean;doneDate?:string}[]>(()=>readStoredArray('essence:routine-items'));const [quickCreate,setQuickCreate]=useState<'task'|'habit'|null>(null);const [lockedFeature,setLockedFeature]=useState<{page:GatedPage;required:SubscriptionPlan}|null>(null);
const [showPlanGate,setShowPlanGate]=useState(false);
useEffect(()=>applyAppSettings(readAppSettings()),[]);
useEffect(()=>{if(!session||!planChecked||subscription.plan!=='free'){setShowPlanGate(false);return}const timer=window.setTimeout(()=>setShowPlanGate(true),650);return()=>window.clearTimeout(timer)},[session,planChecked,subscription.plan]);useEffect(()=>{if(checkedIn)localStorage.setItem('essence:checkin-date',today())},[checkedIn]);useEffect(()=>{if(page!=='home')return;setHomeTasks(readStoredArray('essence:tasks'));setHomeHabits(readStoredArray('essence:routine-items'))},[page]);useEffect(()=>{localStorage.setItem('essence:water',String(water))},[water]);useReminderNotifications();if(!session)return <AuthScreen onSignedIn={setSession}/>;if(!planChecked||(subscription.plan==='free'&&!showPlanGate))return <main className="auth-page"><section className="auth-panel"><p>Preparando seu espaço...</p></section></main>;if(subscription.plan==='free')return <PurchaseRequired email={session.email}/>;const developerMode=session.email.trim().toLowerCase()==='alinelima364@outlook.com';const reviewingOnboarding=localStorage.getItem('essence:onboarding-review')==='true';if((!onboardingDone&&!developerMode)||reviewingOnboarding)return <Onboarding session={session} onComplete={updated=>{setSession(updated);setOnboardingDone(true)}}/>;if(developerMode&&!onboardingDone&&!reviewingOnboarding){setOnboardingDone(true);localStorage.setItem('essence:onboarding',JSON.stringify({completed:true,developer:true,completedAt:today()}))};

const localHost=window.location.hostname==='localhost'||window.location.hostname==='127.0.0.1';

const isLocked=(currentPage:AppPage)=>!planMeets(subscription.plan,requiredPlanForPage(currentPage));
const openPage=(nextPage:AppPage)=>{if(isLocked(nextPage)){setLockedFeature({page:nextPage as GatedPage,required:requiredPlanForPage(nextPage)});setPage(nextPage);setMobileNavOpen(false);return}setLockedFeature(null);setPage(nextPage);setMobileNavOpen(false)};
const openProfilePlans=()=>{setLockedFeature(null);setPage('profile');setMobileNavOpen(false)};

const gatePage=lockedFeature?.page||page;
const gateRequired=lockedFeature?.required||requiredPlanForPage(gatePage);
const routineDay=['SEG','TER','QUA','QUI','SEX','SÁB','DOM'][(new Date().getDay()+6)%7];
const todayTasks=homeTasks.filter(task=>task.date===today());
const todayHabits=homeHabits.filter(habit=>habit.days?.includes(routineDay)||(!habit.days&&true));
const pendingTasks=todayTasks.filter(task=>!task.done);
const pendingHabits=todayHabits.filter(habit=>habit.doneDate!==today());
const totalToday=todayTasks.length+todayHabits.length;
const completedTasks=todayTasks.filter(task=>task.done);
const completedHabits=todayHabits.filter(habit=>habit.doneDate===today());
const completedToday=completedTasks.length+completedHabits.length;
const dayProgress=totalToday?Math.round(completedToday/totalToday*100):0;
const completeHomeTask=(taskId:string)=>setHomeTasks(items=>{const current=items.find(task=>task.id===taskId),done=!current?.done;const next=items.map(task=>task.id===taskId?{...task,done}:task);localStorage.setItem('essence:tasks',JSON.stringify(next));if(done)removeAppReminder(taskId);return next});
const completeHomeHabit=(habitId:string)=>setHomeHabits(items=>{const current=items.find(habit=>habit.id===habitId),done=current?.doneDate!==today();const next=items.map(habit=>habit.id===habitId?{...habit,done,doneDate:done?today():undefined}:habit);localStorage.setItem('essence:routine-items',JSON.stringify(next));const history=readStoredArray<{routineId:string;date:string}>('essence:routine-history'),nextHistory=done?(history.some((entry:{routineId:string;date:string})=>entry.routineId===habitId&&entry.date===today())?history:[{id:id(),routineId:habitId,date:today(),completedAt:new Date().toISOString()},...history]):history.filter((entry:{routineId:string;date:string})=>!(entry.routineId===habitId&&entry.date===today()));localStorage.setItem('essence:routine-history',JSON.stringify(nextHistory));return next});
const registerHomeWater=()=>{const amount=250;let entries:{id:string;date:string;time:string;ml:number}[]=[];try{const saved=JSON.parse(localStorage.getItem('essence:water-entries')||'[]');if(Array.isArray(saved))entries=saved}catch{}const entry={id:id(),date:today(),time:new Date().toTimeString().slice(0,5),ml:amount};const nextEntries=[entry,...entries];localStorage.setItem('essence:water-entries',JSON.stringify(nextEntries));const nextTotal=nextEntries.filter(item=>item.date===today()).reduce((sum,item)=>sum+(Number(item.ml)||0),0);setWater(nextTotal);localStorage.setItem('essence:water',String(nextTotal));return nextTotal};
const unregisterHomeWater=()=>{let entries:{id:string;date:string;time:string;ml:number}[]=[];try{const saved=JSON.parse(localStorage.getItem('essence:water-entries')||'[]');if(Array.isArray(saved))entries=saved}catch{}const index=entries.findIndex(item=>item.date===today());if(index<0)return water;const nextEntries=entries.filter((_,entryIndex)=>entryIndex!==index);localStorage.setItem('essence:water-entries',JSON.stringify(nextEntries));const nextTotal=nextEntries.filter(item=>item.date===today()).reduce((sum,item)=>sum+(Number(item.ml)||0),0);setWater(nextTotal);localStorage.setItem('essence:water',String(nextTotal));return nextTotal};return <AuthenticatedLayout session={session} page={page} mobileNavOpen={mobileNavOpen} onToggleMobileNav={()=>setMobileNavOpen(value=>!value)} openPage={openPage} isLocked={isLocked} showPlanLocks={!(developerMode||localHost)} onLogout={()=>{void signOut().finally(()=>{localStorage.removeItem('essence:session');setSession(null);window.location.assign('/')})}}>{lockedFeature?<AccessGate title={pageMeta[lockedFeature.page].title} required={gateRequired} onOpenPlans={openProfilePlans}/>:<>{page==='home'&&<Home session={session} pendingHabits={pendingHabits} pendingTasks={pendingTasks} completedHabits={completedHabits} completedTasks={completedTasks} totalToday={totalToday} completedToday={completedToday} dayProgress={dayProgress} waterToday={water} quickCreate={quickCreate} setQuickCreate={setQuickCreate} openPage={openPage} registerHomeWater={registerHomeWater} unregisterHomeWater={unregisterHomeWater} completeHomeHabit={completeHomeHabit} completeHomeTask={completeHomeTask} setHomeTasks={setHomeTasks} setHomeHabits={setHomeHabits}/>}{page==='agenda'&&<Agenda/>}{page==='pomodoro'&&<Pomodoro/>}{page==='sleep'&&<SleepModule/>}{page==='workouts'&&<Workouts/>}{page==='beauty'&&<BeautyCare/>}{page==='diary'&&<Diary/>}{page==='insights'&&<Insights openPage={openPage}/>} {page==='settings'&&<Settings onInstall={installApp} canInstall={!!installPrompt} isInstalled={isInstalled}/>}
{page==='profile'&&<Profile session={session} onUpdate={setSession} onInstall={installApp} canInstall={!!installPrompt} isInstalled={isInstalled} onOpenSettings={()=>openPage("settings")}/>}{page==='routine'&&<Routine/>}{page==='cycle'&&<Cycle/>}{page==='finance'&&<Finance canAccess={developerMode||localHost||planMeets(subscription.plan,'premium')} onOpenPlans={()=>openPage('profile')}/>}{page==='house'&&<House canAccessFinance={developerMode||localHost||planMeets(subscription.plan,'premium')}/>} {page==='nutrition'&&<Nutrition setWater={setWater}/>}</>}</AuthenticatedLayout>}function App(){const path=window.location.pathname;const nativeApp=Capacitor.isNativePlatform()||Capacitor.getPlatform()==='android'||Capacitor.getPlatform()==='ios'||window.location.protocol==='capacitor:'||navigator.userAgent.includes('; wv)');const appRoute=nativeApp||path==='/app'||path==='/app/';const [showLaunch,setShowLaunch]=useState(()=>{if(!appRoute)return false;try{if(sessionStorage.getItem('essence:launch-played')==='true')return false;sessionStorage.setItem('essence:launch-played','true')}catch{}return true});useEffect(()=>{if(!showLaunch)return;const timer=window.setTimeout(()=>setShowLaunch(false),1350);return()=>window.clearTimeout(timer)},[showLaunch]);const checkout=path==='/comprar/essencial'||path==='/comprar/pro';if(showLaunch&&appRoute)return <main className="essence-launch" aria-label="Abrindo Essence Life"><i aria-hidden="true"/><img src="/essence-life-launch.png" alt="Essence Life"/><span>Essence Life</span><small>Organizando seu dia com leveza</small></main>;return checkout?<Checkout/>:appRoute?<EssenceApp/>:<DiscoveryQuiz/>}export default App;






















































