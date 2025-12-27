const fs = require('fs');
const path = require('path');

// Chinese (Simplified) translations for all missing sections
const chineseTranslations = {
  "landing": {
    "features": {
      "dataLiberation": {
        "title": "您的数据，您做主",
        "description": "随时导出所有数据。符合GDPR标准，提供完整的同意管理、账户删除和数据可携带性。"
      },
      "nayborNetwork": {
        "title": "邻居网络",
        "description": "与可信赖的邻居建立社区韧性。快速SOS访问、共享紧急联系人和互助。"
      },
      "globalReach": {
        "title": "23种语言",
        "description": "完整的国际化支持，包括阿拉伯语、乌尔都语和希伯来语的RTL支持。提供您的母语版本。"
      }
    }
  },
  "auth": {
    "toasts": {
      "signOutError": "退出登录失败",
      "signOutSuccess": "成功退出登录"
    }
  },
  "actions": {
    "refresh": "刷新",
    "retry": "重试",
    "share": "分享",
    "sharing": "正在分享...",
    "selectAll": "全选",
    "clear": "清除",
    "copy": "复制",
    "print": "打印",
    "saving": "正在保存..."
  },
  "emptyState": {
    "noPostsYet": "暂无帖子",
    "noFriendsYet": {
      "core": "暂无核心好友",
      "inner": "暂无内圈好友",
      "outer": "暂无外圈好友"
    },
    "noPostsDescription": {
      "core": "您的核心好友还没有分享任何内容。成为第一个分享的人吧！",
      "inner": "您的内圈好友还没有分享任何内容。成为第一个分享的人吧！",
      "outer": "您的外圈好友还没有分享任何内容。成为第一个分享的人吧！"
    },
    "getStarted": {
      "core": "开始添加最多5位好友到您的核心圈。",
      "inner": "开始添加最多15位好友到您的内圈。",
      "outer": "开始添加最多150位好友到您的外圈。"
    },
    "addToSee": {
      "core": "添加最多5位好友以在此查看他们的帖子。",
      "inner": "添加最多15位好友以在此查看他们的帖子。",
      "outer": "添加最多150位好友以在此查看他们的帖子。"
    },
    "addFriends": {
      "core": "添加核心好友",
      "inner": "添加内圈好友",
      "outer": "添加外圈好友"
    },
    "createPost": "创建帖子",
    "noParasoicalsYet": "暂无准社会关系",
    "noAcquaintedYet": "暂无熟人",
    "noRoleModelsYet": "暂无榜样",
    "noNayborsYet": "暂无邻居",
    "addParasocialsHint": "添加您关注的创作者、名人或公众人物",
    "acquaintedHint": "由于长期缺乏联系，好友会被重新分类到这里",
    "roleModelsHint": "添加那些生活故事激励您变得更好的人",
    "nayborsHint": "向您的邻居介绍自己并将他们添加到这里",
    "addToCircleHint": "将某人添加到您最亲密的圈子"
  },
  "labels": {
    "phone": "电话号码",
    "notes": "备注",
    "handle": "用户名"
  },
  "dashboard": {
    "title": "您的内圈",
    "subtitle": "管理和维护您最亲密的关系",
    "loading": "正在加载您的圈子...",
    "tend": "维护",
    "share": "分享",
    "localStorageHint": "💡 您的列表保存在本地。创建账户以跨设备同步并启用相互匹配。",
    "dunbarDisclaimer": "注意：这些受邓巴数启发的层级限制可能会随着社区意识科学的发展而改变。未来的修改可能包括某些层级计数影响其他层级的规则——例如，准社会关系可能会减少您允许的外圈好友容量。",
    "toasts": {
      "addedFriend": "已将{{name}}添加到您的{{tier}}圈",
      "movedFriend": "已将{{name}}移动到{{tier}}",
      "moveError": "无法移动好友",
      "removedFriend": "已从您的列表中移除{{name}}",
      "addedReserved": "已将保留组添加到{{tier}}",
      "reservedError": "无法添加保留组",
      "updatedReserved": "保留组已更新",
      "removedReserved": "保留组已移除",
      "imported": "已导入{{count}}位好友",
      "imported_plural": "已导入{{count}}位好友",
      "skippedDuplicates": "已跳过{{count}}个重复项",
      "skippedDuplicates_plural": "已跳过{{count}}个重复项",
      "dataLiberation": "您的数据属于您。随时导出以转移到其他地方。"
    }
  },
  "mission": {
    "title": "面对面时间，非广告时间",
    "description": "当您离开我们的网站时，我们就赢了——与最重要的人分享真实时刻。",
    "learnMore": "了解更多...",
    "showLess": "收起",
    "inspiration": "我们的灵感来源？这个经典的Dentyne Ice广告——完美提醒最美好的时刻发生在您放下手机亲自到场时：",
    "videoTitle": "Dentyne Ice - 面对面时间",
    "quote": "\"创造面对面时间\"——这就是理想。当距离分隔你们时，我们会帮助您通过视频通话来连接。但请永远记住：没有什么比亲自在场更好。",
    "features": {
      "spark": {
        "title": "发起视频通话",
        "description": "当你们相隔两地时，一键即可连接"
      },
      "tend": {
        "title": "维护您的圈子",
        "description": "在联系淡化之前提醒您联络"
      },
      "pull": {
        "title": "拉近距离",
        "description": "将有意义的联系移动到更紧密的轨道"
      }
    }
  },
  "tierSection": {
    "reserve": "保留",
    "reservedCount": "{{count}}个保留",
    "link": "链接",
    "followCreator": "关注创作者",
    "addRoleModel": "添加榜样",
    "add": "添加"
  },
  "tending": {
    "title": "维护您的圈子",
    "markDescription": "标记您{{period}}未联系的{{tier}}好友",
    "periods": {
      "core": "本周",
      "inner": "这两周",
      "outer": "这两个月"
    },
    "peopleCount": "{{count}}人",
    "peopleCount_plural": "{{count}}人",
    "noFriendsInTier": "此层级暂无好友",
    "checkInstruction": "✓ 勾选那些您联系不够的人：",
    "noPhone": "无电话",
    "call": "呼叫",
    "maybeLater": "稍后再说",
    "doneTending": "维护完成",
    "finish": "完成",
    "mobileHint": "联系操作在移动设备上效果最佳",
    "reconnect": {
      "title": "是时候重新联系了",
      "description": "这些好友可以用一些您的时间"
    },
    "toasts": {
      "allTended": "太棒了！您已维护了所有圈子 🌱",
      "noPhone": "{{name}}没有电话号码",
      "connecting": "正在通过{{method}}连接{{name}}",
      "rememberReachOut": "记得尽快联系！💛",
      "friendsWaiting": "{{count}}位好友等待您的消息",
      "friendsWaiting_plural": "{{count}}位好友等待您的消息"
    }
  },
  "nayborSOS": {
    "steps": {
      "category": "您需要什么类型的帮助？",
      "contacts": "选择要联系的邻居"
    },
    "critical": "紧急",
    "emergencyWarning": "遇到危及生命的紧急情况，请先拨打120",
    "suggestedActions": "建议的操作：",
    "addDetails": "添加详情（可选）",
    "describePlaceholder": "描述您的情况...",
    "includeLocation": "包含位置信息",
    "chooseNaybors": "选择邻居",
    "chooseNayborsAria": "继续选择要联系的邻居",
    "nayborsSelected": "已选择{{count}}位邻居",
    "nayborsSelected_plural": "已选择{{count}}位邻居",
    "copyMessage": "复制消息",
    "messageAll": "发送给全部（{{count}}）",
    "contacted": "已联系{{count}}位邻居",
    "contacted_plural": "已联系{{count}}位邻居",
    "toasts": {
      "messageCopied": "消息已复制到剪贴板",
      "noNayborsSelected": "未选择有电话号码的邻居"
    }
  },
  "callActions": {
    "startKall": "开始通话",
    "kallNow": "现在呼叫{{name}}",
    "scheduleKall": "安排通话",
    "scheduleWith": "与{{name}}安排",
    "sharedServices": "共享服务：",
    "theirPreferences": "他们的偏好：",
    "noMethods": "无可用联系方式",
    "requestInfo": "请求联系信息",
    "toasts": {
      "connecting": "正在通过{{service}}连接",
      "openService": "打开{{service}}以连接"
    }
  },
  "onboarding": {
    "steps": {
      "connect": {
        "title": "保持联系",
        "description": "添加您的联系方式，让朋友可以轻松联系到您。"
      },
      "channels": {
        "title": "添加您的渠道",
        "description": "您使用哪些视频通话和消息应用？"
      },
      "complete": {
        "title": "全部完成！",
        "description": "您的朋友现在可以与您开始或安排通话。"
      }
    },
    "skipForNow": "暂时跳过",
    "getStarted": "开始",
    "service": "服务",
    "yourContactInfo": "您的{{service}}联系信息",
    "spontaneous": "即时",
    "scheduled": "预约",
    "addMethod": "添加方式",
    "continue": "继续",
    "methodsAdded": "您已添加{{count}}种联系方式",
    "methodsAdded_plural": "您已添加{{count}}种联系方式",
    "publicProfile": "公开个人资料",
    "privateProfile": "私密个人资料",
    "publicProfileHint": "任何人都可以通过您的用户名找到您",
    "privateProfileHint": "只有确认的好友可以看到您的个人资料",
    "addMore": "添加更多",
    "saving": "正在保存...",
    "completeSetup": "完成设置",
    "toasts": {
      "enterContactInfo": "请输入联系信息",
      "saveFailed": "保存联系方式失败"
    }
  },
  "keysShared": {
    "addressHelp": "当您的邻居代您请求帮助时，此地址将与急救人员共享。",
    "address": "地址",
    "addressPlaceholder": "示例街道123号",
    "unitNumber": "单元/公寓号",
    "unitPlaceholder": "4B室",
    "entryInstructions": "特殊进入说明",
    "instructionsPlaceholder": "门禁在门的右侧，按两次...",
    "instructionsHint": "包括急救人员需要知道的任何进入您家的详细信息",
    "keyType": "访问类型",
    "keyTypes": {
      "physical": "实体钥匙",
      "digital": "数字密码",
      "both": "两者都有"
    },
    "digitalCodeType": "密码类型",
    "codeTypes": {
      "keypad": "门禁密码",
      "smart_lock": "智能锁应用",
      "garage": "车库密码",
      "other": "其他"
    },
    "notes": "备注（可选）",
    "notesPlaceholder": "钥匙在蓝色花盆下面...",
    "confirmKeyHolder": "确认",
    "currentKeyHolders": "当前钥匙持有者",
    "selectNaybors": "添加有钥匙的邻居：",
    "noNaybors": "请先添加邻居以共享钥匙",
    "allNayborsAssigned": "所有邻居已分配",
    "mandatoryScenarios": "强制进入权限",
    "optionalScenarios": "可选进入权限",
    "optionalScenariosHelp": "您可以选择邻居是否可以在这些情况下进入。",
    "mandatoryScenariosHelp": "这些危及生命或安全关键的场景始终允许进入。它们不能被禁用，因为它们保护生命、肢体和无辜的人免受创伤。",
    "scenarios": {
      "cardiac_arrest": {
        "name": "心脏骤停",
        "description": "心脏病发作或心脏骤停——每一秒都很重要"
      },
      "choking": {
        "name": "窒息",
        "description": "窒息紧急情况——气道阻塞，需要立即帮助"
      },
      "drowning": {
        "name": "溺水",
        "description": "泳池、浴缸或其他水中溺水"
      },
      "anaphylaxis": {
        "name": "过敏性休克",
        "description": "蜂蛰、食物、药物引起的严重过敏反应"
      },
      "elderly_fall": {
        "name": "老人跌倒",
        "description": "老人跌倒，无法起身，可能受伤"
      },
      "fire": {
        "name": "火灾",
        "description": "检测到火灾——对生命、肢体、组织、任何行动不便或睡眠中的人的威胁"
      },
      "gas_leak": {
        "name": "煤气泄漏",
        "description": "检测到煤气泄漏——爆炸/中毒风险"
      },
      "carbon_monoxide": {
        "name": "一氧化碳",
        "description": "一氧化碳探测器报警——无声杀手，住户可能已失去意识"
      },
      "childhood_corporal": {
        "name": "儿童体罚",
        "description": "儿童向邻居报告体罚。研究表明社区干预可以防止未来的暴力。"
      },
      "take10_spiral": {
        "name": "Take 10喊叫螺旋",
        "description": "家庭喊叫不可接受地升级。需要降级干预。"
      },
      "bedroom_consent": {
        "name": "卧室同意冲突",
        "description": "检测到卧室同意冲突紧急情况——需要立即干预"
      },
      "medical_other": {
        "name": "其他医疗紧急情况",
        "description": "需要进入家中的其他医疗紧急情况"
      },
      "intruder_check": {
        "name": "入侵者检查",
        "description": "当您无法回应时检查疑似入侵者"
      },
      "welfare_check": {
        "name": "福利检查",
        "description": "当您长时间无回应时的一般福利检查"
      },
      "flooding": {
        "name": "洪水/漏水",
        "description": "漏水或洪水——防止财产损失（非危及生命）"
      }
    },
    "yourAddress": "您的地址",
    "noAddressSet": "未设置地址",
    "unit": "单元",
    "keyHoldersSummary": "{{count}}位邻居有钥匙",
    "keyHoldersSummary_plural": "{{count}}位邻居有钥匙",
    "noKeyHolders": "未分配钥匙持有者",
    "permissionsSummary": "进入权限",
    "mandatoryCount": "{{count}}",
    "mandatoryLabel": "强制（始终允许）",
    "optionalCount": "{{count}}",
    "optionalLabel": "可选已启用",
    "reviewWarning": "通过保存这些设置，您授权指定的邻居在选定的紧急情况下进入您的家。请确保您信任这些人可以进入您的家。",
    "savePreferences": "保存偏好设置",
    "toasts": {
      "keyHolderAdded": "已添加钥匙持有者",
      "keyHolderRemoved": "已移除钥匙持有者",
      "saved": "共享钥匙偏好设置已保存"
    }
  },
  "reserved": {
    "spotsCount_plural": "{{count}}个保留位置",
    "spotsLabel_plural": "个保留位置"
  },
  "addLinkedFriend": {
    "title": "添加关联好友到{{tier}}",
    "description": "通过联系信息查找某人以请求建立联系。",
    "findBy": "通过以下方式查找",
    "enterUsernameHint": "输入他们设置的确切用户名",
    "enterContactHint": "输入他们注册的确切{{type}}",
    "errors": {
      "noUserHandle": "未找到使用该用户名的用户。请确保他们有账户并设置了用户名。",
      "noUserContact": "未找到使用该{{type}}的用户。他们可能还没有将其添加到个人资料中。",
      "searchError": "搜索时发生错误。请重试。",
      "connectionFailed": "发送连接请求失败"
    },
    "userFound": "找到用户",
    "showCircleLevel": "显示圈子级别",
    "circleVisibleHint": "他们会看到您将他们添加为{{tier}}",
    "circleHiddenHint": "他们不会看到您将他们添加到哪个圈子",
    "sendRequest": "发送连接请求",
    "privacyNote": "在他们接受之前，他们只会看到您用来找到他们的联系信息。接受后，你们都将看到彼此的完整联系方式。",
    "serviceTypes": {
      "phone": "电话号码",
      "email": "电子邮件地址",
      "handle": "用户名",
      "signal": "Signal",
      "telegram": "Telegram",
      "whatsapp": "WhatsApp",
      "facetime": "FaceTime"
    }
  },
  "gdpr": {
    "cookies": {
      "title": "我们使用cookies",
      "description": "我们使用cookies来改善您的体验。基本cookies是应用程序工作所必需的。",
      "learnMore": "了解更多",
      "customize": "自定义",
      "customizeAria": "自定义cookie偏好设置",
      "essentialOnly": "仅基本",
      "essentialOnlyAria": "仅接受基本cookies",
      "acceptAll": "全部接受",
      "acceptAllAria": "接受所有cookies",
      "settingsTitle": "Cookie偏好设置",
      "settingsDescription": "选择您要允许的cookie类型。基本cookies始终启用，因为网站运行需要它们。",
      "savePreferences": "保存偏好设置",
      "required": "必需",
      "essential": {
        "title": "基本Cookies",
        "description": "基本网站功能（如身份验证和安全）所需。"
      },
      "functional": {
        "title": "功能性Cookies",
        "description": "记住您的偏好设置，如语言设置和UI自定义。"
      },
      "analytics": {
        "title": "分析Cookies",
        "description": "帮助我们了解访问者如何使用网站以改善体验。"
      },
      "marketing": {
        "title": "营销Cookies",
        "description": "用于投放相关广告和跟踪活动效果。"
      }
    },
    "settings": {
      "cookiePreferences": "Cookie偏好设置",
      "cookieDescription": "管理您允许我们使用的cookie类型。",
      "consentHistory": "同意历史",
      "consentHistoryDescription": "查看和管理您的同意记录。",
      "consentGiven": "同意日期",
      "consentVersion": "条款版本",
      "noConsent": "未找到同意记录。请接受cookie政策。",
      "withdrawConsent": "撤回同意",
      "withdrawWarning": "撤回同意将重置您的cookie偏好设置，可能会限制某些功能。您确定吗？",
      "confirmWithdraw": "是的，撤回同意",
      "dataRights": "您的数据权利",
      "dataRightsDescription": "根据GDPR，您有权访问、导出和删除您的数据。",
      "exportData": "导出我的数据",
      "exportDescription": "以可携带格式下载您的所有数据",
      "deleteAccount": "删除我的账户",
      "deleteDescription": "永久删除您的账户和所有数据"
    },
    "deletion": {
      "title": "删除您的账户",
      "description": "这将永久删除您的账户和所有相关数据。",
      "warningTitle": "警告：此操作无法撤消",
      "warningDescription": "删除后，您的账户和所有数据将被永久删除。如果您想保留数据，请确保先导出。",
      "whatDeleted": "将被删除的内容：",
      "deletedItems": {
        "profile": "您的个人资料和个人信息",
        "connections": "您所有的好友连接和圈子",
        "posts": "您所有的帖子和共享内容",
        "preferences": "您的偏好设置和设置",
        "keysShared": "您的共享钥匙紧急访问设置"
      },
      "gracePeriodTitle": "30天宽限期",
      "gracePeriodDescription": "您的账户将在{{days}}天后计划删除。您可以在此期间通过登录取消删除。",
      "exportFirst": "删除前导出数据？",
      "exportData": "导出数据",
      "exported": "数据已导出",
      "continue": "继续删除",
      "confirmTitle": "确认删除账户",
      "confirmDescription": "这是您的最终确认。请验证您的身份以继续。",
      "typeEmail": "输入您的电子邮件以确认：{{email}}",
      "emailMismatch": "电子邮件与您的账户不匹配",
      "reasonLabel": "离开原因",
      "reasonPlaceholder": "请分享您离开的原因，帮助我们改进...",
      "understandConsequences": "我理解我的账户和所有数据将在宽限期后被永久删除，此操作无法撤消。",
      "deleting": "正在计划删除...",
      "confirmDelete": "删除我的账户",
      "scheduledTitle": "已计划删除",
      "scheduledDescription": "您的账户已计划删除。",
      "scheduledDate": "您的账户将在以下日期永久删除：",
      "cancelInfo": "要取消删除，只需在计划日期之前登录您的账户。"
    },
    "age": {
      "title": "年龄验证",
      "description": "我们需要验证您的年龄以遵守隐私法规。",
      "whyTitle": "为什么我们要问",
      "whyDescription": "根据GDPR，{{age}}岁以下的用户需要家长同意才能创建账户。",
      "birthYearLabel": "您出生于哪一年？",
      "selectYear": "选择年份",
      "privacyNote": "我们仅存储您的出生年份以符合合规要求。",
      "minorTitle": "需要家长同意",
      "minorDescription": "{{age}}岁以下的用户需要家长同意。请让家长或监护人帮助您创建账户。",
      "parentalRequired": "需要家长同意",
      "verify": "验证年龄"
    }
  },
  "admin": {
    "dispatch": {
      "title": "调度账户验证",
      "searchPlaceholder": "按组织、电子邮件或联系人姓名搜索...",
      "filters": {
        "all": "所有账户"
      },
      "noAccounts": "未找到符合条件的账户",
      "accessDenied": {
        "title": "拒绝访问",
        "description": "您没有权限访问调度验证面板。"
      },
      "actions": {
        "verify": "验证",
        "reject": "拒绝",
        "suspend": "暂停"
      },
      "success": {
        "verify": "账户验证成功",
        "reject": "账户已拒绝",
        "suspend": "账户已暂停"
      },
      "errors": {
        "fetchFailed": "获取账户失败",
        "actionFailed": "操作失败。请重试。"
      },
      "detail": {
        "description": "查看组织详情和验证文件",
        "organization": "组织详情",
        "name": "名称",
        "type": "类型",
        "jurisdictions": "管辖区域",
        "legal": "法律信息",
        "taxId": "税务ID",
        "insurance": "保险公司",
        "policyNumber": "保单号",
        "registeredAgent": "注册代理",
        "contact": "联系信息",
        "contactName": "联系人姓名",
        "contactEmail": "电子邮件",
        "contactPhone": "电话",
        "status": "账户状态",
        "verificationStatus": "状态",
        "createdAt": "申请日期",
        "rejectionReason": "拒绝原因"
      },
      "confirm": {
        "verifyTitle": "验证账户？",
        "verifyDescription": "这将授予该组织在紧急情况下访问居民钥匙树信息的权限。",
        "rejectTitle": "拒绝账户？",
        "rejectDescription": "请提供拒绝原因。这将与该组织共享。",
        "suspendTitle": "暂停账户？",
        "suspendDescription": "这将立即撤销该组织的访问权限。请提供原因。",
        "reason": "原因",
        "reasonPlaceholder": "解释为什么拒绝/暂停此账户...",
        "processing": "处理中..."
      }
    }
  },
  "dev": {
    "label": "开发",
    "panelTitle": "开发面板",
    "mode": "开发模式",
    "authStatus": "认证状态",
    "notLoggedIn": "未登录",
    "authActions": "认证操作",
    "refreshButton": "刷新",
    "clearApp": "清除应用",
    "clearAll": "清除全部",
    "forceSignOut": "强制退出",
    "toasts": {
      "clearStorage": "已清除{{count}}个应用localStorage键",
      "clearAll": "已清除所有localStorage和sessionStorage",
      "signOut": "已强制退出并清除认证存储",
      "signOutFailed": "强制退出失败",
      "refreshed": "会话已刷新",
      "refreshFailed": "刷新会话失败"
    },
    "forceLogout": "强制退出",
    "storageActions": "存储操作",
    "storageInspector": "存储检查器",
    "noStorageData": "无localStorage数据",
    "chars": "字符",
    "tips": {
      "title": "提示",
      "sessions": "会话在页面刷新后保持",
      "clearApp": "使用\"清除应用数据\"重置好友列表",
      "forceLogout": "使用\"强制退出\"完全清除认证状态"
    }
  },
  "contactMethods": {
    "title": "联系方式",
    "subtitle": "添加您首选的视频通话和消息服务，以便朋友可以联系您",
    "addButton": "添加联系方式",
    "addButtonCompact": "添加",
    "addDialogTitle": "添加联系方式",
    "addDialogDescription": "添加朋友联系您进行视频通话的方式",
    "serviceLabel": "服务",
    "contactInfoLabel": "您的{{service}}联系信息",
    "labelOptional": "标签（可选）",
    "labelPlaceholder": "如：个人、工作、家庭",
    "labelHint": "帮助您区分同一服务上的多个账户",
    "availableFor": "可用于",
    "spontaneousKalls": "即时通话",
    "spontaneousTooltip": "朋友想要立即连接时的即时视频通话",
    "scheduledKalls": "预约通话",
    "scheduledTooltip": "提前安排在特定时间的视频会议",
    "addMethod": "添加方式",
    "dragToReorder": "拖动重新排序",
    "dragReorderHint": "拖动重新排序优先级。#1是您首选的方式。",
    "noSpontaneousMethods": "尚未添加即时通话方式",
    "noScheduledMethods": "尚未添加预约通话方式"
  },
  "post": {
    "voiceNote": "语音备忘录",
    "audioUnavailable": "音频不可用",
    "callInvitation": "通话邀请",
    "joinCall": "加入",
    "meetupInvitation": "聚会邀请",
    "location": "地点：{{name}}",
    "rsvpYes": "确认参加",
    "rsvpMaybe": "可能参加",
    "nearbyMessage": "我在附近！",
    "lifeUpdate": "生活动态",
    "call": "呼叫",
    "addContactInfo": "添加联系信息",
    "addContactInfoTooltip": "为{{name}}添加联系信息",
    "callViaHighFidelity": "通过{{method}}呼叫（高质量）",
    "addMoreContactInfo": "添加更多联系信息",
    "usePhoneRecommendation": "为获得最佳效果，请使用手机进行通话",
    "voiceReplyTooltip": "发送语音回复（高质量）",
    "meetupTooltip": "安排聚会（高质量）",
    "commentTooltip": "添加评论",
    "likeTooltip": "喜欢这篇帖子",
    "likeTooltipHighFidelity": "喜欢（考虑更有意义的互动）",
    "shareTooltip": "分享",
    "toasts": {
      "noContact": "无可用联系信息",
      "contactFailed": "无法发起联系",
      "noContactPerson": "此人无可用联系信息"
    },
    "callVia": "通过{{method}}呼叫",
    "voiceReply": "语音回复",
    "meetup": "聚会",
    "comment": "评论",
    "like": "喜欢",
    "selectContactMethod": "选择联系方式",
    "warningPlatform": "警告：平台可能存在监控问题",
    "currentlySelected": "当前选择",
    "dontShowMonth": "一个月内不再显示",
    "warningSilenced": "{{method}}警告已静音至下个月",
    "connectingVia": "正在通过{{method}}连接"
  },
  "parasocial": {
    "creatorDashboard": "创作者面板",
    "shareContent": "分享内容",
    "shareNewContent": "分享新内容",
    "shareDescription": "与您的准社会粉丝分享链接",
    "noContentShared": "尚未分享内容",
    "noContentHint": "分享链接以与您的粉丝互动",
    "title": "标题",
    "titlePlaceholder": "您在分享什么？",
    "url": "链接",
    "urlPlaceholder": "https://...",
    "description": "描述",
    "descriptionPlaceholder": "简短描述（可选）",
    "deleteTitle": "删除此分享？",
    "deleteDescription": "这将从您粉丝的信息流中移除该链接。",
    "clicks": "{{count}}次点击",
    "clicks_plural": "{{count}}次点击",
    "engagement": "{{percent}}%参与度",
    "toasts": {
      "titleAndUrlRequired": "标题和链接为必填项",
      "invalidUrl": "请输入有效的链接",
      "sharedContent": "内容已分享给您的粉丝！",
      "deleted": "分享已删除"
    }
  },
  "profileSettings": {
    "title": "个人资料设置",
    "description": "管理您的个人资料和联系偏好设置",
    "tabs": {
      "profile": "个人资料",
      "contact": "联系方式",
      "creator": "创作者"
    },
    "displayName": "显示名称",
    "displayNamePlaceholder": "您的名字",
    "handle": "用户名",
    "handlePlaceholder": "您的用户名",
    "handleHint": "3-30个字符。仅限字母、数字和下划线。",
    "publicProfile": "您的公开个人资料",
    "publicProfileLabel": "公开个人资料",
    "privateProfileLabel": "私密个人资料",
    "publicDescription": "任何人都可以查看您的个人资料页面",
    "privateDescription": "只有您和确认的好友可以查看您的个人资料",
    "parasocialMode": "准社会人格模式",
    "parasocialModeDescription": "如果您是公众人物、创作者或名人，希望接收粉丝的准社会连接并与他们分享内容，请启用此功能。",
    "parasocialModeHint": "启用后，其他用户可以将您添加到他们的准社会圈子并查看您分享的内容。保存个人资料以应用此更改。",
    "saveProfile": "保存个人资料",
    "saveSettings": "保存设置",
    "toasts": {
      "updated": "个人资料已更新",
      "updateFailed": "更新个人资料失败",
      "linkCopied": "链接已复制！"
    }
  },
  "editFriend": {
    "title": "编辑联系人",
    "description": "更新{{name}}的联系信息",
    "namePlaceholder": "好友的名字",
    "emailPlaceholder": "friend@example.com",
    "preferredContactMethod": "首选联系方式",
    "selectContactMethod": "选择如何联系他们",
    "notesPlaceholder": "关于此人的备注...",
    "saveChanges": "保存更改"
  },
  "followCreator": {
    "title": "关注创作者",
    "description": "搜索已验证的创作者以关注并在您的信息流中查看他们的内容。",
    "searchLabel": "按名字或用户名搜索",
    "searchPlaceholder": "@创作者用户名或创作者名字",
    "creatorModeHint": "只有启用了创作者模式的用户才会出现在搜索结果中。",
    "toasts": {
      "following": "现在关注{{name}}",
      "alreadyFollowing": "您已经在关注此创作者",
      "followFailed": "关注失败"
    },
    "errors": {
      "searching": "搜索时发生错误。",
      "noCreators": "未找到匹配该搜索的创作者。他们可能尚未启用创作者模式。",
      "noCreatorsFound": "未找到匹配该搜索的创作者。"
    }
  },
  "dispatch": {
    "validation": {
      "organizationNameRequired": "组织名称为必填项",
      "jurisdictionRequired": "至少需要一个管辖区域",
      "taxIdRequired": "税务ID为必填项",
      "insuranceRequired": "保险公司名称为必填项",
      "policyRequired": "保单号为必填项",
      "agentNameRequired": "注册代理姓名为必填项",
      "agentContactRequired": "注册代理联系方式为必填项",
      "contactNameRequired": "主要联系人姓名为必填项",
      "invalidEmail": "请输入有效的电子邮件地址",
      "invalidPhone": "请输入有效的电话号码",
      "passwordMin": "密码必须至少8个字符",
      "passwordMatch": "密码必须匹配",
      "termsRequired": "您必须同意条款"
    }
  },
  "privacy": {
    "title": "隐私政策",
    "lastUpdated": "最后更新：2025年1月1日",
    "philosophy": {
      "title": "我们的隐私理念",
      "description": "InnerFriend建立在一个基本前提上：您的关系属于您。我们不是通过您的注意力变现或出售您数据的社交网络。我们是帮助您与最重要的人保持有意义连接的工具。"
    },
    "dataCollection": {
      "title": "我们收集的数据",
      "intro": "我们只收集提供服务所必需的数据：",
      "items": {
        "account": "账户信息：创建账户时的电子邮件和密码（加密）",
        "friends": "好友列表：您添加的人的姓名和可选联系信息",
        "connections": "连接数据：如果您选择启用，相互匹配的元数据",
        "preferences": "偏好设置：您的应用设置，如语言和通知偏好"
      }
    },
    "localStorage": {
      "title": "本地优先",
      "description": "默认情况下，您的好友列表仅存储在您的设备上。除非您选择创建账户以使用跨设备同步或相互匹配等功能，否则我们永远不会接触我们的服务器。"
    },
    "noSelling": {
      "title": "我们永不出售您的数据",
      "description": "您的数据不出售。就是这样。我们不会与广告商、数据经纪人或第三方共享用于营销目的。"
    },
    "gdprRights": {
      "title": "您的权利（GDPR合规）",
      "intro": "您对您的数据拥有完全控制权：",
      "items": {
        "access": "访问：随时以可携带格式导出所有数据",
        "deletion": "删除：一键删除您的账户和所有相关数据",
        "rectification": "更正：更新或更正您的任何信息",
        "portability": "可携带性：将您的数据带到其他邓巴兼容的社交网络"
      }
    },
    "security": {
      "title": "安全性",
      "description": "我们对传输中和静态数据使用行业标准加密。密码经过哈希处理，从不以明文存储。"
    },
    "contact": {
      "title": "联系方式",
      "description": "有隐私问题？请联系我们：privacy@lifesaverlabs.org"
    }
  },
  "terms": {
    "title": "服务条款",
    "lastUpdated": "最后更新：2025年1月1日",
    "introduction": {
      "title": "介绍",
      "description": "欢迎使用InnerFriend。使用我们的服务即表示您同意这些条款。我们保持简单易读。"
    },
    "service": {
      "title": "服务",
      "description": "InnerFriend通过提供组织和维护您社交圈的工具来帮助您维持有意义的关系。我们不是社交平台——我们不托管公共内容或促进公共连接。"
    },
    "responsibilities": {
      "title": "您的责任",
      "intro": "使用InnerFriend，您同意：",
      "items": {
        "accurate": "创建账户时提供准确信息",
        "secure": "保护您的登录凭据安全",
        "privacy": "尊重您添加到列表中的人的隐私",
        "lawful": "仅将服务用于合法目的"
      }
    },
    "intellectualProperty": {
      "title": "知识产权",
      "description": "InnerFriend在MIT许可下开源。您的数据属于您——您保留完全所有权。"
    },
    "liability": {
      "title": "责任限制",
      "description": "InnerFriend按「原样」提供，不提供任何保证。我们不对您使用服务造成的任何损害负责。"
    },
    "termination": {
      "title": "终止",
      "description": "您可以随时删除账户。我们保留终止违反这些条款的账户的权利。"
    },
    "changes": {
      "title": "条款变更",
      "description": "我们可能会不时更新这些条款。我们将通过电子邮件或通过应用通知您重大变更。"
    },
    "contact": {
      "title": "联系方式",
      "description": "有问题？请联系我们：support@lifesaverlabs.org"
    }
  }
};

// Deep merge function
function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// Update Chinese locale
const localePath = path.join(__dirname, '../public/locales/zh/common.json');
const existing = JSON.parse(fs.readFileSync(localePath, 'utf8'));
const merged = deepMerge(existing, chineseTranslations);
fs.writeFileSync(localePath, JSON.stringify(merged, null, 2) + '\n');
console.log('Updated: zh');
console.log('Done! Chinese translations applied.');
