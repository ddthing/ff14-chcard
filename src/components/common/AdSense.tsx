import React, { useEffect } from 'react';

interface AdSenseProps {
  client?: string;
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: 'true' | 'false';
  style?: React.CSSProperties;
}

/**
 * Reusable AdSense component for manual ad unit placement.
 * @param slot - The ad slot ID from your AdSense dashboard.
 * @param client - Optional publisher ID (defaults to the one in index.html if not provided).
 */
const AdSense: React.FC<AdSenseProps> = ({
  client = 'ca-pub-2169729065542563', // Updated with actual ID
  slot,
  format = 'auto',
  responsive = 'true',
  style = { display: 'block' },
}) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="adsense-container" style={{ margin: '20px 0', textAlign: 'center' }}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default AdSense;
