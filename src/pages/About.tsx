import { PageLayout } from '../components/PageLayout';
import { usePlayer } from '../contexts/PlayerContext';
import { Helmet } from 'react-helmet-async';

export function About() {
    const { playerInfo } = usePlayer();
    const lang = playerInfo.language;

    const content = {
        ko: {
            title: "소개 (About)",
            h1: "FF14 캐릭터 카드 생성기에 대하여",
            p1: "FF14 캐릭터 카드 생성기는 파이널 판타지 14(Final Fantasy XIV) 모험가 여러분이 자신만의 고유한 게임 내 캐릭터를 아름다운 명함 형태로 제작하고 공유할 수 있도록 돕기 위해 만들어진 비영리 목적의 팬 프로젝트입니다. 에오르제아에서의 소중한 추억을 한 장의 이미지로 기록해보세요.",
            h2: "개발 동기 및 목표",
            p2: "에오르제아에는 하드코어 절 레이드를 달리는 유저, 하우징에 진심인 유저, 멋진 스크린샷(Gpose)을 찍는 것을 즐기는 룩덕 유저 등 다양한 성향의 모험가들이 존재합니다. 과거에는 이런 자신의 성향을 예쁘게 표현하려면 포토샵 같은 전문 디자인 프로그램과 복잡한 템플릿이 필요했습니다. 저희는 누구나 웹 브라우저에서 클릭 몇 번만으로 전문 디자이너가 만든 것 같은 고품질의 카드를 만들 수 있는 접근성 높은 도구를 제공하는 것을 목표로 합니다.",
            h3: "주요 특징 및 기술적 차별점",
            features: [
                "100% Client-side 처리: 서버로 스크린샷이나 텍스트 데이터를 전송하지 않아 개인정보 유출 위험이 원천 차단됩니다.",
                "트위터, 디스코드 등 소셜 미디어 알고리즘에 최적화된 고화질 해상도 이미지 렌더링",
                "한국어, 영어, 일본어 3개 국어 UI 지원 및 전 세계 모든 글로벌 데이터센터 완벽 대응",
                "프리텐다드, 쿠키런 등 14종 이상의 엄선된 웹 폰트와 감성적인 스티커를 활용한 무한한 커스터마이징"
            ],
            h4: "커뮤니티와 함께 성장합니다",
            p3: "본 서비스는 100% 무료로 제공되며, 생성된 카드는 비상업적인 용도 내에서 자유롭게 사용할 수 있습니다. 초기 버전 출시 이후, 유저 여러분들이 트위터와 디스코드에서 보내주신 소중한 피드백(새로운 폰트 추가 요청, 스티커 기능 아이디어 등)을 바탕으로 시스템이 지속적으로 진화하고 있습니다. 앞으로도 에오르제아에서의 여러분의 모험이 이 카드를 통해 더욱 풍성해지고, 새로운 인연을 만나는 훌륭한 매개체가 되기를 진심으로 바랍니다."
        },
        en: {
            title: "About Us",
            h1: "About FF14 Character Card Generator",
            p1: "The FF14 Character Card Generator is a non-profit fan project created to help Final Fantasy XIV adventurers easily design and share their unique in-game characters in the form of a beautiful profile card.",
            h2: "Our Goal",
            p2: "There are countless adventurers in Eorzea, each with their own playstyle. We aim to provide a tool where anyone can express their identity quickly and easily directly in their web browser, without needing any design skills or heavy image editing software.",
            h3: "Key Features",
            features: [
                "Secure client-side image processing with no personal data collection",
                "High-resolution exports optimized for social media like Twitter and Discord",
                "Multilingual support and compatibility with all global data centers",
                "Infinite customization using web fonts and stickers"
            ],
            p3: "This service is 100% free and is continuously improved based on user feedback. We hope your adventures in Eorzea become even more enriching through this tool."
        },
        ja: {
            title: "About",
            h1: "FF14キャラクターカードジェネレーターについて",
            p1: "FF14キャラクターカードジェネレーターは、ファイナルファンタジーXIVの冒険者たちが自分だけのキャラクターを美しいプロフィールカードとして簡単に作成・共有できるように作られた、非営利のファンプロジェクトです。",
            h2: "私たちの目標",
            p2: "エオルゼアには様々なプレイスタイルを持つ冒険者がいます。私たちは、デザインスキルや重い画像編集ソフトがなくても、ブラウザ上で誰でも簡単に自分の個性を表現できるツールを提供することを目指しています。",
            h3: "主な特徴",
            features: [
                "個人情報を収集しない安全なブラウザ内(Client-side)画像処理",
                "TwitterやDiscordなどのSNSに最適化された高解像度出力",
                "多言語対応およびグローバルデータセンター対応",
                "Webフォントやステッカーを活用した無限のカスタマイズ"
            ],
            p3: "本サービスは完全無料で提供されており、ユーザーの皆様からのフィードバックをもとに継続的に改善されています。皆様のエオルゼアでの冒険がさらに豊かなものになることを願っています。"
        }
    }[lang];

    return (
        <>
            <Helmet>
                <title>소개 - FF14 캐릭터 카드 생성기</title>
                <meta name="description" content="파이널 판타지 14 캐릭터 카드 생성기에 대한 소개 및 개발 목적을 안내합니다." />
                <link rel="canonical" href="https://ff14-chcard.pages.dev/about" />
            </Helmet>
            <PageLayout title="About">
                <article className="space-y-8" itemScope itemType="https://schema.org/AboutPage">
                    <section>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{content.h1}</h2>
                        <p className="leading-relaxed opacity-90">{content.p1}</p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{content.h2}</h2>
                        <p className="leading-relaxed opacity-90">{content.p2}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{content.h3}</h2>
                        <ul className="list-disc list-inside space-y-2 opacity-90 ml-2">
                            {content.features.map((feature, i) => (
                                <li key={i}>{feature}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{content.h4 || "Community & Future"}</h2>
                        <p className="leading-relaxed opacity-90">{content.p3}</p>
                    </section>
                </article>
            </PageLayout>
        </>
    );
}
