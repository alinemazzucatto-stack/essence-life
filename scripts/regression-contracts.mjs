import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const [app, home, profile, access, notifications, capacitor, packageJson] = await Promise.all([
  read('src/App.tsx'),
  read('src/modules/home/Home.tsx'),
  read('src/modules/profile/Profile.tsx'),
  read('src/shared/access-control.ts'),
  read('src/shared/notifications.ts'),
  read('capacitor.config.ts'),
  read('package.json'),
]);

const contract = (condition, message) => assert.equal(Boolean(condition), true, message);

contract(app.includes("Capacitor.isNativePlatform()"), 'Native platform detection was removed');
contract(app.includes("const appRoute=nativeApp||path==='/app'||path==='/app/'"), 'Native app no longer opens the app route directly');
contract(app.includes("appRoute?<EssenceApp/>:<DiscoveryQuiz/>"), 'Sales quiz is no longer isolated from the installed app');
contract(app.includes("sessionStorage.getItem('essence:launch-played')"), 'Launch animation may repeat in the same session');

contract(app.includes('done=!current?.done'), 'Tasks can no longer be reopened after completion');
contract(app.includes("done=current?.doneDate!==today()"), 'Habits can no longer be reopened after completion');
contract(app.includes('const amount=250'), 'Home hydration increment changed from 250 ml');
contract(app.includes('const nextEntries=[entry,...entries]'), 'Home hydration no longer accumulates entries');
contract(home.includes('onClick={()=>{const total=registerHomeWater()'), 'Hydration shortcut no longer registers water');

for (const plan of ['monthly', 'quarterly', 'annual']) {
  contract(profile.includes(`id:'${plan}'`), `Premium ${plan} plan is missing`);
}
for (const checkout of ['yIJKlLK', 'UKuHm32', 'a1CTCMt']) {
  contract(profile.includes(checkout), `Kiwify checkout ${checkout} is missing`);
}

contract(access.includes("agenda: 'free'"), 'Agenda access rule changed unexpectedly');
contract(access.includes("nutrition: 'premium'"), 'Nutrition access rule changed unexpectedly');
contract(access.includes("finance: 'premium'"), 'Finance access rule changed unexpectedly');

contract(notifications.includes('LocalNotifications.requestPermissions()'), 'Native notification permission request is missing');
contract(notifications.includes('allowWhileIdle: true'), 'Background reminder scheduling lost allowWhileIdle');
contract(notifications.includes('repeats: true'), 'Daily reminders no longer repeat');
contract(capacitor.includes("appId: 'com.essencelife.app'"), 'Android application id changed');
contract(capacitor.includes('KeyboardResize.Native'), 'Native keyboard resize protection changed');

const manifest = JSON.parse(packageJson);
assert.equal(manifest.version, '1.0.0', 'Stable product version changed unexpectedly');

console.log('Regression contracts passed: native entry, actions, hydration, plans, access, notifications, and keyboard.');