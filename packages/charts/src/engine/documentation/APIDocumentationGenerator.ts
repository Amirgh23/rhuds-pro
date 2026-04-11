/**
 * APIDocumentationGenerator - Automatic API Documentation Generation
 * Generates comprehensive API documentation from code analysis
 */

interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters: Record<string, ParameterDef>;
  requestBody?: RequestBodyDef;
  responses: Record<string, ResponseDef>;
  examples: APIExample[];
  deprecated?: boolean;
  tags: string[];
}

interface ParameterDef {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: unknown;
  schema?: Record<string, unknown>;
}

interface RequestBodyDef {
  description: string;
  required: boolean;
  content: Record<string, ContentDef>;
}

interface ContentDef {
  schema: Record<string, unknown>;
  example?: unknown;
}

interface ResponseDef {
  status: number;
  description: string;
  schema: Record<string, unknown>;
  example?: unknown;
}

interface APIExample {
  title: string;
  description: string;
  request: string;
  response: string;
  language: string;
}

interface APIDocumentation {
  id: string;
  title: string;
  version: string;
  description: string;
  baseUrl: string;
  endpoints: APIEndpoint[];
  schemas: Record<string, Record<string, unknown>>;
  authentication: AuthenticationDef;
  rateLimit: RateLimitDef;
  generatedAt: number;
}

interface AuthenticationDef {
  type: 'bearer' | 'api-key' | 'oauth2' | 'basic';
  description: string;
  example: string;
}

interface RateLimitDef {
  requestsPerMinute: number;
  requestsPerHour: number;
  description: string;
}

export class APIDocumentationGenerator {
  private endpoints: Map<string, APIEndpoint> = new Map();
  private schemas: Map<string, Record<string, unknown>> = new Map();
  private documentation: Map<string, APIDocumentation> = new Map();

  /**
   * Register API endpoint for documentation
   */
  registerEndpoint(endpoint: APIEndpoint): void {
    this.endpoints.set(endpoint.id, endpoint);
  }

  /**
   * Register data schema
   */
  registerSchema(name: string, schema: Record<string, unknown>): void {
    this.schemas.set(name, schema);
  }

  /**
   * Generate API documentation
   */
  generateDocumentation(
    title: string,
    version: string,
    baseUrl: string,
    auth: AuthenticationDef,
    rateLimit: RateLimitDef
  ): APIDocumentation {
    const doc: APIDocumentation = {
      id: `doc-${Date.now()}`,
      title,
      version,
      description: `API Documentation for ${title}`,
      baseUrl,
      endpoints: Array.from(this.endpoints.values()),
      schemas: Object.fromEntries(this.schemas),
      authentication: auth,
      rateLimit,
      generatedAt: Date.now(),
    };

    this.documentation.set(doc.id, doc);
    return doc;
  }

  /**
   * Export documentation as OpenAPI spec
   */
  exportAsOpenAPI(docId: string): Record<string, unknown> {
    const doc = this.documentation.get(docId);
    if (!doc) throw new Error(`Documentation ${docId} not found`);

    const paths: Record<string, unknown> = {};
    for (const endpoint of doc.endpoints) {
      const pathKey = endpoint.path;
      const methodKey = endpoint.method.toLowerCase();

      if (!paths[pathKey]) {
        paths[pathKey] = {};
      }

      (paths[pathKey] as Record<string, unknown>)[methodKey] = {
        summary: endpoint.description,
        tags: endpoint.tags,
        parameters: Object.values(endpoint.parameters).map((p) => ({
          name: p.name,
          in: 'query',
          required: p.required,
          schema: { type: p.type },
          description: p.description,
        })),
        requestBody: endpoint.requestBody
          ? {
              required: endpoint.requestBody.required,
              content: endpoint.requestBody.content,
            }
          : undefined,
        responses: Object.fromEntries(
          Object.entries(endpoint.responses).map(([key, resp]) => [
            key,
            {
              description: resp.description,
              content: {
                'application/json': {
                  schema: resp.schema,
                },
              },
            },
          ])
        ),
      };
    }

    return {
      openapi: '3.0.0',
      info: {
        title: doc.title,
        version: doc.version,
        description: doc.description,
      },
      servers: [{ url: doc.baseUrl }],
      paths,
      components: {
        schemas: doc.schemas,
        securitySchemes: {
          [doc.authentication.type]: {
            type: doc.authentication.type,
            description: doc.authentication.description,
          },
        },
      },
    };
  }

