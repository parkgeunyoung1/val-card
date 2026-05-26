import csv
import random
import sys
import time
from pathlib import Path

import requests
from bs4 import BeautifulSoup


HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}

CSV_COLUMNS = ["시즌/대회", "소속팀", "닉네임", "국적", "포지션", "등급"]
OUTPUT_FILE = Path("valorant_global_master_roster.csv")

stdout_reconfigure = getattr(sys.stdout, "reconfigure", None)
if callable(stdout_reconfigure):
    stdout_reconfigure(encoding="utf-8", errors="replace")

# VLR event stats pages expose team abbreviations in the player column.
# We normalize the common partnered / major-event abbreviations where confidence is high,
# and fall back to the original abbreviation for any unknown case.
TEAM_MAP = {
    "100T": "100 Thieves",
    "2G": "2Game Esports",
    "AG": "All Gamers",
    "APK": "Apeks",
    "ASE": "Attacking Soul Esports",
    "BBL": "BBL Esports",
    "BLD": "Bleed Esports",
    "BLG": "Bilibili Gaming",
    "BME": "BOOM Esports",
    "C9": "Cloud9",
    "DFM": "DFM",
    "DRG": "Dragon Ranger Gaming",
    "DRX": "DRX",
    "EDG": "EDward Gaming",
    "EG": "Evil Geniuses",
    "EF": "Eternal Fire",
    "ENVY": "ENVY",
    "FNC": "Fnatic",
    "FPX": "FunPlus Phoenix",
    "FS": "FULL SENSE",
    "FUR": "FURIA",
    "FUT": "FUT Esports",
    "G2": "G2 Esports",
    "GE": "Global Esports",
    "GEN": "Gen.G",
    "GENG": "Gen.G",
    "GIA": "Giants Gaming",
    "GM8": "Gentle Mates",
    "GX": "GIANTX",
    "JDG": "JD Gaming",
    "KC": "Karmine Corp",
    "KOI": "KOI",
    "KRX": "Kiwoom DRX",
    "KRÜ": "KRÜ Esports",
    "KRU": "KRÜ Esports",
    "LEV": "Leviatán",
    "LOUD": "LOUD",
    "M8": "Gentle Mates",
    "M80": "M80",
    "MIBR": "MIBR",
    "MKOI": "Movistar KOI",
    "NAVI": "NaVi",
    "NS": "Nongshim RedForce",
    "NOVA": "Nova Esports",
    "NRG": "NRG",
    "PCF": "PCIFIC Esports",
    "PRX": "Paper Rex",
    "RRQ": "RRQ",
    "SEN": "Sentinels",
    "TE": "Trace Esports",
    "TEC": "Titan Esports Club",
    "TH": "Team Heretics",
    "T1": "T1",
    "TL": "Team Liquid",
    "TLN": "Talon Esports",
    "TS": "Team Secret",
    "TYL": "TYLOO",
    "ULF": "ULF Esports",
    "VL": "VL",
    "VIT": "Team Vitality",
    "WOL": "Wolves Esports",
    "XLG": "Xi Lai Gaming",
    "ZETA": "ZETA DIVISION",
}

EXCLUDED_TEAM_TAGS = {"BNY", "SPB", "Team", "tarik"}


