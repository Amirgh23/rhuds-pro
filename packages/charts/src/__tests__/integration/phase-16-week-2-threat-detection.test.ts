/**
 * Phase 16 Week 2 - Threat Detection & Response Tests
 * Comprehensive test suite for threat detection and incident response
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  ThreatDetectionEngine,
  ThreatLevel,
  ThreatType,
} from '../../engine/security/ThreatDetectionEngine';
import { IncidentResponseManager } from '../../engine/security/IncidentResponseManager';
import { ThreatIntelligenceManager } from '../../engine/security/ThreatIntelligenceManager';
import { SecurityEventProcessor } from '../../engine/security/SecurityEventProcessor';
import { AutomatedResponseSystem } from '../../engine/security/AutomatedResponseSystem';

describe('Phase 16 Week 2 - Threat Detection & Response', () => {
  let threatEngine: ThreatDetectionEngine;
  let incidentManager: IncidentResponseManager;
  let intelligenceManager: ThreatIntelligenceManager;
  let eventProcessor: SecurityEventProcessor;
  let responseSystem: AutomatedResponseSystem;

  beforeEach(() => {
    threatEngine = new ThreatDetectionEngine();
    incidentManager = new IncidentResponseManager();
    intelligenceManager = new ThreatIntelligenceManager();
    eventProcessor = new SecurityEventProcessor();
    responseSystem = new AutomatedResponseSystem();
  });

  describe('ThreatDetectionEngine', () => {
    it('should create threat pattern', () => {
      const pattern = threatEngine.createPattern({
        name: 'SQL Injection',
        type: 'injection_attack',
        enabled: true,
        rules: [
          {
            field: 'query',
            operator: 'contains',
            value: 'DROP TABLE',
          },
        ],
        severity: 'critical',
        confidence: 0.95,
      });

      expect(pattern.id).toBeDefined();
      expect(pattern.name).toBe('SQL Injection');
      expect(pattern.type).toBe('injection_attack');
    });

    it('should detect threat from event', () => {
      threatEngine.createPattern({
        name: 'Brute Force',
        type: 'brute_force',
        enabled: true,
        rules: [
          {
            field: 'failed_attempts',
            operator: 'greater_than',
            value: 5,
          },
        ],
        severity: 'high',
        confidence: 0.85,
      });

      const threat = threatEngine.detectThreat({
        source: '192.168.1.100',
        target: 'auth_service',
        data: {
          failed_attempts: 10,
          username: 'admin',
        },
      });

      expect(threat).toBeDefined();
      expect(threat?.type).toBe('brute_force');
      expect(threat?.level).toBe('high');
      expect(threat?.confidence).toBe(0.85);
    });

    it('should return null when no pattern matches', () => {
      threatEngine.createPattern({
        name: 'Test Pattern',
        type: 'malware',
        enabled: true,
        rules: [
          {
            field: 'hash',
            operator: 'equals',
            value: 'abc123',
          },
        ],
        severity: 'critical',
        confidence: 0.9,
      });

      const threat = threatEngine.detectThreat({
        source: '192.168.1.100',
        target: 'system',
        data: {
          hash: 'xyz789',
        },
      });

      expect(threat).toBeNull();
    });

    it('should correlate threats', () => {
      threatEngine.createPattern({
        name: 'Lateral Movement',
        type: 'lateral_movement',
        enabled: true,
        rules: [
          {
            field: 'action',
            operator: 'equals',
            value: 'network_scan',
          },
        ],
        severity: 'high',
        confidence: 0.8,
      });

      const threat1 = threatEngine.detectThreat({
        source: '192.168.1.100',
        target: 'system1',
        data: { action: 'network_scan', ip: '192.168.1.100' },
      });

      const threat2 = threatEngine.detectThreat({
        source: '192.168.1.100',
        target: 'system2',
        data: { action: 'network_scan', ip: '192.168.1.100' },
      });

      const correlations = threatEngine.correlateThreats();
      expect(correlations.length).toBeGreaterThan(0);
      expect(correlations[0].correlation).toBeGreaterThan(0.5);
    });

    it('should get open threats', () => {
      threatEngine.createPattern({
        name: 'Test',
        type: 'intrusion',
        enabled: true,
        rules: [{ field: 'type', operator: 'equals', value: 'intrusion' }],
        severity: 'critical',
        confidence: 0.9,
      });

      threatEngine.detectThreat({
        source: '192.168.1.100',
        target: 'system',
        data: { type: 'intrusion' },
      });

      const openThreats = threatEngine.getOpenThreats();
      expect(openThreats.length).toBe(1);
      expect(openThreats[0].status).toBe('open');
    });

    it('should get critical threats', () => {
      threatEngine.createPattern({
        name: 'Critical',
        type: 'malware',
        enabled: true,
        rules: [{ field: 'severity', operator: 'equals', value: 'critical' }],
        severity: 'critical',
        confidence: 0.95,
      });

      threatEngine.detectThreat({
        source: '192.168.1.100',
        target: 'system',
        data: { severity: 'critical' },
      });

      const critical = threatEngine.getCriticalThreats();
      expect(critical.length).toBe(1);
      expect(critical[0].level).toBe('critical');
    });

    it('should update threat status', () => {
      threatEngine.createPattern({
        name: 'Test',
        type: 'intrusion',
        enabled: true,
        rules: [{ field: 'type', operator: 'equals', value: 'intrusion' }],
        severity: 'high',
        confidence: 0.8,
      });

      const threat = threatEngine.detectThreat({
        source: '192.168.1.100',
        target: 'system',
        data: { type: 'intrusion' },
      });

      const updated = threatEngine.updateThreatStatus(threat!.id, 'contained');
      expect(updated).toBe(true);

      const retrieved = threatEngine.getThreat(threat!.id);
      expect(retrieved?.status).toBe('contained');
    });

    it('should get threat statistics', () => {
      threatEngine.createPattern({
        name: 'Test',
        type: 'intrusion',
        enabled: true,
        rules: [{ field: 'type', operator: 'equals', value: 'intrusion' }],
        severity: 'high',
        confidence: 0.8,
      });

      threatEngine.detectThreat({
        source: '192.168.1.100',
        target: 'system',
        data: { type: 'intrusion' },
      });

      const stats = threatEngine.getStatistics();
      expect(stats.totalThreats).toBe(1);
      expect(stats.openThreats).toBe(1);
      expect(stats.criticalThreats).toBe(0);
    });

    it('should export threat report', () => {
      threatEngine.createPattern({
        name: 'Test',
        type: 'intrusion',
        enabled: true,
        rules: [{ field: 'type', operator: 'equals', value: 'intrusion' }],
        severity: 'high',
        confidence: 0.8,
      });

      threatEngine.detectThreat({
        source: '192.168.1.100',
        target: 'system',
        data: { type: 'intrusion' },
      });

      const jsonReport = threatEngine.exportThreatReport('json');
      expect(jsonReport).toContain('intrusion');

      const csvReport = threatEngine.exportThreatReport('csv');
      expect(csvReport).toContain('Type');
    });
  });

  describe('IncidentResponseManager', () => {
    it('should create incident', () => {
      const incident = incidentManager.createIncident({
        title: 'Security Breach',
        description: 'Unauthorized access detected',
        severity: 'critical',
        status: 'reported',
        source: 'IDS',
        affectedSystems: ['web_server', 'database'],
        reportedBy: 'security_team',
        metadata: {},
      });

      expect(incident.id).toBeDefined();
      expect(incident.title).toBe('Security Breach');
      expect(incident.severity).toBe('critical');
    });

    it('should add response action', () => {
      const incident = incidentManager.createIncident({
        title: 'Test',
        description: 'Test incident',
        severity: 'high',
        status: 'reported',
        source: 'IDS',
        affectedSystems: [],
        reportedBy: 'admin',
        metadata: {},
      });

      const action = incidentManager.addResponseAction(incident.id, {
        type: 'isolate_system',
        description: 'Isolate affected system',
        status: 'pending',
      });

      expect(action).toBeDefined();
      expect(action?.type).toBe('isolate_system');
    });

    it('should update incident status', () => {
      const incident = incidentManager.createIncident({
        title: 'Test',
        description: 'Test incident',
        severity: 'high',
        status: 'reported',
        source: 'IDS',
        affectedSystems: [],
        reportedBy: 'admin',
        metadata: {},
      });

      const updated = incidentManager.updateIncidentStatus(incident.id, 'investigating');
      expect(updated).toBe(true);

      const retrieved = incidentManager.getIncident(incident.id);
      expect(retrieved?.status).toBe('investigating');
    });

    it('should assign incident', () => {
      const incident = incidentManager.createIncident({
        title: 'Test',
        description: 'Test incident',
        severity: 'high',
        status: 'reported',
        source: 'IDS',
        affectedSystems: [],
        reportedBy: 'admin',
        metadata: {},
      });

      const assigned = incidentManager.assignIncident(incident.id, 'john_doe');
      expect(assigned).toBe(true);

      const retrieved = incidentManager.getIncident(incident.id);
      expect(retrieved?.assignedTo).toBe('john_doe');
    });

    it('should resolve incident', () => {
      const incident = incidentManager.createIncident({
        title: 'Test',
        description: 'Test incident',
        severity: 'high',
        status: 'reported',
        source: 'IDS',
        affectedSystems: [],
        reportedBy: 'admin',
        metadata: {},
      });

      const resolved = incidentManager.resolveIncident(incident.id, 'Threat neutralized');
      expect(resolved).toBe(true);

      const retrieved = incidentManager.getIncident(incident.id);
      expect(retrieved?.status).toBe('closed');
      expect(retrieved?.resolution?.description).toBe('Threat neutralized');
    });

    it('should get open incidents', () => {
      incidentManager.createIncident({
        title: 'Open',
        description: 'Open incident',
        severity: 'high',
        status: 'reported',
        source: 'IDS',
        affectedSystems: [],
        reportedBy: 'admin',
        metadata: {},
      });

      const open = incidentManager.getOpenIncidents();
      expect(open.length).toBe(1);
    });

    it('should get incident statistics', () => {
      incidentManager.createIncident({
        title: 'Test',
        description: 'Test incident',
        severity: 'critical',
        status: 'reported',
        source: 'IDS',
        affectedSystems: [],
        reportedBy: 'admin',
        metadata: {},
      });

      const stats = incidentManager.getStatistics();
      expect(stats.totalIncidents).toBe(1);
      expect(stats.criticalIncidents).toBe(1);
    });
  });

  describe('ThreatIntelligenceManager', () => {
    it('should add intelligence record', () => {
      const record = intelligenceManager.addIntelligenceRecord({
        source: 'external',
        threatName: 'APT28',
        threatDescription: 'Advanced Persistent Threat',
        indicators: [
          {
            id: 'ind1',
            type: 'ip',
            value: '192.168.1.1',
            confidence: 'high',
            firstSeen: Date.now(),
            lastSeen: Date.now(),
            sources: ['external'],
            metadata: {},
          },
        ],
        severity: 'critical',
        ttl: 86400000,
        relatedThreats: [],
        metadata: {},
      });

      expect(record.id).toBeDefined();
      expect(record.threatName).toBe('APT28');
    });

    it('should search indicators', () => {
      intelligenceManager.addIntelligenceRecord({
        source: 'external',
        threatName: 'APT28',
        threatDescription: 'Test',
        indicators: [
          {
            id: 'ind1',
            type: 'ip',
            value: '192.168.1.1',
            confidence: 'high',
            firstSeen: Date.now(),
            lastSeen: Date.now(),
            sources: ['external'],
            metadata: {},
          },
        ],
        severity: 'high',
        ttl: 86400000,
        relatedThreats: [],
        metadata: {},
      });

      const results = intelligenceManager.searchIndicators('192.168.1.1');
      expect(results.length).toBe(1);
      expect(results[0].value).toBe('192.168.1.1');
    });

    it('should get active records', () => {
      intelligenceManager.addIntelligenceRecord({
        source: 'external',
        threatName: 'APT28',
        threatDescription: 'Test',
        indicators: [],
        severity: 'high',
        ttl: 86400000,
        relatedThreats: [],
        metadata: {},
      });

      const active = intelligenceManager.getActiveRecords();
      expect(active.length).toBe(1);
    });

    it('should get intelligence statistics', () => {
      intelligenceManager.addIntelligenceRecord({
        source: 'external',
        threatName: 'APT28',
        threatDescription: 'Test',
        indicators: [
          {
            id: 'ind1',
            type: 'ip',
            value: '192.168.1.1',
            confidence: 'high',
            firstSeen: Date.now(),
            lastSeen: Date.now(),
            sources: ['external'],
            metadata: {},
          },
        ],
        severity: 'high',
        ttl: 86400000,
        relatedThreats: [],
        metadata: {},
      });

      const stats = intelligenceManager.getStatistics();
      expect(stats.totalRecords).toBe(1);
      expect(stats.totalIndicators).toBe(1);
    });
  });

  describe('SecurityEventProcessor', () => {
    it('should add event to queue', () => {
      const event = eventProcessor.addEvent({
        type: 'login_attempt',
        source: 'auth_service',
        severity: 'info',
        data: { user: 'admin', ip: '192.168.1.100' },
      });

      expect(event.id).toBeDefined();
      expect(event.type).toBe('login_attempt');
      expect(event.processed).toBe(false);
    });

    it('should process events', () => {
      eventProcessor.addEvent({
        type: 'login_attempt',
        source: 'auth_service',
        severity: 'info',
        data: { user: 'admin', ip: '192.168.1.100' },
      });

      eventProcessor.processEvents();

      const stats = eventProcessor.getStatistics();
      expect(stats.processedEvents).toBe(1);
    });

    it('should enrich events', () => {
      const event = eventProcessor.addEvent({
        type: 'login_attempt',
        source: 'auth_service',
        severity: 'info',
        data: { user: 'admin', ip: '192.168.1.100' },
      });

      eventProcessor.processEvents();

      const enrichments = eventProcessor.getEventEnrichments(event.id);
      expect(enrichments.length).toBeGreaterThan(0);
    });

    it('should correlate events', () => {
      eventProcessor.addEvent({
        type: 'login_attempt',
        source: 'auth_service',
        severity: 'info',
        data: { user: 'admin', ip: '192.168.1.100' },
      });

      eventProcessor.addEvent({
        type: 'login_attempt',
        source: 'auth_service',
        severity: 'info',
        data: { user: 'admin', ip: '192.168.1.100' },
      });

      eventProcessor.processEvents();

      const stats = eventProcessor.getStatistics();
      expect(stats.correlatedEvents).toBeGreaterThan(0);
    });

    it('should get processing statistics', () => {
      eventProcessor.addEvent({
        type: 'login_attempt',
        source: 'auth_service',
        severity: 'info',
        data: { user: 'admin' },
      });

      eventProcessor.processEvents();

      const stats = eventProcessor.getStatistics();
      expect(stats.totalEvents).toBe(1);
      expect(stats.processedEvents).toBe(1);
    });
  });

  describe('AutomatedResponseSystem', () => {
    it('should create response rule', () => {
      const rule = responseSystem.createRule({
        name: 'Block Brute Force',
        enabled: true,
        trigger: {
          eventType: 'brute_force',
          severity: 'high',
          condition: (data) => (data.attempts as number) > 5,
        },
        actions: [
          {
            id: 'action1',
            type: 'block_ip',
            parameters: { ip: '192.168.1.100' },
            timeout: 5000,
            rollbackable: true,
          },
        ],
        priority: 10,
        cooldown: 60000,
        maxExecutions: 100,
      });

      expect(rule.id).toBeDefined();
      expect(rule.name).toBe('Block Brute Force');
    });

    it('should execute response', async () => {
      responseSystem.createRule({
        name: 'Block IP',
        enabled: true,
        trigger: {
          eventType: 'brute_force',
          severity: 'high',
          condition: (data) => (data.attempts as number) > 5,
        },
        actions: [
          {
            id: 'action1',
            type: 'block_ip',
            parameters: { ip: '192.168.1.100' },
            timeout: 5000,
            rollbackable: true,
          },
        ],
        priority: 10,
        cooldown: 0,
        maxExecutions: 100,
      });

      const execution = await responseSystem.executeResponse('event1', {
        attempts: 10,
        eventType: 'brute_force',
      });

      expect(execution).toBeDefined();
      expect(execution?.overallStatus).toBe('completed');
    });

    it('should get response statistics', async () => {
      responseSystem.createRule({
        name: 'Test Rule',
        enabled: true,
        trigger: {
          eventType: 'test',
          severity: 'high',
          condition: () => true,
        },
        actions: [
          {
            id: 'action1',
            type: 'alert_admin',
            parameters: { admin: 'admin@example.com', message: 'Test' },
            timeout: 5000,
            rollbackable: false,
          },
        ],
        priority: 10,
        cooldown: 0,
        maxExecutions: 100,
      });

      await responseSystem.executeResponse('event1', {});

      const stats = responseSystem.getStatistics();
      expect(stats.totalExecutions).toBe(1);
      expect(stats.successfulExecutions).toBe(1);
    });

    it('should export response report', async () => {
      responseSystem.createRule({
        name: 'Test',
        enabled: true,
        trigger: {
          eventType: 'test',
          severity: 'high',
          condition: () => true,
        },
        actions: [
          {
            id: 'action1',
            type: 'alert_admin',
            parameters: { admin: 'admin@example.com', message: 'Test' },
            timeout: 5000,
            rollbackable: false,
          },
        ],
        priority: 10,
        cooldown: 0,
        maxExecutions: 100,
      });

      await responseSystem.executeResponse('event1', {});

      const jsonReport = responseSystem.exportResponseReport('json');
      expect(jsonReport).toContain('completed');

      const csvReport = responseSystem.exportResponseReport('csv');
      expect(csvReport).toContain('Status');
    });
  });

  describe('Integration Tests', () => {
    it('should coordinate threat detection and incident response', () => {
      // Create threat pattern
      threatEngine.createPattern({
        name: 'Intrusion',
        type: 'intrusion',
        enabled: true,
        rules: [{ field: 'type', operator: 'equals', value: 'intrusion' }],
        severity: 'critical',
        confidence: 0.95,
      });

      // Detect threat
      const threat = threatEngine.detectThreat({
        source: '192.168.1.100',
        target: 'system',
        data: { type: 'intrusion' },
      });

      // Create incident
      const incident = incidentManager.createIncident({
        title: `Incident for ${threat?.type}`,
        description: threat?.description || '',
        severity: 'critical',
        status: 'reported',
        source: threat?.source || '',
        affectedSystems: [threat?.target || ''],
        reportedBy: 'threat_engine',
        metadata: { threatId: threat?.id },
      });

      expect(incident.id).toBeDefined();
      expect(incident.title).toContain('intrusion');
    });

    it('should coordinate threat intelligence and detection', () => {
      // Add intelligence
      const record = intelligenceManager.addIntelligenceRecord({
        source: 'external',
        threatName: 'APT28',
        threatDescription: 'Advanced threat',
        indicators: [
          {
            id: 'ind1',
            type: 'ip',
            value: '192.168.1.1',
            confidence: 'high',
            firstSeen: Date.now(),
            lastSeen: Date.now(),
            sources: ['external'],
            metadata: {},
          },
        ],
        severity: 'critical',
        ttl: 86400000,
        relatedThreats: [],
        metadata: {},
      });

      // Search for indicator
      const results = intelligenceManager.searchIndicators('192.168.1.1');
      expect(results.length).toBe(1);

      // Create pattern from intelligence
      threatEngine.createPattern({
        name: record.threatName,
        type: 'intrusion',
        enabled: true,
        rules: [
          {
            field: 'source_ip',
            operator: 'equals',
            value: '192.168.1.1',
          },
        ],
        severity: 'critical',
        confidence: 0.95,
      });

      expect(threatEngine.getPatterns().length).toBe(1);
    });

    it('should coordinate event processing and automated response', async () => {
      // Add processing rule
      eventProcessor.addProcessingRule({
        name: 'Detect Brute Force',
        enabled: true,
        condition: (event) => (event.data.attempts as number) > 5,
        action: (event) => {
          event.data.threat_level = 'high';
        },
        priority: 10,
      });

      // Add event
      const event = eventProcessor.addEvent({
        type: 'login_attempt',
        source: 'auth_service',
        severity: 'high',
        data: { attempts: 10, user: 'admin' },
      });

      // Process events
      eventProcessor.processEvents();

      // Create response rule
      responseSystem.createRule({
        name: 'Block Brute Force',
        enabled: true,
        trigger: {
          eventType: 'login_attempt',
          severity: 'high',
          condition: (data) => (data.attempts as number) > 5,
        },
        actions: [
          {
            id: 'action1',
            type: 'block_ip',
            parameters: { ip: '192.168.1.100' },
            timeout: 5000,
            rollbackable: true,
          },
        ],
        priority: 10,
        cooldown: 0,
        maxExecutions: 100,
      });

      // Execute response
      const execution = await responseSystem.executeResponse(event.id, event.data);
      expect(execution?.overallStatus).toBe('completed');
    });

    it('should handle full security workflow', async () => {
      // 1. Add threat intelligence
      intelligenceManager.addIntelligenceRecord({
        source: 'external',
        threatName: 'Malware Campaign',
        threatDescription: 'Detected malware',
        indicators: [
          {
            id: 'ind1',
            type: 'hash',
            value: 'abc123def456',
            confidence: 'high',
            firstSeen: Date.now(),
            lastSeen: Date.now(),
            sources: ['external'],
            metadata: {},
          },
        ],
        severity: 'critical',
        ttl: 86400000,
        relatedThreats: [],
        metadata: {},
      });

      // 2. Create threat pattern
      threatEngine.createPattern({
        name: 'Malware Detection',
        type: 'malware',
        enabled: true,
        rules: [
          {
            field: 'file_hash',
            operator: 'equals',
            value: 'abc123def456',
          },
        ],
        severity: 'critical',
        confidence: 0.95,
      });

      // 3. Detect threat
      const threat = threatEngine.detectThreat({
        source: '192.168.1.100',
        target: 'workstation',
        data: { file_hash: 'abc123def456', filename: 'malware.exe' },
      });

      // 4. Create incident
      const incident = incidentManager.createIncident({
        title: 'Malware Detected',
        description: threat?.description || '',
        severity: 'critical',
        status: 'reported',
        source: 'threat_engine',
        affectedSystems: ['workstation'],
        reportedBy: 'security_system',
        metadata: { threatId: threat?.id },
      });

      // 5. Add response action
      incidentManager.addResponseAction(incident.id, {
        type: 'quarantine_file',
        description: 'Quarantine malicious file',
        status: 'pending',
      });

      // 6. Create automated response rule
      responseSystem.createRule({
        name: 'Quarantine Malware',
        enabled: true,
        trigger: {
          eventType: 'malware',
          severity: 'critical',
          condition: (data) => data.file_hash === 'abc123def456',
        },
        actions: [
          {
            id: 'action1',
            type: 'quarantine_file',
            parameters: { file: 'malware.exe' },
            timeout: 5000,
            rollbackable: true,
          },
        ],
        priority: 10,
        cooldown: 0,
        maxExecutions: 100,
      });

      // 7. Execute response
      const execution = await responseSystem.executeResponse(threat!.id, {
        file_hash: 'abc123def456',
      });

      expect(execution?.overallStatus).toBe('completed');
      expect(incident.id).toBeDefined();
      expect(threat?.id).toBeDefined();
    });

    it('should generate comprehensive security report', () => {
      // Create multiple threats
      threatEngine.createPattern({
        name: 'Test',
        type: 'intrusion',
        enabled: true,
        rules: [{ field: 'type', operator: 'equals', value: 'intrusion' }],
        severity: 'high',
        confidence: 0.8,
      });

      threatEngine.detectThreat({
        source: '192.168.1.100',
        target: 'system',
        data: { type: 'intrusion' },
      });

      // Create incidents
      incidentManager.createIncident({
        title: 'Test Incident',
        description: 'Test',
        severity: 'high',
        status: 'reported',
        source: 'IDS',
        affectedSystems: [],
        reportedBy: 'admin',
        metadata: {},
      });

      // Get statistics
      const threatStats = threatEngine.getStatistics();
      const incidentStats = incidentManager.getStatistics();
      const intelligenceStats = intelligenceManager.getStatistics();

      expect(threatStats.totalThreats).toBe(1);
      expect(incidentStats.totalIncidents).toBe(1);
      expect(intelligenceStats.totalRecords).toBe(0);
    });
  });
});
