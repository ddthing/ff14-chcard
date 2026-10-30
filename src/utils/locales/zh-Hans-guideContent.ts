import type { GuideCopy } from '../guideContent';
export default {
    "title": "FF14 角色卡指南",
    "eyebrow": "制作参考",
    "intro": "确定所需信息并协调图文，阅读后返回编辑器应用。",
    "contentsLabel": "指南目录",
    "useCasesTitle": "确定卡片用途",
    "useCasesIntro": "虚构示例展示不同场景的字段用途。",
    "useCases": [
        {
            "id": "social",
            "title": "社交介绍",
            "summary": "简要介绍角色与游戏风格。",
            "fieldsLabel": "建议字段",
            "fields": [
                "名称与服务器",
                "主职业与风格",
                "简短介绍"
            ],
            "exampleLabel": "虚构示例",
            "example": "喜欢周末轻松打本和装修，欢迎新玩家！",
            "privacy": "请勿填写不想公开的真实姓名、联系方式和常去地点。"
        },
        {
            "id": "recruitment",
            "title": "部队或固定队招募",
            "summary": "说明活动时间与希望的团队类型。",
            "fieldsLabel": "建议字段",
            "fields": [
                "服务器与数据中心",
                "主职业与副职业",
                "在线时间与介绍"
            ],
            "exampleLabel": "虚构示例",
            "example": "通常韩国时间晚 9 点后在线，想找耐心的队友一起学习。",
            "privacy": "只公开必要时间段，使用社区的安全联系流程。"
        },
        {
            "id": "screenshot",
            "title": "截图纪念",
            "summary": "以截图和氛围为主记录角色瞬间。",
            "fieldsLabel": "建议字段",
            "fields": [
                "高分辨率截图",
                "布局与强调色",
                "少量贴纸"
            ],
            "exampleLabel": "虚构示例",
            "example": "围绕想珍藏的集体姿势截图制作卡片。",
            "privacy": "检查其他玩家姓名与聊天内容是否可见。"
        }
    ],
    "sectionLabel": "填写步骤",
    "sections": [
        {
            "id": "purpose",
            "title": "确定传达内容",
            "intro": "信息越多不代表越好，先确定读者应一眼理解的内容。",
            "points": [
                "区分身份信息与游戏风格、在线时间等交流信息。",
                "不会自动复制官方资料或 Lodestone 数据。",
                "截图和填写内容会出现在分享的图片中。"
            ]
        },
        {
            "id": "screenshot",
            "title": "选择并裁剪截图",
            "intro": "角色轮廓清晰比装饰更重要。",
            "points": [
                "确定脸部、装备或轮廓重点，留出适应卡片比例的空间。",
                "检查名称与职业图标在明暗背景上的对比。",
                "低分辨率原图放大仍会模糊，请使用高分辨率截图。",
                "切换横纵布局后重新检查图片区域。"
            ]
        },
        {
            "id": "profile",
            "title": "填写角色资料",
            "intro": "用一句话说明活动、在线时间或期望的互动方式。",
            "points": [
                "公开昵称与游戏内不同则启用对应标记，避免重复游戏内姓名。",
                "需要一起游戏时填写服务器与数据中心。",
                "标签快速传达风格，介绍补充偏好细节。",
                "避免真实姓名、联系方式和过于精确的个人日程。"
            ]
        },
        {
            "id": "jobs",
            "title": "显示职业与游戏风格",
            "intro": "主职业是视觉重点，其他职业展示活动范围。",
            "points": [
                "选择代表当前角色的主职业，也可只使用职业列表。",
                "战斗、制作与采集分组显示，只选需要展示的范围更清晰。",
                "少量准确标签比全部勾选更有效。",
                "等级不会自动核验，必要时注明记录日期。"
            ]
        },
        {
            "id": "style",
            "title": "调整设计与装饰",
            "intro": "颜色和贴纸应补充氛围，避免影响信息阅读。",
            "points": [
                "选择字体时也检查小字是否清晰。",
                "检查强调色与名称、图标和正文的对比。",
                "贴纸放在空白处，避免遮挡名称、图标和介绍。",
                "先确定布局和图片位置，再添加颜色与贴纸。"
            ]
        },
        {
            "id": "save",
            "title": "分享前检查",
            "intro": "保存会下载当前卡片的 PNG，请检查实际可见内容。",
            "points": [
                "应用内浏览器下载失败时请尝试 Chrome、Safari 或 Edge。",
                "清除站点数据可能删除编辑，请保留 PNG 与 JSON 备份。",
                "检查名称、服务器、其他玩家姓名与聊天内容。",
                "本项目非官方合作，游戏、字体和图片权利归原权利方所有。"
            ]
        }
    ],
    "referenceTitle": "当前支持范围",
    "referenceIntro": "列表与编辑器共用职业和服务器数据，随源数据更新。",
    "roleNames": {
        "battle": "战斗职业",
        "crafting": "制作职业",
        "gathering": "采集职业"
    },
    "jobCountLabel": " 个职业",
    "worldScopeTitle": "服务器与数据中心",
    "worldScopeIntro": "包含韩国与全球服务器，不自动导入 Lodestone。",
    "regionCountLabel": " 个区域",
    "dataCenterCountLabel": " 个数据中心",
    "worldCountLabel": " 个服务器",
    "checklistTitle": "保存前检查表",
    "checklistIntro": "检查表仅用于当前会话，不发送到服务器或保存至账号。",
    "checklist": [
        {
            "id": "image",
            "label": "图片位置和缩放正确。"
        },
        {
            "id": "identity",
            "label": "名称与服务器正确。"
        },
        {
            "id": "job",
            "label": "主职业与风格符合现状。"
        },
        {
            "id": "privacy",
            "label": "无私人信息泄露。"
        },
        {
            "id": "contrast",
            "label": "文字与配色对比足够。"
        },
        {
            "id": "share",
            "label": "在分享位置仍清晰可读。"
        }
    ],
    "createCta": "返回编辑器",
    "exampleNotice": "示例为演示填写方向的虚构内容。"
,
 "checklistProgress": (completed: number, total: number) => `${completed}/${total} 已检查`
} satisfies GuideCopy;
