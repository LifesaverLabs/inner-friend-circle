const fs = require('fs');
const path = require('path');

const vietnameseTranslations = {
  "landing": {
    "hero": {
      "title": "Kết nối với những người thực sự quan trọng",
      "subtitle": "InnerFriend giúp bạn quản lý các mối quan hệ thân thiết nhất và duy trì kết nối với những người bạn quan tâm",
      "cta": "Bắt đầu",
      "learnMore": "Tìm hiểu thêm"
    },
    "features": {
      "title": "Tính năng",
      "organize": {
        "title": "Tổ chức bạn bè",
        "description": "Phân loại bạn thân theo tầng dựa trên loại mối quan hệ và mức độ thân thiết"
      },
      "remind": {
        "title": "Duy trì kết nối",
        "description": "Nhận nhắc nhở khi đã quá lâu không liên lạc để duy trì mối quan hệ"
      },
      "emergency": {
        "title": "Mạng lưới khẩn cấp",
        "description": "Xây dựng vòng tròn đáng tin cậy để liên hệ trong trường hợp khẩn cấp"
      }
    },
    "privacy": {
      "title": "Ưu tiên quyền riêng tư",
      "description": "Dữ liệu của bạn thuộc về bạn. Duy trì quyền kiểm soát hoàn toàn đối với mạng xã hội của bạn."
    },
    "cta": {
      "title": "Sẵn sàng bắt đầu hành trình?",
      "subtitle": "Hãy bắt đầu xây dựng các mối quan hệ có ý nghĩa với InnerFriend ngay hôm nay",
      "button": "Bắt đầu miễn phí"
    }
  },
  "auth": {
    "signIn": "Đăng nhập",
    "signUp": "Đăng ký",
    "signOut": "Đăng xuất",
    "email": "Email",
    "password": "Mật khẩu",
    "confirmPassword": "Xác nhận mật khẩu",
    "forgotPassword": "Quên mật khẩu?",
    "resetPassword": "Đặt lại mật khẩu",
    "noAccount": "Chưa có tài khoản?",
    "hasAccount": "Đã có tài khoản?",
    "continueWith": "Tiếp tục với {{provider}}",
    "orContinueWith": "Hoặc tiếp tục với",
    "signingIn": "Đang đăng nhập...",
    "signingUp": "Đang đăng ký...",
    "errors": {
      "invalidEmail": "Vui lòng nhập địa chỉ email hợp lệ",
      "invalidPassword": "Mật khẩu phải có ít nhất 8 ký tự",
      "passwordMismatch": "Mật khẩu không khớp",
      "emailInUse": "Email này đã được sử dụng",
      "invalidCredentials": "Email hoặc mật khẩu không đúng",
      "generic": "Đã xảy ra lỗi. Vui lòng thử lại"
    }
  },
  "actions": {
    "save": "Lưu",
    "cancel": "Hủy",
    "delete": "Xóa",
    "edit": "Chỉnh sửa",
    "add": "Thêm",
    "remove": "Xóa bỏ",
    "confirm": "Xác nhận",
    "back": "Quay lại",
    "next": "Tiếp theo",
    "finish": "Hoàn thành",
    "skip": "Bỏ qua",
    "close": "Đóng",
    "search": "Tìm kiếm",
    "filter": "Lọc",
    "sort": "Sắp xếp",
    "refresh": "Làm mới",
    "loading": "Đang tải...",
    "submit": "Gửi",
    "continue": "Tiếp tục",
    "done": "Xong",
    "apply": "Áp dụng",
    "clear": "Xóa",
    "selectAll": "Chọn tất cả",
    "deselectAll": "Bỏ chọn tất cả",
    "expandAll": "Mở rộng tất cả",
    "collapseAll": "Thu gọn tất cả"
  },
  "emptyState": {
    "noFriends": {
      "title": "Chưa có bạn bè",
      "description": "Hãy bắt đầu bằng cách thêm người bạn đầu tiên",
      "action": "Thêm bạn"
    },
    "noResults": {
      "title": "Không có kết quả",
      "description": "Không có gì phù hợp với tiêu chí tìm kiếm của bạn",
      "action": "Xóa bộ lọc"
    },
    "noNotifications": {
      "title": "Không có thông báo",
      "description": "Bạn đã xem hết rồi!",
      "action": "Làm mới"
    },
    "noActivity": {
      "title": "Không có hoạt động",
      "description": "Hoạt động gần đây của bạn sẽ hiển thị ở đây",
      "action": "Bắt đầu"
    }
  },
  "dashboard": {
    "title": "Bảng điều khiển",
    "welcome": "Xin chào, {{name}}",
    "overview": "Tổng quan",
    "recentActivity": "Hoạt động gần đây",
    "quickActions": "Thao tác nhanh",
    "stats": {
      "totalFriends": "Tổng số bạn",
      "innerCircle": "Vòng tròn thân",
      "needsAttention": "Cần chú ý",
      "lastContact": "Liên hệ cuối"
    },
    "widgets": {
      "upcomingBirthdays": "Sinh nhật sắp tới",
      "recentContacts": "Liên hệ gần đây",
      "suggestedActions": "Đề xuất hành động"
    }
  },
  "mission": {
    "title": "Nhiệm vụ",
    "subtitle": "Duy trì kết nối với những mối quan hệ quan trọng",
    "description": "Nhiệm vụ giúp bạn giữ liên lạc với bạn bè",
    "complete": "Hoàn thành nhiệm vụ",
    "skip": "Bỏ qua nhiệm vụ",
    "remind": "Nhắc tôi sau",
    "empty": {
      "title": "Không có nhiệm vụ đang hoạt động",
      "description": "Bạn đã hoàn thành tất cả! Nhiệm vụ mới sẽ sớm có."
    },
    "types": {
      "call": "Nhiệm vụ gọi điện",
      "message": "Nhiệm vụ nhắn tin",
      "meetup": "Nhiệm vụ gặp mặt",
      "birthday": "Nhiệm vụ sinh nhật",
      "checkin": "Nhiệm vụ hỏi thăm"
    }
  },
  "tending": {
    "title": "Chăm sóc bạn bè",
    "subtitle": "Các mối quan hệ giống như một khu vườn - cần được chăm sóc thường xuyên",
    "description": "Những người bạn cần liên lạc",
    "actions": {
      "markContacted": "Đánh dấu đã liên hệ",
      "snooze": "Tạm hoãn",
      "viewProfile": "Xem hồ sơ"
    },
    "filters": {
      "all": "Tất cả",
      "overdue": "Quá hạn",
      "upcoming": "Sắp đến",
      "byTier": "Theo tầng"
    },
    "frequency": {
      "daily": "Hàng ngày",
      "weekly": "Hàng tuần",
      "biweekly": "Hai tuần một lần",
      "monthly": "Hàng tháng",
      "quarterly": "Hàng quý",
      "yearly": "Hàng năm"
    },
    "status": {
      "onTrack": "Đúng tiến độ",
      "dueSoon": "Sắp đến hạn",
      "overdue": "Quá hạn",
      "needsAttention": "Cần chú ý"
    },
    "reminderTypes": {
      "call": "Gọi điện",
      "text": "Nhắn tin",
      "visit": "Thăm",
      "email": "Email"
    },
    "lastContact": "Liên hệ cuối",
    "contactDue": "Hạn liên hệ",
    "noContactYet": "Chưa liên hệ",
    "daysOverdue": "Quá hạn {{count}} ngày",
    "dueIn": "Còn {{count}} ngày"
  },
  "nayborSOS": {
    "title": "NayborSOS",
    "subtitle": "Tiếp cận vòng tròn tin cậy của bạn khi cần nhất",
    "description": "Mạng lưới khẩn cấp là những người liên hệ đáng tin cậy có thể giúp đỡ trong tình huống khẩn cấp",
    "activate": "Kích hoạt SOS",
    "deactivate": "Hủy kích hoạt SOS",
    "status": {
      "active": "SOS đang hoạt động",
      "inactive": "SOS không hoạt động",
      "pending": "Đang chờ..."
    },
    "contacts": {
      "title": "Liên hệ khẩn cấp",
      "add": "Thêm liên hệ khẩn cấp",
      "remove": "Xóa khỏi danh sách khẩn cấp",
      "empty": "Chưa thiết lập liên hệ khẩn cấp"
    },
    "message": {
      "title": "Tin nhắn khẩn cấp",
      "placeholder": "Nhập tin nhắn sẽ gửi đến mạng lưới của bạn",
      "default": "Tôi cần giúp đỡ. Hãy liên hệ với tôi nếu bạn có thể."
    },
    "settings": {
      "title": "Cài đặt SOS",
      "autoLocation": "Tự động chia sẻ vị trí",
      "confirmActivation": "Xác nhận trước khi kích hoạt",
      "cooldown": "Thời gian chờ giữa các lần kích hoạt"
    }
  },
  "callActions": {
    "call": "Gọi điện",
    "video": "Gọi video",
    "message": "Nhắn tin",
    "email": "Email",
    "directions": "Chỉ đường",
    "schedule": "Lên lịch",
    "addNote": "Thêm ghi chú",
    "recordCall": "Ghi lại cuộc gọi",
    "shareContact": "Chia sẻ liên hệ"
  },
  "onboarding": {
    "welcome": {
      "title": "Chào mừng đến với InnerFriend",
      "subtitle": "Hãy bắt đầu quản lý các mối quan hệ có ý nghĩa",
      "description": "Chúng tôi sẽ hỏi bạn một vài câu để tùy chỉnh trải nghiệm vòng tròn thân"
    },
    "steps": {
      "profile": "Tạo hồ sơ",
      "import": "Nhập danh bạ",
      "categorize": "Phân loại bạn bè",
      "preferences": "Tùy chọn"
    },
    "import": {
      "title": "Nhập danh bạ",
      "description": "Bắt đầu bằng cách nhập danh bạ hiện có",
      "fromPhone": "Từ danh bạ điện thoại",
      "fromGoogle": "Từ Google Contacts",
      "manual": "Thêm thủ công",
      "skip": "Bỏ qua bây giờ"
    },
    "complete": {
      "title": "Tất cả đã sẵn sàng!",
      "subtitle": "Bạn đã sẵn sàng bắt đầu quản lý vòng tròn thân của mình",
      "action": "Đi đến bảng điều khiển"
    }
  },
  "keysShared": {
    "title": "Khóa đã chia sẻ",
    "subtitle": "Quản lý quyền truy cập vào vòng tròn tin cậy của bạn",
    "description": "Quản lý những người có thể truy cập vào vòng tròn thân của bạn trong trường hợp khẩn cấp",
    "grant": "Cấp khóa",
    "revoke": "Thu hồi khóa",
    "manage": "Quản lý khóa đã chia sẻ",
    "permissions": {
      "view": "Xem danh bạ",
      "contact": "Có thể liên hệ trong trường hợp khẩn cấp",
      "location": "Truy cập vị trí"
    },
    "doorKeyTree": {
      "title": "Cây chìa khóa cửa",
      "description": "Những người đáng tin cậy có thể truy cập vào vòng tròn thân của bạn trong trường hợp khẩn cấp",
      "empty": "Chưa chia sẻ khóa nào"
    },
    "shareRequest": {
      "title": "Yêu cầu khóa",
      "pending": "Yêu cầu đang chờ",
      "accept": "Chấp nhận",
      "decline": "Từ chối"
    },
    "sharedWithYou": "Khóa được chia sẻ với bạn",
    "sharedByYou": "Khóa bạn đã chia sẻ",
    "noSharedKeys": "Chưa có khóa được chia sẻ",
    "expiresAt": "Hết hạn: {{date}}",
    "neverExpires": "Không hết hạn"
  },
  "reserved": {
    "title": "Phần dành riêng",
    "description": "Tính năng này dành riêng cho người dùng cao cấp",
    "upgrade": "Nâng cấp để mở khóa"
  },
  "addLinkedFriend": {
    "title": "Thêm bạn liên kết",
    "subtitle": "Kết nối với bạn bè đã sử dụng InnerFriend",
    "description": "Chia sẻ mã của bạn bên dưới hoặc quét mã của bạn bè",
    "searchPlaceholder": "Tìm kiếm theo tên hoặc email",
    "noResults": "Không tìm thấy người dùng",
    "sendRequest": "Gửi yêu cầu kết nối",
    "pending": "Đang chờ yêu cầu",
    "connected": "Đã kết nối",
    "yourCode": "Mã của bạn",
    "scanCode": "Quét mã",
    "enterCode": "Nhập mã",
    "shareCode": "Chia sẻ mã"
  },
  "gdpr": {
    "title": "Quyền riêng tư dữ liệu",
    "subtitle": "Tìm hiểu cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn",
    "consent": {
      "title": "Quản lý đồng ý",
      "description": "Quản lý sự đồng ý xử lý dữ liệu của bạn",
      "analytics": "Cookie phân tích",
      "marketing": "Truyền thông tiếp thị",
      "thirdParty": "Chia sẻ bên thứ ba",
      "withdraw": "Rút lại đồng ý"
    },
    "rights": {
      "title": "Quyền của bạn",
      "access": "Truy cập dữ liệu",
      "rectification": "Sửa đổi dữ liệu",
      "erasure": "Xóa dữ liệu",
      "portability": "Di chuyển dữ liệu",
      "restriction": "Hạn chế xử lý",
      "objection": "Phản đối xử lý"
    },
    "export": {
      "title": "Xuất dữ liệu",
      "description": "Tải xuống bản sao của tất cả dữ liệu cá nhân của bạn",
      "button": "Xuất dữ liệu",
      "processing": "Đang chuẩn bị xuất...",
      "ready": "Dữ liệu sẵn sàng tải xuống"
    },
    "delete": {
      "title": "Xóa tài khoản",
      "description": "Xóa vĩnh viễn tài khoản và tất cả dữ liệu liên quan. Hành động này không thể hoàn tác.",
      "button": "Xóa tài khoản",
      "confirm": "Nhập 'XÓA' để xác nhận",
      "warning": "Hành động này không thể hoàn tác"
    },
    "policy": {
      "title": "Chính sách quyền riêng tư",
      "lastUpdated": "Cập nhật lần cuối",
      "readFull": "Đọc toàn bộ chính sách"
    }
  },
  "admin": {
    "title": "Bảng quản trị",
    "dashboard": "Bảng điều khiển quản trị",
    "users": {
      "title": "Quản lý người dùng",
      "list": "Tất cả người dùng",
      "active": "Người dùng hoạt động",
      "suspended": "Người dùng bị đình chỉ",
      "invite": "Mời người dùng"
    },
    "settings": {
      "title": "Cài đặt hệ thống",
      "general": "Cài đặt chung",
      "security": "Cài đặt bảo mật",
      "notifications": "Cài đặt thông báo"
    },
    "logs": {
      "title": "Nhật ký hệ thống",
      "audit": "Nhật ký kiểm toán",
      "error": "Nhật ký lỗi",
      "access": "Nhật ký truy cập"
    },
    "analytics": {
      "title": "Phân tích",
      "overview": "Tổng quan",
      "users": "Phân tích người dùng",
      "engagement": "Số liệu tương tác"
    }
  },
  "dev": {
    "title": "Cài đặt nhà phát triển",
    "apiKeys": "Khóa API",
    "webhooks": "Webhooks",
    "logs": "Nhật ký nhà phát triển",
    "testing": "Chế độ thử nghiệm",
    "documentation": "Tài liệu API"
  },
  "contactMethods": {
    "title": "Phương thức liên hệ",
    "phone": "Điện thoại",
    "email": "Email",
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
    "other": "Khác",
    "preferred": "Phương thức ưu tiên",
    "add": "Thêm phương thức liên hệ",
    "primary": "Chính",
    "secondary": "Phụ"
  },
  "post": {
    "title": "Tạo bài viết",
    "placeholder": "Bạn đang nghĩ gì?",
    "submit": "Đăng",
    "visibility": {
      "public": "Công khai",
      "friends": "Chỉ bạn bè",
      "private": "Riêng tư"
    },
    "actions": {
      "like": "Thích",
      "comment": "Bình luận",
      "share": "Chia sẻ",
      "save": "Lưu"
    }
  },
  "parasocial": {
    "title": "Theo dõi nhà sáng tạo",
    "subtitle": "Kết nối với những nhà sáng tạo yêu thích",
    "description": "Theo dõi những nhà sáng tạo yêu thích của bạn và nhận cập nhật từ họ",
    "follow": "Theo dõi",
    "unfollow": "Bỏ theo dõi",
    "following": "Đang theo dõi",
    "followers": "Người theo dõi",
    "noCreators": "Không tìm thấy nhà sáng tạo"
  },
  "profileSettings": {
    "title": "Cài đặt hồ sơ",
    "personalInfo": "Thông tin cá nhân",
    "displayName": "Tên hiển thị",
    "bio": "Giới thiệu",
    "avatar": "Ảnh đại diện",
    "changeAvatar": "Đổi ảnh đại diện",
    "removeAvatar": "Xóa ảnh đại diện",
    "privacy": {
      "title": "Cài đặt quyền riêng tư",
      "profileVisibility": "Hiển thị hồ sơ",
      "showOnline": "Hiển thị trạng thái trực tuyến",
      "showLastSeen": "Hiển thị lần truy cập cuối"
    },
    "notifications": {
      "title": "Cài đặt thông báo",
      "email": "Thông báo email",
      "push": "Thông báo đẩy",
      "sms": "Thông báo SMS"
    },
    "account": {
      "title": "Cài đặt tài khoản",
      "changePassword": "Đổi mật khẩu",
      "twoFactor": "Xác thực hai yếu tố",
      "sessions": "Phiên hoạt động",
      "deleteAccount": "Xóa tài khoản"
    }
  },
  "editFriend": {
    "title": "Chỉnh sửa bạn bè",
    "basicInfo": "Thông tin cơ bản",
    "name": "Tên",
    "nickname": "Biệt danh",
    "birthday": "Sinh nhật",
    "notes": "Ghi chú",
    "tier": "Tầng",
    "contactFrequency": "Tần suất liên hệ",
    "save": "Lưu thay đổi",
    "delete": "Xóa bạn",
    "confirmDelete": "Bạn có chắc muốn xóa người bạn này?"
  },
  "followCreator": {
    "title": "Theo dõi nhà sáng tạo",
    "search": "Tìm kiếm nhà sáng tạo",
    "suggested": "Đề xuất cho bạn",
    "categories": "Danh mục",
    "trending": "Đang thịnh hành"
  },
  "dispatch": {
    "validation": {
      "required": "Trường này là bắt buộc",
      "invalidEmail": "Vui lòng nhập địa chỉ email hợp lệ",
      "invalidPhone": "Vui lòng nhập số điện thoại hợp lệ",
      "minLength": "Phải có ít nhất {{min}} ký tự",
      "maxLength": "Không được vượt quá {{max}} ký tự",
      "passwordMatch": "Mật khẩu phải khớp",
      "invalidUrl": "Vui lòng nhập URL hợp lệ",
      "invalidDate": "Vui lòng nhập ngày hợp lệ",
      "futureDate": "Ngày phải ở tương lai",
      "pastDate": "Ngày phải ở quá khứ"
    }
  },
  "privacy": {
    "title": "Chính sách quyền riêng tư",
    "lastUpdated": "Cập nhật lần cuối: {{date}}",
    "sections": {
      "collection": {
        "title": "Thu thập thông tin",
        "description": "Thông tin chúng tôi thu thập và cách chúng tôi thu thập"
      },
      "usage": {
        "title": "Sử dụng thông tin",
        "description": "Cách chúng tôi sử dụng thông tin thu thập được"
      },
      "sharing": {
        "title": "Chia sẻ thông tin",
        "description": "Khi nào và với ai chúng tôi chia sẻ thông tin của bạn"
      },
      "security": {
        "title": "Bảo mật dữ liệu",
        "description": "Cách chúng tôi bảo vệ thông tin của bạn"
      },
      "rights": {
        "title": "Quyền của bạn",
        "description": "Quyền của bạn liên quan đến dữ liệu cá nhân"
      },
      "cookies": {
        "title": "Cookie và theo dõi",
        "description": "Việc sử dụng cookie và các công nghệ tương tự"
      },
      "children": {
        "title": "Quyền riêng tư của trẻ em",
        "description": "Chính sách của chúng tôi về quyền riêng tư của trẻ em"
      },
      "changes": {
        "title": "Thay đổi chính sách",
        "description": "Cách chúng tôi thông báo về các thay đổi của chính sách này"
      },
      "contact": {
        "title": "Liên hệ với chúng tôi",
        "description": "Liên hệ nếu có câu hỏi về quyền riêng tư"
      }
    }
  },
  "terms": {
    "title": "Điều khoản dịch vụ",
    "lastUpdated": "Cập nhật lần cuối: {{date}}",
    "sections": {
      "acceptance": {
        "title": "Chấp nhận điều khoản",
        "description": "Bằng cách sử dụng InnerFriend, bạn đồng ý với các điều khoản này"
      },
      "eligibility": {
        "title": "Điều kiện sử dụng",
        "description": "Yêu cầu để sử dụng dịch vụ của chúng tôi"
      },
      "accounts": {
        "title": "Tài khoản người dùng",
        "description": "Trách nhiệm của bạn đối với tài khoản"
      },
      "content": {
        "title": "Nội dung người dùng",
        "description": "Quy tắc về nội dung bạn gửi lên"
      },
      "prohibited": {
        "title": "Hoạt động bị cấm",
        "description": "Những gì bị cấm trên nền tảng của chúng tôi"
      },
      "intellectual": {
        "title": "Sở hữu trí tuệ",
        "description": "Thông tin về bản quyền và thương hiệu"
      },
      "disclaimers": {
        "title": "Tuyên bố miễn trừ",
        "description": "InnerFriend được cung cấp \"nguyên trạng\" không có bảo đảm"
      },
      "liability": {
        "title": "Giới hạn trách nhiệm",
        "description": "Giới hạn về trách nhiệm của chúng tôi"
      },
      "termination": {
        "title": "Chấm dứt",
        "description": "Khi nào tài khoản có thể bị chấm dứt"
      },
      "governing": {
        "title": "Luật điều chỉnh",
        "description": "Luật điều chỉnh các điều khoản này"
      },
      "contact": {
        "title": "Liên hệ với chúng tôi",
        "description": "Nơi liên hệ nếu có câu hỏi về các điều khoản này"
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

const localePath = path.join(__dirname, '../public/locales/vi/common.json');
const existing = JSON.parse(fs.readFileSync(localePath, 'utf8'));
const merged = deepMerge(existing, vietnameseTranslations);
fs.writeFileSync(localePath, JSON.stringify(merged, null, 2) + '\n');
console.log('Updated: vi');
console.log('Done! Vietnamese translations applied.');
