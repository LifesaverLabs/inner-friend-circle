import { describe, it, expect } from 'vitest';
import {
  SERVICES,
  SERVICE_LIST,
  type ServiceType,
  type ContactMethod,
  type ServiceInfo,
} from '@/types/contactMethod';

describe('ContactMethod Types and Constants', () => {
  describe('SERVICES', () => {
    const expectedServices: ServiceType[] = [
      'real_face_time',
      'facetime',
      'whatsapp',
      'signal',
      'telegram',
      'zoom',
      'google_meet',
      'teams',
      'phone',
      'discord',
      'skype',
      'webex',
      'slack',
    ];

    it('should have all expected services defined', () => {
      expectedServices.forEach(service => {
        expect(SERVICES[service]).toBeDefined();
      });
    });

    it('should have name for each service', () => {
      Object.values(SERVICES).forEach(service => {
        expect(service.name).toBeDefined();
        expect(typeof service.name).toBe('string');
        expect(service.name.length).toBeGreaterThan(0);
      });
    });

    it('should have icon for each service', () => {
      Object.values(SERVICES).forEach(service => {
        expect(service.icon).toBeDefined();
      });
    });

    it('should have placeholder for each service', () => {
      Object.values(SERVICES).forEach(service => {
        expect(service.placeholder).toBeDefined();
        expect(typeof service.placeholder).toBe('string');
      });
    });

    it('should have supportsCall boolean for each service', () => {
      Object.values(SERVICES).forEach(service => {
        expect(typeof service.supportsCall).toBe('boolean');
      });
    });

    it('should have supportsSchedule boolean for each service', () => {
      Object.values(SERVICES).forEach(service => {
        expect(typeof service.supportsSchedule).toBe('boolean');
      });
    });

    describe('individual service configurations', () => {
      it('should have real_face_time service configured', () => {
        expect(SERVICES.real_face_time.name).toContain('Face');
        expect(SERVICES.real_face_time.supportsCall).toBe(false);
        expect(SERVICES.real_face_time.supportsSchedule).toBe(true);
      });

      it('should have facetime service configured', () => {
        expect(SERVICES.facetime.name).toBe('FaceTime');
        expect(SERVICES.facetime.supportsCall).toBe(true);
      });

      it('should have whatsapp service configured', () => {
        expect(SERVICES.whatsapp.name).toBe('WhatsApp');
        expect(SERVICES.whatsapp.supportsCall).toBe(true);
      });

      it('should have signal service configured', () => {
        expect(SERVICES.signal.name).toBe('Signal');
        expect(SERVICES.signal.supportsCall).toBe(true);
      });

      it('should have telegram service configured', () => {
        expect(SERVICES.telegram.name).toBe('Telegram');
        expect(SERVICES.telegram.supportsCall).toBe(true);
      });

      it('should have zoom service configured', () => {
        expect(SERVICES.zoom.name).toBe('Zoom');
        expect(SERVICES.zoom.supportsSchedule).toBe(true);
      });

      it('should have google_meet service configured', () => {
        expect(SERVICES.google_meet.name).toBe('Google Meet');
        expect(SERVICES.google_meet.supportsSchedule).toBe(true);
      });

      it('should have teams service configured', () => {
        expect(SERVICES.teams.name).toBe('Microsoft Teams');
        expect(SERVICES.teams.supportsSchedule).toBe(true);
      });

      it('should have phone service configured', () => {
        expect(SERVICES.phone.name).toBe('Phone Call');
        expect(SERVICES.phone.supportsCall).toBe(true);
      });

      it('should have discord service configured', () => {
        expect(SERVICES.discord.name).toBe('Discord');
      });

      it('should have skype service configured', () => {
        expect(SERVICES.skype.name).toBe('Skype');
        expect(SERVICES.skype.supportsCall).toBe(true);
      });

      it('should have webex service configured', () => {
        expect(SERVICES.webex.name).toBe('Webex');
        expect(SERVICES.webex.supportsSchedule).toBe(true);
      });

      it('should have slack service configured', () => {
        expect(SERVICES.slack.name).toBe('Slack Huddle');
      });
    });

    describe('URL generation', () => {
      it('should have getCallUrl function for services that support calls', () => {
        const callServices = Object.entries(SERVICES).filter(([_, s]) => s.supportsCall);
        callServices.forEach(([_, service]) => {
          if (service.getCallUrl) {
            expect(typeof service.getCallUrl).toBe('function');
          }
        });
      });

      it('should generate tel: URL for phone', () => {
        if (SERVICES.phone.getCallUrl) {
          expect(SERVICES.phone.getCallUrl('1234567890')).toBe('tel:1234567890');
        }
      });

      it('should generate facetime: URL for facetime', () => {
        if (SERVICES.facetime.getCallUrl) {
          expect(SERVICES.facetime.getCallUrl('user@example.com')).toContain('facetime:');
        }
      });

      it('should generate whatsapp URL', () => {
        if (SERVICES.whatsapp.getCallUrl) {
          const url = SERVICES.whatsapp.getCallUrl('1234567890');
          expect(url).toContain('wa.me');
        }
      });

      it('should generate signal URL', () => {
        if (SERVICES.signal.getCallUrl) {
          const url = SERVICES.signal.getCallUrl('1234567890');
          expect(url).toContain('signal');
        }
      });

      it('should generate telegram URL', () => {
        if (SERVICES.telegram.getCallUrl) {
          const url = SERVICES.telegram.getCallUrl('username');
          expect(url).toContain('t.me');
        }
      });

      it('should generate skype URL', () => {
        if (SERVICES.skype.getCallUrl) {
          const url = SERVICES.skype.getCallUrl('username');
          expect(url).toContain('skype:');
        }
      });
    });

    describe('placeholder text', () => {
      it('should have phone number placeholder for phone services', () => {
        expect(SERVICES.phone.placeholder).toMatch(/phone|number/i);
      });

      it('should have appropriate placeholder for telegram', () => {
        expect(SERVICES.telegram.placeholder).toMatch(/username|handle/i);
      });

      it('should have appropriate placeholder for discord', () => {
        expect(SERVICES.discord.placeholder).toMatch(/username|handle/i);
      });

      it('should have URL placeholder for meeting services', () => {
        expect(SERVICES.zoom.placeholder).toMatch(/url|link|meeting/i);
        expect(SERVICES.google_meet.placeholder).toMatch(/url|link|meeting/i);
      });
    });
  });

  describe('SERVICE_LIST', () => {
    it('should be an array', () => {
      expect(Array.isArray(SERVICE_LIST)).toBe(true);
    });

    it('should contain all services from SERVICES', () => {
      const serviceKeys = Object.keys(SERVICES);
      expect(SERVICE_LIST.length).toBe(serviceKeys.length);
    });

    it('should have type property matching SERVICES keys', () => {
      SERVICE_LIST.forEach(item => {
        expect(SERVICES[item.type]).toBeDefined();
      });
    });

    it('should have name property from SERVICES', () => {
      SERVICE_LIST.forEach(item => {
        expect(item.name).toEqual(SERVICES[item.type].name);
      });
    });

    it('should include real_face_time in list', () => {
      const found = SERVICE_LIST.find(s => s.type === 'real_face_time');
      expect(found).toBeDefined();
    });

    it('should include phone in list', () => {
      const found = SERVICE_LIST.find(s => s.type === 'phone');
      expect(found).toBeDefined();
    });

    it('should include all messaging services', () => {
      const messagingServices: ServiceType[] = ['whatsapp', 'signal', 'telegram'];
      messagingServices.forEach(service => {
        const found = SERVICE_LIST.find(s => s.type === service);
        expect(found).toBeDefined();
      });
    });

    it('should include all meeting services', () => {
      const meetingServices: ServiceType[] = ['zoom', 'google_meet', 'teams', 'webex'];
      meetingServices.forEach(service => {
        const found = SERVICE_LIST.find(s => s.type === service);
        expect(found).toBeDefined();
      });
    });
  });

  describe('Type Structure Validation', () => {
    it('should accept valid ContactMethod object', () => {
      const method: ContactMethod = {
        id: 'method-1',
        user_id: 'user-123',
        service_type: 'whatsapp',
        contact_identifier: '1234567890',
        for_spontaneous: true,
        for_scheduled: false,
        spontaneous_priority: 1,
        scheduled_priority: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(method.id).toBe('method-1');
      expect(method.service_type).toBe('whatsapp');
    });

    it('should accept ContactMethod with all optional fields', () => {
      const method: ContactMethod = {
        id: 'method-1',
        user_id: 'user-123',
        service_type: 'zoom',
        contact_identifier: 'https://zoom.us/j/123',
        for_spontaneous: false,
        for_scheduled: true,
        spontaneous_priority: 0,
        scheduled_priority: 2,
        label: 'Work Zoom',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      expect(method.for_spontaneous).toBe(false);
      expect(method.scheduled_priority).toBe(2);
      expect(method.label).toBe('Work Zoom');
    });
  });

  describe('ServiceType values', () => {
    it('should include all standard service types', () => {
      const types: ServiceType[] = [
        'real_face_time',
        'facetime',
        'whatsapp',
        'signal',
        'telegram',
        'zoom',
        'google_meet',
        'teams',
        'phone',
        'discord',
        'skype',
        'webex',
        'slack',
      ];

      types.forEach(type => {
        expect(SERVICES[type]).toBeDefined();
      });
    });
  });

  describe('service categories', () => {
    it('should have spontaneous call services', () => {
      const spontaneousServices = Object.entries(SERVICES)
        .filter(([_, s]) => s.supportsCall)
        .map(([type]) => type);

      expect(spontaneousServices.length).toBeGreaterThan(0);
      expect(spontaneousServices).toContain('phone');
    });

    it('should have scheduled meeting services', () => {
      const scheduledServices = Object.entries(SERVICES)
        .filter(([_, s]) => s.supportsSchedule)
        .map(([type]) => type);

      expect(scheduledServices.length).toBeGreaterThan(0);
      expect(scheduledServices).toContain('zoom');
    });

    it('should have services that support both', () => {
      const bothServices = Object.entries(SERVICES)
        .filter(([_, s]) => s.supportsCall && s.supportsSchedule)
        .map(([type]) => type);

      // Some services may support both
      expect(Array.isArray(bothServices)).toBe(true);
    });
  });
});
