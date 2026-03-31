/**
 * Section
 *
 * A composable container that enforces consistent vertical rhythm and label
 * typography for every form section across all four sidebar tabs.
 *
 * All direct children receive a uniform 12px gap via `space-y-3`, matching
 * the design system's base spacing scale. The section label uses the
 * "caption cap" style — 11px, semibold, #86868b, uppercase — mirroring
 * the treatment used in iOS Settings and macOS System Settings.
 */
export function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
    return (
        <section className="space-y-3">
            {/* Section label — intentionally small and subdued to maintain hierarchy */}
            <h3 className="text-[11px] font-semibold text-[#86868b] uppercase tracking-widest">{title}</h3>
            {children}
        </section>
    );
}
