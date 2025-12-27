const fs = require('fs');
const path = require('path');

const koreanTranslations = {
  "landing": {
    "hero": {
      "title": "진정으로 중요한 사람들과 연결하세요",
      "subtitle": "InnerFriend는 가장 가까운 관계를 관리하고 소중한 사람들과 연결 상태를 유지하도록 도와줍니다",
      "cta": "시작하기",
      "learnMore": "더 알아보기"
    },
    "features": {
      "title": "기능",
      "organize": {
        "title": "친구 정리",
        "description": "친한 친구들을 관계 유형과 친밀도에 따라 티어로 분류하세요"
      },
      "remind": {
        "title": "연결 상태 유지",
        "description": "너무 오래 연락하지 않으면 알림을 받아 관계를 유지하세요"
      },
      "emergency": {
        "title": "긴급 네트워크",
        "description": "긴급 상황에서 연락할 사람들로 신뢰할 수 있는 서클을 구축하세요"
      }
    },
    "privacy": {
      "title": "개인정보 우선",
      "description": "귀하의 데이터는 귀하의 것입니다. 소셜 그래프에 대한 완전한 통제권을 유지하세요."
    },
    "cta": {
      "title": "여정을 시작할 준비가 되셨나요?",
      "subtitle": "오늘 InnerFriend와 함께 의미 있는 관계를 구축하기 시작하세요",
      "button": "무료로 시작하기"
    }
  },
  "auth": {
    "signIn": "로그인",
    "signUp": "가입하기",
    "signOut": "로그아웃",
    "email": "이메일",
    "password": "비밀번호",
    "confirmPassword": "비밀번호 확인",
    "forgotPassword": "비밀번호를 잊으셨나요?",
    "resetPassword": "비밀번호 재설정",
    "noAccount": "계정이 없으신가요?",
    "hasAccount": "이미 계정이 있으신가요?",
    "continueWith": "{{provider}}로 계속하기",
    "orContinueWith": "또는 다음으로 계속",
    "signingIn": "로그인 중...",
    "signingUp": "가입 중...",
    "errors": {
      "invalidEmail": "유효한 이메일 주소를 입력하세요",
      "invalidPassword": "비밀번호는 최소 8자 이상이어야 합니다",
      "passwordMismatch": "비밀번호가 일치하지 않습니다",
      "emailInUse": "이 이메일은 이미 사용 중입니다",
      "invalidCredentials": "잘못된 이메일 또는 비밀번호입니다",
      "generic": "오류가 발생했습니다. 다시 시도하세요"
    }
  },
  "actions": {
    "save": "저장",
    "cancel": "취소",
    "delete": "삭제",
    "edit": "편집",
    "add": "추가",
    "remove": "제거",
    "confirm": "확인",
    "back": "뒤로",
    "next": "다음",
    "finish": "완료",
    "skip": "건너뛰기",
    "close": "닫기",
    "search": "검색",
    "filter": "필터",
    "sort": "정렬",
    "refresh": "새로고침",
    "loading": "로딩 중...",
    "submit": "제출",
    "continue": "계속",
    "done": "완료",
    "apply": "적용",
    "clear": "지우기",
    "selectAll": "전체 선택",
    "deselectAll": "전체 선택 해제",
    "expandAll": "전체 펼치기",
    "collapseAll": "전체 접기"
  },
  "emptyState": {
    "noFriends": {
      "title": "아직 친구가 없습니다",
      "description": "첫 번째 친구를 추가하여 시작하세요",
      "action": "친구 추가"
    },
    "noResults": {
      "title": "결과 없음",
      "description": "검색 조건에 일치하는 항목이 없습니다",
      "action": "필터 지우기"
    },
    "noNotifications": {
      "title": "알림 없음",
      "description": "모두 확인했습니다!",
      "action": "새로고침"
    },
    "noActivity": {
      "title": "활동 없음",
      "description": "최근 활동이 여기에 표시됩니다",
      "action": "시작하기"
    }
  },
  "dashboard": {
    "title": "대시보드",
    "welcome": "안녕하세요, {{name}}님",
    "overview": "개요",
    "recentActivity": "최근 활동",
    "quickActions": "빠른 작업",
    "stats": {
      "totalFriends": "총 친구",
      "innerCircle": "내부 서클",
      "needsAttention": "관심 필요",
      "lastContact": "마지막 연락"
    },
    "widgets": {
      "upcomingBirthdays": "다가오는 생일",
      "recentContacts": "최근 연락",
      "suggestedActions": "추천 작업"
    }
  },
  "mission": {
    "title": "미션",
    "subtitle": "중요한 관계와 연결 상태를 유지하세요",
    "description": "미션은 친구들과 연결 상태를 유지하도록 도와줍니다",
    "complete": "미션 완료",
    "skip": "미션 건너뛰기",
    "remind": "나중에 알림",
    "empty": {
      "title": "활성 미션 없음",
      "description": "모두 완료했습니다! 새로운 미션은 곧 제공됩니다."
    },
    "types": {
      "call": "전화 미션",
      "message": "메시지 미션",
      "meetup": "만남 미션",
      "birthday": "생일 미션",
      "checkin": "체크인 미션"
    }
  },
  "tending": {
    "title": "친구 가꾸기",
    "subtitle": "관계는 정원과 같습니다 - 정기적인 관리가 필요합니다",
    "description": "연락할 시간이 된 친구들",
    "actions": {
      "markContacted": "연락 완료로 표시",
      "snooze": "다시 알림",
      "viewProfile": "프로필 보기"
    },
    "filters": {
      "all": "전체",
      "overdue": "기한 지남",
      "upcoming": "예정",
      "byTier": "티어별"
    },
    "frequency": {
      "daily": "매일",
      "weekly": "매주",
      "biweekly": "격주",
      "monthly": "매월",
      "quarterly": "분기별",
      "yearly": "매년"
    },
    "status": {
      "onTrack": "정상",
      "dueSoon": "곧 연락 필요",
      "overdue": "기한 지남",
      "needsAttention": "관심 필요"
    },
    "reminderTypes": {
      "call": "전화",
      "text": "문자",
      "visit": "방문",
      "email": "이메일"
    },
    "lastContact": "마지막 연락",
    "contactDue": "연락 예정",
    "noContactYet": "아직 연락 없음",
    "daysOverdue": "{{count}}일 지남",
    "dueIn": "{{count}}일 후 예정"
  },
  "nayborSOS": {
    "title": "NayborSOS",
    "subtitle": "가장 중요할 때 신뢰할 수 있는 서클에 도달하세요",
    "description": "긴급 네트워크는 위기 상황에서 도움을 줄 수 있는 신뢰할 수 있는 연락처입니다",
    "activate": "SOS 활성화",
    "deactivate": "SOS 비활성화",
    "status": {
      "active": "SOS 활성화됨",
      "inactive": "SOS 비활성화됨",
      "pending": "대기 중..."
    },
    "contacts": {
      "title": "긴급 연락처",
      "add": "긴급 연락처 추가",
      "remove": "긴급 연락처에서 제거",
      "empty": "아직 긴급 연락처가 설정되지 않았습니다"
    },
    "message": {
      "title": "긴급 메시지",
      "placeholder": "네트워크에 전송될 메시지를 입력하세요",
      "default": "도움이 필요합니다. 가능하면 연락해주세요."
    },
    "settings": {
      "title": "SOS 설정",
      "autoLocation": "자동으로 위치 공유",
      "confirmActivation": "활성화 전 확인",
      "cooldown": "활성화 간 대기 시간"
    }
  },
  "callActions": {
    "call": "전화하기",
    "video": "영상통화",
    "message": "메시지",
    "email": "이메일",
    "directions": "길찾기",
    "schedule": "일정 예약",
    "addNote": "메모 추가",
    "recordCall": "통화 기록",
    "shareContact": "연락처 공유"
  },
  "onboarding": {
    "welcome": {
      "title": "InnerFriend에 오신 것을 환영합니다",
      "subtitle": "의미 있는 관계 관리를 시작해봅시다",
      "description": "귀하의 내부 서클 경험을 맞춤화하기 위해 몇 가지 질문을 드리겠습니다"
    },
    "steps": {
      "profile": "프로필 만들기",
      "import": "연락처 가져오기",
      "categorize": "친구 분류",
      "preferences": "환경설정"
    },
    "import": {
      "title": "연락처 가져오기",
      "description": "기존 연락처를 가져와서 시작하세요",
      "fromPhone": "휴대폰 연락처에서",
      "fromGoogle": "Google 연락처에서",
      "manual": "수동으로 추가",
      "skip": "지금은 건너뛰기"
    },
    "complete": {
      "title": "모든 설정 완료!",
      "subtitle": "내부 서클 관리를 시작할 준비가 되었습니다",
      "action": "대시보드로 이동"
    }
  },
  "keysShared": {
    "title": "공유된 열쇠",
    "subtitle": "당신의 신뢰 서클에 대한 접근 관리",
    "description": "긴급 상황에서 당신의 내부 서클에 접근할 수 있는 사람들을 관리하세요",
    "grant": "열쇠 부여",
    "revoke": "열쇠 철회",
    "manage": "공유된 열쇠 관리",
    "permissions": {
      "view": "연락처 보기",
      "contact": "긴급 상황에서 연락 가능",
      "location": "위치 접근"
    },
    "doorKeyTree": {
      "title": "문 열쇠 트리",
      "description": "긴급 상황에서 당신의 내부 서클에 접근할 수 있는 신뢰할 수 있는 사람들",
      "empty": "아직 열쇠가 공유되지 않음"
    },
    "shareRequest": {
      "title": "열쇠 요청",
      "pending": "대기 중인 요청",
      "accept": "수락",
      "decline": "거절"
    },
    "sharedWithYou": "당신과 공유된 열쇠",
    "sharedByYou": "당신이 공유한 열쇠",
    "noSharedKeys": "아직 공유된 열쇠가 없습니다",
    "expiresAt": "만료: {{date}}",
    "neverExpires": "만료 없음"
  },
  "reserved": {
    "title": "예약된 섹션",
    "description": "이 기능은 프리미엄 사용자를 위해 예약되어 있습니다",
    "upgrade": "잠금 해제를 위해 업그레이드"
  },
  "addLinkedFriend": {
    "title": "연결된 친구 추가",
    "subtitle": "이미 InnerFriend를 사용하는 친구와 연결",
    "description": "아래 코드를 공유하거나 친구의 코드를 스캔하세요",
    "searchPlaceholder": "이름 또는 이메일로 검색",
    "noResults": "사용자를 찾을 수 없습니다",
    "sendRequest": "연결 요청 보내기",
    "pending": "요청 대기 중",
    "connected": "연결됨",
    "yourCode": "나의 코드",
    "scanCode": "코드 스캔",
    "enterCode": "코드 입력",
    "shareCode": "코드 공유"
  },
  "gdpr": {
    "title": "데이터 개인정보",
    "subtitle": "개인 데이터의 수집, 사용 및 보호 방법에 대해 알아보세요",
    "consent": {
      "title": "동의 관리",
      "description": "데이터 처리 동의 관리",
      "analytics": "분석 쿠키",
      "marketing": "마케팅 커뮤니케이션",
      "thirdParty": "제3자 공유",
      "withdraw": "동의 철회"
    },
    "rights": {
      "title": "귀하의 권리",
      "access": "데이터 접근",
      "rectification": "데이터 수정",
      "erasure": "데이터 삭제",
      "portability": "데이터 이식성",
      "restriction": "처리 제한",
      "objection": "처리 반대"
    },
    "export": {
      "title": "데이터 내보내기",
      "description": "모든 개인 데이터의 사본 다운로드",
      "button": "데이터 내보내기",
      "processing": "내보내기 준비 중...",
      "ready": "데이터 다운로드 준비 완료"
    },
    "delete": {
      "title": "계정 삭제",
      "description": "계정과 모든 관련 데이터를 영구적으로 삭제합니다. 이 작업은 취소할 수 없습니다.",
      "button": "계정 삭제",
      "confirm": "삭제를 확인하려면 '삭제'를 입력하세요",
      "warning": "이 작업은 되돌릴 수 없습니다"
    },
    "policy": {
      "title": "개인정보 처리방침",
      "lastUpdated": "마지막 업데이트",
      "readFull": "전체 정책 읽기"
    }
  },
  "admin": {
    "title": "관리자 패널",
    "dashboard": "관리자 대시보드",
    "users": {
      "title": "사용자 관리",
      "list": "모든 사용자",
      "active": "활성 사용자",
      "suspended": "정지된 사용자",
      "invite": "사용자 초대"
    },
    "settings": {
      "title": "시스템 설정",
      "general": "일반 설정",
      "security": "보안 설정",
      "notifications": "알림 설정"
    },
    "logs": {
      "title": "시스템 로그",
      "audit": "감사 로그",
      "error": "오류 로그",
      "access": "접근 로그"
    },
    "analytics": {
      "title": "분석",
      "overview": "개요",
      "users": "사용자 분석",
      "engagement": "참여 지표"
    }
  },
  "dev": {
    "title": "개발자 설정",
    "apiKeys": "API 키",
    "webhooks": "웹훅",
    "logs": "개발자 로그",
    "testing": "테스트 모드",
    "documentation": "API 문서"
  },
  "contactMethods": {
    "title": "연락 방법",
    "phone": "전화",
    "email": "이메일",
    "sms": "SMS",
    "whatsapp": "WhatsApp",
    "telegram": "Telegram",
    "signal": "Signal",
    "messenger": "Messenger",
    "instagram": "Instagram",
    "twitter": "Twitter",
    "linkedin": "LinkedIn",
    "discord": "Discord",
    "slack": "Slack",
    "other": "기타",
    "preferred": "선호하는 방법",
    "add": "연락 방법 추가",
    "primary": "기본",
    "secondary": "보조"
  },
  "post": {
    "title": "게시물 만들기",
    "placeholder": "무슨 생각을 하고 계세요?",
    "submit": "게시",
    "visibility": {
      "public": "공개",
      "friends": "친구만",
      "private": "나만 보기"
    },
    "actions": {
      "like": "좋아요",
      "comment": "댓글",
      "share": "공유",
      "save": "저장"
    }
  },
  "parasocial": {
    "title": "크리에이터 팔로우",
    "subtitle": "좋아하는 크리에이터와 연결",
    "description": "좋아하는 크리에이터를 팔로우하고 그들의 업데이트를 받으세요",
    "follow": "팔로우",
    "unfollow": "언팔로우",
    "following": "팔로잉",
    "followers": "팔로워",
    "noCreators": "크리에이터를 찾을 수 없습니다"
  },
  "profileSettings": {
    "title": "프로필 설정",
    "personalInfo": "개인 정보",
    "displayName": "표시 이름",
    "bio": "자기소개",
    "avatar": "아바타",
    "changeAvatar": "아바타 변경",
    "removeAvatar": "아바타 제거",
    "privacy": {
      "title": "개인정보 설정",
      "profileVisibility": "프로필 공개 설정",
      "showOnline": "온라인 상태 표시",
      "showLastSeen": "마지막 접속 표시"
    },
    "notifications": {
      "title": "알림 설정",
      "email": "이메일 알림",
      "push": "푸시 알림",
      "sms": "SMS 알림"
    },
    "account": {
      "title": "계정 설정",
      "changePassword": "비밀번호 변경",
      "twoFactor": "2단계 인증",
      "sessions": "활성 세션",
      "deleteAccount": "계정 삭제"
    }
  },
  "editFriend": {
    "title": "친구 편집",
    "basicInfo": "기본 정보",
    "name": "이름",
    "nickname": "별명",
    "birthday": "생일",
    "notes": "메모",
    "tier": "티어",
    "contactFrequency": "연락 빈도",
    "save": "변경사항 저장",
    "delete": "친구 삭제",
    "confirmDelete": "이 친구를 삭제하시겠습니까?"
  },
  "followCreator": {
    "title": "크리에이터 팔로우",
    "search": "크리에이터 검색",
    "suggested": "추천 크리에이터",
    "categories": "카테고리",
    "trending": "인기 크리에이터"
  },
  "dispatch": {
    "validation": {
      "required": "이 필드는 필수입니다",
      "invalidEmail": "유효한 이메일 주소를 입력하세요",
      "invalidPhone": "유효한 전화번호를 입력하세요",
      "minLength": "최소 {{min}}자 이상이어야 합니다",
      "maxLength": "최대 {{max}}자를 초과할 수 없습니다",
      "passwordMatch": "비밀번호가 일치해야 합니다",
      "invalidUrl": "유효한 URL을 입력하세요",
      "invalidDate": "유효한 날짜를 입력하세요",
      "futureDate": "날짜는 미래여야 합니다",
      "pastDate": "날짜는 과거여야 합니다"
    }
  },
  "privacy": {
    "title": "개인정보 처리방침",
    "lastUpdated": "마지막 업데이트: {{date}}",
    "sections": {
      "collection": {
        "title": "정보 수집",
        "description": "당사가 수집하는 정보와 수집 방법에 대해 설명합니다"
      },
      "usage": {
        "title": "정보 사용",
        "description": "수집된 정보의 사용 방법에 대해 설명합니다"
      },
      "sharing": {
        "title": "정보 공유",
        "description": "귀하의 정보를 공유하는 경우와 대상에 대해 설명합니다"
      },
      "security": {
        "title": "데이터 보안",
        "description": "귀하의 정보를 보호하는 방법에 대해 설명합니다"
      },
      "rights": {
        "title": "귀하의 권리",
        "description": "개인 데이터에 대한 귀하의 권리에 대해 설명합니다"
      },
      "cookies": {
        "title": "쿠키 및 추적",
        "description": "쿠키 및 유사 기술의 사용에 대해 설명합니다"
      },
      "children": {
        "title": "아동 개인정보",
        "description": "아동 개인정보 보호에 대한 당사의 정책"
      },
      "changes": {
        "title": "정책 변경",
        "description": "이 정책에 대한 변경 통보 방법"
      },
      "contact": {
        "title": "문의하기",
        "description": "개인정보 관련 질문이 있으시면 연락주세요"
      }
    }
  },
  "terms": {
    "title": "이용약관",
    "lastUpdated": "마지막 업데이트: {{date}}",
    "sections": {
      "acceptance": {
        "title": "약관 동의",
        "description": "InnerFriend를 사용함으로써 귀하는 본 약관에 동의합니다"
      },
      "eligibility": {
        "title": "사용 자격",
        "description": "당사 서비스 이용에 필요한 요건"
      },
      "accounts": {
        "title": "사용자 계정",
        "description": "귀하의 계정에 대한 책임"
      },
      "content": {
        "title": "사용자 콘텐츠",
        "description": "귀하가 제출하는 콘텐츠에 관한 규칙"
      },
      "prohibited": {
        "title": "금지 행위",
        "description": "당사 플랫폼에서 금지되는 행위"
      },
      "intellectual": {
        "title": "지적재산권",
        "description": "저작권 및 상표에 관한 정보"
      },
      "disclaimers": {
        "title": "면책 조항",
        "description": "InnerFriend는 보증 없이 「있는 그대로」 제공됩니다"
      },
      "liability": {
        "title": "책임 제한",
        "description": "당사 책임에 대한 제한"
      },
      "termination": {
        "title": "해지",
        "description": "계정 해지 가능 조건"
      },
      "governing": {
        "title": "준거법",
        "description": "본 약관에 적용되는 법률"
      },
      "contact": {
        "title": "문의하기",
        "description": "본 약관에 대한 질문 연락처"
      }
    }
  }
};

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

const localePath = path.join(__dirname, '../public/locales/ko/common.json');
const existing = JSON.parse(fs.readFileSync(localePath, 'utf8'));
const merged = deepMerge(existing, koreanTranslations);
fs.writeFileSync(localePath, JSON.stringify(merged, null, 2) + '\n');
console.log('Updated: ko');
console.log('Done! Korean translations applied.');
