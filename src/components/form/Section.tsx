export function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        /* 개별 폼 섹션 컨테이너 */
        <section className="space-y-3">
            {/* 섹션 제목: Apple 스타일의 미니멀한 캡션 텍스트 */}
            <h3 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest">{title}</h3>
            {children}
        </section>
    );
}
