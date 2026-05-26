# VCT 2025 Logo Downloader
# Run from: C:\Users\SSAFY\val\frontend
# Usage: powershell -ExecutionPolicy Bypass -File download-logos.ps1

$ErrorActionPreference = "Continue"

New-Item -ItemType Directory -Force -Path "public\logos\teams"   | Out-Null
New-Item -ItemType Directory -Force -Path "public\logos\leagues" | Out-Null

$headers = @{
  "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
  "Referer"    = "https://liquipedia.net/"
  "Accept"     = "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
}

$teams = [ordered]@{
  # ── Americas ──────────────────────────────────────────
  "sentinels.png"      = "https://liquipedia.net/commons/images/4/48/Sentinels_2025_allmode.png"
  "loud.png"           = "https://liquipedia.net/commons/images/8/8b/LOUD_allmode.png"
  "nrg.png"            = "https://liquipedia.net/commons/images/1/16/NRG_2024_allmode.png"
  "evil-geniuses.png"  = "https://liquipedia.net/commons/images/3/3c/Evil_Geniuses_2024_lightmode.png"
  "100-thieves.png"    = "https://liquipedia.net/commons/images/c/c2/100_Thieves_lightmode.png"
  "m80.png"            = "https://liquipedia.net/commons/images/5/55/M80_2023_allmode.png"
  "kru-esports.png"    = "https://liquipedia.net/commons/images/b/bf/KRU_Esports_allmode.png"
  "cloud9.png"         = "https://liquipedia.net/commons/images/b/bb/Cloud9_2023_allmode.png"
  "leviatan.png"       = "https://liquipedia.net/commons/images/e/ec/Leviat%C3%A1n_allmode.png"
  "mibr.png"           = "https://liquipedia.net/commons/images/8/85/MIBR_2018_lightmode.png"
  "2game-esports.png"  = "https://liquipedia.net/commons/images/7/7f/2GAME_Esports_2024_allmode.png"
  "g2-esports.png"     = "https://liquipedia.net/commons/images/7/77/G2_Esports_allmode.png"
  "furia.png"          = "https://liquipedia.net/commons/images/1/1e/FURIA_Esports_lightmode.png"
  # ── EMEA ──────────────────────────────────────────────
  "fnatic.png"         = "https://liquipedia.net/commons/images/f/f9/Fnatic_2020_allmode.png"
  "team-liquid.png"    = "https://liquipedia.net/commons/images/0/01/Team_Liquid_2024_lightmode.png"
  "team-vitality.png"  = "https://liquipedia.net/commons/images/e/e4/Team_Vitality_2023_lightmode.png"
  "natus-vincere.png"  = "https://liquipedia.net/commons/images/3/3f/Natus_Vincere_2021_lightmode.png"
  "guild-esports.png"  = "https://liquipedia.net/commons/images/f/f8/Guild_Esports_allmode.png"
  "bbl-esports.png"    = "https://liquipedia.net/commons/images/4/4e/BBL_Esports_2022_lightmode.png"
  "karmine-corp.png"   = "https://liquipedia.net/commons/images/0/0e/Karmine_Corp_lightmode.png"
  "fut-esports.png"    = "https://liquipedia.net/commons/images/9/90/Futbolist_2021_lightmode.png"
  "gentle-mates.png"   = "https://liquipedia.net/commons/images/c/c0/Gentle_Mates_2024_lightmode.png"
  "giantx.png"         = "https://liquipedia.net/commons/images/2/2d/GIANTX_lightmode.png"
  "apeks.png"          = "https://liquipedia.net/commons/images/a/a7/Apeks_2021_darkmode.png"
  "team-heretics.png"  = "https://liquipedia.net/commons/images/d/d5/Team_Heretics_2021_allmode.png"
  "koi.png"            = "https://liquipedia.net/commons/images/c/c3/KOI_lightmode.png"
  # ── Pacific ───────────────────────────────────────────
  "zeta-division.png"  = "https://liquipedia.net/commons/images/4/4f/ZETA_DIVISION_lightmode.png"
  "drx.png"            = "https://liquipedia.net/commons/images/1/1f/DRX_2023_lightmode.png"
  "paper-rex.png"      = "https://liquipedia.net/commons/images/8/8c/Paper_Rex_lightmode.png"
  "t1.png"             = "https://liquipedia.net/commons/images/e/e4/T1_2019_allmode.png"
  "geng.png"           = "https://liquipedia.net/commons/images/6/66/Gen.G_Esports_2025_lightmode.png"
  "global-esports.png" = "https://liquipedia.net/commons/images/2/23/Global_Esports_2020_allmode.png"
  "talon-esports.png"  = "https://liquipedia.net/commons/images/7/7c/Talon_Esports_2019_allmode.png"
  "rrq.png"            = "https://liquipedia.net/commons/images/1/1e/Rex_Regum_Qeon_allmode.png"
  "dfm.png"            = "https://liquipedia.net/commons/images/2/27/DetonatioN_FocusMe_2022_lightmode.png"
  "bleed-esports.png"  = "https://liquipedia.net/commons/images/d/d6/Bleed_Esports_2024_allmode.png"
}