  /**
   * Export documentation as Markdown
   */
  exportAsMarkdown(docId: string): string {
    const doc = this.documentation.get(docId);
    if (!doc) throw new Error(`Documentation ${docId} not found`);

    let markdown = `# ${doc.title}\n\n`;
    markdown += `**Version:** ${doc.version}\n\n`;
    markdown += `${doc.description}\n\n`;

    markdown += `## Authentication\n\n`;
    markdown += `**Type:** ${doc.authentication.type}\n\n`;
    markdown += `${doc.authentication.description}\n\n`;
    markdown += `\`\`\`\n${doc.authentication.example}\n\`\`\`\n\n`;

    markdown += `## Rate Limiting\n\n`;
    markdown += `- Requests per minute: ${doc.rateLimit.requestsPerMinute}\n`;
    markdown += `- Requests per hour: ${doc.rateLimit.requestsPerHour}\n\n`;

    markdown += `## Endpoints\n\n`;
    for (const endpoint of doc.endpoints) {
      markdown += `### ${endpoint.method} ${endpoint.path}\n\n`;
      markdown += `${endpoint.description}\n\n`;

      if (Object.keys(endpoint.parameters).length > 0) {
        markdown += `**Parameters:**\n\n`;
        markdown += `| Name | Type | Required | Description |\n`;
        markdown += `|------|------|----------|-------------|\n`;
        for (const param of Object.values(endpoint.parameters)) {
          markdown += `| ${param.name} | ${param.type} | ${param.required ? 'Yes' : 'No'} | ${param.description} |\n`;
        }
        markdown += `\n`;
      }

      if (endpoint.examples.length > 0) {
        markdown += `**Examples:**\n\n`;
        for (const example of endpoint.examples) {
          markdown += `#### ${example.title}\n\n`;
          markdown += `${example.description}\n\n`;
          markdown += `\`\`\`${example.language}\n${example.request}\n\`\`\`\n\n`;
          markdown += `Response:\n\n`;
          markdown += `\`\`\`json\n${example.response}\n\`\`\`\n\n`;
        }
      }
    }

    return markdown;
  }

  /**
   * Generate HTML documentation
   */
  generateHTML(docId: string): string {
    const doc = this.documentation.get(docId);
    if (!doc) throw new Error(`Documentation ${docId} not found`);

    let html = `<!DOCTYPE html>
<html>
<head>
  <title>${doc.title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    .endpoint { border: 1px solid #ddd; padding: 10px; margin: 10px 0; }
    .method { font-weight: bold; }
    .get { color: green; }
    .post { color: blue; }
    .put { color: orange; }
    .delete { color: red; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  </style>
</head>
<body>
  <h1>${doc.title}</h1>
  <p><strong>Version:</strong> ${doc.version}</p>
  <p>${doc.description}</p>
`;

    for (const endpoint of doc.endpoints) {
      html += `<div class="endpoint">
    <h2><span class="method ${endpoint.method.toLowerCase()}">${endpoint.method}</span> ${endpoint.path}</h2>
    <p>${endpoint.description}</p>`;

      if (Object.keys(endpoint.parameters).length > 0) {
        html += `<h3>Parameters</h3>
    <table>
      <tr><th>Name</th><th>Type</th><th>Required</th><th>Description</th></tr>`;
        for (const param of Object.values(endpoint.parameters)) {
          html += `<tr><td>${param.name}</td><td>${param.type}</td><td>${param.required ? 'Yes' : 'No'}</td><td>${param.description}</td></tr>`;
        }
        html += `</table>`;
      }

      html += `</div>`;
    }

    html += `</body></html>`;
    return html;
  }

  /**
   * Get documentation
   */
  getDocumentation(docId: string): APIDocumentation | undefined {
    return this.documentation.get(docId);
  }

  /**
   * List all documentation
   */
  listDocumentation(): APIDocumentation[] {
    return Array.from(this.documentation.values());
  }

  /**
   * Update endpoint
   */
  updateEndpoint(id: string, updates: Partial<APIEndpoint>): APIEndpoint {
    const endpoint = this.endpoints.get(id);
    if (!endpoint) throw new Error(`Endpoint ${id} not found`);

    const updated = { ...endpoint, ...updates };
    this.endpoints.set(id, updated);
    return updated;
  }

  /**
   * Delete endpoint
   */
  deleteEndpoint(id: string): void {
    this.endpoints.delete(id);
  }

  /**
   * Get endpoint
   */
  getEndpoint(id: string): APIEndpoint | undefined {
    return this.endpoints.get(id);
  }

  /**
   * List all endpoints
   */
  listEndpoints(): APIEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  /**
   * Validate documentation
   */
  validateDocumentation(docId: string): { valid: boolean; errors: string[] } {
    const doc = this.documentation.get(docId);
    if (!doc) return { valid: false, errors: [`Documentation ${docId} not found`] };

    const errors: string[] = [];

    if (!doc.title) errors.push('Missing title');
    if (!doc.version) errors.push('Missing version');
    if (doc.endpoints.length === 0) errors.push('No endpoints defined');

    for (const endpoint of doc.endpoints) {
      if (!endpoint.path) errors.push(`Endpoint ${endpoint.id} missing path`);
      if (!endpoint.method) errors.push(`Endpoint ${endpoint.id} missing method`);
      if (Object.keys(endpoint.responses).length === 0) {
        errors.push(`Endpoint ${endpoint.id} missing responses`);
      }
    }

    return { valid: errors.length === 0, errors };
  }
}
