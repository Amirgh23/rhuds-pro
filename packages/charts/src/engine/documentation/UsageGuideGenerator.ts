/**
 * UsageGuideGenerator - Generate Usage Guides and Tutorials
 * Creates comprehensive usage guides from feature definitions
 */

interface GuideSection {
  id: string;
  title: string;
  content: string;
  subsections: GuideSection[];
  codeExamples: CodeExample[];
  order: number;
}

interface CodeExample {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  output?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface UsageGuide {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
  sections: GuideSection[];
  prerequisites: string[];
  relatedGuides: string[];
  createdAt: number;
  updatedAt: number;
}

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  codeExample: CodeExample;
  expectedResult: string;
  commonIssues: string[];
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  steps: TutorialStep[];
  prerequisites: string[];
  createdAt: number;
}

export class UsageGuideGenerator {
  private guides: Map<string, UsageGuide> = new Map();
  private tutorials: Map<string, Tutorial> = new Map();
  private codeExamples: Map<string, CodeExample> = new Map();

  /**
   * Create usage guide
   */
  private guideCounter = 0;

  createGuide(
    title: string,
    description: string,
    targetAudience: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    prerequisites: string[]
  ): UsageGuide {
    const guide: UsageGuide = {
      id: `guide-${Date.now()}-${this.guideCounter++}`,
      title,
      description,
      targetAudience,
      difficulty,
      estimatedReadTime: 0,
      sections: [],
      prerequisites,
      relatedGuides: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.guides.set(guide.id, guide);
    return guide;
  }

  /**
   * Add section to guide
   */
  addSection(guideId: string, section: GuideSection): UsageGuide {
    const guide = this.guides.get(guideId);
    if (!guide) throw new Error(`Guide ${guideId} not found`);

    guide.sections.push(section);
    guide.updatedAt = Date.now();
    return guide;
  }

  /**
   * Add code example to section
   */
  addCodeExample(guideId: string, sectionId: string, example: CodeExample): void {
    const guide = this.guides.get(guideId);
    if (!guide) throw new Error(`Guide ${guideId} not found`);

    const section = this.findSection(guide.sections, sectionId);
    if (!section) throw new Error(`Section ${sectionId} not found`);

    section.codeExamples.push(example);
    this.codeExamples.set(example.id, example);
  }

  /**
   * Create tutorial
   */
  createTutorial(
    title: string,
    description: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    estimatedDuration: number,
    prerequisites: string[]
  ): Tutorial {
    const tutorial: Tutorial = {
      id: `tutorial-${Date.now()}`,
      title,
      description,
      difficulty,
      estimatedDuration,
      steps: [],
      prerequisites,
      createdAt: Date.now(),
    };

    this.tutorials.set(tutorial.id, tutorial);
    return tutorial;
  }

  /**
   * Add step to tutorial
   */
  addStep(tutorialId: string, step: TutorialStep): Tutorial {
    const tutorial = this.tutorials.get(tutorialId);
    if (!tutorial) throw new Error(`Tutorial ${tutorialId} not found`);

    tutorial.steps.push(step);
    return tutorial;
  }

  /**
   * Generate guide as Markdown
   */
  generateGuideMarkdown(guideId: string): string {
    const guide = this.guides.get(guideId);
    if (!guide) throw new Error(`Guide ${guideId} not found`);

    let markdown = `# ${guide.title}\n\n`;
    markdown += `${guide.description}\n\n`;

    markdown += `## Guide Information\n\n`;
    markdown += `- **Target Audience:** ${guide.targetAudience}\n`;
    markdown += `- **Difficulty:** ${guide.difficulty}\n`;
    markdown += `- **Estimated Read Time:** ${guide.estimatedReadTime} minutes\n\n`;

    if (guide.prerequisites.length > 0) {
      markdown += `## Prerequisites\n\n`;
      for (const prereq of guide.prerequisites) {
        markdown += `- ${prereq}\n`;
      }
      markdown += `\n`;
    }

    markdown += `## Contents\n\n`;
    for (const section of guide.sections) {
      markdown += this.generateSectionMarkdown(section, 2);
    }

    if (guide.relatedGuides.length > 0) {
      markdown += `## Related Guides\n\n`;
      for (const relatedId of guide.relatedGuides) {
        const related = this.guides.get(relatedId);
        if (related) {
          markdown += `- [${related.title}](#${related.id})\n`;
        }
      }
    }

    return markdown;
  }

  /**
   * Generate tutorial as Markdown
   */
  generateTutorialMarkdown(tutorialId: string): string {
    const tutorial = this.tutorials.get(tutorialId);
    if (!tutorial) throw new Error(`Tutorial ${tutorialId} not found`);

    let markdown = `# ${tutorial.title}\n\n`;
    markdown += `${tutorial.description}\n\n`;

    markdown += `## Tutorial Information\n\n`;
    markdown += `- **Difficulty:** ${tutorial.difficulty}\n`;
    markdown += `- **Estimated Duration:** ${tutorial.estimatedDuration} minutes\n`;
    markdown += `- **Steps:** ${tutorial.steps.length}\n\n`;

    if (tutorial.prerequisites.length > 0) {
      markdown += `## Prerequisites\n\n`;
      for (const prereq of tutorial.prerequisites) {
        markdown += `- ${prereq}\n`;
      }
      markdown += `\n`;
    }

    markdown += `## Steps\n\n`;
    for (let i = 0; i < tutorial.steps.length; i++) {
      const step = tutorial.steps[i];
      markdown += `### Step ${i + 1}: ${step.title}\n\n`;
      markdown += `${step.description}\n\n`;

      markdown += `**Instructions:**\n\n`;
      for (const instruction of step.instructions) {
        markdown += `1. ${instruction}\n`;
      }
      markdown += `\n`;

      markdown += `**Code Example:**\n\n`;
      markdown += `\`\`\`${step.codeExample.language}\n${step.codeExample.code}\n\`\`\`\n\n`;

      if (step.codeExample.output) {
        markdown += `**Expected Output:**\n\n`;
        markdown += `\`\`\`\n${step.codeExample.output}\n\`\`\`\n\n`;
      }

      if (step.commonIssues.length > 0) {
        markdown += `**Common Issues:**\n\n`;
        for (const issue of step.commonIssues) {
          markdown += `- ${issue}\n`;
        }
        markdown += `\n`;
      }
    }

    return markdown;
  }

  /**
   * Generate HTML guide
   */
  generateGuideHTML(guideId: string): string {
    const guide = this.guides.get(guideId);
    if (!guide) throw new Error(`Guide ${guideId} not found`);

    let html = `<!DOCTYPE html>
<html>
<head>
  <title>${guide.title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; max-width: 900px; }
    h1 { color: #333; }
    h2 { color: #666; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
    .info { background: #f0f0f0; padding: 10px; border-radius: 5px; margin: 10px 0; }
    .code { background: #f5f5f5; padding: 10px; border-left: 3px solid #007bff; margin: 10px 0; }
    pre { overflow-x: auto; }
  </style>
</head>
<body>
  <h1>${guide.title}</h1>
  <p>${guide.description}</p>
  <div class="info">
    <p><strong>Target Audience:</strong> ${guide.targetAudience}</p>
    <p><strong>Difficulty:</strong> ${guide.difficulty}</p>
    <p><strong>Read Time:</strong> ${guide.estimatedReadTime} minutes</p>
  </div>
`;

    for (const section of guide.sections) {
      html += this.generateSectionHTML(section, 2);
    }

    html += `</body></html>`;
    return html;
  }

  /**
   * Export guide as PDF (structure)
   */
  exportGuidePDFStructure(guideId: string): Record<string, unknown> {
    const guide = this.guides.get(guideId);
    if (!guide) throw new Error(`Guide ${guideId} not found`);

    return {
      title: guide.title,
      description: guide.description,
      metadata: {
        targetAudience: guide.targetAudience,
        difficulty: guide.difficulty,
        estimatedReadTime: guide.estimatedReadTime,
        createdAt: new Date(guide.createdAt).toISOString(),
      },
      sections: guide.sections.map((s) => this.sectionToPDF(s)),
    };
  }

  /**
   * Get guide
   */
  getGuide(guideId: string): UsageGuide | undefined {
    return this.guides.get(guideId);
  }

  /**
   * Get tutorial
   */
  getTutorial(tutorialId: string): Tutorial | undefined {
    return this.tutorials.get(tutorialId);
  }

  /**
   * List all guides
   */
  listGuides(): UsageGuide[] {
    return Array.from(this.guides.values());
  }

  /**
   * List all tutorials
   */
  listTutorials(): Tutorial[] {
    return Array.from(this.tutorials.values());
  }

  /**
   * Search guides
   */
  searchGuides(query: string): UsageGuide[] {
    const lowerQuery = query.toLowerCase();
    const allGuides = Array.from(this.guides.values());
    return allGuides.filter(
      (g) =>
        g.title.toLowerCase().includes(lowerQuery) ||
        g.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get guides by difficulty
   */
  getGuidesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): UsageGuide[] {
    const allGuides = Array.from(this.guides.values());
    return allGuides.filter((g) => g.difficulty === difficulty);
  }

  /**
   * Update guide
   */
  updateGuide(guideId: string, updates: Partial<UsageGuide>): UsageGuide {
    const guide = this.guides.get(guideId);
    if (!guide) throw new Error(`Guide ${guideId} not found`);

    const updated = { ...guide, ...updates, updatedAt: Date.now() };
    this.guides.set(guideId, updated);
    return updated;
  }

  /**
   * Delete guide
   */
  deleteGuide(guideId: string): void {
    this.guides.delete(guideId);
  }

  // Helper methods

  private findSection(sections: GuideSection[], id: string): GuideSection | undefined {
    for (const section of sections) {
      if (section.id === id) return section;
      const found = this.findSection(section.subsections, id);
      if (found) return found;
    }
    return undefined;
  }

  private generateSectionMarkdown(section: GuideSection, level: number): string {
    let markdown = `${'#'.repeat(level)} ${section.title}\n\n`;
    markdown += `${section.content}\n\n`;

    for (const example of section.codeExamples) {
      markdown += `**${example.title}** (${example.difficulty})\n\n`;
      markdown += `${example.description}\n\n`;
      markdown += `\`\`\`${example.language}\n${example.code}\n\`\`\`\n\n`;
    }

    for (const subsection of section.subsections) {
      markdown += this.generateSectionMarkdown(subsection, level + 1);
    }

    return markdown;
  }

  private generateSectionHTML(section: GuideSection, level: number): string {
    const tag = `h${level}`;
    let html = `<${tag}>${section.title}</${tag}>\n`;
    html += `<p>${section.content}</p>\n`;

    for (const example of section.codeExamples) {
      html += `<div class="code">
        <strong>${example.title}</strong> (${example.difficulty})<br>
        ${example.description}<br>
        <pre><code>${this.escapeHTML(example.code)}</code></pre>
      </div>\n`;
    }

    for (const subsection of section.subsections) {
      html += this.generateSectionHTML(subsection, level + 1);
    }

    return html;
  }

  private sectionToPDF(section: GuideSection): Record<string, unknown> {
    return {
      title: section.title,
      content: section.content,
      examples: section.codeExamples.map((e) => ({
        title: e.title,
        code: e.code,
        language: e.language,
      })),
      subsections: section.subsections.map((s) => this.sectionToPDF(s)),
    };
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
