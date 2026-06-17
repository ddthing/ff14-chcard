
import sys

file_path = r'c:\Users\zzzec\Downloads\ff14-chcard-master\src\utils\i18n.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "export const PLAYSTYLES_JA = [" in line or any(p in line for p in ['絶レ이드', 'ア치이브먼트', '로그인多め']):
        # We target the specific array and fix it
        if "'初心者/若葉'" in line:
            line = line.replace("'絶レ이드'", "'絶レイド'")
            line = line.replace("'ア치이브먼트'", "'アチーブメント'")
            line = line.replace("'로그인多め'", "'ログイン多め'")
            # Add more fixes if needed based on what I saw
            line = line.replace("'レ이드/高難易度'", "'レイド/高難易度'") # Just in case it was '레레이드'
    new_lines.append(line)

# Since I can't be sure about the exact matches above, let's just replace the whole block if we find the start
found_start = -1
for i, line in enumerate(lines):
    if "export const PLAYSTYLES_JA = [" in line:
        found_start = i
        break

if found_start != -1:
    lines[found_start+1] = "    '初心者/若葉', '復帰勢', 'レイド/高難易度', '絶レイド',\n"
    lines[found_start+2] = "    'ライト勢/エンジョイ', 'SS/ミラプリ', 'ハウジング', 'ギャザクラ', 'ヌシ釣り',\n"
    lines[found_start+3] = "    'RP(ロールプレイ)', 'PvP', 'ア치ーブ먼트', '麻雀', 'ゴールドソーサー', '地図/宝物庫',\n"
    # Wait, 'ア치이브먼트' might be in different line.
    # Let's just rewrite lines 514-517 (0-indexed 513-516)
    # The file has 513: export const...
    # So 514 is lines[513]
    lines[513] = "    '初心者/若葉', '復帰勢', 'レイド/高難易度', '絶レイド',\n"
    lines[514] = "    'ライト勢/エンジョイ', 'SS/ミラプリ', 'ハウジング', 'ギャザクラ', 'ヌシ釣り',\n"
    lines[515] = "    'RP(ロールプレイ)', 'PvP', 'アチーブメント', '麻雀', 'ゴールドソーサー', '地図/宝物庫',\n"
    lines[516] = "    'Discord可能', 'Twitter(X)交流有', 'ログイン多め'\n"

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("Successfully updated PLAYSTYLES_JA")
