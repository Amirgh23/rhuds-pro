/**
 * ArchitectureDocumenter - Document System Architecture
 * Generates architecture documentation and diagrams
 */

interface Component {
  id: string;
  name: string;
  description: string;
  type: 'service' | 'module' | 'library' | 'database' | 'external';
  dependencies: string[];
  responsibilities: string[];
  interfaces: InterfaceDef[];
}

interface InterfaceDef {
  name: string;
  methods: MethodDef[];
  description: string;
}

interface MethodDef {
  name: string;
  parameters: ParameterDef[];
  returnType: string;
  description: string;
}

interface ParameterDef {
  name: string;
  type: string;
  description: string;
}

interface ArchitectureLayer {
  id: string;
  name: string;
  description: string;
  components: Component[];
  order: number;
}

interface ArchitecturePattern {
  id: string;
  name: string;
  description: string;
  components: string[];
  interactions: Interaction[];
  benefits: string[];
  tradeoffs: string[];
}

interface Interaction {
  from: string;
  to: string;
  type: 'sync' | 'async' | 'event';
  description: string;
}

interface ArchitectureDocument {
  id: string;
  title: string;
  description: string;
  version: string;
  layers: ArchitectureLayer[];
  patterns: ArchitecturePattern[];
  dataFlow: DataFlowDiagram;
  deploymentModel: DeploymentModel;
  createdAt: number;
}

interface DataFlowDiagram {
  id: string;
  title: string;
  flows: DataFlow[];
}

interface DataFlow {
  id: string;
  source: string;
  destination: string;
  dataType: string;
  frequency: string;
  description: string;
}

interface DeploymentModel {
  id: string;
  environments: DeploymentEnvironment[];
  scalingStrategy: string;
  failoverStrategy: string;
}

interface DeploymentEnvironment {
  name: string;
  components: Record<string, number>;
  resources: ResourceRequirements;
}

interface ResourceRequirements {
  cpu: string;
  memory: string;
  storage: string;
}

export class ArchitectureDocumenter {
  private components: Map<string, Component> = new Map();
  private layers: Map<string, ArchitectureLayer> = new Map();
  private patterns: Map<string, ArchitecturePattern> = new Map();
  private documents: Map<string, ArchitectureDocument> = new Map();

  /**
   * Register component
   */
  registerComponent(component: Component): void {
    this.components.set(component.id, component);
  }

  /**
   * Create architecture layer
   */
  createLayer(name: string, description: string, order: number): ArchitectureLayer {
    const layer: ArchitectureLayer = {
      id: `layer-${Date.now()}`,
      name,
      description,
      components: [],
      order,
    };

    this.layers.set(layer.id, layer);
    return layer;
  }

  /**
   * Add component to layer
   */
  addComponentToLayer(layerId: string, componentId: string): void {
    const layer = this.layers.get(layerId);
    const component = this.components.get(componentId);

    if (!layer) throw new Error(`Layer ${layerId} not found`);
    if (!component) throw new Error(`Component ${componentId} not found`);

    layer.components.push(component);
  }

  /**
   * Register architecture pattern
   */
  registerPattern(pattern: ArchitecturePattern): void {
    this.patterns.set(pattern.id, pattern);
  }

  /**
   * Generate architecture document
   */
  generateDocument(
    title: string,
    description: string,
    version: string,
    dataFlow: DataFlowDiagram,
    deploymentModel: DeploymentModel
  ): ArchitectureDocument {
    const doc: ArchitectureDocument = {
      id: `arch-${Date.now()}`,
      title,
      description,
      version,
      layers: Array.from(this.layers.values()).sort((a, b) => a.order - b.order),
      patterns: Array.from(this.patterns.values()),
      dataFlow,
      deploymentModel,
      createdAt: Date.now(),
    };

    this.documents.set(doc.id, doc);
    return doc;
  }

  /**
   * Generate architecture diagram (Mermaid format)
   */
  generateMermaidDiagram(docId: string): string {
    const doc = this.documents.get(docId);
    if (!doc) throw new Error(`Document ${docId} not found`);

    let mermaid = `graph TB\n`;

    // Add layers
    for (const layer of doc.layers) {
      mermaid += `  subgraph ${layer.id}["${layer.name}"]\n`;
      for (const component of layer.components) {
        mermaid += `    ${component.id}["${component.name}"]\n`;
      }
      mermaid += `  end\n`;
    }

    // Add interactions
    for (const component of this.components.values()) {
      for (const depId of component.dependencies) {
        mermaid += `  ${component.id} --> ${depId}\n`;
      }
    }

    return mermaid;
  }

