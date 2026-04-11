/**
 * BestPracticesCompiler - Compile and Organize Best Practices
 * Generates best practices documentation from guidelines
 */

interface BestPractice {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  applicableTo: string[];
  examples: PracticeExample[];
  antiPatterns: string[];
  relatedPractices: string[];
  createdAt: number;
}

interface PracticeExample {
  title: string;
  description: string;
  goodCode: string;
  badCode: string;
  explanation: string;
  language: string;
}

interface BestPracticesGuide {
  id: string;
  title: string;
  description: string;
  version: string;
  categories: PracticeCategory[];
  practices: BestPractice[];
  checklist: ChecklistItem[];
  createdAt: number;
}

interface PracticeCategory {
  id: string;
  name: string;
  description: string;
  practices: string[];
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  relatedPractices: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface PracticeMetrics {
  totalPractices: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  coverage: number;
}

export class BestPracticesCompiler {
  private practices: Map<string, BestPractice> = new Map();
  private guides: Map<string, BestPracticesGuide> = new Map();
  private categories: Map<string, PracticeCategory> = new Map();

  /**
   * Register best practice
   */
  registerPractice(practice: BestPractice): void {
    this.practices.set(practice.id, practice);
  }

  /**
   * Create practice category
   */
  createCategory(name: string, description: string): PracticeCategory {
    const category: PracticeCategory = {
      id: `cat-${Date.now()}`,
      name,
      description,
      practices: [],
    };

    this.categories.set(category.id, category);
    return category;
  }

  /**
   * Add practice to category
   */
  addPracticeToCategory(categoryId: string, practiceId: string): void {
    const category = this.categories.get(categoryId);
    const practice = this.practices.get(practiceId);

    if (!category) throw new Error(`Category ${categoryId} not found`);
    if (!practice) throw new Error(`Practice ${practiceId} not found`);

    if (!category.practices.includes(practiceId)) {
      category.practices.push(practiceId);
    }
  }

  /**
   * Create best practices guide
   */
  createGuide(title: string, description: string, version: string): BestPracticesGuide {
    const guide: BestPracticesGuide = {
      id: `guide-${Date.now()}`,
      title,
      description,
      version,
      categories: Array.from(this.categories.values()),
      practices: Array.from(this.practices.values()),
      checklist: [],
      createdAt: Date.now(),
    };

    this.guides.set(guide.id, guide);
    return guide;
  }

  /**
   * Add checklist item
   */
  addChecklistItem(guideId: string, item: ChecklistItem): BestPracticesGuide {
    const guide = this.guides.get(guideId);
    if (!guide) throw new Error(`Guide ${guideId} not found`);

    guide.checklist.push(item);
    return guide;
  }

  /**
   * Generate best practices guide as Markdown
   */
  generateMarkdown(guideId: string): string {
    const guide = this.guides.get(guideId);
    if (!guide) throw new Error(`Guide ${guideId} not found`);

    let markdown = `# ${guide.title}\n\n`;
    markdown += `${guide.description}\n\n`;
    markdown += `**Version:** ${guide.version}\n\n`;

    markdown += `## Table of Contents\n\n`;
    for (const category of guide.categories) {
      markdown += `- [${category.name}](#${category.id})\n`;
    }
    markdown += `\n`;

    for (const category of guide.categories) {
      markdown += `## ${category.name}\n\n`;
      markdown += `${category.description}\n\n`;

      for (const practiceId of category.practices) {
        const practice = this.practices.get(practiceId);
        if (practice) {
          markdown += this.generatePracticeMarkdown(practice);
        }
      }
    }

    markdown += `## Checklist\n\n`;
    for (const item of guide.checklist) {
      markdown += `- [ ] ${item.title}\n`;
      markdown += `  - ${item.description}\n`;
    }
    markdown += `\n`;

    return markdown;
  }

