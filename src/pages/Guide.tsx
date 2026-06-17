import { PageLayout } from '../components/PageLayout';
import { usePlayer } from '../contexts/PlayerContext';
import { Camera, Type, Wand2, Share2, Sparkles, Palette } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function Guide() {
    const { playerInfo } = usePlayer();
    const lang = playerInfo.language;

    return (
        <>
            <Helmet>
                <title>FF14 캐릭터 카드 생성기 - 가이드 및 팁</title>
                <meta name="description" content="파이널 판타지 14 캐릭터 카드 생성기를 100% 활용하는 방법을 안내합니다. 스크린샷 보정부터 예쁜 폰트 추천까지 가이드를 확인하세요." />
                <link rel="canonical" href="https://ff14-chcard.pages.dev/guide" />
            </Helmet>
            <PageLayout title={lang === 'ko' ? "사용 가이드 및 팁" : lang === 'ja' ? "ガイドとヒント" : "Guides & Tips"}>
                <div className="space-y-16 pb-12">
                
                {/* Intro Section */}
                <section className="text-center space-y-4 mb-12">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        {lang === 'ko' ? "캐릭터 카드 100% 활용 가이드" : lang === 'ja' ? "キャラクターカード100%活用ガイド" : "100% Utilization Guide"}
                    </h1>
                    <p className="text-lg opacity-80 max-w-2xl mx-auto leading-relaxed">
                        {lang === 'ko' 
                            ? "더 멋지고 개성 있는 파이널 판타지 14 프로필을 만들기 위한 심층 가이드입니다. 스크린샷 보정부터 레이아웃 설정까지 모든 팁을 확인해 보세요."
                            : "A deep guide to creating a more wonderful and unique Final Fantasy XIV profile. Check out all the tips from screenshot retouching to layout settings."}
                    </p>
                </section>

                {/* Article 1 */}
                <article className="rounded-3xl p-8 md:p-12" style={{ backgroundColor: 'var(--surface-50)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-2xl" style={{ backgroundColor: 'var(--surface-200)', color: 'var(--text-primary)' }}>
                            <Camera size={24} />
                        </div>
                        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            1. 완벽한 스크린샷을 찍는 Gpose(단체 자세) 팁
                        </h2>
                    </div>
                    
                    <div className="space-y-6 text-base leading-loose" style={{ color: 'var(--text-secondary)' }}>
                        <p>
                            캐릭터 카드의 완성도를 결정하는 가장 중요한 요소는 바로 <strong>'스크린샷의 퀄리티'</strong>입니다. 파이널 판타지 14의 인게임 기능인 단체 자세(`/gpose`)를 활용하면 외부 보정 프로그램 없이도 훌륭한 결과물을 얻을 수 있습니다.
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--surface-100)' }}>
                                <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                    <Sparkles size={18} className="text-yellow-500" /> 조명(Lighting) 설정
                                </h3>
                                <p className="text-sm opacity-90">
                                    캐릭터의 얼굴이 그늘지지 않도록 <strong>조명 1번</strong>을 캐릭터 정면(카메라 위치)에 배치하세요. 조명의 강도를 3단계로 맞추고, 색상을 살짝 웜톤(주황빛)이나 쿨톤(푸른빛)으로 조절하면 피부 질감이 훨씬 부드러워 보입니다. 림라이트(백라이트)로 조명 2번을 캐릭터 뒤통수 쪽에 약하게 주면 입체감이 살아납니다.
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--surface-100)' }}>
                                <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                    <Sparkles size={18} className="text-yellow-500" /> 시야각과 피사계 심도(DoF)
                                </h3>
                                <p className="text-sm opacity-90">
                                    화면의 화각을 좁히면(줌 인) 캐릭터의 이목구비 왜곡이 줄어들어 증명사진처럼 예쁘게 나옵니다. 또한 <strong>수동 피사계 심도</strong>를 활성화하여 조리개 값을 낮추면 배경이 아웃포커싱(흐림 처리)되어 캐릭터가 더욱 돋보이는 효과를 줄 수 있습니다.
                                </p>
                            </div>
                        </div>

                        <p className="mt-4 p-4 rounded-xl text-sm" style={{ backgroundColor: 'var(--surface-200)', borderLeft: '4px solid var(--text-primary)' }}>
                            <strong>💡 꿀팁:</strong> 크로마키(단색 배경) 하우징 스튜디오를 방문하여 스크린샷을 찍고 배경을 투명하게 지운(누끼) 이미지를 업로드하면, 카드 생성기의 배경색과 완벽하게 어우러집니다.
                        </p>
                    </div>
                </article>

                {/* Article 2 */}
                <article className="rounded-3xl p-8 md:p-12" style={{ backgroundColor: 'var(--surface-50)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-2xl" style={{ backgroundColor: 'var(--surface-200)', color: 'var(--text-primary)' }}>
                            <Wand2 size={24} />
                        </div>
                        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            2. 폰트와 컬러로 완성하는 나만의 디자인
                        </h2>
                    </div>
                    
                    <div className="space-y-6 text-base leading-loose" style={{ color: 'var(--text-secondary)' }}>
                        <p>
                            스크린샷이 준비되었다면, 다음은 텍스트와 색상을 통해 <strong>캐릭터의 분위기(Vibe)</strong>를 표현할 차례입니다. 우리 생성기는 한국어 환경에 최적화된 14종의 고품질 웹폰트를 기본 제공합니다.
                        </p>

                        <ul className="list-none space-y-4 ml-0 pl-0">
                            <li className="flex items-start gap-4">
                                <div className="mt-1 p-1.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <Type size={16} />
                                </div>
                                <div>
                                    <strong className="block text-lg mb-1" style={{ color: 'var(--text-primary)' }}>폰트 선택 가이드</strong>
                                    강인한 전사나 다크 판타지 컨셉이라면 진지한 <strong>'부크크 명조'</strong>나 <strong>'서궁'</strong> 체를 추천합니다. 귀엽고 캐주얼한 라라펠 유저라면 <strong>'온글잎 바닷바람'</strong>, <strong>'쿠키런'</strong> 폰트가 잘 어울립니다. 모던하고 깔끔한 느낌을 원한다면 <strong>'프리텐다드'</strong>가 언제나 정답입니다.
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="mt-1 p-1.5 rounded bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">
                                    <Palette size={16} />
                                </div>
                                <div>
                                    <strong className="block text-lg mb-1" style={{ color: 'var(--text-primary)' }}>테마 컬러 픽(Color Pick)</strong>
                                    컬러는 캐릭터의 눈동자 색이나 머리색, 또는 입고 있는 룩(의상)의 메인 컬러에서 스포이드로 추출한 색상을 테마 컬러로 지정하는 것이 가장 자연스럽고 세련되어 보입니다. 보색을 사용하면 너무 튀어 보일 수 있으니 주의하세요.
                                </div>
                            </li>
                        </ul>
                    </div>
                </article>

                {/* Article 3 */}
                <article className="rounded-3xl p-8 md:p-12" style={{ backgroundColor: 'var(--surface-50)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-2xl" style={{ backgroundColor: 'var(--surface-200)', color: 'var(--text-primary)' }}>
                            <Share2 size={24} />
                        </div>
                        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            3. 카드를 디스코드와 트위터에 200% 활용하기
                        </h2>
                    </div>
                    
                    <div className="space-y-6 text-base leading-loose" style={{ color: 'var(--text-secondary)' }}>
                        <p>
                            정성스럽게 만든 카드를 저장했다면 이제 사람들과 공유할 시간입니다! 파이널 판타지 14 커뮤니티는 카드 프로필을 교환하는 문화가 매우 발달해 있습니다.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 mt-6">
                            <div>
                                <h3 className="text-xl font-bold mb-3 border-b pb-2" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}>
                                    트위터(X) 트친소 메인 트윗
                                </h3>
                                <p className="opacity-90">
                                    트위터에서 <code>#파판14_트친소</code>, <code>#FF14_트친소</code> 해시태그를 검색하면 많은 분들이 카드를 올리고 있습니다. 본인의 카드를 첨부하고 "RT/마음 남겨주시면 찾아가요!" 라는 문구와 함께 트윗을 작성하세요. 그리고 해당 트윗을 프로필의 <strong>'메인 트윗으로 고정'</strong>해두면 당신을 처음 방문하는 사람들이 당신의 주직업과 성향을 한눈에 파악할 수 있습니다.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3 border-b pb-2" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}>
                                    디스코드 자유부대/공대 구인구직
                                </h3>
                                <p className="opacity-90">
                                    새로운 자유부대(길드)에 가입하거나 절/영식 레이드를 위한 고정 파티(공대)를 구할 때, 구구절절 텍스트로 적는 것보다 <strong>카드 한 장을 이력서처럼 첨부</strong>하는 것이 훨씬 직관적입니다. 플레이스타일 태그에 '하드코어', '레이드' 등을 표기하고 레벨링 현황을 보여주면 훌륭한 자기소개서가 됩니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </article>

            </div>
        </PageLayout>
        </>
    );
}
