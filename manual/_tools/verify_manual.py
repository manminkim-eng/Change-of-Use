# -*- coding: utf-8 -*-
"""매뉴얼 검사 — usage: python verify_manual.py <repoDir> [판 X.Y.Z]
   ① 그림 파일·표시점(0~100%) ② 범례 수 = 표시점 수 ③ 예제 판정·조항이 본문에 있음 ④ 내부 링크 ⑤ 앱 근거 표기(v5.0.6)"""
import sys, os, re, json
repo = sys.argv[1]; M = os.path.join(repo, 'manual'); ok = True
def chk(name, cond, info=''):
    global ok; ok &= bool(cond); print(('✓' if cond else '✗'), name, info)
h = open(os.path.join(M, 'index.html'), encoding='utf-8').read()
marks = json.load(open(os.path.join(M, 'images', '_marks.json'), encoding='utf-8'))
ex = json.load(open(os.path.join(M, '_tools', '_example.json'), encoding='utf-8'))
figs = re.findall(r'<figure class="shot[^"]*" id="fig-([^"]+)">(.*?)</figure>', h, re.S)
chk('그림 수 = 캡처 수', len(figs) == len(marks), f'{len(figs)}/{len(marks)}')
chk('그림 파일 존재', all(os.path.exists(os.path.join(M, 'images', k + '.webp')) for k in marks))
out = [f'{k}:{m["label"]}' for k, v in marks.items() for m in v['marks'] if 'x' not in m or m['x'] < 0 or m['y'] < 0 or m['x'] + m['w'] > 100.5 or m['y'] + m['h'] > 100.5]
chk('표시점이 이미지 안', not out, str(out[:5]))
bad = [sid for sid, body in figs if len(re.findall(r'<li><b>', body)) != len(marks[sid]['marks'])]
chk('범례 수 = 표시점 수', not bad, str(bad))
need = []
for k in 'ABC':
    e = ex[k]; need += [e['verdict'], e['mi']['판정 기준'], e['cur'], e['tgt'], e['mi']['시설군 이동']]
miss = [n for n in need if n not in h]
chk('예제 판정·조항이 본문에 있음', not miss, f'{len(need)}개 ' + str(miss))
chk('예제 A 허가 · B 신고 · C 같은 군', ex['A']['type'] == 'permit' and ex['B']['type'] == 'report' and ex['C']['type'] == 'free')
ids = set(re.findall(r'id="([^"]+)"', h)); links = set(re.findall(r'href="#([^"]+)"', h))
chk('내부 링크', links <= ids, str(sorted(links - ids)[:5]))
chk('매뉴얼 — 옛 표기 없음', not re.search(r'교정 및 군사시설(?!」)|국토계획법 시행령 별표|건축사법 제23조(?!」)|제19조 제3항에 따라 신고', h))
app = open(os.path.join(repo, 'index.html'), encoding='utf-8').read()
chk('앱 — 신고 근거 제2항 제2호', app.count('제2항 제2호') >= 4, str(app.count('제2항 제2호')))
chk('앱 — 옛 표기 없음', not re.search(r"교정 및 군사|국토계획법 시행령 별표|29개 용도|자유 변경|건축사법 제23조|2026\. 7\. 28|통상 15~30일|통상 3~7일|간소화|' 제3항':type==='permit'", app))
chk('앱 — 매뉴얼 버튼', 'class="tb tb-manual"' in app and 'Change-of-Use/manual/' in app)
sw = open(os.path.join(repo, 'sw.js'), encoding='utf-8').read()
# 2026-11-12 정밀검토 B7: 캐시명을 고정값으로 검사하지 않고 sw.js 에서 읽음 — 폴더 이름에 -vX.Y.Z 가 있으면 그 판과 대조, 셋째 인자로 판 지정 가능
_m = re.search(r"'(yodo-v(\d+\.\d+\.\d+))'", sw)
_dv = re.search(r'-v(\d+\.\d+\.\d+)$', os.path.basename(os.path.abspath(repo)))
_want = sys.argv[2] if len(sys.argv) > 2 else (_dv.group(1) if _dv else None)
chk('sw — 캐시명 yodo-vX.Y.Z' + (f' = {_want}' if _want else ' (판 대조 없음)'), _m and (_want is None or _m.group(2) == _want) and 'manual' not in sw, _m.group(1) if _m else '캐시명 없음')
sys.exit(0 if ok else 1)