  /**
   * Generate architecture document as Markdown
   */
  generateMarkdown(docId: string): string {
    const doc = this.documents.get(docId);
    if (!doc) throw new Error(`Document ${docId} not found`);

    let markdown = `# ${doc.title}\n\n`;
    markdown += `${doc.description}\n\n`;
    markdown += `**Version:** ${doc.version}\n\n`;

    markdown += `## Architecture Overview\n\n`;
    markdown += `This document describes the architecture of ${doc.title}.\n\n`;

    markdown += `## Layers\n\n`;
    for (const layer of doc.layers) {
      markdown += `### ${layer.name}\n\n`;
      markdown += `${layer.description}\n\n`;

      markdown += `**Components:**\n\n`;
      for (const component of layer.components) {
        markdown += `#### ${component.name}\n\n`;
        markdown += `${component.description}\n\n`;

        if (component.responsibilities.length > 0) {
          markdown += `**Responsibilities:**\n\n`;
          for (const resp of component.responsibilities) {
            markdown += `- ${resp}\n`;
          }
          markdown += `\n`;
        }

        if (component.dependencies.length > 0) {
          markdown += `**Dependencies:**\n\n`;
          for (const dep of component.dependencies) {
            markdown += `- ${dep}\n`;
          }
          markdown += `\n`;
        }

        if (component.interfaces.length > 0) {
          markdown += `**Interfaces:**\n\n`;
          for (const iface of component.interfaces) {
            markdown += `- ${iface.name}: ${iface.description}\n`;
          }
          markdown += `\n`;
        }
      }
    }

    markdown += `## Patterns\n\n`;
    for (const pattern of doc.patterns) {
      markdown += `### ${pattern.name}\n\n`;
      markdown += `${pattern.description}\n\n`;

      markdown += `**Benefits:**\n\n`;
      for (const benefit of pattern.benefits) {
        markdown += `- ${benefit}\n`;
      }

      markdown += `**Tradeoffs:**\n\n`;
      for (const tradeoff of pattern.tradeoffs) {
        markdown += `- ${tradeoff}\n`;
      }
      markdown += `\n`;
    }

    markdown += `## Data Flow\n\n`;
    for (const flow of doc.dataFlow.flows) {
      markdown += `- **${flow.source} → ${flow.destination}**: ${flow.description}\n`;
      markdown += `  - Data Type: ${flow.dataType}\n`;
      markdown += `  - Frequency: ${flow.frequency}\n`;
    }
    markdown += `\n`;

    markdown += `## Deployment\n\n`;
    for (const env of doc.deploymentModel.environments) {
      markdown += `### ${env.name}\n\n`;
      markdown += `**Resources:**\n`;
      markdown += `- CPU: ${env.resources.cpu}\n`;
      markdown += `- Memory: ${env.resources.memory}\n`;
      markdown += `- Storage: ${env.resources.storage}\n\n`;

      markdown += `**Components:**\n`;
      for (const [comp, count] of Object.entries(env.components)) {
        markdown += `- ${comp}: ${count} instance(s)\n`;
      }
      markdown += `\n`;
    }

    return markdown;
  }

  /**
   * Generate HTML documentation
   */
  generateHTML(docId: string): string {
    const doc = this.documents.get(docId);
    if (!doc) throw new Error(`Document ${docId} not found`);

    let html = `<!DOCTYPE html>
<html>
<head>
  <title>${doc.title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    h2 { color: #666; border-bottom: 2px solid #ddd; }
    .layer { border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
    .component { background: #f9f9f9; padding: 10px; margin: 5px 0; }
    .pattern { background: #e8f4f8; padding: 10px; margin: 10px 0; }
  </style>
</head>
<body>
  <h1>${doc.title}</h1>
  <p>${doc.description}</p>
  <p><strong>Version:</strong> ${doc.version}</p>
`;

    for (const layer of doc.layers) {
      html += `<div class="layer">
    <h2>${layer.name}</h2>
    <p>${layer.description}</p>`;

      for (const component of layer.components) {
        html += `<div class="component">
      <h3>${component.name}</h3>
      <p>${component.description}</p>`;

        if (component.responsibilities.length > 0) {
          html += `<p><strong>Responsibilities:</strong></p>
      <ul>`;
          for (const resp of component.responsibilities) {
            html += `<li>${resp}</li>`;
          }
          html += `</ul>`;
        }

        html += `</div>`;
      }

      html += `</div>`;
    }

    html += `</body></html>`;
    return html;
  }

  /**
   * Validate architecture
   */
  validateArchitecture(docId: string): { valid: boolean; issues: string[] } {
    const doc = this.documents.get(docId);
    if (!doc) return { valid: false, issues: [`Document ${docId} not found`] };

    const issues: string[] = [];

    // Check for circular dependencies
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    for (const component of this.components.values()) {
      if (!visited.has(component.id)) {
        if (this.hasCyclicDependency(component.id, visited, recursionStack)) {
          issues.push(`Circular dependency detected involving ${component.name}`);
        }
      }
    }

    return { valid: issues.length === 0, issues };
  }

  /**
   * Get document
   */
  getDocument(docId: string): ArchitectureDocument | undefined {
    return this.documents.get(docId);
  }

  /**
   * List all documents
   */
  listDocuments(): ArchitectureDocument[] {
    return Array.from(this.documents.values());
  }

  /**
   * Get component
   */
  getComponent(componentId: string): Component | undefined {
    return this.components.get(componentId);
  }

  /**
   * List all components
   */
  listComponents(): Component[] {
    return Array.from(this.components.values());
  }

  /**
   * Update component
   */
  updateComponent(componentId: string, updates: Partial<Component>): Component {
    const component = this.components.get(componentId);
    if (!component) throw new Error(`Component ${componentId} not found`);

    const updated = { ...component, ...updates };
    this.components.set(componentId, updated);
    return updated;
  }

  /**
   * Delete component
   */
  deleteComponent(componentId: string): void {
    this.components.delete(componentId);
  }

  // Helper methods

  private hasCyclicDependency(
    nodeId: string,
    visited: Set<string>,
    recursionStack: Set<string>
  ): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const component = this.components.get(nodeId);
    if (!component) return false;

    for (const depId of component.dependencies) {
      if (!visited.has(depId)) {
        if (this.hasCyclicDependency(depId, visited, recursionStack)) {
          return true;
        }
      } else if (recursionStack.has(depId)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }
}
