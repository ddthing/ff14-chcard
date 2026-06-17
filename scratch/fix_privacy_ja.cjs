const fs = require('fs');
const path = 'src/utils/i18n.ts';
let content = fs.readFileSync(path, 'utf8');

const oldJAP = 'p: "法的な事項や技術적인 질문은 개발자(zzzec.dev@gmail.com)까지 연락주시기 바랍니다."';
// Wait, I see '法적인 사항이나 기술적인 질문은 개발자(zzzec.dev@gmail.com)에게 문의해 주시기 바랍니다.' earlier.
// I'll just use a very simple replace for the Japanese privacy section.

const startIdx = content.indexOf('id: "contact",');
const endIdx = content.indexOf('}', startIdx);

if (startIdx !== -1) {
    const newBlock = `id: "contact",
                    h: "3. 情報主体の権利及び連絡先",
                    p: "本サービスは個人情報を保管しないため、データの削除要請は不要です。運営上の問い合わせや法的連絡が必要な場合は、開発者 (https://coner.luv3r.me/) までお問い合わせください。"`;
    content = content.substring(0, startIdx) + newBlock + content.substring(endIdx);
    fs.writeFileSync(path, content, 'utf8');
    console.log('JA updated');
}
