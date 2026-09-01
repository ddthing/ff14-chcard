import { renderToStaticMarkup } from 'react-dom/server';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { StaticApp } from './StaticApp';

export interface StaticRenderResult {
    body: string;
    head: string;
}

export function render(url: string): StaticRenderResult {
    const helmetContext: { helmet?: HelmetServerState | null } = {};
    const rendered = renderToStaticMarkup(
        <HelmetProvider context={helmetContext}>
            <StaticApp url={url} />
        </HelmetProvider>,
    );

    if (helmetContext.helmet) {
        const { helmet } = helmetContext;
        const head = [helmet.title.toString(), helmet.meta.toString(), helmet.link.toString(), helmet.script.toString()]
            .filter(Boolean)
            .join('\n  ');

        return { body: rendered, head };
    }

    // React 19 renders Helmet tags as metadata elements during SSR instead of
    // populating HelmetProvider's legacy server context. Move those elements
    // into <head> before the prerender script injects the page body.
    const metadataPattern = /<title>[\s\S]*?<\/title>|<meta\b(?=[^>]*(?:name="description"|property="og:|name="twitter:))[^>]*\/?\s*>|<link\b(?=[^>]*rel="canonical")[^>]*\/?\s*>|<script\b(?=[^>]*type="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/gi;
    const metadata = rendered.match(metadataPattern) ?? [];

    if (metadata.length === 0) {
        throw new Error(`Helmet metadata was not produced for ${url}`);
    }

    return { body: rendered.replace(metadataPattern, ''), head: metadata.join('\n  ') };
}
