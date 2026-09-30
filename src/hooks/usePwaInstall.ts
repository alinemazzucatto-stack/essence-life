import { useEffect, useState } from 'react';
import type { InstallPromptEvent } from '../shared/app.types';

export function usePwaInstall(){const [installPrompt,setInstallPrompt]=useState<InstallPromptEvent|null>(null);const [isInstalled,setIsInstalled]=useState(()=>window.matchMedia('(display-mode: standalone)').matches);
useEffect(()=>{const ready=(event:Event)=>{event.preventDefault();setInstallPrompt(event as InstallPromptEvent)};const installed=()=>{setInstallPrompt(null);setIsInstalled(true)};window.addEventListener('beforeinstallprompt',ready);window.addEventListener('appinstalled',installed);return()=>{window.removeEventListener('beforeinstallprompt',ready);window.removeEventListener('appinstalled',installed)}},[]);
const installApp=async()=>{if(!installPrompt)return;await installPrompt.prompt();const result=await installPrompt.userChoice;if(result.outcome==='accepted')setIsInstalled(true);setInstallPrompt(null)};
return {installPrompt,isInstalled,installApp};}
