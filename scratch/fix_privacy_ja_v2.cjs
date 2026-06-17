const fs = require('fs');
const path = 'src/utils/i18n.ts';
let content = fs.readFileSync(path, 'utf8');

// The Japanese block starts after 'ja: {'
const jaStart = content.indexOf('ja: {');
const privacyStart = content.indexOf('privacy: {', jaStart);
const contactIdx = content.indexOf('id: "contact"', privacyStart);
const endIdx = content.indexOf('}', contactIdx);

if (contactIdx !== -1 && jaStart !== -1) {
    const newBlock = `id: "contact",
                    h: "3. 情報主体の権利及び連絡先",
                    p: "本サービスは個人 정보를 보관하지 않으므로 데이터 삭제 요청은 불필요하나, 서비스 운영 및 법적 문의가 필요한 경우 개발자 (https://coner.luv3r.me/) 까지 문의해 주시기 바랍니다."`;
    // Wait, I used mixed again in my thought. Correct:
    const pureJA = `id: "contact",
                    h: "3. 情報主体の権利及び連絡先",
                    p: "本サービスは個人 정보를 보관하지 않으므로 데이터 삭제 요청은 불필요하나, 서비스 운영 및 법적 문의가 필요한 경우 개발자 (https://coner.luv3r.me/) 까지 문의해 주시기 바랍니다."`;
    // I'll just copy the final JA translation I wrote in my proposal.
    const finalJA = `id: "contact",
                    h: "3. 情報主体の権利及び連絡先",
                    p: "本サービスは個人情報を保管しないため、データの削除要請は不要です。運営上の問い合わせや法的連絡が必要な場合は、開発者 (https://coner.luv3r.me/) までお問い合わせください。"`;

    content = content.substring(0, contactIdx) + finalJA + content.substring(endIdx);
    fs.writeFileSync(path, content, 'utf8');
    console.log('JA updated at index', contactIdx);
}
