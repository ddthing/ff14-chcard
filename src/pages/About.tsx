import { PageLayout } from '../components/PageLayout';
import { usePlayerSelector } from '../contexts/PlayerContext';
import { SEOContent } from '../components/SEOContent';
import { Helmet } from 'react-helmet-async';
import { pageMeta } from '../utils/pageMeta';

export function About() {
    const lang = usePlayerSelector(snapshot => snapshot.playerInfo.language);
    const meta = pageMeta[lang].about;

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
            h4: "이용 범위",
            p3: "본 서비스는 100% 무료로 제공되며, 생성된 카드는 비상업적인 용도 내에서 자유롭게 사용할 수 있습니다. 카드 제작에 필요한 이미지 처리와 프로필 편집은 사용자의 브라우저 안에서 이루어집니다. 에오르제아에서의 소중한 모험을 한 장의 카드로 기록해 보세요."
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
            h4: "Usage",
            p3: "This service is 100% free, and generated cards may be used for non-commercial purposes. Image processing and profile editing happen in your browser. Keep a memorable Eorzean adventure as a single profile card."
        },
        ja: {
            title: "紹介",
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
            h4: "ご利用について",
            p3: "本サービスは完全無料で提供され、作成したカードは非商用の範囲で自由に利用できます。画像処理とプロフィール編集はブラウザ内で行われます。エオルゼアでの大切な冒険を一枚のカードに記録してください。"
        }
    }[lang];

    return (
        <>
            <Helmet>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />
                <link rel="canonical" href="https://ff14-chcard.pages.dev/about" />
            </Helmet>
            <PageLayout title={content.title}>
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
                        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{content.h4}</h2>
                        <p className="leading-relaxed opacity-90">{content.p3}</p>
                    </section>
                </article>
                <SEOContent />
            </PageLayout>
        </>
    );
}
