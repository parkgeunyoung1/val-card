# 실패한 4개 로고 재시도 스크립트
$ErrorActionPreference = "Continue"

$headers = @{
  "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
  "Referer"    = "https://liquipedia.net/"
  "Accept"     = "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
}

# 각 팀마다 URL 후보를 순서대로 시도
$retries = @{
  "g2-esports.png" = @(
    "https://liquipedia.net/commons/images/9/9f/G2_Esports_2024_allmode.png",
    "https://liquipedia.net/commons/images/7/77/G2_Esports_allmode.png",
    "https://liquipedia.net/commons/images/2/27/G2_Esports_2022_allmode.png"
  )
  "furia.png" = @(
    "https://liquipedia.net/commons/images/f/f2/FURIA_Esports_2021_lightmode.png",
    "https://liquipedia.net/commons/images/a/aa/FURIA_Esports_allmode.png",
    "https://liquipedia.net/commons/images/1/1e/FURIA_Esports_lightmode.png"
  )
  "team-heretics.png" = @(
    "https://liquipedia.net/commons/images/5/5b/Team_Heretics_2023_allmode.png",
    "https://liquipedia.net/commons/images/9/9d/Team_Heretics_2022_allmode.png",
    "https://liquipedia.net/commons/images/d/d5/Team_Heretics_2021_allmode.png"
  )
  "koi.png" = @(
    "https://liquipedia.net/commons/images/7/71/KOI_2024_allmode.png",
    "https://liquipedia.net/commons/images/4/4b/KOI_2023_allmode.png",
    "https://liquipedia.net/commons/images/c/c3/KOI_lightmode.png"
  )
}

foreach ($entry in $retries.GetEnumerator()) {
  $dest = "public\logos\teams\$($entry.Key)"
  $found = $false
  foreach ($url in $entry.Value) {
    try {
      Invoke-WebRequest -Uri $url -Headers $headers -OutFile $dest -TimeoutSec 15 -UseBasicParsing
      $size = (Get-Item $dest).Length
      if ($size -lt 500) { throw "too small" }
      Write-Host "[OK]  $($entry.Key)  ← $url" -ForegroundColor Green
      $found = $true
      break
    } catch {
      if (Test-Path $dest) { Remove-Item $dest }
    }
    Start-Sleep -Milliseconds 200
  }
  if (-not $found) {
    Write-Host "[FAIL] $($entry.Key) — 모든 URL 실패. 수동으로 추가 필요." -ForegroundColor Red
  }
}
