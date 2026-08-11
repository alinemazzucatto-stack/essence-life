export function readStoredArray<T>(key:string):T[]{
  try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[]}
  catch{return[]}
}

export function readStoredObject<T>(key:string,fallback:T):T{
  try{const value=JSON.parse(localStorage.getItem(key)||'null');return value&&typeof value==='object'&&!Array.isArray(value)?value as T:fallback}
  catch{return fallback}
}