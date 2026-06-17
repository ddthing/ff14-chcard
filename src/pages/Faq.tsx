import { PageLayout } from '../components/PageLayout';
import { usePlayer } from '../contexts/PlayerContext';
import { Helmet } from 'react-helmet-async';

export function Faq() {
    const { playerInfo } = usePlayer();
    const lang = playerInfo.language;

    const faqs = [
        {
            q: "이미지 저장이 안 되거나 오류가 발생합니다.",
            a: "모바일 환경의 인앱 브라우저(카카오톡, 트위터 앱 등)에서는 보안 정책으로 인해 다운로드가 차단될 수 있습니다. 가능하면 외부 브라우저(Chrome, Safari, Edge 등)로 열어주세요. 데스크탑의 경우 팝업 차단이 활성화되어 있다면 해제하시고, 브라우저가 최신 버전인지 확인해 주시기 바랍니다."
        },
        {
            q: "업로드한 캐릭터 스크린샷과 개인정보가 서버에 저장되나요?",
            a: "전혀 저장되지 않습니다. 본 생성기는 모든 이미지 처리와 데이터 입력을 사용자 브라우저 내부(Client-side)에서만 수행합니다. 외부 서버로 어떠한 개인 정보나 스크린샷 원본을 전송하지 않으므로 안심하고 사용하셔도 됩니다."
        },
        {
            q: "글로벌 서버(북미, 유럽, 일본, 오세아니아) 유저도 사용할 수 있나요?",
            a: "네, 완벽하게 지원합니다. 한국 서버뿐만 아니라 파이널 판타지 14 글로벌 클라이언트의 모든 데이터센터 및 월드를 선택할 수 있으며, 영문 및 일어 인터페이스도 기본 제공합니다."
        },
        {
            q: "스마트폰이나 태블릿에서도 카드를 만들 수 있나요?",
            a: "반응형 웹 디자인이 적용되어 있어 모바일 환경에서도 캐릭터 카드를 만들 수 있습니다. 다만, 세밀한 스크린샷 크롭 및 스티커 배치를 원하신다면 화면이 넓은 PC 환경에서의 사용을 권장합니다."
        },
        {
            q: "캐릭터 로드스톤(공식 홈페이지) API 연동은 지원하지 않나요?",
            a: "지원하지 않습니다. 공식 데이터에 얽매이지 않고 유저가 원하는 특정 시점(과거 룩, 특정 직업 만렙 콘셉트 등)으로 자유롭게 카드를 꾸밀 수 있도록 수동 입력 방식을 채택했습니다. 이는 데이터 수집을 방지하고 프라이버시를 지키기 위한 목적도 있습니다."
        },
        {
            q: "추가하고 싶은 무료 폰트가 있는데 건의할 수 있나요?",
            a: "네, 상업적 이용이 가능한 오픈 라이선스(OFL) 폰트에 한해 폰트 추가를 적극 검토하고 있습니다. 하단의 Contact 페이지나 개발자의 SNS/이메일을 통해 원하는 폰트의 이름과 다운로드 링크를 남겨주세요."
        },
        {
            q: "생성한 카드를 인쇄해서 굿즈나 명함으로 만들어도 되나요?",
            a: "개인 소장 목적이거나 지인들과 소량 나눔하는 용도로는 괜찮습니다. 하지만 다운로드한 카드 이미지를 판매하여 영리적 이익을 취하는 것은 파이널 판타지 14 2차 창작 가이드라인에 위배되므로 엄격히 금지됩니다."
        },
        {
            q: "맥(Mac) 환경에서 사파리로 한글 입력 시 글자가 분리됩니다.",
            a: "Mac OS의 Safari 브라우저에서 간혹 발생하는 한글 자소 분리 현상입니다. 이 경우 크롬(Chrome)이나 파이어폭스(Firefox) 같은 타 브라우저를 이용하시면 원활하게 텍스트를 입력하실 수 있습니다."
        },
        {
            q: "스크린샷의 배경을 투명하게 지우고 싶습니다. (누끼 따기)",
            a: "현재 웹사이트 내에 배경 제거 AI 기능은 탑재되어 있지 않습니다. 인게임 /gpose 기능에서 단색 스크린(크로마키)을 활용해 스크린샷을 찍은 뒤, 외부 무료 툴을 이용해 배경이 지워진 PNG 이미지를 업로드하시는 것을 추천합니다."
        },
        {
            q: "배치한 스티커의 위치나 크기를 어떻게 조절하나요?",
            a: "추가된 스티커를 클릭하면 모서리에 조절 핸들이 활성화됩니다. 이 핸들을 드래그하여 직관적으로 크기를 키우거나 회전시킬 수 있습니다. 삭제를 원하시면 우측 상단의 'X' 버튼이나 키보드의 Delete 키를 누르면 됩니다."
        },
        {
            q: "플레이스타일 태그를 제가 직접 타이핑해서 넣을 순 없나요?",
            a: "현재 디자인의 일관성을 위해 사전에 엄선된 태그 목록 안에서만 선택이 가능합니다. 태그로 표현하기 어려운 나만의 개성이나 특정 목적은 하단의 200자 '자기소개(코멘트)' 영역을 적극적으로 활용해 주세요."
        },
        {
            q: "포인트 컬러에 원하는 색상 코드를 직접 입력할 수 있나요?",
            a: "가능합니다. 색상 선택 도구를 열어 HEX 코드(예: #FF5733)를 직접 입력하시면 정확히 원하는 컬러로 테마를 지정할 수 있습니다. 캐릭터의 머리색이나 의상 색상과 맞추면 예쁜 결과물을 얻을 수 있습니다."
        },
        {
            q: "나중에 다시 접속하면 이전에 입력한 내용이 남아있나요?",
            a: "로컬 스토리지에 일부 설정을 저장하는 기능이 있으나 브라우저 캐시나 쿠키를 삭제하면 데이터가 초기화됩니다. 안전하게 정보를 보존하고 싶다면 완성된 이미지를 반드시 다운로드해 보관해 주세요."
        },
        {
            q: "다운로드한 이미지 화질이 조금 깨져 보입니다.",
            a: "기본적으로 웹 공유(트위터 등)에 최적화된 고화질 해상도(x2 Pixel Ratio)로 렌더링됩니다. 다만 업로드하신 원본 스크린샷의 해상도가 낮거나 너무 크게 확대한 경우 이미지가 픽셀화되어 보일 수 있습니다. 고화질 스크린샷 사용을 권장합니다."
        },
        {
            q: "이전에 있던 '새싹' 및 '멘토' 아이콘은 어떻게 적용하나요?",
            a: "기본 정보 입력 탭에서 플레이어 상태(새싹/멘토) 옵션을 활성화하시면 카드 내 닉네임 옆에 공식 아이콘과 유사한 마크가 표시됩니다. 본인의 현재 게임 내 스테이터스와 일치하게 설정해 보세요."
        },
        {
            q: "광고(AdSense)가 표시되는데, 서비스가 유료화 되나요?",
            a: "이 서비스는 100% 무료로 유지됩니다. 페이지에 노출되는 배너 광고는 지속적인 서버 트래픽 유지비 및 도메인 유지보수 비용을 충당하기 위한 최소한의 수단이며, 향후에도 핵심 기능을 유료화할 계획은 없습니다."
        },
        {
            q: "카드를 세로형 레이아웃으로 만들었는데 가로형으로 바꿀 수 있나요?",
            a: "네, 상단의 '레이아웃' 탭에서 가로형(Horizontal)과 세로형(Portrait)을 언제든지 실시간으로 전환할 수 있습니다. 단, 레이아웃 변경 시 스크린샷 크롭 위치가 다소 어긋날 수 있으니 재조정이 필요할 수 있습니다."
        },
        {
            q: "사이트의 업데이트 내역이나 패치 노트는 어디서 봅니까?",
            a: "화면 우측 하단이나 네비게이션에 위치한 버전 배지(예: v1.X.X)를 클릭하시면 최근 기능 추가 사항 및 버그 수정 내역을 상세히 확인할 수 있는 모달 창이 열립니다."
        },
        {
            q: "이 서비스는 스퀘어 에닉스와 관련이 있나요?",
            a: "아닙니다. 파이널 판타지 14를 사랑하는 유저가 개인적으로 제작한 비공식(Unofficial) 팬 프로젝트입니다. 스퀘어 에닉스나 액토즈소프트로부터 어떠한 금전적 후원도 받지 않았으며 공식적인 연관이 없습니다."
        },
        {
            q: "만들어진 카드를 영어로 저장하고 싶습니다.",
            a: "우측 상단의 언어 선택기(글로브 아이콘)를 클릭하여 'English'로 변경해 주세요. UI뿐만 아니라 카드 이미지에 렌더링되는 모든 항목(Job, Server, Playstyle 등)이 영문으로 변경되어 렌더링됩니다."
        }
    ];

    // FAQ Schema 생성
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    };

    return (
        <>
            <Helmet>
                <title>자주 묻는 질문(FAQ) - FF14 캐릭터 카드 생성기</title>
                <meta name="description" content="파이널 판타지 14 캐릭터 카드 생성기 사용 중 궁금한 점이나 오류 해결 방법을 확인하세요." />
                <link rel="canonical" href="https://ff14-chcard.pages.dev/faq" />
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </Helmet>
            <PageLayout title={lang === 'ko' ? "자주 묻는 질문 (FAQ)" : lang === 'ja' ? "よくある質問 (FAQ)" : "Frequently Asked Questions"}>

            <article className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
                <div className="mb-10 text-[15px] opacity-80 leading-relaxed">
                    {lang === 'ko' 
                        ? "FF14 캐릭터 카드 생성기 사용 시 유저분들이 주로 문의하시는 내용들을 정리했습니다. 원하는 답변을 찾지 못하셨다면 Contact 페이지를 통해 직접 문의해 주세요." 
                        : "Here are the most frequently asked questions about using the FF14 Character Card Generator."}
                </div>

                <div className="grid gap-4">
                    {faqs.map((faq, idx) => (
                        <details 
                            key={idx} 
                            className="group p-5 rounded-xl border transition-all duration-200" 
                            style={{ 
                                borderColor: 'var(--border-subtle)', 
                                backgroundColor: 'var(--surface-100)' 
                            }}
                            itemScope 
                            itemProp="mainEntity" 
                            itemType="https://schema.org/Question"
                        >
                            <summary 
                                className="font-bold text-[16px] cursor-pointer list-none flex justify-between items-center outline-none" 
                                style={{ color: 'var(--text-primary)' }}
                                itemProp="name"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-blue-500 font-black">Q.</span>
                                    <span>{faq.q}</span>
                                </div>
                                <span className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180 opacity-50">
                                    ▼
                                </span>
                            </summary>
                            <div 
                                className="mt-4 pl-8 text-[15px] leading-relaxed opacity-90 border-t pt-4" 
                                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                                itemScope 
                                itemProp="acceptedAnswer" 
                                itemType="https://schema.org/Answer"
                            >
                                <span itemProp="text">{faq.a}</span>
                            </div>
                        </details>
                    ))}
                </div>
            </article>
            </PageLayout>
        </>
    );
}