$leagues = [ordered]@{
  "vct-americas.png"       = "https://liquipedia.net/commons/images/0/09/VCT_2023_Americas_League_allmode.png"
  "vct-emea.png"           = "https://liquipedia.net/commons/images/b/b3/VCT_2024_EMEA_League_lightmode.png"
  "vct-pacific.png"        = "https://liquipedia.net/commons/images/5/54/VCT_2023_Pacific_League_allmode.png"
  "vct-champions-2025.png" = "https://liquipedia.net/commons/images/a/a2/VCT_Champions_Paris_2025.png"
  "vct-masters-2025.png"   = "https://liquipedia.net/commons/images/7/7d/VCT_Masters_Toronto_2025_allmode.png"
}

$ok = 0; $fail = 0

function Download-Logo($url, $dest, $label) {
  try {
    Invoke-WebRequest -Uri $url -Headers $headers -OutFile $dest -TimeoutSec 20 -UseBasicParsing
    $size = (Get-Item $dest).Length
    if ($size -lt 500) { throw "File too small ($size bytes) — likely an error page" }
    Write-Host "  [OK]  $label" -ForegroundColor Green
    return $true
  } catch {
    Write-Host "  [FAIL] $label — $_" -ForegroundColor Red
    if (Test-Path $dest) { Remove-Item $dest }
    return $false
  }
}

Write-Host "`n=== Downloading team logos ($($teams.Count)) ===" -ForegroundColor Cyan
foreach ($entry in $teams.GetEnumerator()) {
  $dest = "public\logos\teams\$($entry.Key)"
  if (Test-Path $dest) { Write-Host "  [SKIP] $($entry.Key) (already exists)" -ForegroundColor DarkGray; $ok++; continue }
  if (Download-Logo $entry.Value $dest $entry.Key) { $ok++ } else { $fail++ }
  Start-Sleep -Milliseconds 300
}

Write-Host "`n=== Downloading league / tournament logos ($($leagues.Count)) ===" -ForegroundColor Cyan
foreach ($entry in $leagues.GetEnumerator()) {
  $dest = "public\logos\leagues\$($entry.Key)"
  if (Test-Path $dest) { Write-Host "  [SKIP] $($entry.Key) (already exists)" -ForegroundColor DarkGray; $ok++; continue }
  if (Download-Logo $entry.Value $dest $entry.Key) { $ok++ } else { $fail++ }
  Start-Sleep -Milliseconds 300
}

Write-Host "`n=== Done: $ok OK / $fail FAILED ===" -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Yellow" })
if ($fail -gt 0) {
  Write-Host "Failed logos will show as initials on the card — you can add them manually later." -ForegroundColor DarkGray
}
