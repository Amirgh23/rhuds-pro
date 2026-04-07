/**
 * API Documentation Generator
 * تولید کننده مستندات API برای توثیق خودکار
 *
 * Features:
 * - OpenAPI/Swagger generation
 * - Interactive documentation
 * - Code examples
 * - SDK generation
 */

import { EventEmitter } from 'events';

export interface APIEndpoint {
  path: string;
  method: string;
  summary: string;
  description: string;
  parameters: APIParameter[];
  requestBody?: APIRequestBody;
  responses: APIResponse[];
  tags: string[];
  deprecated: boolean;
}

export interface APIParameter {
  name: string;
  in: 'query' | 'path' | 'header';
  required: boolean;
  type: string;
  description: string;
  example?: any;
}

export interface APIRequestBody {
  required: boolean;
  content: Record<string, APIMediaType>;
}

export interface APIMediaType {
  schema: any;
  example?: any;
}

export interface APIResponse {
  status: number;
  description: string;
  content?: Record<string, APIMediaType>;
}

export interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers: Array<{ url: string; description?: string }>;
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
}

export class APIDocumentationGenerator extends EventEmitter {
  private endpoints: APIEndpoint[];
  private schemas: Map<string, any>;
  private examples: Map<string, any>;
  private stats: {
    endpointsDocumented: number;
    schemasGenerated: number;
    examplesCreated: number;
  };

  constructor() {
    super();
    this.endpoints = [];
    this.schemas = new Map();
    this.examples = new Map();
    this.stats = {
      endpointsDocumented: 0,
      schemasGenerated: 0,
      examplesCreated: 0,
    };

    this.initialize();
  }

  private initialize(): void {
    this.emit('initialized', { timestamp: Date.now() });
  }

  /**
   * Register endpoint
   */
  public registerEndpoint(endpoint: APIEndpoint): void {
    this.endpoints.push(endpoint);
    this.stats.endpointsDocumented++;

    this.emit('endpoint-registered', {
      path: endpoint.path,
      method: endpoint.method,
    });
  }

  /**
   * Register schema
   */
  public registerSchema(name: string, schema: any): void {
    this.schemas.set(name, schema);
    this.stats.schemasGenerated++;

    this.emit('schema-registered', { name });
  }

  /**
   * Add example
   */
  public addExample(name: string, example: any): void {
    this.examples.set(name, example);
    this.stats.examplesCreated++;

    this.emit('example-added', { name });
  }

  /**
   * Generate OpenAPI spec
   */
  public generateOpenAPISpec(title: string, version: string, baseUrl: string): OpenAPISpec {
    const paths: Record<string, any> = {};

    for (const endpoint of this.endpoints) {
      if (!paths[endpoint.path]) {
        paths[endpoint.path] = {};
      }

      paths[endpoint.path][endpoint.method.toLowerCase()] = {
        summary: endpoint.summary,
        description: endpoint.description,
        tags: endpoint.tags,
        deprecated: endpoint.deprecated,
        parameters: endpoint.parameters.map((p) => ({
          name: p.name,
          in: p.in,
          required: p.required,
          schema: { type: p.type },
          description: p.description,
          example: p.example,
        })),
        requestBody: endpoint.requestBody
          ? {
              required: endpoint.requestBody.required,
              content: endpoint.requestBody.content,
            }
          : undefined,
        responses: endpoint.responses.reduce(
          (acc, r) => {
            acc[r.status] = {
              description: r.description,
              content: r.content,
            };
            return acc;
          },
          {} as Record<number, any>
        ),
      };
    }

    const spec: OpenAPISpec = {
      openapi: '3.0.0',
      info: {
        title,
        version,
      },
      servers: [{ url: baseUrl }],
      paths,
      components: {
        schemas: Object.fromEntries(this.schemas),
      },
    };

    this.emit('openapi-spec-generated', { endpoints: this.endpoints.length });

    return spec;
  }

  /**
   * Generate Swagger UI HTML
   */
  public generateSwaggerUI(spec: OpenAPISpec): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>${spec.info.title}</title>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui.js"></script>
  <script>
    SwaggerUIBundle({
      spec: ${JSON.stringify(spec)},
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIBundle.SwaggerUIStandalonePreset
      ],
      layout: "BaseLayout"
    })
  </script>
