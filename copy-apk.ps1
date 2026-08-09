$ErrorActionPreference = 'Stop'
$src = Join-Path $PSScriptRoot 'android\app\build\outputs\apk\debug\app-debug.apk'
$dst1 = Join-Path $PSScriptRoot 'Essence-Life-atualizado.apk'
$dst2 = Join-Path $PSScriptRoot 'EssenceLife.apk'
Copy-Item $src $dst1 -Force
Copy-Item $src $dst2 -Force
Get-Item $dst1, $dst2 | Select-Object FullName, Length, LastWriteTime
