/**
 * API Documentation Generator
 * Automatic API documentation generation
 */

export interface APIEndpointDoc {
  path: string;
  method: string;
  description: string;
  parameters: APIParameter[];
  requestBody?: APISchema;
  responses: Record<number, APISchema>;
  examples: APIExample[];
  deprecated: boolean;
}

export interface APIParameter {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  example?: unknown;
}

export interface APISchema {
  type: string;
  properties?: Record<string, APISchema>;
  items?: APISchema;
  description?: string;
}

export interface APIExample {
  name: string;
  request: unknown;
  response: unknown;
}

/**
 * APIDocumentationGenerator - Generate API documentation
 */
export class APIDocumentationGenerator {
  private endpoints: Map<string, APIEndpointDoc> = new Map();
  private listeners: Set<(event: string, data: unknown) => void> = new Set();

  /**
   * Register endpoint documentation
   */
  registerEndpoint(doc: APIEndpointDoc): void {
    const key = `${doc.method}:${doc.path}`;
    this.endpoints.set(key, doc);
    this.emit('endpoint_documented', doc);
  }

  /**
   * Get endpoint documentation
   */
  getEndpointDoc(method: string, path: string): APIEndpointDoc | null {
    const key = `${method}:${path}`;
    return this.endpoints.get(key) ?? null;
  }

  /**
   * Get all endpoints
   */
  getAllEndpoints(): APIEndpointDoc[] {
    return Array.from(this.endpoints.values());
  }

  /**
   * Generate OpenAPI spec
   */
  generateOpenAPISpec(title: string, version: string): Record<string, unknown> {
    const paths: Record<string, unknown> = {};

    for (const endpoint of this.endpoints.values()) {
      const pathKey = endpoint.path;

      if (!paths[pathKey]) {
        paths[pathKey] = {};
      }

      const methodKey = endpoint.method.toLowerCase();
      (paths[pathKey] as Record<string, unknown>)[methodKey] = {
        summary: endpoint.description,
        deprecated: endpoint.deprecated,
        parameters: endpoint.parameters.map((p) => ({
          name: p.name,
          in: 'query',
          required: p.required,
          schema: { type: p.type },
          description: p.description,
          example: p.example,
        })),
        requestBody: endpoint.requestBody
          ? {
              content: {
                'application/json': {
                  schema: endpoint.requestBody,
                },
              },
            }
          : undefined,
        responses: Object.entries(endpoint.responses).reduce(
          (acc, [code, schema]) => {
            acc[code] = {
              description: `Response ${code}`,
              content: {
                'application/json': {
                  schema,
                },
              },
            };
            return acc;
          },
          {} as Record<string, unknown>
        ),
      };
    }

    return {
      openapi: '3.0.0',
      info: {
        title,
        version,
      },
      paths,
    };
  }

  /**
   * Generate Markdown documentation
   */
  generateMarkdown(): string {
    let doc = '# API Documentation\n\n';

    const grouped: Record<string, APIEndpointDoc[]> = {};

    for (const endpoint of this.endpoints.values()) {
      const path = endpoint.path.split('/')[1] || 'root';
      if (!grouped[path]) {
        grouped[path] = [];
      }
      grouped[path].push(endpoint);
    }

    for (const [group, endpoints] of Object.entries(grouped)) {
      doc += `## ${group}\n\n`;

      for (const endpoint of endpoints) {
        doc += `### ${endpoint.method} ${endpoint.path}\n\n`;
        doc += `${endpoint.description}\n\n`;

        if (endpoint.deprecated) {
          doc += '**DEPRECATED**\n\n';
        }

        if (endpoint.parameters.length > 0) {
          doc += '#### Parameters\n\n';
          doc += '| Name | Type | Required | Description |\n';
          doc += '|------|------|----------|-------------|\n';

          for (const param of endpoint.parameters) {
            doc += `| ${param.name} | ${param.type} | ${param.required ? 'Yes' : 'No'} | ${param.description || ''} |\n`;
          }

          doc += '\n';
        }

        if (endpoint.examples.length > 0) {
          doc += '#### Examples\n\n';

          for (const example of endpoint.examples) {
            doc += `##### ${example.name}\n\n`;
            doc += '**Request:**\n```json\n';
            doc += JSON.stringify(example.request, null, 2);
            doc += '\n```\n\n';
            doc += '**Response:**\n```json\n';
            doc += JSON.stringify(example.response, null, 2);
            doc += '\n```\n\n';
          }
        }
      }
    }

    return doc;
  }

  /**
   * Generate HTML documentation
   */
  generateHTML(): string {
    const markdown = this.generateMarkdown();
    // Simple HTML generation
    return `<!DOCTYPE html>
<html>
<head>
  <title>API Documentation</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    h2 { color: #666; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
    h3 { color: #999; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    pre { background-color: #f4f4f4; padding: 10px; overflow-x: auto; }
  </style>
</head>
<body>
  <div>${markdown.replace(/\n/g, '<br>')}</div>
</body>
</html>`;
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const endpoints = this.getAllEndpoints();
    const deprecated = endpoints.filter((e) => e.deprecated).length;

    return {
      totalEndpoints: endpoints.length,
      deprecatedEndpoints: deprecated,
      activeEndpoints: endpoints.length - deprecated,
      methods: new Set(endpoints.map((e) => e.method)).size,
    };
  }

  /**
   * Emit event
   */
  private emit(event: string, data: unknown): void {
    for (const listener of this.listeners) {
      try {
        listener(event, data);
      } catch (error) {
        // Handle listener error
      }
    }
  }

  /**
   * Add listener
   */
  addListener(listener: (event: string, data: unknown) => void): void {
    this.listeners.add(listener);
  }

  /**
   * Remove listener
   */
  removeListener(listener: (event: string, data: unknown) => void): void {
    this.listeners.delete(listener);
  }
}
