import { useEffect, useRef } from 'react';

/**
 * AdBanner Component
 *
 * Google AdSense 광고를 렌더링하는 컴포넌트.
 * variant prop으로 사이드바용 / 와이드 레이아웃용을 구분합니다.
 *
 * 실제 AdSense 연동 시:
 * 1. data-ad-client, data-ad-slot 값을 교체하세요.
 * 2. <script> 태그를 index.html <head>에 추가하세요:
 *    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
 */

interface AdBannerProps {
    /** 'sidebar' = 사이드바 내 세로형 광고 | 'wide' = 하단 가로형 광고 */
    variant?: 'sidebar' | 'wide';
    /** 광고 슬롯 ID (AdSense에서 발급) */
    adSlot?: string;
    /** AdSense 클라이언트 ID */
    adClient?: string;
    className?: string;
}

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

export function AdBanner({
    variant = 'sidebar',
    adSlot = 'XXXXXXXXXX',
    adClient = 'ca-pub-XXXXXXXXXXXXXXXX',
    className = '',
}: AdBannerProps) {
    const adRef = useRef<HTMLModElement>(null);
    const initialized = useRef(false);

    // AdSense 초기화 (중복 push 방지)
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        try {
            if (typeof window !== 'undefined') {
                window.adsbygoogle = window.adsbygoogle || [];
                window.adsbygoogle.push({});
            }
        } catch {
            // AdSense 스크립트가 로드되지 않은 개발 환경에서 무시
        }
    }, []);

    const isSidebar = variant === 'sidebar';

    return (
        <div
            className={`ad-banner-wrapper ${isSidebar ? 'ad-sidebar' : 'ad-wide'} ${className}`}
            aria-label="광고"
        >
            {/* 광고 레이블 — 작고 눈에 덜 띄게 */}
            <p className="ad-label">광고</p>

            {/* 
              실제 AdSense 연동 시 아래 <ins> 태그의 data-ad-client와 data-ad-slot을 교체하세요.
              현재는 개발용 플레이스홀더 UI가 표시됩니다.
            */}
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-ad-format={isSidebar ? 'auto' : 'horizontal'}
                data-full-width-responsive="true"
            />

            {/* 
              개발 환경 플레이스홀더: AdSense 스크립트가 없을 때 표시됩니다.
              프로덕션에서는 AdSense가 이 영역을 채웁니다.
            */}
            {import.meta.env.DEV && (
                <div className="ad-placeholder">
                    <span className="ad-placeholder-text">
                        {isSidebar ? 'AdSense 300×250' : 'AdSense 728×90'}
                    </span>
                </div>
            )}
        </div>
    );
}
