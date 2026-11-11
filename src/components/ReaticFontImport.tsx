import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  ensureReaticFont, getInitialReaticStatus, getReaticStatus, REATIC_SOURCE, registerReaticFont, subscribeToReatic,
} from '../utils/reaticFont';
import type { Language } from '../types';
import './reatic-font-import.css';

const COPY = {
  'ko': ["리틱체 파일 등록","공식 다운로드","다운로드한 ZIP에서 REATIC-Regular.ttf 또는 .otf 파일을 선택하세요.","공식 Regular 파일인지 확인해 주세요.","이 브라우저에 글꼴을 저장하지 못했습니다."],
  'en': ["Add REATIC font","Official download","Choose REATIC-Regular.ttf or .otf from the downloaded ZIP.","Choose an official Regular font file.","Could not save the font in this browser."],
  'ja': ["リティック体を登録","公式ダウンロード","ZIPを展開し、REATIC-Regular.ttf または .otf を選んでください。","公式の Regular フォントを選んでください。","このブラウザーにフォントを保存できませんでした。"],
  'fr': ["Ajouter la police REATIC","Téléchargement officiel","Choisissez REATIC-Regular.ttf ou .otf dans l’archive ZIP.","Choisissez le fichier Regular officiel.","Impossible d’enregistrer la police dans ce navigateur."],
  'de': ["REATIC-Schrift hinzufügen","Offizieller Download","Wähle REATIC-Regular.ttf oder .otf aus der ZIP-Datei.","Wähle eine offizielle Regular-Schriftdatei.","Die Schrift konnte nicht im Browser gespeichert werden."],
  'zh-Hans': ["添加 REATIC 字体","官方下载","解压 ZIP 后，选择 REATIC-Regular.ttf 或 .otf。","请选择官方 Regular 字体文件。","无法在此浏览器中保存字体。"],
  'zh-Hant': ["新增 REATIC 字型","官方下載","解壓縮 ZIP 後，選擇 REATIC-Regular.ttf 或 .otf。","請選擇官方 Regular 字型檔。","無法在此瀏覽器中儲存字型。"],
} as const;

export default function ReaticFontImport({ locale }: { locale: Language }) {
  const input = useRef<HTMLInputElement>(null);
  const status = useSyncExternalStore(subscribeToReatic, getReaticStatus, getInitialReaticStatus);
  const [error, setError] = useState<'invalid' | 'failed'>();
  const [add, download, hint, invalid, failed] = COPY[locale];

  useEffect(() => { void ensureReaticFont(); }, []);
  if (status === 'idle' || status === 'ready') return null;

  return (
    <div className="reatic-font-import" aria-busy={status === 'loading'}>
      <p>{hint}</p>
      <div className="reatic-font-actions">
        <button type="button" disabled={status === 'loading'} onClick={() => input.current?.click()}>{add}</button>
        <a href={REATIC_SOURCE} target="_blank" rel="noreferrer">{download}</a>
      </div>
      <input
        ref={input}
        type="file"
        accept=".ttf,.otf"
        hidden
        onChange={async event => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = '';
          if (!file) return;
          setError(undefined);
          const result = await registerReaticFont(file);
          if (result !== 'ready') setError(result);
        }}
      />
      {error && <p role="alert">{error === 'invalid' ? invalid : failed}</p>}
    </div>
  );
}
