import type { GuideCopy } from '../guideContent';
export default {
    "title": "FF14 角色卡指南",
    "eyebrow": "製作參考",
    "intro": "確定所需資訊並協調圖文，閱讀後返回編輯器套用。",
    "contentsLabel": "指南目錄",
    "useCasesTitle": "確定卡片用途",
    "useCasesIntro": "虛構範例展示不同情境的欄位用途。",
    "useCases": [
        {
            "id": "social",
            "title": "社群介紹",
            "summary": "簡要介紹角色與遊戲風格。",
            "fieldsLabel": "建議欄位",
            "fields": [
                "名稱與伺服器",
                "主要職業與風格",
                "簡短介紹"
            ],
            "exampleLabel": "虛構範例",
            "example": "喜歡週末輕鬆打副本與裝潢，歡迎新玩家！",
            "privacy": "請勿填寫不想公開的真實姓名、聯絡方式與常去地點。"
        },
        {
            "id": "recruitment",
            "title": "公會或固定團招募",
            "summary": "說明活動時間與希望的團隊類型。",
            "fieldsLabel": "建議欄位",
            "fields": [
                "伺服器與資料中心",
                "主要與次要職業",
                "上線時間與介紹"
            ],
            "exampleLabel": "虛構範例",
            "example": "通常韓國時間晚間 9 點後上線，想找有耐心的隊友一起學習。",
            "privacy": "只公開必要時段，使用社群的安全聯絡流程。"
        },
        {
            "id": "screenshot",
            "title": "截圖紀念",
            "summary": "以截圖與氛圍為主記錄角色瞬間。",
            "fieldsLabel": "建議欄位",
            "fields": [
                "高解析度截圖",
                "版面與強調色",
                "少量貼紙"
            ],
            "exampleLabel": "虛構範例",
            "example": "圍繞想珍藏的團體姿勢截圖製作卡片。",
            "privacy": "檢查其他玩家姓名與聊天內容是否可見。"
        }
    ],
    "sectionLabel": "填寫步驟",
    "sections": [
        {
            "id": "purpose",
            "title": "確定傳達內容",
            "intro": "資訊越多不代表越好，先確定讀者應一眼理解的內容。",
            "points": [
                "區分身分資訊與遊戲風格、上線時間等交流資訊。",
                "不會自動複製官方資料或 Lodestone 資料。",
                "截圖與填寫內容會出現在分享的圖片中。"
            ]
        },
        {
            "id": "screenshot",
            "title": "選擇並裁切截圖",
            "intro": "角色輪廓清楚比裝飾更重要。",
            "points": [
                "確定臉部、裝備或輪廓重點，留出適應卡片比例的空間。",
                "檢查名稱與職業圖示在明暗背景上的對比。",
                "低解析度原圖放大仍會模糊，請使用高解析度截圖。",
                "切換橫直版面後重新檢查圖片區域。"
            ]
        },
        {
            "id": "profile",
            "title": "填寫角色資料",
            "intro": "用一句話說明活動、上線時間或期望的互動方式。",
            "points": [
                "公開暱稱與遊戲內不同則啟用對應標記，避免重複遊戲內姓名。",
                "需要一起遊戲時填寫伺服器與資料中心。",
                "標籤快速傳達風格，介紹補充偏好細節。",
                "避免真實姓名、聯絡方式與過於精確的個人行程。"
            ]
        },
        {
            "id": "jobs",
            "title": "顯示職業與遊戲風格",
            "intro": "主要職業是視覺重點，其他職業展示活動範圍。",
            "points": [
                "選擇代表目前角色的主要職業，也可只使用職業列表。",
                "戰鬥、製作與採集分組顯示，只選需要展示的範圍更清楚。",
                "少量準確標籤比全部勾選更有效。",
                "等級不會自動核驗，必要時註明記錄日期。"
            ]
        },
        {
            "id": "style",
            "title": "調整設計與裝飾",
            "intro": "顏色與貼紙應補充氛圍，避免影響資訊閱讀。",
            "points": [
                "選擇字型時也檢查小字是否清楚。",
                "檢查強調色與名稱、圖示及內文的對比。",
                "貼紙放在空白處，避免遮擋名稱、圖示與介紹。",
                "先確定版面與圖片位置，再新增顏色與貼紙。"
            ]
        },
        {
            "id": "save",
            "title": "分享前檢查",
            "intro": "儲存會下載目前卡片的 PNG，請檢查實際可見內容。",
            "points": [
                "內建瀏覽器下載失敗時請嘗試 Chrome、Safari 或 Edge。",
                "清除網站資料可能刪除編輯，請保留 PNG 與 JSON 備份。",
                "檢查名稱、伺服器、其他玩家姓名與聊天內容。",
                "本專案非官方合作，遊戲、字型與圖片權利歸原權利方所有。"
            ]
        }
    ],
    "referenceTitle": "目前支援範圍",
    "referenceIntro": "列表與編輯器共用職業和伺服器資料，隨原始資料更新。",
    "roleNames": {
        "battle": "戰鬥職業",
        "crafting": "製作職業",
        "gathering": "採集職業"
    },
    "jobCountLabel": " 個職業",
    "worldScopeTitle": "伺服器與資料中心",
    "worldScopeIntro": "包含韓國與全球伺服器，不自動匯入 Lodestone。",
    "regionCountLabel": " 個區域",
    "dataCenterCountLabel": " 個資料中心",
    "worldCountLabel": " 個伺服器",
    "checklistTitle": "儲存前檢查表",
    "checklistIntro": "檢查表僅用於目前工作階段，不傳送到伺服器或儲存至帳號。",
    "checklist": [
        {
            "id": "image",
            "label": "圖片位置與縮放正確。"
        },
        {
            "id": "identity",
            "label": "名稱與伺服器正確。"
        },
        {
            "id": "job",
            "label": "主要職業與風格符合現況。"
        },
        {
            "id": "privacy",
            "label": "無私人資訊洩漏。"
        },
        {
            "id": "contrast",
            "label": "文字與配色對比足夠。"
        },
        {
            "id": "share",
            "label": "在分享位置仍清楚易讀。"
        }
    ],
    "createCta": "返回編輯器",
    "exampleNotice": "範例為示範填寫方向的虛構內容。"
,
 "checklistProgress": (completed: number, total: number) => `${completed}/${total} 已檢查`
} satisfies GuideCopy;
