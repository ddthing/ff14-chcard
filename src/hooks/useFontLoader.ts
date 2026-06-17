import { useEffect } from 'react';

/**
 * Dictionary of all heavy web fonts.
 * By removing these from the global CSS and injecting them only when selected,
 * we prevent any possibility of accidental preloading and significantly improve LCP.
 */
export const FONT_FACES: Record<string, string> = {
    'font-a2z': `
        @font-face { font-family: 'A2z'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/에이투지체-4Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
        @font-face { font-family: 'A2z'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/에이투지체-7Bold.woff2') format('woff2'); font-weight: 700; font-display: swap; }
    `,
    'font-mona': `
        @font-face { font-family: 'Mona12'; src: url('https://cdn.jsdelivr.net/gh/MonadABXY/mona-font/web/Mona12.woff2') format('woff2'); font-weight: 400; font-display: swap; }
        @font-face { font-family: 'Mona12'; src: url('https://cdn.jsdelivr.net/gh/MonadABXY/mona-font/web/Mona12-Bold.woff2') format('woff2'); font-weight: 700; font-display: swap; }
    `,
    'font-galmuri9': `
        @font-face { font-family: 'Galmuri9'; src: url('https://cdn.jsdelivr.net/npm/galmuri@latest/dist/Galmuri9.woff2') format('woff2'); font-weight: 400; font-display: swap; }
    `,
    'font-gmarket': `
        @font-face { font-family: 'GMarketSans'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff'); font-weight: 500; font-display: swap; }
        @font-face { font-family: 'GMarketSans'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansBold.woff') format('woff'); font-weight: 700; font-display: swap; }
    `,
    'font-police': `
        @font-face { font-family: 'NostalgicPoliceFairness'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/Griun_PolFairness-Rg.woff2') format('woff2'); font-weight: normal; font-display: swap; }
    `,
    'font-myungjo': `
        @font-face { font-family: 'BookkMyungjo'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302@1.0/BookkMyungjo-Lt.woff2') format('woff2'); font-weight: 400; font-display: swap; }
        @font-face { font-family: 'BookkMyungjo'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302@1.0/BookkMyungjo-Bd.woff2') format('woff2'); font-weight: 700; font-display: swap; }
    `,
    'font-seabreeze': `
        @font-face { font-family: 'OngleIpSeaBreeze'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2510-1@1.0/Ownglyph_the_sea_breeze-Rg.woff2') format('woff2'); font-weight: normal; font-display: swap; }
    `,
    'font-schoolsafe': `
        @font-face { font-family: 'SchoolSafeOuting'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-5@1.0/HakgyoansimNadeuriTTF-L.woff2') format('woff2'); font-weight: 400; font-display: swap; }
        @font-face { font-family: 'SchoolSafeOuting'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-5@1.0/HakgyoansimNadeuriTTF-B.woff2') format('woff2'); font-weight: 700; font-display: swap; }
    `,
    'font-hancom': `
        @font-face { font-family: 'HancomMalrangmalrang'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2406-1@1.0/HancomMalangMalang-Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
        @font-face { font-family: 'HancomMalrangmalrang'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2406-1@1.0/HancomMalangMalang-Bold.woff2') format('woff2'); font-weight: 700; font-display: swap; }
    `,
    'font-tangba': `
        @font-face { font-family: 'Tangba'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-4@1.1/Tangba12.woff2') format('woff2'); font-weight: normal; font-display: swap; }
    `,
    'font-puradak': `
        @font-face { font-family: 'PuradakGentleGothic'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.1/PuradakGentleGothicR.woff2') format('woff2'); font-weight: normal; font-display: swap; }
    `,
    'font-paperozi': `
        @font-face { font-family: 'Paperozi'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-4Regular.woff2') format('woff2'); font-weight: 400; font-display: swap; }
        @font-face { font-family: 'Paperozi'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-7Bold.woff2') format('woff2'); font-weight: 700; font-display: swap; }
    `,
    'font-tmoney': `
        @font-face { font-family: 'TMoneyDungunbaram'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-07@1.0/TmoneyRoundWindRegular.woff') format('woff'); font-weight: normal; font-display: swap; }
        @font-face { font-family: 'TMoneyDungunbaram'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-07@1.0/TmoneyRoundWindExtraBold.woff') format('woff'); font-weight: 800; font-display: swap; }
    `,
    'font-cafe24': `
        @font-face { font-family: 'Cafe24SuperMagic'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2307-2@1.0/Cafe24Supermagic-Regular-v1.0.woff2') format('woff2'); font-weight: 400; font-display: swap; }
        @font-face { font-family: 'Cafe24SuperMagic'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2307-2@1.0/Cafe24Supermagic-Bold-v1.0.woff2') format('woff2'); font-weight: 700; font-display: swap; }
    `,
    'font-gangwon': `
        @font-face { font-family: 'GangwonEducationModuche'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/GangwonEdu_OTFLightA.woff') format('woff'); font-weight: 300; font-display: swap; }
        @font-face { font-family: 'GangwonEducationModuche'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2201-2@1.0/GangwonEdu_OTFBoldA.woff') format('woff'); font-weight: 700; font-display: swap; }
    `,
    'font-cookierun': `
        @font-face { font-family: 'CookieRun'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/CookieRun-Regular.woff') format('woff'); font-weight: normal; font-display: swap; }
        @font-face { font-family: 'CookieRun'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.0/CookieRunOTF-Bold00.woff') format('woff'); font-weight: 700; font-display: swap; }
    `,
    'font-seogung': `
        @font-face { font-family: 'Seogung'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-4@1.1/Suhgung12.woff2') format('woff2'); font-weight: normal; font-display: swap; }
    `,
    'font-cloudsanscode': `
        @font-face { font-family: 'CloudSansCode'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2408@1.0/goorm-sans-code.woff2') format('woff2'); font-weight: normal; font-display: swap; }
    `,
};

export function useFontLoader(fontId: string) {
    useEffect(() => {
        if (!fontId || fontId === 'font-pretendard') return;
        
        const styleId = `dynamic-font-${fontId}`;
        
        // Prevent injecting the same font multiple times
        if (document.getElementById(styleId)) return;

        const fontCss = FONT_FACES[fontId];
        if (fontCss) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = fontCss;
            document.head.appendChild(style);
        }
    }, [fontId]);
}
