export type ServiceType = 
  | 'facetime' 
  | 'whatsapp' 
  | 'signal' 
  | 'telegram' 
  | 'zoom' 
  | 'google_meet' 
  | 'teams' 
  | 'phone' 
  | 'discord' 
  | 'skype'
  | 'webex'
  | 'slack';

export interface ContactMethod {
  id: string;
  user_id: string;
  service_type: ServiceType;
  contact_identifier: string;
  for_spontaneous: boolean;
  for_scheduled: boolean;
  spontaneous_priority: number;
  scheduled_priority: number;
  label?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceInfo {
  name: string;
  icon: string;
  placeholder: string;
  supportsCall: boolean;
  supportsSchedule: boolean;
  getCallUrl?: (identifier: string) => string;
  getScheduleUrl?: (identifier: string) => string;
}

export const SERVICES: Record<ServiceType, ServiceInfo> = {
  facetime: {
    name: 'FaceTime',
    icon: '📱',
    placeholder: 'Phone number or Apple ID email',
    supportsCall: true,
    supportsSchedule: false,
    getCallUrl: (id) => `facetime:${id}`,
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: '💬',
    placeholder: 'Phone number (with country code)',
    supportsCall: true,
    supportsSchedule: false,
    getCallUrl: (id) => `https://wa.me/${id.replace(/\D/g, '')}?video=true`,
  },
  signal: {
    name: 'Signal',
    icon: '🔐',
    placeholder: 'Phone number (with country code)',
    supportsCall: true,
    supportsSchedule: false,
    getCallUrl: (id) => `https://signal.me/#p/${id.replace(/\D/g, '')}`,
  },
  telegram: {
    name: 'Telegram',
    icon: '✈️',
    placeholder: 'Username or phone number',
    supportsCall: true,
    supportsSchedule: false,
    getCallUrl: (id) => `https://t.me/${id.replace('@', '')}`,
  },
  zoom: {
    name: 'Zoom',
    icon: '🎥',
    placeholder: 'Personal meeting ID or link',
    supportsCall: true,
    supportsSchedule: true,
    getCallUrl: (id) => id.includes('zoom.us') ? id : `https://zoom.us/j/${id}`,
  },
  google_meet: {
    name: 'Google Meet',
    icon: '🟢',
    placeholder: 'Email or meeting link',
    supportsCall: true,
    supportsSchedule: true,
    getCallUrl: (id) => id.includes('meet.google.com') ? id : `https://meet.google.com/new`,
  },
  teams: {
    name: 'Microsoft Teams',
    icon: '🟣',
    placeholder: 'Email or Teams link',
    supportsCall: true,
    supportsSchedule: true,
    getCallUrl: (id) => id.includes('teams.microsoft.com') ? id : `https://teams.microsoft.com/l/call/0/0`,
  },
  phone: {
    name: 'Phone Call',
    icon: '📞',
    placeholder: 'Phone number',
    supportsCall: true,
    supportsSchedule: false,
    getCallUrl: (id) => `tel:${id}`,
  },
  discord: {
    name: 'Discord',
    icon: '🎮',
    placeholder: 'Username#0000 or User ID',
    supportsCall: true,
    supportsSchedule: false,
    getCallUrl: (id) => `discord://-/users/${id}`,
  },
  skype: {
    name: 'Skype',
    icon: '🔵',
    placeholder: 'Skype username',
    supportsCall: true,
    supportsSchedule: true,
    getCallUrl: (id) => `skype:${id}?call&video=true`,
  },
  webex: {
    name: 'Webex',
    icon: '🌐',
    placeholder: 'Personal room link or email',
    supportsCall: true,
    supportsSchedule: true,
    getCallUrl: (id) => id.includes('webex.com') ? id : `https://webex.com`,
  },
  slack: {
    name: 'Slack Huddle',
    icon: '💼',
    placeholder: 'Slack workspace/channel or email',
    supportsCall: true,
    supportsSchedule: false,
  },
};

export const SERVICE_LIST = Object.entries(SERVICES).map(([key, value]) => ({
  type: key as ServiceType,
  ...value,
}));
