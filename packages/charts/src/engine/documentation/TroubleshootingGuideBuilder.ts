/**
 * TroubleshootingGuideBuilder - Build Troubleshooting Guides
 * Generates troubleshooting documentation from common issues
 */

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  symptoms: string[];
  rootCauses: string[];
  solutions: Solution[];
  preventionTips: string[];
  relatedIssues: string[];
  frequency: 'common' | 'occasional' | 'rare';
  createdAt: number;
}

interface Solution {
  id: string;
  title: string;
  description: string;
  steps: string[];
  code?: string;
  codeLanguage?: string;
  expectedResult: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeEstimate: number;
}

interface TroubleshootingGuide {
  id: string;
  title: string;
  description: string;
  version: string;
  categories: TroubleshootingCategory[];
  issues: Issue[];
  faq: FAQItem[];
  diagnosticTools: DiagnosticTool[];
  createdAt: number;
}

interface TroubleshootingCategory {
  id: string;
  name: string;
  description: string;
  issues: string[];
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  relatedIssues: string[];
}

interface DiagnosticTool {
  id: string;
  name: string;
  description: string;
  command: string;
  expectedOutput: string;
  interpretation: string;
}

interface TroubleshootingMetrics {
  totalIssues: number;
  bySeverity: Record<string, number>;
  byFrequency: Record<string, number>;
  averageResolutionTime: number;
}

export class TroubleshootingGuideBuilder {
  private issues: Map<string, Issue> = new Map();
  private guides: Map<string, TroubleshootingGuide> = new Map();
  private categories: Map<string, TroubleshootingCategory> = new Map();
  private diagnosticTools: Map<string, DiagnosticTool> = new Map();

  /**
   * Register issue
   */
  registerIssue(issue: Issue): void {
    this.issues.set(issue.id, issue);
  }

  /**
   * Create troubleshooting category
   */
  createCategory(name: string, description: string): TroubleshootingCategory {
    const category: TroubleshootingCategory = {
      id: `cat-${Date.now()}`,
      name,
      description,
      issues: [],
    };

    this.categories.set(category.id, category);
    return category;
  }

  /**
   * Add issue to category
   */
  addIssueToCategory(categoryId: string, issueId: string): void {
    const category = this.categories.get(categoryId);
    const issue = this.issues.get(issueId);

    if (!category) throw new Error(`Category ${categoryId} not found`);
    if (!issue) throw new Error(`Issue ${issueId} not found`);

    if (!category.issues.includes(issueId)) {
      category.issues.push(issueId);
    }
  }

  /**
   * Register diagnostic tool
   */
  registerDiagnosticTool(tool: DiagnosticTool): void {
    this.diagnosticTools.set(tool.id, tool);
  }

  /**
   * Create troubleshooting guide
   */
  createGuide(title: string, description: string, version: string): TroubleshootingGuide {
    const guide: TroubleshootingGuide = {
      id: `guide-${Date.now()}`,
      title,
      description,
      version,
      categories: Array.from(this.categories.values()),
      issues: Array.from(this.issues.values()),
      faq: [],
      diagnosticTools: Array.from(this.diagnosticTools.values()),
      createdAt: Date.now(),
    };

    this.guides.set(guide.id, guide);
    return guide;
  }

  /**
   * Add FAQ item
   */
  addFAQItem(guideId: string, item: FAQItem): TroubleshootingGuide {
    const guide = this.guides.get(guideId);
    if (!guide) throw new Error(`Guide ${guideId} not found`);

    guide.faq.push(item);
    return guide;
  }

