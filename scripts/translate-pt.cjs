const fs = require('fs');
const path = require('path');

// Portuguese (Brazilian) translations for all missing sections
const portugueseTranslations = {
  "landing": {
    "features": {
      "dataLiberation": {
        "title": "Seus Dados, Sua Escolha",
        "description": "Exporte todos os seus dados a qualquer momento. Conforme com GDPR com gestão completa de consentimento, exclusão de conta e portabilidade de dados."
      },
      "nayborNetwork": {
        "title": "Rede Naybor",
        "description": "Construa resiliência comunitária com vizinhos de confiança. Acesso SOS rápido, contatos de emergência compartilhados e ajuda mútua."
      },
      "globalReach": {
        "title": "23 Idiomas",
        "description": "Internacionalização completa com suporte RTL para árabe, urdu e hebraico. Disponível no seu idioma nativo."
      }
    }
  },
  "auth": {
    "toasts": {
      "signOutError": "Falha ao sair",
      "signOutSuccess": "Saiu com sucesso"
    }
  },
  "actions": {
    "refresh": "Atualizar",
    "retry": "Tentar novamente",
    "share": "Compartilhar",
    "sharing": "Compartilhando...",
    "selectAll": "Selecionar tudo",
    "clear": "Limpar",
    "copy": "Copiar",
    "print": "Imprimir",
    "saving": "Salvando..."
  },
  "emptyState": {
    "noPostsYet": "Ainda sem publicações",
    "noFriendsYet": {
      "core": "Ainda sem amigos no núcleo",
      "inner": "Ainda sem amigos no círculo íntimo",
      "outer": "Ainda sem amigos no círculo externo"
    },
    "noPostsDescription": {
      "core": "Seus amigos do núcleo ainda não compartilharam nada. Seja o primeiro a compartilhar algo!",
      "inner": "Seus amigos do círculo íntimo ainda não compartilharam nada. Seja o primeiro a compartilhar algo!",
      "outer": "Seus amigos do círculo externo ainda não compartilharam nada. Seja o primeiro a compartilhar algo!"
    },
    "getStarted": {
      "core": "Comece adicionando até 5 amigos ao seu Núcleo.",
      "inner": "Comece adicionando até 15 amigos ao seu Círculo Íntimo.",
      "outer": "Comece adicionando até 150 amigos ao seu Círculo Externo."
    },
    "addToSee": {
      "core": "Adicione até 5 amigos para ver as publicações deles aqui.",
      "inner": "Adicione até 15 amigos para ver as publicações deles aqui.",
      "outer": "Adicione até 150 amigos para ver as publicações deles aqui."
    },
    "addFriends": {
      "core": "Adicionar Amigos ao Núcleo",
      "inner": "Adicionar Amigos ao Círculo Íntimo",
      "outer": "Adicionar Amigos ao Círculo Externo"
    },
    "createPost": "Criar uma Publicação",
    "noParasoicalsYet": "Ainda sem parassociais",
    "noAcquaintedYet": "Ainda sem conhecidos",
    "noRoleModelsYet": "Ainda sem modelos",
    "noNayborsYet": "Ainda sem vizinhos",
    "addParasocialsHint": "Adicione criadores, celebridades ou figuras que você segue",
    "acquaintedHint": "Amigos são reclassificados aqui por falta de contato ao longo do tempo",
    "roleModelsHint": "Adicione pessoas cujas histórias de vida te inspiram a ser bom, melhor, o melhor",
    "nayborsHint": "Apresente-se aos seus vizinhos e adicione-os aqui",
    "addToCircleHint": "Adicione alguém ao seu círculo mais próximo"
  },
  "labels": {
    "phone": "Número de Telefone",
    "notes": "Notas",
    "handle": "Identificador"
  },
  "dashboard": {
    "title": "Seus Círculos Íntimos",
    "subtitle": "Cuide e cultive seus relacionamentos mais próximos",
    "loading": "Carregando seus círculos...",
    "tend": "Cuidar",
    "share": "Compartilhar",
    "localStorageHint": "💡 Suas listas são salvas localmente. Crie uma conta para sincronizar entre dispositivos e habilitar correspondência mútua.",
    "dunbarDisclaimer": "Nota: Esses limites de níveis inspirados em Dunbar estão sujeitos a alterações conforme a ciência da consciência comunitária evolui. Modificações futuras podem incluir regras onde certas contagens de níveis afetam outras — por exemplo, conexões parassociais podem reduzir sua capacidade permitida de amigos externos.",
    "toasts": {
      "addedFriend": "Adicionado {{name}} ao seu círculo {{tier}}",
      "movedFriend": "Movido {{name}} para {{tier}}",
      "moveError": "Falha ao mover amigo",
      "removedFriend": "Removido {{name}} das suas listas",
      "addedReserved": "Adicionado grupo reservado ao {{tier}}",
      "reservedError": "Falha ao adicionar grupo reservado",
      "updatedReserved": "Grupo reservado atualizado",
      "removedReserved": "Grupo reservado removido",
      "imported": "Importado {{count}} amigo",
      "imported_plural": "Importados {{count}} amigos",
      "skippedDuplicates": "Pulado {{count}} duplicado",
      "skippedDuplicates_plural": "Pulados {{count}} duplicados",
      "dataLiberation": "Seus dados pertencem a você. Exporte a qualquer momento para levar para outro lugar."
    }
  },
  "mission": {
    "title": "Tempo Real, Não Tempo de Anúncio",
    "description": "Ganhamos quando você sai do nosso site — para compartilhar momentos reais com as pessoas que mais importam.",
    "learnMore": "Saiba mais...",
    "showLess": "Mostrar menos",
    "inspiration": "Nossa inspiração? Esta clássica propaganda Dentyne Ice — o lembrete perfeito de que os melhores momentos acontecem quando você larga o telefone e aparece:",
    "videoTitle": "Dentyne Ice - Tempo Real",
    "quote": "\"Faça Tempo Real\" — esse é o ideal. Quando a distância os separa, ajudaremos você a conectar com videochamadas. Mas sempre lembre: nada supera estar lá.",
    "features": {
      "spark": {
        "title": "Inicie Videochamadas",
        "description": "Quando estiverem separados, um clique conecta vocês"
      },
      "tend": {
        "title": "Cuide dos Seus Círculos",
        "description": "Lembretes para entrar em contato antes que as conexões desapareçam"
      },
      "pull": {
        "title": "Aproxime Mais",
        "description": "Mova conexões significativas para órbitas mais próximas"
      }
    }
  },
  "tierSection": {
    "reserve": "Reservar",
    "reservedCount": "{{count}} Reservados",
    "link": "Vincular",
    "followCreator": "Seguir Criador",
    "addRoleModel": "Adicionar Modelo",
    "add": "Adicionar"
  },
  "tending": {
    "title": "Cuide dos Seus Círculos",
    "markDescription": "Marque seus amigos {{tier}} com quem você não se conectou {{period}}",
    "peopleCount": "{{count}} pessoa",
    "peopleCount_plural": "{{count}} pessoas",
    "noFriendsInTier": "Ainda sem amigos neste nível",
    "checkInstruction": "✓ Marque aqueles com quem você não conversou o suficiente:",
    "noPhone": "sem telefone",
    "call": "Ligar",
    "maybeLater": "Talvez Depois",
    "doneTending": "Cuidado Concluído",
    "finish": "Finalizar",
    "mobileHint": "Ações de contato funcionam melhor em dispositivos móveis",
    "reconnect": {
      "title": "Hora de Reconectar",
      "description": "Esses amigos poderiam usar um pouco do seu tempo"
    },
    "toasts": {
      "allTended": "Incrível! Você cuidou de todos os seus círculos 🌱",
      "noPhone": "Sem número de telefone para {{name}}",
      "connecting": "Conectando com {{name}} via {{method}}",
      "rememberReachOut": "Lembre-se de entrar em contato em breve! 💛",
      "friendsWaiting": "{{count}} amigo esperando notícias suas",
      "friendsWaiting_plural": "{{count}} amigos esperando notícias suas"
    }
  },
  "nayborSOS": {
    "steps": {
      "category": "Que tipo de ajuda você precisa?",
      "contacts": "Escolha vizinhos para contatar"
    },
    "critical": "Crítico",
    "emergencyWarning": "Para emergências com risco de vida, ligue primeiro para o 192",
    "suggestedActions": "Ações sugeridas:",
    "addDetails": "Adicionar detalhes (opcional)",
    "describePlaceholder": "Descreva sua situação...",
    "includeLocation": "Incluir informações de localização",
    "chooseNaybors": "Escolher Vizinhos",
    "chooseNayborsAria": "Continue para escolher vizinhos para contatar",
    "nayborsSelected": "{{count}} vizinho selecionado",
    "nayborsSelected_plural": "{{count}} vizinhos selecionados",
    "copyMessage": "Copiar mensagem",
    "messageAll": "Enviar para Todos ({{count}})",
    "contacted": "Contatado {{count}} vizinho",
    "contacted_plural": "Contatados {{count}} vizinhos",
    "toasts": {
      "messageCopied": "Mensagem copiada para a área de transferência",
      "noNayborsSelected": "Nenhum vizinho com número de telefone selecionado"
    }
  },
  "callActions": {
    "startKall": "Iniciar uma chamada",
    "kallNow": "Ligar para {{name}} agora",
    "scheduleKall": "Agendar uma chamada",
    "scheduleWith": "Agendar com {{name}}",
    "sharedServices": "Serviços compartilhados:",
    "theirPreferences": "Preferências deles:",
    "noMethods": "Nenhum método de contato disponível",
    "requestInfo": "Solicitar info de contato",
    "toasts": {
      "connecting": "Conectando via {{service}}",
      "openService": "Abra {{service}} para conectar"
    }
  },
  "onboarding": {
    "steps": {
      "connect": {
        "title": "Fique Conectado",
        "description": "Adicione seus métodos de contato para que amigos possam te encontrar facilmente."
      },
      "channels": {
        "title": "Adicione Seus Canais",
        "description": "Quais apps de videochamada e mensagens você usa?"
      },
      "complete": {
        "title": "Tudo Pronto!",
        "description": "Seus amigos agora podem iniciar ou agendar chamadas com você."
      }
    },
    "skipForNow": "Pular por enquanto",
    "getStarted": "Começar",
    "service": "Serviço",
    "yourContactInfo": "Suas Info de {{service}}",
    "spontaneous": "Espontâneo",
    "scheduled": "Agendado",
    "addMethod": "Adicionar Método",
    "continue": "Continuar",
    "methodsAdded": "Você adicionou {{count}} método de contato",
    "methodsAdded_plural": "Você adicionou {{count}} métodos de contato",
    "publicProfile": "Perfil Público",
    "privateProfile": "Perfil Privado",
    "publicProfileHint": "Qualquer pessoa pode te encontrar pelo seu identificador",
    "privateProfileHint": "Apenas amigos confirmados podem ver seu perfil",
    "addMore": "Adicionar Mais",
    "saving": "Salvando...",
    "completeSetup": "Concluir Configuração",
    "toasts": {
      "enterContactInfo": "Por favor, insira informações de contato",
      "saveFailed": "Falha ao salvar métodos de contato"
    }
  },
  "keysShared": {
    "addressHelp": "Este endereço será compartilhado com socorristas quando seus vizinhos solicitarem ajuda em seu nome.",
    "address": "Endereço",
    "addressPlaceholder": "Rua Principal 123",
    "unitNumber": "Número do Apt/Unidade",
    "unitPlaceholder": "Apt 4B",
    "entryInstructions": "Instruções Especiais de Entrada",
    "instructionsPlaceholder": "O teclado está à direita da porta, toque duas vezes...",
    "instructionsHint": "Inclua quaisquer detalhes que os socorristas devem saber sobre como acessar sua casa",
    "keyType": "Tipo de Acesso",
    "keyTypes": {
      "physical": "Chave Física",
      "digital": "Código Digital",
      "both": "Ambos"
    },
    "digitalCodeType": "Tipo de Código",
    "codeTypes": {
      "keypad": "Teclado da Porta",
      "smart_lock": "App de Fechadura Inteligente",
      "garage": "Código da Garagem",
      "other": "Outro"
    },
    "notes": "Notas (opcional)",
    "notesPlaceholder": "A chave está embaixo do vaso azul...",
    "confirmKeyHolder": "Confirmar",
    "currentKeyHolders": "Portadores de Chaves Atuais",
    "selectNaybors": "Adicione um vizinho que tem acesso:",
    "noNaybors": "Adicione vizinhos primeiro para compartilhar chaves com eles",
    "allNayborsAssigned": "Todos os seus vizinhos foram atribuídos",
    "optionalScenarios": "Permissões de Entrada Opcionais",
    "optionalScenariosHelp": "Você pode escolher se vizinhos podem entrar para esses cenários.",
    "mandatoryScenariosHelp": "Esses cenários com risco de vida ou críticos para segurança sempre permitem entrada. Eles não podem ser desativados porque protegem a vida, integridade física e seres humanos inocentes de trauma.",
    "scenarios": {
      "cardiac_arrest": {
        "name": "Parada Cardíaca",
        "description": "Ataque cardíaco ou parada cardíaca súbita — cada segundo conta"
      },
      "choking": {
        "name": "Engasgo",
        "description": "Emergência de engasgo — vias aéreas bloqueadas, precisa de ajuda imediata"
      },
      "drowning": {
        "name": "Afogamento",
        "description": "Afogamento em piscina, banheira ou outra água"
      },
      "anaphylaxis": {
        "name": "Choque Anafilático",
        "description": "Reação alérgica grave por picada de abelha, comida, medicamento"
      },
      "elderly_fall": {
        "name": "Queda de Idoso",
        "description": "Pessoa idosa caiu, incapaz de levantar, possivelmente ferida"
      },
      "fire": {
        "name": "Incêndio",
        "description": "Incêndio detectado — ameaça à vida, integridade, tecido, qualquer pessoa imobilizada ou dormindo"
      },
      "gas_leak": {
        "name": "Vazamento de Gás",
        "description": "Vazamento de gás detectado — risco de explosão/envenenamento"
      },
      "carbon_monoxide": {
        "name": "Monóxido de Carbono",
        "description": "Alarme de detector de CO — assassino silencioso, ocupantes podem estar inconscientes"
      },
      "childhood_corporal": {
        "name": "Punição Corporal Infantil",
        "description": "Criança alertando vizinhos sobre punição corporal. Pesquisas mostram que a intervenção da comunidade previne violência futura."
      },
      "take10_spiral": {
        "name": "Espiral de Gritos Take 10",
        "description": "Gritos domésticos escalando inaceitavelmente. Intervenção de desescalada necessária."
      },
      "bedroom_consent": {
        "name": "Conflito de Consentimento no Quarto",
        "description": "Detectada emergência de conflito de consentimento no quarto — intervenção imediata necessária"
      },
      "medical_other": {
        "name": "Outra Emergência Médica",
        "description": "Outra emergência médica que requer entrada na casa"
      },
      "intruder_check": {
        "name": "Verificação de Intruso",
        "description": "Verificar suspeita de intruso quando você não pode responder"
      },
      "welfare_check": {
        "name": "Verificação de Bem-estar",
        "description": "Verificação geral de bem-estar quando você não responde por período prolongado"
      },
      "flooding": {
        "name": "Inundação/Vazamento de Água",
        "description": "Vazamento de água ou inundação — prevenção de danos à propriedade (não apresenta risco de vida)"
      }
    },
    "yourAddress": "Seu Endereço",
    "noAddressSet": "Nenhum endereço definido",
    "unit": "Unidade",
    "keyHoldersSummary": "{{count}} vizinho(s) têm chaves",
    "keyHoldersSummary_plural": "{{count}} vizinhos têm chaves",
    "noKeyHolders": "Nenhum portador de chaves atribuído",
    "permissionsSummary": "Permissões de Entrada",
    "mandatoryCount": "{{count}}",
    "mandatoryLabel": "obrigatórias (sempre permitidas)",
    "optionalCount": "{{count}}",
    "optionalLabel": "opcionais habilitadas",
    "reviewWarning": "Ao salvar essas configurações, você autoriza seus vizinhos designados a entrar na sua casa durante os cenários de emergência selecionados. Certifique-se de confiar nessas pessoas com acesso à sua casa.",
    "toasts": {
      "keyHolderAdded": "Portador de chaves adicionado",
      "keyHolderRemoved": "Portador de chaves removido",
      "saved": "Preferências de chaves compartilhadas salvas"
    }
  },
  "reserved": {
    "spotsCount_plural": "{{count}} Vagas Reservadas",
    "spotsLabel_plural": "vagas reservadas"
  },
  "addLinkedFriend": {
    "title": "Adicionar Amigo Vinculado ao {{tier}}",
    "description": "Encontre alguém pelas informações de contato para solicitar uma conexão.",
    "findBy": "Encontrar por",
    "enterUsernameHint": "Insira o nome de usuário deles exatamente como configuraram",
    "enterContactHint": "Insira o {{type}} deles exatamente como registraram",
    "errors": {
      "noUserHandle": "Nenhum usuário encontrado com esse identificador. Certifique-se de que eles têm uma conta e configuraram seu identificador.",
      "noUserContact": "Nenhum usuário encontrado com esse {{type}}. Eles podem não ter adicionado ao perfil ainda.",
      "searchError": "Ocorreu um erro durante a pesquisa. Por favor, tente novamente.",
      "connectionFailed": "Falha ao enviar solicitação de conexão"
    },
    "userFound": "Usuário Encontrado",
    "showCircleLevel": "Mostrar nível do círculo",
    "circleVisibleHint": "Eles verão que você os adicionou como {{tier}}",
    "circleHiddenHint": "Eles não verão a qual círculo você os adicionou",
    "sendRequest": "Enviar Solicitação de Conexão",
    "privacyNote": "Eles verão apenas as informações de contato que você usou para encontrá-los até aceitarem. Uma vez aceito, ambos verão os métodos de contato completos um do outro.",
    "serviceTypes": {
      "phone": "Número de Telefone",
      "email": "Endereço de Email",
      "handle": "Identificador de Usuário",
      "signal": "Signal",
      "telegram": "Telegram",
      "whatsapp": "WhatsApp",
      "facetime": "FaceTime"
    }
  },
  "gdpr": {
    "cookies": {
      "title": "Usamos cookies",
      "description": "Usamos cookies para melhorar sua experiência. Cookies essenciais são necessários para o app funcionar.",
      "learnMore": "Saiba mais",
      "customize": "Personalizar",
      "customizeAria": "Personalizar preferências de cookies",
      "essentialOnly": "Apenas Essenciais",
      "essentialOnlyAria": "Aceitar apenas cookies essenciais",
      "acceptAll": "Aceitar Todos",
      "acceptAllAria": "Aceitar todos os cookies",
      "settingsTitle": "Preferências de Cookies",
      "settingsDescription": "Escolha quais tipos de cookies você quer permitir. Cookies essenciais estão sempre habilitados pois são necessários para o site funcionar.",
      "savePreferences": "Salvar Preferências",
      "required": "Obrigatório",
      "essential": {
        "title": "Cookies Essenciais",
        "description": "Necessários para funcionalidade básica do site como autenticação e segurança."
      },
      "functional": {
        "title": "Cookies Funcionais",
        "description": "Lembram suas preferências como configurações de idioma e personalizações de UI."
      },
      "analytics": {
        "title": "Cookies de Análise",
        "description": "Nos ajudam a entender como visitantes usam nosso site para melhorar a experiência."
      },
      "marketing": {
        "title": "Cookies de Marketing",
        "description": "Usados para entregar anúncios relevantes e rastrear a eficácia de campanhas."
      }
    },
    "settings": {
      "cookiePreferences": "Preferências de Cookies",
      "cookieDescription": "Gerencie quais tipos de cookies você nos permite usar.",
      "consentHistory": "Histórico de Consentimento",
      "consentHistoryDescription": "Visualize e gerencie seus registros de consentimento.",
      "consentGiven": "Consentimento dado em",
      "consentVersion": "Versão dos termos",
      "noConsent": "Nenhum registro de consentimento encontrado. Por favor, aceite a política de cookies.",
      "withdrawConsent": "Retirar Consentimento",
      "withdrawWarning": "Retirar o consentimento irá redefinir suas preferências de cookies e pode limitar alguns recursos. Tem certeza?",
      "confirmWithdraw": "Sim, Retirar Consentimento",
      "dataRights": "Seus Direitos sobre Dados",
      "dataRightsDescription": "Sob a LGPD/GDPR, você tem o direito de acessar, exportar e excluir seus dados.",
      "exportData": "Exportar Meus Dados",
      "exportDescription": "Baixe todos os seus dados em um formato portável",
      "deleteAccount": "Excluir Minha Conta",
      "deleteDescription": "Excluir permanentemente sua conta e todos os dados"
    },
    "deletion": {
      "title": "Excluir Sua Conta",
      "description": "Isso excluirá permanentemente sua conta e todos os dados associados.",
      "warningTitle": "Aviso: Isso não pode ser desfeito",
      "warningDescription": "Uma vez excluída, sua conta e todos os dados serão removidos permanentemente. Certifique-se de exportar seus dados primeiro se quiser mantê-los.",
      "whatDeleted": "O que será excluído:",
      "deletedItems": {
        "profile": "Seu perfil e informações pessoais",
        "connections": "Todas as suas conexões de amigos e círculos",
        "posts": "Todas as suas publicações e conteúdo compartilhado",
        "preferences": "Suas preferências e configurações",
        "keysShared": "Suas configurações de acesso de emergência Chaves Compartilhadas"
      },
      "gracePeriodTitle": "Período de Carência de 30 Dias",
      "gracePeriodDescription": "Sua conta será agendada para exclusão em {{days}} dias. Você pode cancelar a exclusão durante este período fazendo login.",
      "exportFirst": "Exportar seus dados antes da exclusão?",
      "exportData": "Exportar Dados",
      "exported": "Dados Exportados",
      "continue": "Continuar para Exclusão",
      "confirmTitle": "Confirmar Exclusão de Conta",
      "confirmDescription": "Esta é sua confirmação final. Por favor, verifique sua identidade para prosseguir.",
      "typeEmail": "Digite seu email para confirmar: {{email}}",
      "emailMismatch": "O email não corresponde à sua conta",
      "reasonLabel": "Motivo para sair",
      "reasonPlaceholder": "Ajude-nos a melhorar compartilhando por que você está saindo...",
      "understandConsequences": "Eu entendo que minha conta e todos os dados serão excluídos permanentemente após o período de carência, e esta ação não pode ser desfeita.",
      "deleting": "Agendando exclusão...",
      "confirmDelete": "Excluir Minha Conta",
      "scheduledTitle": "Exclusão Agendada",
      "scheduledDescription": "Sua conta foi agendada para exclusão.",
      "scheduledDate": "Sua conta será excluída permanentemente em:",
      "cancelInfo": "Para cancelar a exclusão, simplesmente faça login na sua conta antes da data agendada."
    },
    "age": {
      "title": "Verificação de Idade",
      "description": "Precisamos verificar sua idade para cumprir as regulamentações de privacidade.",
      "whyTitle": "Por que perguntamos",
      "whyDescription": "Sob a LGPD/GDPR, usuários menores de {{age}} anos requerem consentimento dos pais para criar uma conta.",
      "birthYearLabel": "Em que ano você nasceu?",
      "selectYear": "Selecione o ano",
      "privacyNote": "Armazenamos apenas seu ano de nascimento para fins de conformidade.",
      "minorTitle": "Consentimento dos Pais Necessário",
      "minorDescription": "Usuários menores de {{age}} requerem consentimento dos pais. Por favor, peça a um pai ou responsável para ajudar você a criar uma conta.",
      "parentalRequired": "Consentimento dos Pais Necessário",
      "verify": "Verificar Idade"
    }
  },
  "admin": {
    "dispatch": {
      "title": "Verificação de Conta de Despacho",
      "searchPlaceholder": "Pesquisar por organização, email ou nome do contato...",
      "filters": {
        "all": "Todas as Contas"
      },
      "noAccounts": "Nenhuma conta encontrada correspondendo aos seus critérios",
      "accessDenied": {
        "title": "Acesso Negado",
        "description": "Você não tem permissão para acessar o painel de verificação de despacho."
      },
      "actions": {
        "verify": "Verificar",
        "reject": "Rejeitar",
        "suspend": "Suspender"
      },
      "success": {
        "verify": "Conta verificada com sucesso",
        "reject": "Conta rejeitada",
        "suspend": "Conta suspensa"
      },
      "errors": {
        "fetchFailed": "Falha ao buscar contas",
        "actionFailed": "Ação falhou. Por favor, tente novamente."
      },
      "detail": {
        "description": "Revise os detalhes da organização e documentos de verificação",
        "organization": "Detalhes da Organização",
        "name": "Nome",
        "type": "Tipo",
        "jurisdictions": "Jurisdições",
        "legal": "Informações Legais",
        "taxId": "CNPJ",
        "insurance": "Seguradora",
        "policyNumber": "Número da Apólice",
        "registeredAgent": "Agente Registrado",
        "contact": "Informações de Contato",
        "contactName": "Nome do Contato",
        "contactEmail": "Email",
        "contactPhone": "Telefone",
        "status": "Status da Conta",
        "verificationStatus": "Status",
        "createdAt": "Solicitado Em",
        "rejectionReason": "Motivo da Rejeição"
      },
      "confirm": {
        "verifyTitle": "Verificar Conta?",
        "verifyDescription": "Isso concederá à organização acesso às informações da Árvore de Chaves da Porta dos residentes durante emergências.",
        "rejectTitle": "Rejeitar Conta?",
        "rejectDescription": "Por favor, forneça um motivo para a rejeição. Isso será compartilhado com a organização.",
        "suspendTitle": "Suspender Conta?",
        "suspendDescription": "Isso revogará imediatamente o acesso da organização. Por favor, forneça um motivo.",
        "reason": "Motivo",
        "reasonPlaceholder": "Explique por que esta conta está sendo rejeitada/suspensa...",
        "processing": "Processando..."
      }
    }
  },
  "dev": {
    "label": "Dev",
    "panelTitle": "Painel Dev",
    "mode": "Modo de Desenvolvimento",
    "authStatus": "Status de Auth",
    "notLoggedIn": "Não logado",
    "authActions": "Ações de Auth",
    "refreshButton": "Atualizar",
    "clearApp": "Limpar App",
    "clearAll": "Limpar Tudo",
    "forceSignOut": "Forçar Saída",
    "toasts": {
      "clearStorage": "Limpas {{count}} chaves localStorage do app",
      "clearAll": "Limpados todos localStorage e sessionStorage",
      "signOut": "Saída forçada e armazenamento de auth limpo",
      "signOutFailed": "Falha na saída forçada",
      "refreshed": "Sessão atualizada",
      "refreshFailed": "Falha ao atualizar sessão"
    },
    "forceLogout": "Logout Forçado",
    "storageActions": "Ações de Armazenamento",
    "storageInspector": "Inspetor de Armazenamento",
    "noStorageData": "Sem dados no localStorage",
    "chars": "caracteres",
    "tips": {
      "title": "Dicas",
      "sessions": "Sessões persistem entre recarregamentos de página",
      "clearApp": "Use \"Limpar Dados do App\" para resetar listas de amigos",
      "forceLogout": "Use \"Logout Forçado\" para limpar completamente o estado de auth"
    }
  },
  "contactMethods": {
    "title": "Métodos de Contato",
    "subtitle": "Adicione seus serviços preferidos de videochamada e mensagens para que amigos possam te encontrar",
    "addButton": "Adicionar Método de Contato",
    "addButtonCompact": "Adicionar",
    "addDialogTitle": "Adicionar Método de Contato",
    "addDialogDescription": "Adicione uma forma para seus amigos te encontrarem para videochamadas",
    "serviceLabel": "Serviço",
    "contactInfoLabel": "Suas Info de {{service}}",
    "labelOptional": "Rótulo (opcional)",
    "labelPlaceholder": "ex., Pessoal, Trabalho, Casa",
    "labelHint": "Ajuda você a identificar entre múltiplas contas no mesmo serviço",
    "availableFor": "Disponível para",
    "spontaneousKalls": "Chamadas Espontâneas",
    "spontaneousTooltip": "Videochamadas instantâneas quando amigos querem conectar agora",
    "scheduledKalls": "Chamadas Agendadas",
    "scheduledTooltip": "Reuniões de vídeo planejadas com antecedência para um horário específico",
    "addMethod": "Adicionar Método",
    "dragToReorder": "Arraste para reordenar",
    "dragReorderHint": "Arraste para reordenar prioridade. #1 é seu método preferido.",
    "noSpontaneousMethods": "Nenhum método de chamada espontânea adicionado ainda",
    "noScheduledMethods": "Nenhum método de chamada agendada adicionado ainda"
  },
  "post": {
    "voiceNote": "Nota de Voz",
    "audioUnavailable": "Áudio indisponível",
    "callInvitation": "Convite para Chamada",
    "joinCall": "Entrar",
    "meetupInvitation": "Convite para Encontro",
    "location": "Local: {{name}}",
    "rsvpYes": "Confirmo Sim",
    "rsvpMaybe": "Talvez",
    "nearbyMessage": "Estou por perto!",
    "lifeUpdate": "Atualização de Vida",
    "call": "Ligar",
    "addContactInfo": "Adicionar Info de Contato",
    "addContactInfoTooltip": "Adicionar informações de contato para {{name}}",
    "callViaHighFidelity": "Ligar via {{method}} (alta fidelidade)",
    "addMoreContactInfo": "Adicionar mais info de contato",
    "usePhoneRecommendation": "Para melhores resultados, use seu telefone para chamadas",
    "voiceReplyTooltip": "Enviar uma resposta de voz (alta fidelidade)",
    "meetupTooltip": "Agendar um encontro (alta fidelidade)",
    "commentTooltip": "Adicionar um comentário",
    "likeTooltip": "Curtir esta publicação",
    "likeTooltipHighFidelity": "Curtir (considere uma interação mais significativa)",
    "shareTooltip": "Compartilhar",
    "toasts": {
      "noContact": "Nenhuma informação de contato disponível",
      "contactFailed": "Falha ao iniciar contato",
      "noContactPerson": "Nenhuma informação de contato disponível para esta pessoa"
    },
    "callVia": "Ligar via {{method}}",
    "voiceReply": "Resposta de Voz",
    "meetup": "Encontro",
    "comment": "Comentar",
    "like": "Curtir",
    "selectContactMethod": "Selecionar método de contato",
    "warningPlatform": "Aviso: plataforma pode ter preocupações de vigilância",
    "currentlySelected": "Atualmente selecionado",
    "dontShowMonth": "Não mostrar por 1 mês",
    "warningSilenced": "Avisos de {{method}} silenciados até o próximo mês",
    "connectingVia": "Conectando via {{method}}"
  },
  "parasocial": {
    "creatorDashboard": "Painel do Criador",
    "shareContent": "Compartilhar Conteúdo",
    "shareNewContent": "Compartilhar Novo Conteúdo",
    "shareDescription": "Compartilhe um link com seus seguidores parassociais",
    "noContentShared": "Ainda sem conteúdo compartilhado",
    "noContentHint": "Compartilhe links para interagir com seus seguidores",
    "title": "Título",
    "titlePlaceholder": "O que você está compartilhando?",
    "url": "URL",
    "urlPlaceholder": "https://...",
    "description": "Descrição",
    "descriptionPlaceholder": "Breve descrição (opcional)",
    "deleteTitle": "Excluir este compartilhamento?",
    "deleteDescription": "Isso removerá o link dos feeds dos seus seguidores.",
    "clicks": "{{count}} clique",
    "clicks_plural": "{{count}} cliques",
    "engagement": "{{percent}}% engajamento",
    "toasts": {
      "titleAndUrlRequired": "Título e URL são obrigatórios",
      "invalidUrl": "Por favor, insira uma URL válida",
      "sharedContent": "Conteúdo compartilhado com seus seguidores!",
      "deleted": "Compartilhamento excluído"
    }
  },
  "profileSettings": {
    "title": "Configurações de Perfil",
    "description": "Gerencie seu perfil e preferências de contato",
    "tabs": {
      "profile": "Perfil",
      "contact": "Contato",
      "creator": "Criador"
    },
    "displayName": "Nome de Exibição",
    "displayNamePlaceholder": "Seu nome",
    "handle": "Identificador",
    "handlePlaceholder": "seu_identificador",
    "handleHint": "3-30 caracteres. Apenas letras, números e underscores.",
    "publicProfile": "Seu Perfil Público",
    "publicProfileLabel": "Perfil Público",
    "privateProfileLabel": "Perfil Privado",
    "publicDescription": "Qualquer pessoa pode ver sua página de perfil",
    "privateDescription": "Apenas você e amigos confirmados podem ver seu perfil",
    "parasocialMode": "Modo Personalidade Parassocial",
    "parasocialModeDescription": "Habilite isso se você é uma figura pública, criador ou celebridade que quer receber conexões parassociais de fãs e compartilhar conteúdo com eles.",
    "parasocialModeHint": "Quando habilitado, outros usuários podem adicioná-lo ao círculo de Parassociais deles e ver o conteúdo que você compartilha. Salve seu perfil para aplicar essa mudança.",
    "saveProfile": "Salvar Perfil",
    "saveSettings": "Salvar Configurações",
    "toasts": {
      "updated": "Perfil atualizado",
      "updateFailed": "Falha ao atualizar perfil",
      "linkCopied": "Link copiado!"
    }
  },
  "editFriend": {
    "title": "Editar Contato",
    "description": "Atualize as informações de contato para {{name}}",
    "namePlaceholder": "Nome do amigo",
    "emailPlaceholder": "amigo@exemplo.com",
    "preferredContactMethod": "Método de Contato Preferido",
    "selectContactMethod": "Escolha como contatá-lo",
    "notesPlaceholder": "Qualquer nota sobre esta pessoa...",
    "saveChanges": "Salvar Alterações"
  },
  "followCreator": {
    "title": "Seguir um Criador",
    "description": "Pesquise criadores verificados para seguir e ver seu conteúdo no seu feed.",
    "searchLabel": "Pesquisar por nome ou identificador",
    "searchPlaceholder": "@identificador_criador ou Nome do Criador",
    "creatorModeHint": "Apenas usuários que habilitaram o Modo Criador aparecerão nos resultados da pesquisa.",
    "toasts": {
      "following": "Agora seguindo {{name}}",
      "alreadyFollowing": "Você já está seguindo este criador",
      "followFailed": "Falha ao seguir"
    },
    "errors": {
      "searching": "Ocorreu um erro durante a pesquisa.",
      "noCreators": "Nenhum criador encontrado correspondente a essa pesquisa. Eles podem não ter habilitado o modo criador ainda.",
      "noCreatorsFound": "Nenhum criador encontrado correspondente a essa pesquisa."
    }
  },
  "dispatch": {
    "validation": {
      "organizationNameRequired": "Nome da organização é obrigatório",
      "jurisdictionRequired": "Pelo menos uma jurisdição é obrigatória",
      "taxIdRequired": "CNPJ é obrigatório",
      "insuranceRequired": "Nome da seguradora é obrigatório",
      "policyRequired": "Número da apólice é obrigatório",
      "agentNameRequired": "Nome do agente registrado é obrigatório",
      "agentContactRequired": "Contato do agente registrado é obrigatório",
      "contactNameRequired": "Nome do contato principal é obrigatório",
      "invalidEmail": "Por favor, insira um endereço de email válido",
      "invalidPhone": "Por favor, insira um número de telefone válido",
      "passwordMin": "A senha deve ter pelo menos 8 caracteres",
      "passwordMatch": "As senhas devem coincidir",
      "termsRequired": "Você deve aceitar os termos"
    }
  },
  "privacy": {
    "title": "Política de Privacidade",
    "lastUpdated": "Última atualização: 1 de janeiro de 2025",
    "philosophy": {
      "title": "Nossa Filosofia de Privacidade",
      "description": "InnerFriend é construído sobre uma premissa fundamental: seus relacionamentos são seus. Não somos uma rede social que monetiza sua atenção ou vende seus dados. Somos uma ferramenta que ajuda você a manter conexões significativas com as pessoas que mais importam."
    },
    "dataCollection": {
      "title": "Dados Que Coletamos",
      "intro": "Coletamos apenas o necessário para fornecer o serviço:",
      "items": {
        "account": "Informações da Conta: Email e senha (criptografada) quando você cria uma conta",
        "friends": "Listas de Amigos: Os nomes e informações de contato opcionais das pessoas que você adiciona",
        "connections": "Dados de Conexão: Metadados de correspondência mútua se você escolher habilitar",
        "preferences": "Preferências: Suas configurações do app como idioma e preferências de notificação"
      }
    },
    "localStorage": {
      "title": "Local Primeiro",
      "description": "Por padrão, suas listas de amigos são armazenadas apenas no seu dispositivo. Nunca tocamos nossos servidores a menos que você escolha criar uma conta para recursos como sincronização entre dispositivos ou correspondência mútua."
    },
    "noSelling": {
      "title": "Nunca Vendemos Seus Dados",
      "description": "Seus dados não estão à venda. Ponto final. Não os compartilhamos com anunciantes, corretores de dados ou terceiros para fins de marketing."
    },
    "gdprRights": {
      "title": "Seus Direitos (Conformidade LGPD/GDPR)",
      "intro": "Você tem controle total sobre seus dados:",
      "items": {
        "access": "Acesso: Exporte todos os seus dados a qualquer momento em um formato portável",
        "deletion": "Exclusão: Exclua sua conta e todos os dados associados com um clique",
        "rectification": "Retificação: Atualize ou corrija qualquer uma das suas informações",
        "portability": "Portabilidade: Leve seus dados para outras redes sociais compatíveis com Dunbar"
      }
    },
    "security": {
      "title": "Segurança",
      "description": "Usamos criptografia padrão da indústria para dados em trânsito e em repouso. Senhas são hasheadas e nunca armazenadas em texto simples."
    },
    "contact": {
      "title": "Contato",
      "description": "Dúvidas sobre privacidade? Entre em contato conosco em privacy@lifesaverlabs.org"
    }
  },
  "terms": {
    "title": "Termos de Serviço",
    "lastUpdated": "Última atualização: 1 de janeiro de 2025",
    "introduction": {
      "title": "Introdução",
      "description": "Bem-vindo ao InnerFriend. Ao usar nosso serviço, você concorda com estes termos. Nós os mantivemos simples e legíveis."
    },
    "service": {
      "title": "O Serviço",
      "description": "InnerFriend ajuda você a manter relacionamentos significativos fornecendo ferramentas para organizar e cuidar dos seus círculos sociais. Não somos uma plataforma social — não hospedamos conteúdo público nem facilitamos conexões públicas."
    },
    "responsibilities": {
      "title": "Suas Responsabilidades",
      "intro": "Ao usar o InnerFriend, você concorda em:",
      "items": {
        "accurate": "Fornecer informações precisas ao criar uma conta",
        "secure": "Manter suas credenciais de login seguras",
        "privacy": "Respeitar a privacidade das pessoas que você adiciona às suas listas",
        "lawful": "Usar o serviço apenas para fins legítimos"
      }
    },
    "intellectualProperty": {
      "title": "Propriedade Intelectual",
      "description": "InnerFriend é código aberto sob a licença MIT. Seus dados pertencem a você — você mantém a propriedade total."
    },
    "liability": {
      "title": "Limitação de Responsabilidade",
      "description": "InnerFriend é fornecido \"como está\" sem garantias. Não somos responsáveis por quaisquer danos decorrentes do seu uso do serviço."
    },
    "termination": {
      "title": "Rescisão",
      "description": "Você pode excluir sua conta a qualquer momento. Reservamo-nos o direito de encerrar contas que violem estes termos."
    },
    "changes": {
      "title": "Alterações nos Termos",
      "description": "Podemos atualizar estes termos ocasionalmente. Notificaremos você sobre mudanças significativas por email ou através do app."
    },
    "contact": {
      "title": "Contato",
      "description": "Dúvidas? Entre em contato conosco em support@lifesaverlabs.org"
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

// Update Portuguese locale
const localePath = path.join(__dirname, '../public/locales/pt/common.json');
const existing = JSON.parse(fs.readFileSync(localePath, 'utf8'));
const merged = deepMerge(existing, portugueseTranslations);
fs.writeFileSync(localePath, JSON.stringify(merged, null, 2) + '\n');
console.log('Updated: pt');
console.log('Done! Portuguese translations applied.');
