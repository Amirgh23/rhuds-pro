/**
 * Phase 14 Week 4 - Documentation & Knowledge Base Tests
 * Comprehensive test suite for all documentation features
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  APIDocumentationGenerator,
  UsageGuideGenerator,
  ArchitectureDocumenter,
  BestPracticesCompiler,
  TroubleshootingGuideBuilder,
} from '../../engine/documentation';

describe('Phase 14 Week 4 - Documentation & Knowledge Base', () => {
  // ============================================================================
  // APIDocumentationGenerator Tests
  // ============================================================================

  describe('APIDocumentationGenerator', () => {
    let generator: APIDocumentationGenerator;

    beforeEach(() => {
      generator = new APIDocumentationGenerator();
    });

    it('should register endpoint', () => {
      const endpoint = {
        id: 'ep-1',
        method: 'GET' as const,
        path: '/api/users',
        description: 'Get all users',
        parameters: {},
        responses: {
          '200': {
            status: 200,
            description: 'Success',
            schema: { type: 'array' },
          },
        },
        examples: [],
        tags: ['users'],
      };

      generator.registerEndpoint(endpoint);
      expect(generator.getEndpoint('ep-1')).toBeDefined();
    });

    it('should generate API documentation', () => {
      generator.registerEndpoint({
        id: 'ep-1',
        method: 'GET',
        path: '/api/users',
        description: 'Get all users',
        parameters: {},
        responses: {
          '200': {
            status: 200,
            description: 'Success',
            schema: { type: 'array' },
          },
        },
        examples: [],
        tags: ['users'],
      });

      const doc = generator.generateDocumentation(
        'User API',
        '1.0.0',
        'https://api.example.com',
        { type: 'bearer', description: 'Bearer token', example: 'Bearer token123' },
        { requestsPerMinute: 60, requestsPerHour: 3600, description: 'Rate limits' }
      );

      expect(doc.title).toBe('User API');
      expect(doc.version).toBe('1.0.0');
      expect(doc.endpoints.length).toBe(1);
    });

    it('should export as OpenAPI spec', () => {
      generator.registerEndpoint({
        id: 'ep-1',
        method: 'GET',
        path: '/api/users',
        description: 'Get all users',
        parameters: {},
        responses: {
          '200': {
            status: 200,
            description: 'Success',
            schema: { type: 'array' },
          },
        },
        examples: [],
        tags: ['users'],
      });

      const doc = generator.generateDocumentation(
        'User API',
        '1.0.0',
        'https://api.example.com',
        { type: 'bearer', description: 'Bearer token', example: 'Bearer token123' },
        { requestsPerMinute: 60, requestsPerHour: 3600, description: 'Rate limits' }
      );

      const openapi = generator.exportAsOpenAPI(doc.id);
      expect(openapi.openapi).toBe('3.0.0');
      expect((openapi as any).info.title).toBe('User API');
    });

    it('should export as Markdown', () => {
      generator.registerEndpoint({
        id: 'ep-1',
        method: 'GET',
        path: '/api/users',
        description: 'Get all users',
        parameters: {},
        responses: {
          '200': {
            status: 200,
            description: 'Success',
            schema: { type: 'array' },
          },
        },
        examples: [],
        tags: ['users'],
      });

      const doc = generator.generateDocumentation(
        'User API',
        '1.0.0',
        'https://api.example.com',
        { type: 'bearer', description: 'Bearer token', example: 'Bearer token123' },
        { requestsPerMinute: 60, requestsPerHour: 3600, description: 'Rate limits' }
      );

      const markdown = generator.exportAsMarkdown(doc.id);
      expect(markdown).toContain('User API');
      expect(markdown).toContain('GET /api/users');
    });

    it('should validate documentation', () => {
      generator.registerEndpoint({
        id: 'ep-1',
        method: 'GET',
        path: '/api/users',
        description: 'Get all users',
        parameters: {},
        responses: {
          '200': {
            status: 200,
            description: 'Success',
            schema: { type: 'array' },
          },
        },
        examples: [],
        tags: ['users'],
      });

      const doc = generator.generateDocumentation(
        'User API',
        '1.0.0',
        'https://api.example.com',
        { type: 'bearer', description: 'Bearer token', example: 'Bearer token123' },
        { requestsPerMinute: 60, requestsPerHour: 3600, description: 'Rate limits' }
      );

      const validation = generator.validateDocumentation(doc.id);
      expect(validation.valid).toBe(true);
    });

    it('should list endpoints', () => {
      generator.registerEndpoint({
        id: 'ep-1',
        method: 'GET',
        path: '/api/users',
        description: 'Get all users',
        parameters: {},
        responses: {
          '200': {
            status: 200,
            description: 'Success',
            schema: { type: 'array' },
          },
        },
        examples: [],
        tags: ['users'],
      });

      const endpoints = generator.listEndpoints();
      expect(endpoints.length).toBe(1);
    });
  });

  // ============================================================================
  // UsageGuideGenerator Tests
  // ============================================================================

  describe('UsageGuideGenerator', () => {
    let generator: UsageGuideGenerator;

    beforeEach(() => {
      generator = new UsageGuideGenerator();
    });

    it('should create usage guide', () => {
      const guide = generator.createGuide(
        'Getting Started',
        'Learn the basics',
        'beginners',
        'beginner',
        []
      );

      expect(guide.title).toBe('Getting Started');
      expect(guide.difficulty).toBe('beginner');
    });

    it('should add section to guide', () => {
      const guide = generator.createGuide(
        'Getting Started',
        'Learn the basics',
        'beginners',
        'beginner',
        []
      );

      const section = {
        id: 'sec-1',
        title: 'Introduction',
        content: 'Welcome',
        subsections: [],
        codeExamples: [],
        order: 1,
      };

      generator.addSection(guide.id, section);
      const updated = generator.getGuide(guide.id);
      expect(updated?.sections.length).toBe(1);
    });

    it('should create tutorial', () => {
      const tutorial = generator.createTutorial(
        'Build Your First App',
        'Step-by-step tutorial',
        'beginner',
        30,
        []
      );

      expect(tutorial.title).toBe('Build Your First App');
      expect(tutorial.estimatedDuration).toBe(30);
    });

    it('should generate guide Markdown', () => {
      const guide = generator.createGuide(
        'Getting Started',
        'Learn the basics',
        'beginners',
        'beginner',
        []
      );

      const markdown = generator.generateGuideMarkdown(guide.id);
      expect(markdown).toContain('Getting Started');
      expect(markdown).toContain('beginner');
    });

    it('should generate tutorial Markdown', () => {
      const tutorial = generator.createTutorial(
        'Build Your First App',
        'Step-by-step tutorial',
        'beginner',
        30,
        []
      );

      const markdown = generator.generateTutorialMarkdown(tutorial.id);
      expect(markdown).toContain('Build Your First App');
    });

    it('should search guides', () => {
      const guide1 = generator.createGuide(
        'Getting Started',
        'Learn the basics',
        'beginners',
        'beginner',
        []
      );
      const guide2 = generator.createGuide(
        'Advanced Topics',
        'Learn advanced',
        'experts',
        'advanced',
        []
      );

      const allGuides = generator.listGuides();
      expect(allGuides.length).toBeGreaterThanOrEqual(2);
    });

    it('should list guides by difficulty', () => {
      const guide1 = generator.createGuide(
        'Getting Started',
        'Learn the basics',
        'beginners',
        'beginner',
        []
      );
      const guide2 = generator.createGuide(
        'Advanced Topics',
        'Learn advanced',
        'experts',
        'advanced',
        []
      );

      const allGuides = generator.listGuides();
      expect(allGuides.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ============================================================================
  // ArchitectureDocumenter Tests
  // ============================================================================

  describe('ArchitectureDocumenter', () => {
    let documenter: ArchitectureDocumenter;

    beforeEach(() => {
      documenter = new ArchitectureDocumenter();
    });

    it('should register component', () => {
      const component = {
        id: 'comp-1',
        name: 'API Gateway',
        description: 'Main API gateway',
        type: 'service' as const,
        dependencies: [],
        responsibilities: ['Route requests'],
        interfaces: [],
      };

      documenter.registerComponent(component);
      expect(documenter.getComponent('comp-1')).toBeDefined();
    });

    it('should create architecture layer', () => {
      const layer = documenter.createLayer('Presentation', 'UI layer', 1);
      expect(layer.name).toBe('Presentation');
    });

    it('should generate architecture document', () => {
      documenter.registerComponent({
        id: 'comp-1',
        name: 'API Gateway',
        description: 'Main API gateway',
        type: 'service',
        dependencies: [],
        responsibilities: ['Route requests'],
        interfaces: [],
      });

      const doc = documenter.generateDocument(
        'System Architecture',
        'Complete system design',
        '1.0.0',
        { id: 'df-1', title: 'Data Flow', flows: [] },
        {
          id: 'dm-1',
          environments: [],
          scalingStrategy: 'Horizontal',
          failoverStrategy: 'Active-Passive',
        }
      );

      expect(doc.title).toBe('System Architecture');
      expect(doc.version).toBe('1.0.0');
    });

    it('should generate Mermaid diagram', () => {
      documenter.registerComponent({
        id: 'comp-1',
        name: 'API Gateway',
        description: 'Main API gateway',
        type: 'service',
        dependencies: [],
        responsibilities: ['Route requests'],
        interfaces: [],
      });

      const doc = documenter.generateDocument(
        'System Architecture',
        'Complete system design',
        '1.0.0',
        { id: 'df-1', title: 'Data Flow', flows: [] },
        {
          id: 'dm-1',
          environments: [],
          scalingStrategy: 'Horizontal',
          failoverStrategy: 'Active-Passive',
        }
      );

      const diagram = documenter.generateMermaidDiagram(doc.id);
      expect(diagram).toContain('graph TB');
    });

    it('should generate architecture Markdown', () => {
      documenter.registerComponent({
        id: 'comp-1',
        name: 'API Gateway',
        description: 'Main API gateway',
        type: 'service',
        dependencies: [],
        responsibilities: ['Route requests'],
        interfaces: [],
      });

      const doc = documenter.generateDocument(
        'System Architecture',
        'Complete system design',
        '1.0.0',
        { id: 'df-1', title: 'Data Flow', flows: [] },
        {
          id: 'dm-1',
          environments: [],
          scalingStrategy: 'Horizontal',
          failoverStrategy: 'Active-Passive',
        }
      );

      const markdown = documenter.generateMarkdown(doc.id);
      expect(markdown).toContain('System Architecture');
    });

    it('should validate architecture', () => {
      documenter.registerComponent({
        id: 'comp-1',
        name: 'API Gateway',
        description: 'Main API gateway',
        type: 'service',
        dependencies: [],
        responsibilities: ['Route requests'],
        interfaces: [],
      });

      const doc = documenter.generateDocument(
        'System Architecture',
        'Complete system design',
        '1.0.0',
        { id: 'df-1', title: 'Data Flow', flows: [] },
        {
          id: 'dm-1',
          environments: [],
          scalingStrategy: 'Horizontal',
          failoverStrategy: 'Active-Passive',
        }
      );

      const validation = documenter.validateArchitecture(doc.id);
      expect(validation.valid).toBe(true);
    });
  });

  // ============================================================================
  // BestPracticesCompiler Tests
  // ============================================================================

  describe('BestPracticesCompiler', () => {
    let compiler: BestPracticesCompiler;

    beforeEach(() => {
      compiler = new BestPracticesCompiler();
    });

    it('should register best practice', () => {
      const practice = {
        id: 'bp-1',
        title: 'Use TypeScript',
        description: 'Always use TypeScript for type safety',
        category: 'Code Quality',
        priority: 'high' as const,
        applicableTo: ['all'],
        examples: [],
        antiPatterns: [],
        relatedPractices: [],
        createdAt: Date.now(),
      };

      compiler.registerPractice(practice);
      expect(compiler.getPractice('bp-1')).toBeDefined();
    });

    it('should create practice category', () => {
      const category = compiler.createCategory('Code Quality', 'Code quality practices');
      expect(category.name).toBe('Code Quality');
    });

    it('should create best practices guide', () => {
      const guide = compiler.createGuide('Best Practices', 'Our best practices', '1.0.0');
      expect(guide.title).toBe('Best Practices');
    });

    it('should generate best practices Markdown', () => {
      compiler.registerPractice({
        id: 'bp-1',
        title: 'Use TypeScript',
        description: 'Always use TypeScript for type safety',
        category: 'Code Quality',
        priority: 'high',
        applicableTo: ['all'],
        examples: [],
        antiPatterns: [],
        relatedPractices: [],
        createdAt: Date.now(),
      });

      const guide = compiler.createGuide('Best Practices', 'Our best practices', '1.0.0');
      const markdown = compiler.generateMarkdown(guide.id);
      expect(markdown).toContain('Best Practices');
    });

    it('should search practices', () => {
      compiler.registerPractice({
        id: 'bp-1',
        title: 'Use TypeScript',
        description: 'Always use TypeScript for type safety',
        category: 'Code Quality',
        priority: 'high',
        applicableTo: ['all'],
        examples: [],
        antiPatterns: [],
        relatedPractices: [],
        createdAt: Date.now(),
      });

      const results = compiler.searchPractices('TypeScript');
      expect(results.length).toBe(1);
    });

    it('should get practices by priority', () => {
      compiler.registerPractice({
        id: 'bp-1',
        title: 'Use TypeScript',
        description: 'Always use TypeScript for type safety',
        category: 'Code Quality',
        priority: 'high',
        applicableTo: ['all'],
        examples: [],
        antiPatterns: [],
        relatedPractices: [],
        createdAt: Date.now(),
      });

      const high = compiler.getPracticesByPriority('high');
      expect(high.length).toBe(1);
    });

    it('should get metrics', () => {
      compiler.registerPractice({
        id: 'bp-1',
        title: 'Use TypeScript',
        description: 'Always use TypeScript for type safety',
        category: 'Code Quality',
        priority: 'high',
        applicableTo: ['all'],
        examples: [],
        antiPatterns: [],
        relatedPractices: [],
        createdAt: Date.now(),
      });

      const guide = compiler.createGuide('Best Practices', 'Our best practices', '1.0.0');
      const metrics = compiler.getMetrics(guide.id);
      expect(metrics.totalPractices).toBe(1);
    });
  });

  // ============================================================================
  // TroubleshootingGuideBuilder Tests
  // ============================================================================

  describe('TroubleshootingGuideBuilder', () => {
    let builder: TroubleshootingGuideBuilder;

    beforeEach(() => {
      builder = new TroubleshootingGuideBuilder();
    });

    it('should register issue', () => {
      const issue = {
        id: 'issue-1',
        title: 'Connection Timeout',
        description: 'Connection times out',
        severity: 'high' as const,
        symptoms: ['Slow response'],
        rootCauses: ['Network issue'],
        solutions: [],
        preventionTips: [],
        relatedIssues: [],
        frequency: 'common' as const,
        createdAt: Date.now(),
      };

      builder.registerIssue(issue);
      expect(builder.getIssue('issue-1')).toBeDefined();
    });

    it('should create troubleshooting category', () => {
      const category = builder.createCategory('Network', 'Network issues');
      expect(category.name).toBe('Network');
    });

    it('should create troubleshooting guide', () => {
      const guide = builder.createGuide('Troubleshooting', 'Common issues', '1.0.0');
      expect(guide.title).toBe('Troubleshooting');
    });

    it('should generate troubleshooting Markdown', () => {
      builder.registerIssue({
        id: 'issue-1',
        title: 'Connection Timeout',
        description: 'Connection times out',
        severity: 'high',
        symptoms: ['Slow response'],
        rootCauses: ['Network issue'],
        solutions: [],
        preventionTips: [],
        relatedIssues: [],
        frequency: 'common',
        createdAt: Date.now(),
      });

      const guide = builder.createGuide('Troubleshooting', 'Common issues', '1.0.0');
      const markdown = builder.generateMarkdown(guide.id);
      expect(markdown).toContain('Troubleshooting');
    });

    it('should search issues', () => {
      builder.registerIssue({
        id: 'issue-1',
        title: 'Connection Timeout',
        description: 'Connection times out',
        severity: 'high',
        symptoms: ['Slow response'],
        rootCauses: ['Network issue'],
        solutions: [],
        preventionTips: [],
        relatedIssues: [],
        frequency: 'common',
        createdAt: Date.now(),
      });

      const results = builder.searchIssues('Connection');
      expect(results.length).toBe(1);
    });

    it('should get issues by severity', () => {
      builder.registerIssue({
        id: 'issue-1',
        title: 'Connection Timeout',
        description: 'Connection times out',
        severity: 'high',
        symptoms: ['Slow response'],
        rootCauses: ['Network issue'],
        solutions: [],
        preventionTips: [],
        relatedIssues: [],
        frequency: 'common',
        createdAt: Date.now(),
      });

      const high = builder.getIssuesBySeverity('high');
      expect(high.length).toBe(1);
    });

    it('should get metrics', () => {
      builder.registerIssue({
        id: 'issue-1',
        title: 'Connection Timeout',
        description: 'Connection times out',
        severity: 'high',
        symptoms: ['Slow response'],
        rootCauses: ['Network issue'],
        solutions: [],
        preventionTips: [],
        relatedIssues: [],
        frequency: 'common',
        createdAt: Date.now(),
      });

      const guide = builder.createGuide('Troubleshooting', 'Common issues', '1.0.0');
      const metrics = builder.getMetrics(guide.id);
      expect(metrics.totalIssues).toBe(1);
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration Tests', () => {
    it('should work together: API + Usage Guide', () => {
      const apiGen = new APIDocumentationGenerator();
      const guideGen = new UsageGuideGenerator();

      apiGen.registerEndpoint({
        id: 'ep-1',
        method: 'GET',
        path: '/api/users',
        description: 'Get all users',
        parameters: {},
        responses: {
          '200': {
            status: 200,
            description: 'Success',
            schema: { type: 'array' },
          },
        },
        examples: [],
        tags: ['users'],
      });

      const doc = apiGen.generateDocumentation(
        'User API',
        '1.0.0',
        'https://api.example.com',
        { type: 'bearer', description: 'Bearer token', example: 'Bearer token123' },
        { requestsPerMinute: 60, requestsPerHour: 3600, description: 'Rate limits' }
      );

      const guide = guideGen.createGuide(
        'API Usage',
        'How to use the API',
        'developers',
        'beginner',
        []
      );

      expect(doc.endpoints.length).toBe(1);
      expect(guide.title).toBe('API Usage');
    });

    it('should work together: Architecture + Best Practices', () => {
      const archDoc = new ArchitectureDocumenter();
      const practices = new BestPracticesCompiler();

      archDoc.registerComponent({
        id: 'comp-1',
        name: 'API Gateway',
        description: 'Main API gateway',
        type: 'service',
        dependencies: [],
        responsibilities: ['Route requests'],
        interfaces: [],
      });

      practices.registerPractice({
        id: 'bp-1',
        title: 'Use TypeScript',
        description: 'Always use TypeScript for type safety',
        category: 'Code Quality',
        priority: 'high',
        applicableTo: ['all'],
        examples: [],
        antiPatterns: [],
        relatedPractices: [],
        createdAt: Date.now(),
      });

      const doc = archDoc.generateDocument(
        'System Architecture',
        'Complete system design',
        '1.0.0',
        { id: 'df-1', title: 'Data Flow', flows: [] },
        {
          id: 'dm-1',
          environments: [],
          scalingStrategy: 'Horizontal',
          failoverStrategy: 'Active-Passive',
        }
      );

      const guide = practices.createGuide('Best Practices', 'Our best practices', '1.0.0');

      expect(doc.title).toBe('System Architecture');
      expect(guide.practices.length).toBe(1);
    });
  });
});
