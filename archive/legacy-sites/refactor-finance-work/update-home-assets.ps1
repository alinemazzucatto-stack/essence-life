$ErrorActionPreference = 'Stop'

$root = Join-Path $PSScriptRoot 'dist'

$index = Join-Path $root 'index.html'
$html = Get-Content $index -Raw
$html = $html.Replace('./essence-home-inspiration-v2.css?v=inspiration-v3','./essence-home-summary-v1.css?v=summary-v1')
$html = $html.Replace('./essence-home-inspiration-v2.js?v=inspiration-v3','./essence-home-summary-v1.js?v=summary-v1')
[IO.File]::WriteAllText($index, $html, (New-Object Text.UTF8Encoding($false)))

$sw = Join-Path $root 'sw.js'
$s = Get-Content $sw -Raw
$s = $s.Replace('essence-life-shell-ux-refresh-2','essence-life-shell-ux-refresh-3')
[IO.File]::WriteAllText($sw, $s, (New-Object Text.UTF8Encoding($false)))

Write-Host 'home-assets-updated'