  /**
   * Generate HTML guide
   */
  generateHTML(guideId: string): string {
    const guide = this.guides.get(guideId);
    if (!guide) throw new Error(`Guide ${guideId} not found`);

    let html = `<!DOCTYPE html>
<html>
<head>
  <title>${guide.title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    h2 { color: #666; border-bottom: 2px solid #ddd; }
    .practice { border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
    .priority-critical { border-left: 4px solid #d32f2f; }
    .priority-high { border-left: 4px solid #f57c00; }
    .priority-medium { border-left: 4px solid #fbc02d; }
    .priority-low { border-left: 4px solid #388e3c; }
    .code-example { background: #f5f5f5; padding: 10px; margin: 10px 0; }
    .good { border-left: 3px solid #4caf50; }
    .bad { border-left: 3px solid #f44336; }
  </style>
</head>
<body>
  <h1>${guide.title}</h1>
  <p>${guide.description}</p>
`;

    for (const category of guide.categories) {
      html += `<h2>${category.name}</h2>
  <p>${category.description}</p>`;

      for (const practiceId of category.practices) {
        const practice = this.practices.get(practiceId);
        if (practice) {
          html += `<div class="practice priority-${practice.priority}">
    <h3>${practice.title}</h3>
    <p>${practice.description}</p>
    <p><strong>Priority:</strong> ${practice.priority}</p>`;

          for (const example of practice.examples) {
            html += `<div class="code-example">
      <h4>${example.title}</h4>
      <p>${example.description}</p>
      <p><strong>Good:</strong></p>
      <pre><code>${this.escapeHTML(example.goodCode)}</code></pre>
      <p><strong>Bad:</strong></p>
      <pre><code>${this.escapeHTML(example.badCode)}</code></pre>
      <p><strong>Explanation:</strong> ${example.explanation}</p>
    </div>`;
          }

          html += `</div>`;
        }
      }
    }

    html += `</body></html>`;
    return html;
  }

  /**
   * Generate checklist
   */
  generateChecklist(guideId: string): string {
    const guide = this.guides.get(guideId);
    if (!guide) throw new Error(`Guide ${guideId} not found`);

    let checklist = `# ${guide.title} - Checklist\n\n`;

    for (const item of guide.checklist) {
      checklist += `- [ ] **${item.title}** (${item.priority})\n`;
      checklist += `  ${item.description}\n`;
    }

    return checklist;
  }

  /**
   * Get metrics
   */
  getMetrics(guideId: string): PracticeMetrics {
    const guide = this.guides.get(guideId);
    if (!guide) throw new Error(`Guide ${guideId} not found`);

    const byCategory: Record<string, number> = {};
    const byPriority: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    for (const practice of guide.practices) {
      byCategory[practice.category] = (byCategory[practice.category] || 0) + 1;
      byPriority[practice.priority]++;
    }

    return {
      totalPractices: guide.practices.length,
      byCategory,
      byPriority,
      coverage: guide.practices.length > 0 ? 100 : 0,
    };
  }

  /**
   * Search practices
   */
  searchPractices(query: string): BestPractice[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.practices.values()).filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get practices by priority
   */
  getPracticesByPriority(priority: 'critical' | 'high' | 'medium' | 'low'): BestPractice[] {
    return Array.from(this.practices.values()).filter((p) => p.priority === priority);
  }

  /**
   * Get practices by category
   */
  getPracticesByCategory(category: string): BestPractice[] {
    return Array.from(this.practices.values()).filter((p) => p.category === category);
  }

  /**
   * Get guide
   */
  getGuide(guideId: string): BestPracticesGuide | undefined {
    return this.guides.get(guideId);
  }

  /**
   * List all guides
   */
  listGuides(): BestPracticesGuide[] {
    return Array.from(this.guides.values());
  }

  /**
   * Get practice
   */
  getPractice(practiceId: string): BestPractice | undefined {
    return this.practices.get(practiceId);
  }

  /**
   * List all practices
   */
  listPractices(): BestPractice[] {
    return Array.from(this.practices.values());
  }

  /**
   * Update practice
   */
  updatePractice(practiceId: string, updates: Partial<BestPractice>): BestPractice {
    const practice = this.practices.get(practiceId);
    if (!practice) throw new Error(`Practice ${practiceId} not found`);

    const updated = { ...practice, ...updates };
    this.practices.set(practiceId, updated);
    return updated;
  }

  /**
   * Delete practice
   */
  deletePractice(practiceId: string): void {
    this.practices.delete(practiceId);
  }

  // Helper methods

  private generatePracticeMarkdown(practice: BestPractice): string {
    let markdown = `### ${practice.title}\n\n`;
    markdown += `${practice.description}\n\n`;
    markdown += `**Priority:** ${practice.priority}\n\n`;

    if (practice.examples.length > 0) {
      markdown += `**Examples:**\n\n`;
      for (const example of practice.examples) {
        markdown += `#### ${example.title}\n\n`;
        markdown += `${example.description}\n\n`;

        markdown += `**Good:**\n\n`;
        markdown += `\`\`\`${example.language}\n${example.goodCode}\n\`\`\`\n\n`;

        markdown += `**Bad:**\n\n`;
        markdown += `\`\`\`${example.language}\n${example.badCode}\n\`\`\`\n\n`;

        markdown += `**Explanation:** ${example.explanation}\n\n`;
      }
    }

    if (practice.antiPatterns.length > 0) {
      markdown += `**Anti-patterns to Avoid:**\n\n`;
      for (const antiPattern of practice.antiPatterns) {
        markdown += `- ${antiPattern}\n`;
      }
      markdown += `\n`;
    }

    return markdown;
  }

  private escapeHTML(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}
