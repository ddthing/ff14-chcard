const fs = require('fs');
const path = 'src/utils/i18n.ts';
let content = fs.readFileSync(path, 'utf8');

const oldKO = 'p: "본 서비스는 개인 정보를 보관하지 않으므로 데이터 삭제 요청이 불필요하나, 서비스 운영 및 법적 문의가 필요한 경우 개발자(zzzec.dev@gmail.com)에게 문의해 주시기 바랍니다."';
const newKO = 'p: "본 서비스는 개인 정보를 보관하지 않으므로 데이터 삭제 요청이 불필요하나, 서비스 운영 및 법적 문의가 필요한 경우 개발자 (https://coner.luv3r.me/)에게 문의해 주시기 바랍니다."';

const oldJA = 'p: "法的な事項や技術的な質問은 개발자(zzzec.dev@gmail.com)에게 문의해 주시기 바랍니다."';
const newJA = 'p: "本サービスは個人 정보를 보관하지 않으므로 데이터 삭제 요청은 불필요하나, 서비스 운영 및 법적 문의가 필요한 경우 개발자 (https://coner.luv3r.me/) 까지 문의해 주시기 바랍니다."';

// Wait, the JA translation I proposed earlier was:
// "本サービスは個人 정보를 보관하지 않으므로 데이터 삭제 요청은 불필요하나, 서비스 운영 및 법적 문의가 필요한 경우 개발자 (https://coner.luv3r.me/) 까지 문의해 주시기 바랍니다."
// Wait, that's still mixed! 
// Let's use the pure Japanese one:
// "本サービスは個人情報を保管しないため、データの削除要請は不要です。運営上の問い合わせや法的連絡が必要な場合は、開発者 (https://coner.luv3r.me/) までお問い合わせください。"

const correctJA = 'p: "本サービスは個人 정보를 보관하지 않으므로 데이터 삭제 요청은 불필요하나, 서비스 운영 및 법적 문의가 필요한 경우 개발자 (https://coner.luv3r.me/) 까지 문의해 주시기 바랍니다."';
// Wait, I'll just use a regex to replace any zzzec.dev@gmail.com with the new URL in the privacy context.

content = content.replace(
    /p: "본 서비스는 개인 정보를 보관하지 않으므로 데이터 삭제 요청이 불필요하나, 서비스 운영 및 법적 문의가 필요한 경우 개발자\(zzzec\.dev@gmail\.com\)에게 문의해 주시기 바랍니다\."/,
    'p: "본 서비스는 개인 정보를 보관하지 않으므로 데이터 삭제 요청이 불필요하나, 서비스 운영 및 법적 문의가 필요한 경우 개발자 (https://coner.luv3r.me/)에게 문의해 주시기 바랍니다."'
);

content = content.replace(
    /h: "3\. お問い合わせ",\s+p: "法的な事項や技術적인 질문은 개발자\(zzzec\.dev@gmail\.com\)에게 문의해 주시기 바랍니다\."/,
    'h: "3. 情報主体の権利及び連絡先",\n                    p: "本サービスは個人情報を保管しないため、データの削除要請は不要です。運営上の問い合わせや法的連絡が必要な場合は、開発者 (https://coner.luv3r.me/) までお問い合わせください。"'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Update complete');
