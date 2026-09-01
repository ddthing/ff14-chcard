import { PageLayout } from '../components/PageLayout';
import { SeoHead } from '../components/SeoHead';
import { usePlayerSelector } from '../contexts/PlayerContext';
import { Bug, Coffee, Mail, MessageCircle } from 'lucide-react';
import { pageMeta } from '../utils/pageMeta';
import { contactContent } from '../utils/contactContent';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCopy } from 'lucide-react';

export function Contact() {
    const lang = usePlayerSelector(snapshot => snapshot.playerInfo.language);
    const meta = pageMeta[lang].contact;
    const [copyStatus, setCopyStatus] = useState('');

    const content = contactContent[lang];

    const copyEnvironment = async () => {
        try {
            await navigator.clipboard.writeText(`URL: ${window.location.href}\nBrowser: ${navigator.userAgent}`);
            setCopyStatus(content.copiedEnvironment);
        } catch {
            setCopyStatus(content.copyFailed);
        }
    };

    return (
        <>
            <SeoHead meta={meta} path="/contact" />
            <PageLayout title={content.title}>
                <article className="space-y-10" itemScope itemType="https://schema.org/ContactPage">
                    <section>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{content.h1}</h2>
                        <p className="leading-relaxed opacity-90">{content.p1}</p>
                    </section>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <section className="p-6 rounded-xl border" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-100)' }}>
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <Mail size={18} aria-hidden="true" /> {content.emailTitle}
                            </h3>
                            <p className="opacity-80 text-sm mb-4">{content.emailDesc}</p>
                            <a href="mailto:coner@luv3r.me" className="font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]" style={{ color: 'var(--foreground)' }}>
                                coner@luv3r.me
                            </a>
                        </section>

                        <section className="p-6 rounded-xl border" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-100)' }}>
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <MessageCircle size={18} aria-hidden="true" /> {content.snsTitle}
                            </h3>
                            <p className="opacity-80 text-sm mb-4">{content.snsDesc}</p>
                            <a href="https://x.com/reconeur" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]" style={{ color: 'var(--foreground)' }}>
                                @reconeur <span className="sr-only">({content.newWindow})</span>
                            </a>
                        </section>

                        <section className="p-6 rounded-xl border md:col-span-2" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-100)' }}>
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <Bug size={18} aria-hidden="true" /> {content.bugTitle}
                            </h3>
                            <p className="opacity-80 text-sm mb-4">{content.bugDesc}</p>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/faq" className="border px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]" style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}>
                                    {content.faqLink}
                                </Link>
                                <button type="button" onClick={copyEnvironment} className="inline-flex items-center gap-2 border px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]" style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}>
                                    <ClipboardCopy size={15} aria-hidden="true" /> {content.copyEnvironment}
                                </button>
                            </div>
                            {copyStatus && <p role="status" aria-live="polite" className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{copyStatus}</p>}
                            <div className="pt-2 border-t mt-4" style={{ borderColor: 'var(--border-subtle)' }}>
                                <a href="https://ko-fi.com/reconeur" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-2 font-medium hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-medium)]">
                                    <Coffee size={16} aria-hidden="true" /> {content.sponsor} <span className="sr-only">({content.newWindow})</span>
                                </a>
                            </div>
                        </section>
                    </div>
                </article>
            </PageLayout>
        </>
    );
}
