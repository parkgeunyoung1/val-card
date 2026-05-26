# 신규 팀/대회 로고 다운로더 (중국팀 12개 + 실패팀 4개 + 대회 로고)
$ErrorActionPreference = "Continue"

New-Item -ItemType Directory -Force -Path "public\logos\teams"   | Out-Null
New-Item -ItemType Directory -Force -Path "public\logos\leagues" | Out-Null

$headers = @{
  "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
  "Referer"    = "https://liquipedia.net/"
  "Accept"     = "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
}

# 파일명 → URL 후보 목록 (앞에서부터 순서대로 시도)
$targets = [ordered]@{

  # ── 이전 실패 4개 (재시도) ──────────────────────────────
  "teams\g2-esports.png" = @(
    "https://liquipedia.net/commons/images/9/9f/G2_Esports_2024_allmode.png",
    "https://liquipedia.net/commons/images/5/5a/G2_Esports_allmode.png",
    "https://liquipedia.net/commons/images/7/77/G2_Esports_2022_allmode.png"
  )
  "teams\furia.png" = @(
    "https://liquipedia.net/commons/images/f/f2/FURIA_Esports_allmode.png",
    "https://liquipedia.net/commons/images/1/1e/FURIA_Esports_2023_allmode.png",
    "https://liquipedia.net/commons/images/a/aa/FURIA_2021_allmode.png"
  )
  "teams\team-heretics.png" = @(
    "https://liquipedia.net/commons/images/5/5b/Team_Heretics_2023_allmode.png",
    "https://liquipedia.net/commons/images/9/9d/Team_Heretics_2024_allmode.png",
    "https://liquipedia.net/commons/images/d/d5/Team_Heretics_allmode.png"
  )
  "teams\koi.png" = @(
    "https://liquipedia.net/commons/images/7/71/KOI_2024_allmode.png",
    "https://liquipedia.net/commons/images/4/4b/KOI_2023_allmode.png",
    "https://liquipedia.net/commons/images/c/cf/Movistar_KOI_allmode.png"
  )

  # ── 중국팀 ──────────────────────────────────────────────
  "teams\edg.png" = @(
    "https://liquipedia.net/commons/images/9/98/EDward_Gaming_2017_lightmode.png",
    "https://liquipedia.net/commons/images/e/e3/EDward_Gaming_allmode.png",
    "https://liquipedia.net/commons/images/f/f5/EDward_Gaming_2023_allmode.png"
  )
  "teams\blg.png" = @(
    "https://liquipedia.net/commons/images/5/50/Bilibili_Gaming_2021_allmode.png",
    "https://liquipedia.net/commons/images/b/b6/Bilibili_Gaming_allmode.png",
    "https://liquipedia.net/commons/images/2/2e/BLG_allmode.png"
  )
  "teams\fpx.png" = @(
    "https://liquipedia.net/commons/images/2/20/FunPlus_Phoenix_2021_allmode.png",
    "https://liquipedia.net/commons/images/f/f0/FunPlus_Phoenix_allmode.png",
    "https://liquipedia.net/commons/images/4/43/FPX_allmode.png"
  )
  "teams\trace-esports.png" = @(
    "https://liquipedia.net/commons/images/3/3f/Trace_Esports_2025_allmode.png",
    "https://liquipedia.net/commons/images/t/tr/Trace_Esports_allmode.png",
    "https://liquipedia.net/commons/images/6/6e/Trace_Esports_allmode.png"
  )
  "teams\drg.png" = @(
    "https://liquipedia.net/commons/images/c/ce/Dragon_Ranger_Gaming_allmode.png",
    "https://liquipedia.net/commons/images/d/d0/Dragon_Ranger_Gaming_2024_allmode.png",
    "https://liquipedia.net/commons/images/3/30/DRG_allmode.png"
  )
  "teams\nova-esports.png" = @(
    "https://liquipedia.net/commons/images/8/8a/Nova_Esports_2025_allmode.png",
    "https://liquipedia.net/commons/images/n/no/Nova_Esports_allmode.png",
    "https://liquipedia.net/commons/images/4/4e/Nova_Esports_2024_allmode.png"
  )
  "teams\wolves-esports.png" = @(
    "https://liquipedia.net/commons/images/6/6c/Wolves_Esports_allmode.png",
    "https://liquipedia.net/commons/images/w/wo/Wolves_Esports_allmode.png",
    "https://liquipedia.net/commons/images/5/52/Wolves_allmode.png"
  )
  "teams\all-gamers.png" = @(
    "https://liquipedia.net/commons/images/a/a1/All_Gamers_allmode.png",
    "https://liquipedia.net/commons/images/0/0c/All_Gamers_2024_allmode.png",
    "https://liquipedia.net/commons/images/5/55/AG_allmode.png"
  )
  "teams\tec.png" = @(
    "https://liquipedia.net/commons/images/8/84/Titan_Esports_Club_2025_allmode.png",
    "https://liquipedia.net/commons/images/t/ti/Titan_Esports_Club_allmode.png",
    "https://liquipedia.net/commons/images/6/6b/TEC_allmode.png"
  )
  "teams\xlg.png" = @(
    "https://liquipedia.net/commons/images/5/5a/XLG_China_2024_allmode.png",
    "https://liquipedia.net/commons/images/x/xl/Xi_Lai_Gaming_allmode.png",
    "https://liquipedia.net/commons/images/3/3b/Xi_Lai_Gaming_2024_allmode.png"
  )
  "teams\jdg.png" = @(
    "https://liquipedia.net/commons/images/d/d6/JD_Gaming_2021_allmode.png",
    "https://liquipedia.net/commons/images/j/jd/JD_Gaming_allmode.png",
    "https://liquipedia.net/commons/images/4/40/JDG_allmode.png"
  )
  "teams\tyloo.png" = @(
    "https://liquipedia.net/commons/images/5/5f/TyLoo_2016_allmode.png",
    "https://liquipedia.net/commons/images/t/ty/TYLOO_allmode.png",
    "https://liquipedia.net/commons/images/2/24/Tyloo_allmode.png"
  )

  # ── 신규 대회 로고 ────────────────────────────────────────
  "leagues\vct-china.png" = @(
    "https://liquipedia.net/commons/images/4/4e/VCT_2024_China_League_allmode.png",
    "https://liquipedia.net/commons/images/c/ca/VCT_China_allmode.png",
    "https://liquipedia.net/commons/images/6/6f/VCT_2023_China_League_allmode.png"
  )
  "leagues\vct-masters-bangkok-25.png" = @(
    "https://liquipedia.net/commons/images/1/1d/VCT_Masters_Bangkok_allmode.png",
    "https://liquipedia.net/commons/images/b/ba/VCT_Masters_Bangkok_2025_allmode.png",
    "https://liquipedia.net/commons/images/8/8e/Valorant_Masters_Bangkok_2025_allmode.png"
  )
}

$ok = 0; $fail = 0; $skip = 0

foreach ($entry in $targets.GetEnumerator()) {
  $dest = "public\logos\$($entry.Key)"
  if (Test-Path $dest) {
    Write-Host "  [SKIP] $($entry.Key)" -ForegroundColor DarkGray
    $skip++
    continue
  }

  $found = $false
  foreach ($url in $entry.Value) {
    try {
      Invoke-WebRequest -Uri $url -Headers $headers -OutFile $dest -TimeoutSec 15 -UseBasicParsing
      $size = (Get-Item $dest).Length
      if ($size -lt 500) { throw "too small ($size bytes)" }
      Write-Host "  [OK]  $($entry.Key)" -ForegroundColor Green
      $found = $true; $ok++
      break
    } catch {
      if (Test-Path $dest) { Remove-Item $dest }
    }
    Start-Sleep -Milliseconds 200
  }

  if (-not $found) {
    Write-Host "  [FAIL] $($entry.Key) — 수동 추가 필요" -ForegroundColor Red
    $fail++
  }
  Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Host "=== 완료: OK $ok / SKIP $skip / FAIL $fail ===" -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Yellow" })
