const fs = require('fs');
const path = require('path');

// Japanese translations for all missing sections
const japaneseTranslations = {
  "landing": {
    "features": {
      "dataLiberation": {
        "title": "あなたのデータ、あなたの選択",
        "description": "いつでもすべてのデータをエクスポートできます。同意管理、アカウント削除、データポータビリティを完備したGDPR準拠。"
      },
      "nayborNetwork": {
        "title": "ネイバーネットワーク",
        "description": "信頼できる隣人とコミュニティのレジリエンスを構築。迅速なSOSアクセス、共有緊急連絡先、相互扶助。"
      },
      "globalReach": {
        "title": "23言語対応",
        "description": "アラビア語、ウルドゥー語、ヘブライ語のRTLサポートを含む完全な国際化。母国語でご利用いただけます。"
      }
    }
  },
  "auth": {
    "toasts": {
      "signOutError": "サインアウトに失敗しました",
      "signOutSuccess": "正常にサインアウトしました"
    }
  },
  "actions": {
    "refresh": "更新",
    "retry": "再試行",
    "share": "共有",
    "sharing": "共有中...",
    "selectAll": "すべて選択",
    "clear": "クリア",
    "copy": "コピー",
    "print": "印刷",
    "saving": "保存中..."
  },
  "emptyState": {
    "noPostsYet": "まだ投稿がありません",
    "noFriendsYet": {
      "core": "まだコア友達がいません",
      "inner": "まだインナーサークルの友達がいません",
      "outer": "まだアウターサークルの友達がいません"
    },
    "noPostsDescription": {
      "core": "コア友達はまだ何も共有していません。最初に何かを共有してみましょう！",
      "inner": "インナーサークルの友達はまだ何も共有していません。最初に何かを共有してみましょう！",
      "outer": "アウターサークルの友達はまだ何も共有していません。最初に何かを共有してみましょう！"
    },
    "getStarted": {
      "core": "コアに最大5人の友達を追加して始めましょう。",
      "inner": "インナーサークルに最大15人の友達を追加して始めましょう。",
      "outer": "アウターサークルに最大150人の友達を追加して始めましょう。"
    },
    "addToSee": {
      "core": "投稿を見るには最大5人の友達を追加してください。",
      "inner": "投稿を見るには最大15人の友達を追加してください。",
      "outer": "投稿を見るには最大150人の友達を追加してください。"
    },
    "addFriends": {
      "core": "コア友達を追加",
      "inner": "インナーサークル友達を追加",
      "outer": "アウターサークル友達を追加"
    },
    "createPost": "投稿を作成",
    "noParasoicalsYet": "まだパラソーシャルがいません",
    "noAcquaintedYet": "まだ知人がいません",
    "noRoleModelsYet": "まだロールモデルがいません",
    "noNayborsYet": "まだ隣人がいません",
    "addParasocialsHint": "フォローしているクリエイター、有名人、著名人を追加",
    "acquaintedHint": "時間の経過とともに連絡が途絶えた友達はここに再分類されます",
    "roleModelsHint": "あなたを良い人、より良い人、最高の人になるよう鼓舞する人生物語を持つ人々を追加",
    "nayborsHint": "隣人に自己紹介してここに追加",
    "addToCircleHint": "最も近いサークルに誰かを追加"
  },
  "labels": {
    "phone": "電話番号",
    "notes": "メモ",
    "handle": "ユーザー名"
  },
  "dashboard": {
    "title": "あなたのインナーサークル",
    "subtitle": "最も親しい関係を管理・維持",
    "loading": "サークルを読み込み中...",
    "tend": "ケア",
    "share": "共有",
    "localStorageHint": "💡 リストはローカルに保存されます。デバイス間の同期と相互マッチングを有効にするにはアカウントを作成してください。",
    "dunbarDisclaimer": "注意：これらのダンバー数に触発された層制限は、コミュニティ意識科学の進化に伴い変更される可能性があります。将来の変更には、特定の層カウントが他に影響するルールが含まれる可能性があります。例えば、パラソーシャル接続が許容されるアウター友達容量を減らす可能性があります。",
    "toasts": {
      "addedFriend": "{{name}}を{{tier}}サークルに追加しました",
      "movedFriend": "{{name}}を{{tier}}に移動しました",
      "moveError": "友達の移動に失敗しました",
      "removedFriend": "{{name}}をリストから削除しました",
      "addedReserved": "予約グループを{{tier}}に追加しました",
      "reservedError": "予約グループの追加に失敗しました",
      "updatedReserved": "予約グループを更新しました",
      "removedReserved": "予約グループを削除しました",
      "imported": "{{count}}人の友達をインポートしました",
      "imported_plural": "{{count}}人の友達をインポートしました",
      "skippedDuplicates": "{{count}}件の重複をスキップしました",
      "skippedDuplicates_plural": "{{count}}件の重複をスキップしました",
      "dataLiberation": "あなたのデータはあなたのものです。いつでもエクスポートして別の場所に持っていけます。"
    }
  },
  "mission": {
    "title": "フェイスタイム、広告タイムではなく",
    "description": "あなたがサイトを離れた時、私たちの勝利です—最も大切な人々と本当の瞬間を共有するために。",
    "learnMore": "詳しく見る...",
    "showLess": "閉じる",
    "inspiration": "私たちのインスピレーション？この古典的なDentyne Iceのコマーシャル—電話を置いて実際に会う時に最高の瞬間が起こることを完璧に思い出させてくれます：",
    "videoTitle": "Dentyne Ice - フェイスタイム",
    "quote": "「フェイスタイムを作ろう」—これが理想です。距離があなたを隔てている時、ビデオ通話で橋渡しするお手伝いをします。でも常に覚えていてください：実際にそこにいることに勝るものはありません。",
    "features": {
      "spark": {
        "title": "ビデオ通話を開始",
        "description": "離れていても、ワンクリックで接続"
      },
      "tend": {
        "title": "サークルをケア",
        "description": "つながりが薄れる前に連絡するリマインダー"
      },
      "pull": {
        "title": "より近くに引き寄せる",
        "description": "意味のあるつながりをより近い軌道に移動"
      }
    }
  },
  "tierSection": {
    "reserve": "予約",
    "reservedCount": "{{count}}件予約済み",
    "link": "リンク",
    "followCreator": "クリエイターをフォロー",
    "addRoleModel": "ロールモデルを追加",
    "add": "追加"
  },
  "tending": {
    "title": "サークルをケア",
    "markDescription": "{{period}}連絡していない{{tier}}友達をマーク",
    "periods": {
      "core": "今週",
      "inner": "この2週間",
      "outer": "この2ヶ月"
    },
    "peopleCount": "{{count}}人",
    "peopleCount_plural": "{{count}}人",
    "noFriendsInTier": "この層にはまだ友達がいません",
    "checkInstruction": "✓ 十分に話していない人をチェック：",
    "noPhone": "電話番号なし",
    "call": "電話",
    "maybeLater": "後で",
    "doneTending": "ケア完了",
    "finish": "完了",
    "mobileHint": "連絡アクションはモバイルデバイスで最適に動作します",
    "reconnect": {
      "title": "再接続の時間",
      "description": "これらの友達はあなたの時間を必要としています"
    },
    "toasts": {
      "allTended": "素晴らしい！すべてのサークルをケアしました 🌱",
      "noPhone": "{{name}}の電話番号がありません",
      "connecting": "{{method}}で{{name}}に接続中",
      "rememberReachOut": "近いうちに連絡することを忘れずに！💛",
      "friendsWaiting": "{{count}}人の友達があなたからの連絡を待っています",
      "friendsWaiting_plural": "{{count}}人の友達があなたからの連絡を待っています"
    }
  },
  "nayborSOS": {
    "steps": {
      "category": "どのような助けが必要ですか？",
      "contacts": "連絡する隣人を選択"
    },
    "critical": "緊急",
    "emergencyWarning": "命に関わる緊急事態は、まず119に電話してください",
    "suggestedActions": "推奨アクション：",
    "addDetails": "詳細を追加（任意）",
    "describePlaceholder": "状況を説明してください...",
    "includeLocation": "位置情報を含める",
    "chooseNaybors": "隣人を選択",
    "chooseNayborsAria": "連絡する隣人の選択を続ける",
    "nayborsSelected": "{{count}}人の隣人を選択",
    "nayborsSelected_plural": "{{count}}人の隣人を選択",
    "copyMessage": "メッセージをコピー",
    "messageAll": "全員にメッセージ（{{count}}）",
    "contacted": "{{count}}人の隣人に連絡済み",
    "contacted_plural": "{{count}}人の隣人に連絡済み",
    "toasts": {
      "messageCopied": "メッセージをクリップボードにコピーしました",
      "noNayborsSelected": "電話番号のある隣人が選択されていません"
    }
  },
  "callActions": {
    "startKall": "通話を開始",
    "kallNow": "今すぐ{{name}}に電話",
    "scheduleKall": "通話を予約",
    "scheduleWith": "{{name}}と予約",
    "sharedServices": "共有サービス：",
    "theirPreferences": "相手の好み：",
    "noMethods": "利用可能な連絡方法がありません",
    "requestInfo": "連絡先情報をリクエスト",
    "toasts": {
      "connecting": "{{service}}で接続中",
      "openService": "接続するには{{service}}を開いてください"
    }
  },
  "onboarding": {
    "steps": {
      "connect": {
        "title": "つながりを保つ",
        "description": "友達が簡単にあなたに連絡できるよう、連絡方法を追加してください。"
      },
      "channels": {
        "title": "チャンネルを追加",
        "description": "どのビデオ通話やメッセージングアプリを使っていますか？"
      },
      "complete": {
        "title": "準備完了！",
        "description": "友達があなたとの通話を開始または予約できるようになりました。"
      }
    },
    "skipForNow": "今はスキップ",
    "getStarted": "始める",
    "service": "サービス",
    "yourContactInfo": "あなたの{{service}}連絡先情報",
    "spontaneous": "即座",
    "scheduled": "予約",
    "addMethod": "方法を追加",
    "continue": "続行",
    "methodsAdded": "{{count}}件の連絡方法を追加しました",
    "methodsAdded_plural": "{{count}}件の連絡方法を追加しました",
    "publicProfile": "公開プロフィール",
    "privateProfile": "非公開プロフィール",
    "publicProfileHint": "誰でもあなたのユーザー名で見つけられます",
    "privateProfileHint": "確認済みの友達のみがプロフィールを見られます",
    "addMore": "さらに追加",
    "saving": "保存中...",
    "completeSetup": "セットアップ完了",
    "toasts": {
      "enterContactInfo": "連絡先情報を入力してください",
      "saveFailed": "連絡方法の保存に失敗しました"
    }
  },
  "keysShared": {
    "addressHelp": "この住所は、隣人があなたに代わって助けを求めた時に緊急対応者と共有されます。",
    "address": "住所",
    "addressPlaceholder": "東京都渋谷区1-2-3",
    "unitNumber": "部屋番号",
    "unitPlaceholder": "401号室",
    "entryInstructions": "特別な入室手順",
    "instructionsPlaceholder": "キーパッドはドアの右側、2回押してください...",
    "instructionsHint": "緊急対応者があなたの家にアクセスするために知っておくべき詳細を含めてください",
    "keyType": "アクセスタイプ",
    "keyTypes": {
      "physical": "物理的な鍵",
      "digital": "デジタルコード",
      "both": "両方"
    },
    "digitalCodeType": "コードタイプ",
    "codeTypes": {
      "keypad": "ドアキーパッド",
      "smart_lock": "スマートロックアプリ",
      "garage": "ガレージコード",
      "other": "その他"
    },
    "notes": "メモ（任意）",
    "notesPlaceholder": "鍵は青い植木鉢の下に...",
    "confirmKeyHolder": "確認",
    "currentKeyHolders": "現在の鍵保持者",
    "selectNaybors": "アクセス権を持つ隣人を追加：",
    "noNaybors": "鍵を共有するにはまず隣人を追加してください",
    "allNayborsAssigned": "すべての隣人が割り当てられました",
    "mandatoryScenarios": "必須の入室許可",
    "optionalScenarios": "オプションの入室許可",
    "optionalScenariosHelp": "これらのシナリオで隣人が入室できるかどうかを選択できます。",
    "mandatoryScenariosHelp": "これらの生命を脅かすまたは安全上重要なシナリオは常に入室を許可します。生命、身体、無実の人々をトラウマから守るため、無効にすることはできません。",
    "scenarios": {
      "cardiac_arrest": {
        "name": "心停止",
        "description": "心臓発作または突然の心停止—一秒一秒が重要です"
      },
      "choking": {
        "name": "窒息",
        "description": "窒息緊急事態—気道閉塞、即座の助けが必要"
      },
      "drowning": {
        "name": "溺水",
        "description": "プール、浴槽、その他の水での溺水"
      },
      "anaphylaxis": {
        "name": "アナフィラキシーショック",
        "description": "蜂刺され、食物、薬による重度のアレルギー反応"
      },
      "elderly_fall": {
        "name": "高齢者の転倒",
        "description": "高齢者が転倒し、起き上がれない、負傷の可能性"
      },
      "fire": {
        "name": "火災",
        "description": "火災検知—生命、身体、組織、動けない人や眠っている人への脅威"
      },
      "gas_leak": {
        "name": "ガス漏れ",
        "description": "ガス漏れ検知—爆発/中毒リスク"
      },
      "carbon_monoxide": {
        "name": "一酸化炭素",
        "description": "CO検知器のアラーム—サイレントキラー、居住者が意識不明の可能性"
      },
      "childhood_corporal": {
        "name": "子どもへの体罰",
        "description": "子どもが体罰について隣人に警告。研究はコミュニティの介入が将来の暴力を防ぐことを示しています。"
      },
      "take10_spiral": {
        "name": "Take 10叫びスパイラル",
        "description": "家庭内の叫び声が容認できないほどエスカレート。デエスカレーション介入が必要。"
      },
      "bedroom_consent": {
        "name": "寝室の同意紛争",
        "description": "寝室の同意紛争緊急事態を検知—即座の介入が必要"
      },
      "medical_other": {
        "name": "その他の医療緊急事態",
        "description": "家への入室が必要なその他の医療緊急事態"
      },
      "intruder_check": {
        "name": "侵入者確認",
        "description": "あなたが応答できない時の侵入者の疑いの確認"
      },
      "welfare_check": {
        "name": "安否確認",
        "description": "長時間応答がない時の一般的な安否確認"
      },
      "flooding": {
        "name": "浸水/水漏れ",
        "description": "水漏れまたは浸水—財産損害防止（生命を脅かすものではない）"
      }
    },
    "yourAddress": "あなたの住所",
    "noAddressSet": "住所が設定されていません",
    "unit": "部屋",
    "keyHoldersSummary": "{{count}}人の隣人が鍵を持っています",
    "keyHoldersSummary_plural": "{{count}}人の隣人が鍵を持っています",
    "noKeyHolders": "鍵保持者が割り当てられていません",
    "permissionsSummary": "入室許可",
    "mandatoryCount": "{{count}}",
    "mandatoryLabel": "必須（常に許可）",
    "optionalCount": "{{count}}",
    "optionalLabel": "オプションが有効",
    "reviewWarning": "これらの設定を保存することで、選択した緊急シナリオ中に指定した隣人があなたの家に入ることを許可します。これらの人々にあなたの家へのアクセスを信頼していることを確認してください。",
    "savePreferences": "設定を保存",
    "toasts": {
      "keyHolderAdded": "鍵保持者を追加しました",
      "keyHolderRemoved": "鍵保持者を削除しました",
      "saved": "共有鍵の設定を保存しました"
    }
  },
  "reserved": {
    "spotsCount_plural": "{{count}}件の予約スポット",
    "spotsLabel_plural": "予約スポット"
  },
  "addLinkedFriend": {
    "title": "{{tier}}にリンク友達を追加",
    "description": "連絡先情報で誰かを見つけて接続をリクエストします。",
    "findBy": "検索方法",
    "enterUsernameHint": "相手が設定した正確なユーザー名を入力",
    "enterContactHint": "相手が登録した正確な{{type}}を入力",
    "errors": {
      "noUserHandle": "そのユーザー名のユーザーが見つかりません。アカウントを持っていてユーザー名を設定していることを確認してください。",
      "noUserContact": "その{{type}}のユーザーが見つかりません。まだプロフィールに追加していない可能性があります。",
      "searchError": "検索中にエラーが発生しました。もう一度お試しください。",
      "connectionFailed": "接続リクエストの送信に失敗しました"
    },
    "userFound": "ユーザーが見つかりました",
    "showCircleLevel": "サークルレベルを表示",
    "circleVisibleHint": "あなたが{{tier}}として追加したことが相手に表示されます",
    "circleHiddenHint": "どのサークルに追加したかは相手に表示されません",
    "sendRequest": "接続リクエストを送信",
    "privacyNote": "承認されるまで、相手は見つけるために使用した連絡先情報のみを見ることができます。承認後、お互いの完全な連絡方法が表示されます。",
    "serviceTypes": {
      "phone": "電話番号",
      "email": "メールアドレス",
      "handle": "ユーザー名",
      "signal": "Signal",
      "telegram": "Telegram",
      "whatsapp": "WhatsApp",
      "facetime": "FaceTime"
    }
  },
  "gdpr": {
    "cookies": {
      "title": "Cookieを使用しています",
      "description": "体験を向上させるためにCookieを使用しています。必須Cookieはアプリの動作に必要です。",
      "learnMore": "詳しく見る",
      "customize": "カスタマイズ",
      "customizeAria": "Cookie設定をカスタマイズ",
      "essentialOnly": "必須のみ",
      "essentialOnlyAria": "必須Cookieのみを受け入れる",
      "acceptAll": "すべて受け入れる",
      "acceptAllAria": "すべてのCookieを受け入れる",
      "settingsTitle": "Cookie設定",
      "settingsDescription": "許可するCookieタイプを選択してください。必須Cookieはサイトの動作に必要なため、常に有効です。",
      "savePreferences": "設定を保存",
      "required": "必須",
      "essential": {
        "title": "必須Cookie",
        "description": "認証やセキュリティなどの基本的なサイト機能に必要です。"
      },
      "functional": {
        "title": "機能Cookie",
        "description": "言語設定やUIカスタマイズなどの設定を記憶します。"
      },
      "analytics": {
        "title": "分析Cookie",
        "description": "訪問者がサイトをどのように使用しているかを理解し、体験を改善するのに役立ちます。"
      },
      "marketing": {
        "title": "マーケティングCookie",
        "description": "関連性のある広告を配信し、キャンペーンの効果を追跡するために使用されます。"
      }
    },
    "settings": {
      "cookiePreferences": "Cookie設定",
      "cookieDescription": "使用を許可するCookieタイプを管理します。",
      "consentHistory": "同意履歴",
      "consentHistoryDescription": "同意記録を表示・管理します。",
      "consentGiven": "同意日",
      "consentVersion": "規約バージョン",
      "noConsent": "同意記録が見つかりません。Cookieポリシーを承認してください。",
      "withdrawConsent": "同意を撤回",
      "withdrawWarning": "同意を撤回するとCookie設定がリセットされ、一部の機能が制限される可能性があります。よろしいですか？",
      "confirmWithdraw": "はい、同意を撤回",
      "dataRights": "データの権利",
      "dataRightsDescription": "GDPRに基づき、データへのアクセス、エクスポート、削除の権利があります。",
      "exportData": "データをエクスポート",
      "exportDescription": "すべてのデータをポータブル形式でダウンロード",
      "deleteAccount": "アカウントを削除",
      "deleteDescription": "アカウントとすべてのデータを完全に削除"
    },
    "deletion": {
      "title": "アカウントを削除",
      "description": "これにより、アカウントと関連するすべてのデータが完全に削除されます。",
      "warningTitle": "警告：取り消しできません",
      "warningDescription": "削除後、アカウントとすべてのデータは完全に削除されます。保存したい場合は、先にデータをエクスポートしてください。",
      "whatDeleted": "削除される内容：",
      "deletedItems": {
        "profile": "プロフィールと個人情報",
        "connections": "すべての友達接続とサークル",
        "posts": "すべての投稿と共有コンテンツ",
        "preferences": "設定と環境設定",
        "keysShared": "共有鍵の緊急アクセス設定"
      },
      "gracePeriodTitle": "30日間の猶予期間",
      "gracePeriodDescription": "アカウントは{{days}}日後に削除がスケジュールされます。この期間中にサインインすることで削除をキャンセルできます。",
      "exportFirst": "削除前にデータをエクスポートしますか？",
      "exportData": "データをエクスポート",
      "exported": "データをエクスポートしました",
      "continue": "削除を続行",
      "confirmTitle": "アカウント削除の確認",
      "confirmDescription": "最終確認です。続行するには本人確認を行ってください。",
      "typeEmail": "確認のためメールアドレスを入力：{{email}}",
      "emailMismatch": "メールアドレスがアカウントと一致しません",
      "reasonLabel": "退会理由",
      "reasonPlaceholder": "退会理由を共有して改善にご協力ください...",
      "understandConsequences": "アカウントとすべてのデータは猶予期間後に完全に削除され、この操作は取り消しできないことを理解しています。",
      "deleting": "削除をスケジュール中...",
      "confirmDelete": "アカウントを削除",
      "scheduledTitle": "削除がスケジュールされました",
      "scheduledDescription": "アカウントの削除がスケジュールされました。",
      "scheduledDate": "アカウントは以下の日に完全に削除されます：",
      "cancelInfo": "削除をキャンセルするには、スケジュールされた日付より前にアカウントにサインインしてください。"
    },
    "age": {
      "title": "年齢確認",
      "description": "プライバシー規制に準拠するため、年齢を確認する必要があります。",
      "whyTitle": "なぜお聞きするのか",
      "whyDescription": "GDPRにより、{{age}}歳未満のユーザーはアカウント作成に保護者の同意が必要です。",
      "birthYearLabel": "何年生まれですか？",
      "selectYear": "年を選択",
      "privacyNote": "コンプライアンス目的で生まれ年のみを保存します。",
      "minorTitle": "保護者の同意が必要",
      "minorDescription": "{{age}}歳未満のユーザーには保護者の同意が必要です。アカウント作成は保護者にご相談ください。",
      "parentalRequired": "保護者の同意が必要",
      "verify": "年齢を確認"
    }
  },
  "admin": {
    "dispatch": {
      "title": "ディスパッチアカウント確認",
      "searchPlaceholder": "組織、メール、連絡先名で検索...",
      "filters": {
        "all": "すべてのアカウント"
      },
      "noAccounts": "条件に一致するアカウントが見つかりません",
      "accessDenied": {
        "title": "アクセス拒否",
        "description": "ディスパッチ確認パネルにアクセスする権限がありません。"
      },
      "actions": {
        "verify": "確認",
        "reject": "拒否",
        "suspend": "停止"
      },
      "success": {
        "verify": "アカウントを正常に確認しました",
        "reject": "アカウントを拒否しました",
        "suspend": "アカウントを停止しました"
      },
      "errors": {
        "fetchFailed": "アカウントの取得に失敗しました",
        "actionFailed": "操作に失敗しました。もう一度お試しください。"
      },
      "detail": {
        "description": "組織の詳細と確認書類を確認",
        "organization": "組織詳細",
        "name": "名前",
        "type": "タイプ",
        "jurisdictions": "管轄区域",
        "legal": "法的情報",
        "taxId": "税務ID",
        "insurance": "保険会社",
        "policyNumber": "証券番号",
        "registeredAgent": "登録代理人",
        "contact": "連絡先情報",
        "contactName": "連絡先名",
        "contactEmail": "メール",
        "contactPhone": "電話",
        "status": "アカウント状態",
        "verificationStatus": "状態",
        "createdAt": "申請日",
        "rejectionReason": "拒否理由"
      },
      "confirm": {
        "verifyTitle": "アカウントを確認しますか？",
        "verifyDescription": "これにより、緊急時に組織が住民のドアキーツリー情報にアクセスできるようになります。",
        "rejectTitle": "アカウントを拒否しますか？",
        "rejectDescription": "拒否理由を提供してください。これは組織と共有されます。",
        "suspendTitle": "アカウントを停止しますか？",
        "suspendDescription": "これにより組織のアクセスが即座に取り消されます。理由を提供してください。",
        "reason": "理由",
        "reasonPlaceholder": "このアカウントを拒否/停止する理由を説明してください...",
        "processing": "処理中..."
      }
    }
  },
  "dev": {
    "label": "開発",
    "panelTitle": "開発パネル",
    "mode": "開発モード",
    "authStatus": "認証状態",
    "notLoggedIn": "ログインしていません",
    "authActions": "認証アクション",
    "refreshButton": "更新",
    "clearApp": "アプリをクリア",
    "clearAll": "すべてクリア",
    "forceSignOut": "強制サインアウト",
    "toasts": {
      "clearStorage": "{{count}}件のアプリlocalStorageキーをクリアしました",
      "clearAll": "すべてのlocalStorageとsessionStorageをクリアしました",
      "signOut": "強制サインアウトし認証ストレージをクリアしました",
      "signOutFailed": "強制サインアウトに失敗しました",
      "refreshed": "セッションを更新しました",
      "refreshFailed": "セッションの更新に失敗しました"
    },
    "forceLogout": "強制ログアウト",
    "storageActions": "ストレージアクション",
    "storageInspector": "ストレージインスペクター",
    "noStorageData": "localStorageデータなし",
    "chars": "文字",
    "tips": {
      "title": "ヒント",
      "sessions": "セッションはページ更新後も保持されます",
      "clearApp": "友達リストをリセットするには「アプリデータをクリア」を使用",
      "forceLogout": "認証状態を完全にクリアするには「強制ログアウト」を使用"
    }
  },
  "contactMethods": {
    "title": "連絡方法",
    "subtitle": "友達があなたに連絡できるよう、お好みのビデオ通話やメッセージングサービスを追加",
    "addButton": "連絡方法を追加",
    "addButtonCompact": "追加",
    "addDialogTitle": "連絡方法を追加",
    "addDialogDescription": "友達がビデオ通話であなたに連絡する方法を追加",
    "serviceLabel": "サービス",
    "contactInfoLabel": "あなたの{{service}}連絡先情報",
    "labelOptional": "ラベル（任意）",
    "labelPlaceholder": "例：個人、仕事、自宅",
    "labelHint": "同じサービスの複数のアカウントを区別するのに役立ちます",
    "availableFor": "利用可能",
    "spontaneousKalls": "即時通話",
    "spontaneousTooltip": "友達が今すぐ接続したい時の即時ビデオ通話",
    "scheduledKalls": "予約通話",
    "scheduledTooltip": "特定の時間に事前に設定されたビデオ会議",
    "addMethod": "方法を追加",
    "dragToReorder": "ドラッグして並べ替え",
    "dragReorderHint": "優先順位を変更するにはドラッグしてください。#1があなたの優先方法です。",
    "noSpontaneousMethods": "即時通話方法がまだ追加されていません",
    "noScheduledMethods": "予約通話方法がまだ追加されていません"
  },
  "post": {
    "voiceNote": "ボイスメモ",
    "audioUnavailable": "音声が利用できません",
    "callInvitation": "通話招待",
    "joinCall": "参加",
    "meetupInvitation": "ミートアップ招待",
    "location": "場所：{{name}}",
    "rsvpYes": "参加する",
    "rsvpMaybe": "たぶん",
    "nearbyMessage": "近くにいます！",
    "lifeUpdate": "ライフアップデート",
    "call": "電話",
    "addContactInfo": "連絡先情報を追加",
    "addContactInfoTooltip": "{{name}}の連絡先情報を追加",
    "callViaHighFidelity": "{{method}}で電話（高品質）",
    "addMoreContactInfo": "連絡先情報をさらに追加",
    "usePhoneRecommendation": "最良の結果を得るには、通話にはスマートフォンを使用してください",
    "voiceReplyTooltip": "ボイス返信を送信（高品質）",
    "meetupTooltip": "ミートアップをスケジュール（高品質）",
    "commentTooltip": "コメントを追加",
    "likeTooltip": "この投稿にいいね",
    "likeTooltipHighFidelity": "いいね（より意味のあるインタラクションを検討してください）",
    "shareTooltip": "共有",
    "toasts": {
      "noContact": "連絡先情報がありません",
      "contactFailed": "連絡の開始に失敗しました",
      "noContactPerson": "この人の連絡先情報がありません"
    },
    "callVia": "{{method}}で電話",
    "voiceReply": "ボイス返信",
    "meetup": "ミートアップ",
    "comment": "コメント",
    "like": "いいね",
    "selectContactMethod": "連絡方法を選択",
    "warningPlatform": "警告：プラットフォームに監視の懸念がある可能性があります",
    "currentlySelected": "現在選択中",
    "dontShowMonth": "1ヶ月間表示しない",
    "warningSilenced": "{{method}}の警告は来月まで無効化されました",
    "connectingVia": "{{method}}で接続中"
  },
  "parasocial": {
    "creatorDashboard": "クリエイターダッシュボード",
    "shareContent": "コンテンツを共有",
    "shareNewContent": "新しいコンテンツを共有",
    "shareDescription": "パラソーシャルフォロワーとリンクを共有",
    "noContentShared": "まだコンテンツが共有されていません",
    "noContentHint": "フォロワーとエンゲージするためにリンクを共有",
    "title": "タイトル",
    "titlePlaceholder": "何を共有していますか？",
    "url": "URL",
    "urlPlaceholder": "https://...",
    "description": "説明",
    "descriptionPlaceholder": "簡単な説明（任意）",
    "deleteTitle": "この共有を削除しますか？",
    "deleteDescription": "フォロワーのフィードからリンクが削除されます。",
    "clicks": "{{count}}クリック",
    "clicks_plural": "{{count}}クリック",
    "engagement": "{{percent}}%エンゲージメント",
    "toasts": {
      "titleAndUrlRequired": "タイトルとURLは必須です",
      "invalidUrl": "有効なURLを入力してください",
      "sharedContent": "フォロワーにコンテンツを共有しました！",
      "deleted": "共有を削除しました"
    }
  },
  "profileSettings": {
    "title": "プロフィール設定",
    "description": "プロフィールと連絡先設定を管理",
    "tabs": {
      "profile": "プロフィール",
      "contact": "連絡先",
      "creator": "クリエイター"
    },
    "displayName": "表示名",
    "displayNamePlaceholder": "あなたの名前",
    "handle": "ユーザー名",
    "handlePlaceholder": "あなたのユーザー名",
    "handleHint": "3-30文字。英数字とアンダースコアのみ。",
    "publicProfile": "公開プロフィール",
    "publicProfileLabel": "公開プロフィール",
    "privateProfileLabel": "非公開プロフィール",
    "publicDescription": "誰でもプロフィールページを閲覧できます",
    "privateDescription": "あなたと確認済みの友達のみがプロフィールを閲覧できます",
    "parasocialMode": "パラソーシャルパーソナリティモード",
    "parasocialModeDescription": "あなたが公人、クリエイター、有名人で、ファンからのパラソーシャル接続を受け取り、コンテンツを共有したい場合に有効にしてください。",
    "parasocialModeHint": "有効にすると、他のユーザーがあなたをパラソーシャルサークルに追加し、共有するコンテンツを見ることができます。この変更を適用するにはプロフィールを保存してください。",
    "saveProfile": "プロフィールを保存",
    "saveSettings": "設定を保存",
    "toasts": {
      "updated": "プロフィールを更新しました",
      "updateFailed": "プロフィールの更新に失敗しました",
      "linkCopied": "リンクをコピーしました！"
    }
  },
  "editFriend": {
    "title": "連絡先を編集",
    "description": "{{name}}の連絡先情報を更新",
    "namePlaceholder": "友達の名前",
    "emailPlaceholder": "friend@example.com",
    "preferredContactMethod": "優先連絡方法",
    "selectContactMethod": "連絡方法を選択",
    "notesPlaceholder": "この人についてのメモ...",
    "saveChanges": "変更を保存"
  },
  "followCreator": {
    "title": "クリエイターをフォロー",
    "description": "確認済みのクリエイターを検索してフォローし、フィードでコンテンツを見る。",
    "searchLabel": "名前またはユーザー名で検索",
    "searchPlaceholder": "@クリエイターのユーザー名またはクリエイター名",
    "creatorModeHint": "クリエイターモードを有効にしたユーザーのみが検索結果に表示されます。",
    "toasts": {
      "following": "{{name}}をフォローしました",
      "alreadyFollowing": "すでにこのクリエイターをフォローしています",
      "followFailed": "フォローに失敗しました"
    },
    "errors": {
      "searching": "検索中にエラーが発生しました。",
      "noCreators": "検索に一致するクリエイターが見つかりません。まだクリエイターモードを有効にしていない可能性があります。",
      "noCreatorsFound": "検索に一致するクリエイターが見つかりません。"
    }
  },
  "dispatch": {
    "validation": {
      "organizationNameRequired": "組織名は必須です",
      "jurisdictionRequired": "少なくとも1つの管轄区域が必要です",
      "taxIdRequired": "税務IDは必須です",
      "insuranceRequired": "保険会社名は必須です",
      "policyRequired": "証券番号は必須です",
      "agentNameRequired": "登録代理人名は必須です",
      "agentContactRequired": "登録代理人の連絡先は必須です",
      "contactNameRequired": "主要連絡先名は必須です",
      "invalidEmail": "有効なメールアドレスを入力してください",
      "invalidPhone": "有効な電話番号を入力してください",
      "passwordMin": "パスワードは8文字以上である必要があります",
      "passwordMatch": "パスワードが一致する必要があります",
      "termsRequired": "規約に同意する必要があります"
    }
  },
  "privacy": {
    "title": "プライバシーポリシー",
    "lastUpdated": "最終更新：2025年1月1日",
    "philosophy": {
      "title": "私たちのプライバシー哲学",
      "description": "InnerFriendは基本的な前提に基づいて構築されています：あなたの関係はあなたのものです。私たちはあなたの注意を収益化したりデータを売ったりするソーシャルネットワークではありません。私たちは、最も大切な人々と意味のあるつながりを維持するのを助けるツールです。"
    },
    "dataCollection": {
      "title": "収集するデータ",
      "intro": "サービスを提供するために必要なものだけを収集します：",
      "items": {
        "account": "アカウント情報：アカウント作成時のメールとパスワード（暗号化）",
        "friends": "友達リスト：追加した人の名前とオプションの連絡先情報",
        "connections": "接続データ：有効にした場合の相互マッチングメタデータ",
        "preferences": "設定：言語や通知設定などのアプリ設定"
      }
    },
    "localStorage": {
      "title": "ローカルファースト",
      "description": "デフォルトでは、友達リストはデバイスにのみ保存されます。デバイス間同期や相互マッチングなどの機能のためにアカウントを作成することを選択しない限り、サーバーに触れることはありません。"
    },
    "noSelling": {
      "title": "データを販売することは決してありません",
      "description": "あなたのデータは販売されません。以上です。広告主、データブローカー、マーケティング目的のサードパーティと共有することはありません。"
    },
    "gdprRights": {
      "title": "あなたの権利（GDPRコンプライアンス）",
      "intro": "データを完全にコントロールできます：",
      "items": {
        "access": "アクセス：いつでもすべてのデータをポータブル形式でエクスポート",
        "deletion": "削除：ワンクリックでアカウントと関連するすべてのデータを削除",
        "rectification": "訂正：情報を更新または修正",
        "portability": "ポータビリティ：データを他のダンバー互換ソーシャルネットワークに持っていく"
      }
    },
    "security": {
      "title": "セキュリティ",
      "description": "転送中および保存中のデータに業界標準の暗号化を使用しています。パスワードはハッシュ化され、プレーンテキストで保存されることはありません。"
    },
    "contact": {
      "title": "お問い合わせ",
      "description": "プライバシーに関する質問は、privacy@lifesaverlabs.orgまでご連絡ください"
    }
  },
  "terms": {
    "title": "利用規約",
    "lastUpdated": "最終更新：2025年1月1日",
    "introduction": {
      "title": "はじめに",
      "description": "InnerFriendへようこそ。サービスを利用することで、これらの規約に同意したことになります。シンプルで読みやすくしています。"
    },
    "service": {
      "title": "サービス",
      "description": "InnerFriendは、ソーシャルサークルを整理・管理するツールを提供することで、意味のある関係を維持するのを助けます。私たちはソーシャルプラットフォームではありません—公開コンテンツをホストしたり、公開接続を促進したりしません。"
    },
    "responsibilities": {
      "title": "あなたの責任",
      "intro": "InnerFriendを使用することで、以下に同意します：",
      "items": {
        "accurate": "アカウント作成時に正確な情報を提供する",
        "secure": "ログイン資格情報を安全に保つ",
        "privacy": "リストに追加した人のプライバシーを尊重する",
        "lawful": "サービスを合法的な目的にのみ使用する"
      }
    },
    "intellectualProperty": {
      "title": "知的財産",
      "description": "InnerFriendはMITライセンスの下でオープンソースです。あなたのデータはあなたのもので、完全な所有権を保持します。"
    },
    "liability": {
      "title": "責任の制限",
      "description": "InnerFriendは保証なしに「現状のまま」提供されます。サービスの使用から生じるいかなる損害についても責任を負いません。"
    },
    "termination": {
      "title": "終了",
      "description": "いつでもアカウントを削除できます。これらの規約に違反するアカウントを終了する権利を留保します。"
    },
    "changes": {
      "title": "規約の変更",
      "description": "これらの規約を随時更新する場合があります。重大な変更についてはメールまたはアプリを通じてお知らせします。"
    },
    "contact": {
      "title": "お問い合わせ",
      "description": "質問は、support@lifesaverlabs.orgまでご連絡ください"
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

// Update Japanese locale
const localePath = path.join(__dirname, '../public/locales/ja/common.json');
const existing = JSON.parse(fs.readFileSync(localePath, 'utf8'));
const merged = deepMerge(existing, japaneseTranslations);
fs.writeFileSync(localePath, JSON.stringify(merged, null, 2) + '\n');
console.log('Updated: ja');
console.log('Done! Japanese translations applied.');
