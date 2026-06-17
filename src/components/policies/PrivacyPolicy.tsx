import React from 'react';

/**
 * Basic Privacy Policy component for AdSense compliance.
 * This should be linked from the footer or a dedicated page.
 */
const PrivacyPolicy: React.FC = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6', color: 'inherit' }}>
      <h1>개인정보처리방침 (Privacy Policy)</h1>
      <p>본 서비스("FF14 캐릭터 카드 생성기")는 사용자의 개인정보를 소중히 다루며, 관련 법령을 준수합니다.</p>
      
      <h2>1. 수집하는 개인정보</h2>
      <p>본 서비스는 별도의 회원가입 없이 이용 가능하며, 서버에 사용자의 개인 식별 정보를 저장하지 않습니다. 카드 생성을 위해 입력하는 캐릭터 정보는 브라우저 내에서만 처리되거나 이미지 생성 시에만 일시적으로 사용됩니다.</p>

      <h2>2. 쿠키 및 광고 (Google AdSense)</h2>
      <p>본 사이트는 Google AdSense를 통해 광고를 게재합니다. Google은 사용자가 본 사이트 또는 다른 사이트를 방문한 기록을 바탕으로 광고를 게재하기 위해 쿠키를 사용합니다.</p>
      <ul>
        <li>Google은 광고 쿠키를 사용하여 사용자의 방문 기록을 바탕으로 맞춤 광고를 제공합니다.</li>
        <li>사용자는 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">광고 설정</a>을 통해 맞춤 광고를 해제할 수 있습니다.</li>
      </ul>

      <h2>3. 제3자 제공</h2>
      <p>본 서비스는 사용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.</p>

      <h2>4. 문의처</h2>
      <p>서비스 이용 관련 문의는 제작자에게 연락해 주시기 바랍니다.</p>
      
      <p style={{ marginTop: '40px', fontSize: '0.9em', opacity: 0.7 }}>시행일: 2026년 3월 15일</p>
    </div>
  );
};

export default PrivacyPolicy;