TARGET_EVENTS = [
    # 2023 top-tier VCT structure
    {"name": "Champions Tour 2023: LOCK//IN São Paulo", "event_id": "1188"},
    {"name": "Champions Tour 2023: Americas League", "event_id": "1189"},
    {"name": "Champions Tour 2023: EMEA League", "event_id": "1190"},
    {"name": "Champions Tour 2023: Pacific League", "event_id": "1191"},
    {"name": "Champions Tour 2023: Masters Tokyo", "event_id": "1494"},
    {"name": "Valorant Champions 2023", "event_id": "1657"},
    # 2024
    {"name": "Champions Tour 2024: Americas Kickoff", "event_id": "1923"},
    {"name": "Champions Tour 2024: EMEA Kickoff", "event_id": "1925"},
    {"name": "Champions Tour 2024: Pacific Kickoff", "event_id": "1924"},
    {"name": "Champions Tour 2024: China Kickoff", "event_id": "1926"},
    {"name": "Champions Tour 2024: Masters Madrid", "event_id": "1921"},
    {"name": "Champions Tour 2024: EMEA Stage 1", "event_id": "1998"},
    {"name": "Champions Tour 2024: Pacific Stage 1", "event_id": "2002"},
    {"name": "Champions Tour 2024: Americas Stage 1", "event_id": "2004"},
    {"name": "Champions Tour 2024: China Stage 1", "event_id": "2006"},
    {"name": "Champions Tour 2024: Masters Shanghai", "event_id": "1999"},
    {"name": "Champions Tour 2024: EMEA Stage 2", "event_id": "2094"},
    {"name": "Champions Tour 2024: Americas Stage 2", "event_id": "2095"},
    {"name": "Champions Tour 2024: China Stage 2", "event_id": "2096"},
    {"name": "Champions Tour 2024: Pacific Stage 2", "event_id": "2005"},
    {"name": "Valorant Champions 2024", "event_id": "2097"},
    # 2025
    {"name": "VCT 2025: Americas Kickoff", "event_id": "2274"},
    {"name": "VCT 2025: China Kickoff", "event_id": "2275"},
    {"name": "VCT 2025: EMEA Kickoff", "event_id": "2276"},
    {"name": "VCT 2025: Pacific Kickoff", "event_id": "2277"},
    {"name": "Valorant Masters Bangkok 2025", "event_id": "2281"},
    {"name": "Valorant Masters Toronto 2025", "event_id": "2282"},
    {"name": "Valorant Champions 2025", "event_id": "2283"},
    {"name": "VCT 2025: Americas Stage 1", "event_id": "2347"},
    {"name": "VCT 2025: China Stage 1", "event_id": "2359"},
    {"name": "VCT 2025: Pacific Stage 1", "event_id": "2379"},
    {"name": "VCT 2025: EMEA Stage 1", "event_id": "2380"},
    {"name": "VCT 2025: EMEA Stage 2", "event_id": "2498"},
    {"name": "VCT 2025: China Stage 2", "event_id": "2499"},
    {"name": "VCT 2025: Pacific Stage 2", "event_id": "2500"},
    {"name": "VCT 2025: Americas Stage 2", "event_id": "2501"},
    # 2026 (includes incomplete/upcoming major slots so missing events are not omitted)
    {"name": "VCT 2026: Americas Kickoff", "event_id": "2682"},
    {"name": "VCT 2026: Pacific Kickoff", "event_id": "2683"},
    {"name": "VCT 2026: EMEA Kickoff", "event_id": "2684"},
    {"name": "VCT 2026: China Kickoff", "event_id": "2685"},
    {"name": "Valorant Masters Santiago 2026", "event_id": "2760"},
    {"name": "Valorant Masters London 2026", "event_id": "2765"},
    {"name": "Valorant Champions 2026", "event_id": "2766"},
    {"name": "VCT 2026: Pacific Stage 1", "event_id": "2775"},
    {"name": "VCT 2026: Pacific Stage 2", "event_id": "2776"},
    {"name": "VCT 2026: Americas Stage 1", "event_id": "2860"},
    {"name": "VCT 2026: EMEA Stage 1", "event_id": "2863"},
    {"name": "VCT 2026: China Stage 1", "event_id": "2864"},
    {"name": "VCT 2026: EMEA Stage 2", "event_id": "2976"},
    {"name": "VCT 2026: Americas Stage 2", "event_id": "2977"},
    {"name": "VCT 2026: China Stage 2", "event_id": "2978"},
]


def extract_country_code(player_cell):
    flag = player_cell.select_one("i.flag")
    if not flag:
        return ""

    for class_name in flag.get("class", []):
        if class_name.startswith("mod-"):
            return class_name.replace("mod-", "").upper()
    return ""


def normalize_team(raw_team):
    compact = " ".join(raw_team.split())
    return TEAM_MAP.get(compact, compact)


def parse_event_rows(event_name, event_id):
    url = f"https://www.vlr.gg/event/stats/{event_id}"
    print(f"수집 중: {event_name} ({event_id})")

    response = requests.get(url, headers=HEADERS, timeout=30)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    rows = soup.select("table.wf-table.mod-stats tbody tr")
    records = []
    seen = set()

    for row in rows:
        player_cell = row.select_one("td.mod-player")
        if not player_cell:
            continue

        nickname_el = player_cell.select_one(".text-of")
        team_el = player_cell.select_one(".stats-player-country")

        nickname = nickname_el.get_text(" ", strip=True) if nickname_el else ""
        raw_team = team_el.get_text(" ", strip=True) if team_el else "FA"
        if raw_team in EXCLUDED_TEAM_TAGS:
            continue

        team = normalize_team(raw_team)
        nationality = extract_country_code(player_cell)

        if not nickname:
            continue

        dedupe_key = (event_id, team, nickname, nationality)
        if dedupe_key in seen:
            continue
        seen.add(dedupe_key)

        records.append(
            {
                "시즌/대회": event_name,
                "소속팀": team,
                "닉네임": nickname,
                "국적": nationality,
                "포지션": "",
                "등급": "",
            }
        )

    print(f"  -> {len(records)}명 수집")
    return records


def main():
    all_records = []
    missing_events = []

    for index, event in enumerate(TARGET_EVENTS):
        try:
            records = parse_event_rows(event["name"], event["event_id"])
            if records:
                all_records.extend(records)
            else:
                missing_events.append(
                    f"{event['name']} ({event['event_id']}) - rows not found"
                )
        except Exception as exc:
            print(f"  !! 실패: {event['name']} ({event['event_id']}) -> {exc}")
            missing_events.append(f"{event['name']} ({event['event_id']}) - {exc}")

        if index < len(TARGET_EVENTS) - 1:
            delay = round(random.uniform(3.0, 4.0), 2)
            print(f"  -> {delay}초 대기")
            time.sleep(delay)

    with OUTPUT_FILE.open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=CSV_COLUMNS)
        writer.writeheader()
        writer.writerows(all_records)

    print(f"\n완료: {OUTPUT_FILE} ({len(all_records)} rows)")
    if missing_events:
        print("\n행이 비었거나 실패한 이벤트:")
        for item in missing_events:
            print(f"- {item}")
    else:
        print("\n모든 대상 이벤트에서 데이터를 확인했습니다.")


if __name__ == "__main__":
    main()