</body>
</html>
    `;
  }

  /**
   * Generate code example
   */
  public generateCodeExample(endpoint: APIEndpoint, language: string = 'javascript'): string {
    switch (language) {
      case 'javascript':
        return this.generateJavaScriptExample(endpoint);
      case 'python':
        return this.generatePythonExample(endpoint);
      case 'curl':
        return this.generateCurlExample(endpoint);
      default:
        return this.generateJavaScriptExample(endpoint);
    }
  }

  /**
   * Generate JavaScript example
   */
  private generateJavaScriptExample(endpoint: APIEndpoint): string {
    const params = endpoint.parameters
      .map((p) => `  ${p.name}: "${p.example || 'value'}"`)
      .join(',\n');

    return `
// ${endpoint.summary}
const response = await fetch('${endpoint.path}', {
  method: '${endpoint.method}',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
${params}
  })
});

const data = await response.json();
console.log(data);
    `;
  }

  /**
   * Generate Python example
   */
  private generatePythonExample(endpoint: APIEndpoint): string {
    const params = endpoint.parameters
      .map((p) => `    "${p.name}": "${p.example || 'value'}"`)
      .join(',\n');

    return `
# ${endpoint.summary}
import requests

response = requests.${endpoint.method.toLowerCase()}(
    '${endpoint.path}',
    json={
${params}
    }
)

data = response.json()
print(data)
    `;
  }

  /**
   * Generate cURL example
   */
  private generateCurlExample(endpoint: APIEndpoint): string {
    const params = endpoint.parameters
      .map((p) => `-H "${p.name}: ${p.example || 'value'}"`)
      .join(' ');

    return `
# ${endpoint.summary}
curl -X ${endpoint.method} '${endpoint.path}' \\
  -H 'Content-Type: application/json' \\
  ${params}
    `;
  }

  /**
   * Generate SDK
   */
  public generateSDK(language: string = 'typescript'): string {
    if (language === 'typescript') {
      return this.generateTypeScriptSDK();
    }

    return '';
  }

  /**
   * Generate TypeScript SDK
   */
  private generateTypeScriptSDK(): string {
    const methods = this.endpoints
      .map(
        (endpoint) => `
  async ${this.camelCase(endpoint.method + endpoint.path)}(${
    endpoint.parameters.length > 0
      ? `params: { ${endpoint.parameters.map((p) => `${p.name}: ${p.type}`).join(', ')} }`
      : ''
  }): Promise<any> {
    const response = await fetch('${endpoint.path}', {
      method: '${endpoint.method}',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return response.json();
  }
      `
      )
      .join('\n');

    return `
export class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

${methods}
}
    `;
  }

  /**
   * Convert to camelCase
   */
  private camelCase(str: string): string {
    return str
      .replace(/[-_\s](.)/g, (_, c) => c.toUpperCase())
      .replace(/^(.)/, (c) => c.toLowerCase());
  }

  /**
   * Generate markdown documentation
   */
  public generateMarkdown(): string {
    let markdown = '# API Documentation\n\n';

    for (const endpoint of this.endpoints) {
      markdown += `## ${endpoint.method} ${endpoint.path}\n\n`;
      markdown += `${endpoint.description}\n\n`;

      if (endpoint.parameters.length > 0) {
        markdown += '### Parameters\n\n';
        markdown += '| Name | Type | Required | Description |\n';
        markdown += '|------|------|----------|-------------|\n';

        for (const param of endpoint.parameters) {
          markdown += `| ${param.name} | ${param.type} | ${param.required ? 'Yes' : 'No'} | ${param.description} |\n`;
        }

        markdown += '\n';
      }

      markdown += '### Responses\n\n';

      for (const response of endpoint.responses) {
        markdown += `- **${response.status}**: ${response.description}\n`;
      }

      markdown += '\n';
    }

    return markdown;
  }

  /**
   * Get all endpoints
   */
  public getEndpoints(): APIEndpoint[] {
    return this.endpoints;
  }

  /**
   * Get statistics
   */
  public getStats() {
    return {
      ...this.stats,
      totalEndpoints: this.endpoints.length,
      totalSchemas: this.schemas.size,
      totalExamples: this.examples.size,
    };
  }

  /**
   * Export documentation
   */
  public exportDocumentation(format: 'openapi' | 'markdown' | 'html' = 'openapi') {
    switch (format) {
      case 'openapi':
        return this.generateOpenAPISpec('API', '1.0.0', 'http://localhost:3000');
      case 'markdown':
        return this.generateMarkdown();
      case 'html':
        return this.generateSwaggerUI(
          this.generateOpenAPISpec('API', '1.0.0', 'http://localhost:3000')
        );
      default:
        return this.generateOpenAPISpec('API', '1.0.0', 'http://localhost:3000');
    }
  }
}
