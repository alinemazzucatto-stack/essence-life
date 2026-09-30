export type AppReminder={id:string;sourceId?:string;title:string;time:string;enabled:boolean;date?:string};

export const readAppReminders=():AppReminder[]=>{try{const value=JSON.parse(localStorage.getItem('essence:reminders')||'[]');return Array.isArray(value)?value:[]}catch{return[]}};

export function syncAppReminder(sourceId:string,title:string,time:string,enabled:boolean,date?:string){
  const next=readAppReminders().filter(item=>item.sourceId!==sourceId&&item.id!=='app-'+sourceId);
  if(enabled&&time)next.push({id:'app-'+sourceId,sourceId,title,time,enabled:true,date});
  localStorage.setItem('essence:reminders',JSON.stringify(next));
}

export function removeAppReminder(sourceId:string){syncAppReminder(sourceId,'','',false)}

export function syncDatedReminder(sourceId:string,title:string,date:string,time:string,minutesBefore=0){
  if(!date||!time){removeAppReminder(sourceId);return}
  const due=new Date(date+'T'+time+':00');
  due.setMinutes(due.getMinutes()-minutesBefore);
  const reminderDate=due.getFullYear()+'-'+String(due.getMonth()+1).padStart(2,'0')+'-'+String(due.getDate()).padStart(2,'0');
  syncAppReminder(sourceId,title,due.toTimeString().slice(0,5),true,reminderDate);
}

export async function requestReminderPermission(){
  if(!('Notification' in window)||Notification.permission!=='default')return;
  try{await Notification.requestPermission()}catch{}
}