  /**
   * Generate troubleshooting guide as Markdown
   */
  generateMarkdown(guideId: string): string {
    const guide = this.guides.get(guideId);
    if (!guide) throw new Error(`Guide ${guideId} not found`);

    let markdown = `# ${guide.title}\n\n`;
    markdown += `${guide.description}\n\n`;
    markdown += `**Version:** ${guide.version}\n\n`;

    markdown += `## Quick Diagnostic\n\n`;
    for (const tool of guide.diagnosticTools) {
      markdown += `### ${tool.name}\n\n`;
      markdown += `${tool.description}\n\n`;
      markdown += `\`\`\`bash\n${tool.command}\n\`\`\`\n\n`;
      markdown += `**Expected Output:** ${tool.expectedOutput}\n\n`;
      markdown += `**Interpretation:** ${tool.interpretation}\n\n`;
    }

    markdown += `## Issues by Category\n\n`;
    for (const category of guide.categories) {
      markdown += `### ${category.name}\n\n`;
      markdown += `${category.description}\n\n`;

      for (const issueId of category.issues) {
        const issue = this.issues.get(issueId);
        if (issue) {
          markdown += this.generateIssueMarkdown(issue);
        }
      }
    }

    markdown += `## Frequently Asked Questions\n\n`;
    for (const faq of guide.faq) {
      markdown += `### ${faq.question}\n\n`;
      markdown += `${faq.answer}\n\n`;
    }

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
    .issue { border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
    .severity-critical { border-left: 4px solid #d32f2f; }
    .severity-high { border-left: 4px solid #f57c00; }
    .severity-medium { border-left: 4px solid #fbc02d; }
    .severity-low { border-left: 4px solid #388e3c; }
    .solution { background: #f0f8ff; padding: 10px; margin: 10px 0; }
    .faq { background: #f5f5f5; padding: 10px; margin: 10px 0; }
  </style>
</head>
<body>
  <h1>${guide.title}</h1>
  <p>${guide.description}</p>
`;

    for (const category of guide.categories) {
      html += `<h2>${category.name}</h2>
  <p>${category.description}</p>`;

      for (const issueId of category.issues) {
        const issue = this.issues.get(issueId);
        if (issue) {
          html += `<div class="issue severity-${issue.severity}">
    <h3>${issue.title}</h3>
    <p>${issue.description}</p>
    <p><strong>Severity:</strong> ${issue.severity}</p>
    <p><strong>Frequency:</strong> ${issue.frequency}</p>`;

          if (issue.symptoms.length > 0) {
            html += `<p><strong>Symptoms:</strong></p>
    <ul>`;
            for (const symptom of issue.symptoms) {
              html += `<li>${symptom}</li>`;
            }
            html += `</ul>`;
          }

          for (const solution of issue.solutions) {
            html += `<div class="solution">
      <h4>${solution.title}</h4>
      <p>${solution.description}</p>
      <p><strong>Difficulty:</strong> ${solution.difficulty}</p>
      <p><strong>Time Estimate:</strong> ${solution.timeEstimate} minutes</p>
      <ol>`;
            for (const step of solution.steps) {
              html += `<li>${step}</li>`;
            }
            html += `</ol>
      <p><strong>Expected Result:</strong> ${solution.expectedResult}</p>
    </div>`;
          }

          html += `</div>`;
        }
      }
    }

    html += `<h2>FAQ</h2>`;
    for (const faq of guide.faq) {
      html += `<div class="faq">
    <h3>${faq.question}</h3>
    <p>${faq.answer}</p>
  </div>`;
    }

    html += `</body></html>`;
    return html;
  }

  /**
   * Search issues
   */
  searchIssues(query: string): Issue[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.issues.values()).filter(
      (i) =>
        i.title.toLowerCase().includes(lowerQuery) ||
        i.description.toLowerCase().includes(lowerQuery) ||
        i.symptoms.some((s) => s.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get issues by severity
   */
  getIssuesBySeverity(severity: 'critical' | 'high' | 'medium' | 'low'): Issue[] {
    return Array.from(this.issues.values()).filter((i) => i.severity === severity);
  }

  /**
   * Get issues by frequency
   */
  getIssuesByFrequency(frequency: 'common' | 'occasional' | 'rare'): Issue[] {
    return Array.from(this.issues.values()).filter((i) => i.frequency === frequency);
  }

  /**
   * Get metrics
   */
  getMetrics(guideId: string): TroubleshootingMetrics {
    const guide = this.guides.get(guideId);
    if (!guide) throw new Error(`Guide ${guideId} not found`);

    const bySeverity: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    const byFrequency: Record<string, number> = {
      common: 0,
      occasional: 0,
      rare: 0,
    };

    let totalTime = 0;

    for (const issue of guide.issues) {
      bySeverity[issue.severity]++;
      byFrequency[issue.frequency]++;

      for (const solution of issue.solutions) {
        totalTime += solution.timeEstimate;
      }
    }

    return {
      totalIssues: guide.issues.length,
      bySeverity,
      byFrequency,
      averageResolutionTime: guide.issues.length > 0 ? totalTime / guide.issues.length : 0,
    };
  }

  /**
   * Get guide
   */
  getGuide(guideId: string): TroubleshootingGuide | undefined {
    return this.guides.get(guideId);
  }

  /**
   * List all guides
   */
  listGuides(): TroubleshootingGuide[] {
    return Array.from(this.guides.values());
  }

  /**
   * Get issue
   */
  getIssue(issueId: string): Issue | undefined {
    return this.issues.get(issueId);
  }

  /**
   * List all issues
   */
  listIssues(): Issue[] {
    return Array.from(this.issues.values());
  }

  /**
   * Update issue
   */
  updateIssue(issueId: string, updates: Partial<Issue>): Issue {
    const issue = this.issues.get(issueId);
    if (!issue) throw new Error(`Issue ${issueId} not found`);

    const updated = { ...issue, ...updates };
    this.issues.set(issueId, updated);
    return updated;
  }

  /**
   * Delete issue
   */
  deleteIssue(issueId: string): void {
    this.issues.delete(issueId);
  }

  // Helper methods

  private generateIssueMarkdown(issue: Issue): string {
    let markdown = `#### ${issue.title}\n\n`;
    markdown += `${issue.description}\n\n`;
    markdown += `**Severity:** ${issue.severity} | **Frequency:** ${issue.frequency}\n\n`;

    if (issue.symptoms.length > 0) {
      markdown += `**Symptoms:**\n\n`;
      for (const symptom of issue.symptoms) {
        markdown += `- ${symptom}\n`;
      }
      markdown += `\n`;
    }

    if (issue.rootCauses.length > 0) {
      markdown += `**Root Causes:**\n\n`;
      for (const cause of issue.rootCauses) {
        markdown += `- ${cause}\n`;
      }
      markdown += `\n`;
    }

    markdown += `**Solutions:**\n\n`;
    for (const solution of issue.solutions) {
      markdown += `##### ${solution.title}\n\n`;
      markdown += `${solution.description}\n\n`;
      markdown += `**Difficulty:** ${solution.difficulty} | **Time:** ${solution.timeEstimate} min\n\n`;

      markdown += `**Steps:**\n\n`;
      for (let i = 0; i < solution.steps.length; i++) {
        markdown += `${i + 1}. ${solution.steps[i]}\n`;
      }
      markdown += `\n`;

      if (solution.code) {
        markdown += `\`\`\`${solution.codeLanguage || 'text'}\n${solution.code}\n\`\`\`\n\n`;
      }

      markdown += `**Expected Result:** ${solution.expectedResult}\n\n`;
    }

    if (issue.preventionTips.length > 0) {
      markdown += `**Prevention Tips:**\n\n`;
      for (const tip of issue.preventionTips) {
        markdown += `- ${tip}\n`;
      }
      markdown += `\n`;
    }

    return markdown;
  }
}
