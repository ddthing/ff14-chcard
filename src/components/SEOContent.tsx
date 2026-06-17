import { usePlayer } from '../contexts/PlayerContext';
import { Sparkles, Palette, Globe, Smartphone, Download, Share2 } from 'lucide-react';

export function SEOContent() {
    const { playerInfo } = usePlayer();
    const lang = playerInfo.language || 'ko';

    const t = {
        ko: {
            badge: "설치가 필요 없는 웹 기반 도구",
            title: "가장 아름다운 모험가의 기록",
            subtitle1: "나만의 고유한 캐릭터를 돋보이게 해주는 프로필 제작 도구입니다.",
            subtitle2: "클릭 몇 번으로 트위터와 디스코드에 공유하기 완벽한 명함을 완성하세요.",
            features: [
                { title: "프리미엄 커스터마이징", desc: "10여 종 이상의 감성적인 웹폰트와 다양한 스티커를 지원합니다. 원하는 테마 컬러로 자유롭게 카드를 꾸며보세요." },
                { title: "글로벌 데이터센터 지원", desc: "한국 서버는 물론 북미, 유럽, 일본, 오세아니아 등 파이널 판타지 14의 모든 월드와 직업을 완벽하게 지원합니다." },
                { title: "모든 기기 완벽 대응", desc: "PC, 태블릿, 스마트폰 등 브라우저가 있는 어떤 환경에서든 즉시 접속하여 사용할 수 있는 100% 반응형 디자인을 제공합니다." }
            ],
            stepTitle: "쉽고 빠른 제작 과정",
            stepSubtitle: "단 3단계면 나만의 프로필이 완성됩니다.",
            steps: [
                { num: "01", title: "정보 입력", desc: "캐릭터 이름, 소속 서버, 주 직업 및 레벨 등 기본 정보를 폼에 채워 넣습니다." },
                { num: "02", title: "디자인 꾸미기", desc: "가장 멋진 스크린샷을 업로드하고 폰트, 색상, 스티커를 활용해 개성을 표현합니다." },
                { num: "03", title: "저장 및 공유", desc: "고해상도 이미지로 다운로드하여 해시태그와 함께 공유합니다." }
            ],
            useCaseTitle: "어디에 활용할 수 있나요?",
            useCaseDesc: "트위터(X)의 메인 트윗으로 고정하여 나를 방문하는 사람들에게 내 캐릭터 성향을 한눈에 알리거나, 자유부대(길드) 및 공대 구인구직을 위한 디스코드 채널에 이력서처럼 제출해 보세요.",
            checks: [
                "안전한 브라우저(Client-side) 이미지 처리",
                "개인정보 및 서버 데이터 수집 없음",
                "상업적 이용 및 재판매 절대 불가"
            ],
            createBox: "Create Your Card"
        },
        en: {
            badge: "No Installation Required",
            title: "The Most Beautiful Adventurer Record",
            subtitle1: "A profile creation tool to make your unique character stand out.",
            subtitle2: "Create the perfect card to share on Twitter and Discord with just a few clicks.",
            features: [
                { title: "Premium Customization", desc: "Supports beautiful web fonts and various stickers. Decorate your card freely with your desired theme color." },
                { title: "Global DC Support", desc: "Perfectly supports all Final Fantasy XIV worlds, including NA, EU, JP, and OCE, along with all jobs." },
                { title: "Fully Responsive", desc: "100% responsive design available instantly on any device with a browser: PC, tablet, or smartphone." }
            ],
            stepTitle: "Quick & Easy Process",
            stepSubtitle: "Complete your profile in just 3 steps.",
            steps: [
                { num: "01", title: "Enter Info", desc: "Fill in basic information like character name, server, and job levels." },
                { num: "02", title: "Design & Decorate", desc: "Upload your best screenshot and express yourself using fonts, colors, and stickers." },
                { num: "03", title: "Save & Share", desc: "Download the high-resolution image and share it with your friends!" }
            ],
            useCaseTitle: "Where can I use it?",
            useCaseDesc: "Pin it as your main tweet on Twitter (X) to introduce yourself, or submit it like a resume in Discord channels for Free Company or Static recruitments.",
            checks: [
                "Secure Client-side image processing",
                "No personal or server data collection",
                "Commercial use strictly prohibited"
            ],
            createBox: "Create Your Card"
        },
        ja: {
            badge: "インストール不要",
            title: "最も美しい冒険者の記録",
            subtitle1: "あなただけのキャラクターを引き立てるプロフィール作成ツールです。",
            subtitle2: "数回のクリックで、TwitterやDiscordでのシェアに最適な名刺を完成させましょう。",
            features: [
                { title: "プレミアムなカスタマイズ", desc: "美しいWebフォントや多彩なステッカーをサポート。お好みのテーマカラーでカードを自由に装飾できます。" },
                { title: "グローバルDC対応", desc: "日本サーバーはもちろん、北米、欧州、オセアニアなどFF14のすべてのワールドとジョブに完全対応。" },
                { title: "全デバイス対応", desc: "PC、タブレット、スマホなど、ブラウザがあればどこからでもすぐに使える100%レスポンシブデザイン。" }
            ],
            stepTitle: "簡単でスピーディな作成",
            stepSubtitle: "たった3ステップでプロフィールが完成します。",
            steps: [
                { num: "01", title: "情報入力", desc: "キャラクター名、サーバー、ジョブレベルなどの基本情報をフォームに入力します。" },
                { num: "02", title: "デザイン装飾", desc: "最高のスクリーンショットをアップロードし、フォントや色、ステッカーで個性を表現します。" },
                { num: "03", title: "保存＆シェア", desc: "高解像度画像をダウンロードして、ハッシュタグと一緒にシェアしましょう！" }
            ],
            useCaseTitle: "どこで使えますか？",
            useCaseDesc: "Twitter(X)の固定ツイートにして訪問者に自分のプレイスタイルを伝えたり、FCや固定メンバー募集のDiscordチャンネルに履歴書として提出してみてください。",
            checks: [
                "安全なブラウザ内(Client-side)画像処理",
                "個人情報やサーバーデータの収集なし",
                "商用利用および転売は固く禁止"
            ],
            createBox: "Create Your Card"
        }
    }[lang];

    return (
        <article className="w-full mt-20 pb-20">
            {/* Divider */}
            <div className="w-full h-px mb-20" style={{ backgroundImage: 'linear-gradient(90deg, transparent, var(--border-medium), transparent)' }} />

            <div className="max-w-5xl mx-auto px-6">
                {/* Hero / Intro */}
                <header className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-sm font-medium" style={{ backgroundColor: 'var(--surface-200)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                        <Sparkles size={14} className="text-blue-500" />
                        <span>{t.badge}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        {t.title}
                    </h2>
                    <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                        {t.subtitle1}<br className="hidden md:block"/>
                        {t.subtitle2}
                    </p>
                </header>

                {/* Features Grid */}
                <section className="grid md:grid-cols-3 gap-6 mb-24">
                    {[
                        { icon: <Palette />, ...t.features[0] },
                        { icon: <Globe />, ...t.features[1] },
                        { icon: <Smartphone />, ...t.features[2] }
                    ].map((feature, idx) => (
                        <div key={idx} className="p-8 rounded-[24px] transition-transform hover:-translate-y-1" style={{ backgroundColor: 'var(--surface-50)', border: '1px solid var(--border-subtle)' }}>
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--surface-200)', color: 'var(--text-primary)' }}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
                        </div>
                    ))}
                </section>

                {/* Step-by-Step */}
                <section className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.stepTitle}</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>{t.stepSubtitle}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop only) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2 -z-10" style={{ backgroundColor: 'var(--border-subtle)' }} />
                        
                        {t.steps.map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center p-6 rounded-[24px]" style={{ backgroundColor: 'var(--surface-100)' }}>
                                <div className="text-4xl font-black mb-4 opacity-20" style={{ color: 'var(--text-primary)' }}>{step.num}</div>
                                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Use Cases */}
                <section className="p-8 md:p-12 rounded-[32px] mb-12 flex flex-col md:flex-row items-center justify-between gap-10" style={{ backgroundColor: 'var(--surface-200)' }}>
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: 'var(--surface-50)', color: 'var(--text-secondary)' }}>
                            <Share2 size={12} /> Use Cases
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{t.useCaseTitle}</h2>
                        <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                            {t.useCaseDesc}
                        </p>
                        <ul className="space-y-3 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                            {t.checks.map((check, idx) => (
                                <li key={idx} className="flex items-center gap-2">✓ {check}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="shrink-0 w-full md:w-[300px] h-[300px] rounded-[24px] flex flex-col items-center justify-center border border-dashed" style={{ borderColor: 'var(--border-medium)', backgroundColor: 'var(--surface-50)' }}>
                        <Download size={48} className="mb-4 opacity-20" style={{ color: 'var(--text-primary)' }} />
                        <span className="font-bold text-sm opacity-50" style={{ color: 'var(--text-primary)' }}>{t.createBox}</span>
                    </div>
                </section>
            </div>
        </article>
    );
}
