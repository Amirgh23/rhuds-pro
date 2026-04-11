/**
 * Natural Language Processing Integration
 * Text analysis, sentiment analysis, entity extraction, and more
 */

export interface TextClassificationResult {
  text: string;
  category: string;
  confidence: number;
  scores: Record<string, number>;
}

export interface SentimentResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number; // -1 to 1
  confidence: number;
}

export interface Entity {
  text: string;
  type: 'PERSON' | 'LOCATION' | 'ORGANIZATION' | 'DATE' | 'MONEY' | 'OTHER';
  start: number;
  end: number;
  confidence: number;
}

export interface Topic {
  name: string;
  keywords: string[];
  weight: number;
}

export interface LanguageDetectionResult {
  language: string;
  confidence: number;
  alternatives: Array<{ language: string; confidence: number }>;
}

/**
 * NLPIntegration - Natural Language Processing capabilities
 */
export class NLPIntegration {
  private stopWords = new Set([
    'the',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
  ]);

  private sentimentWords: Record<string, number> = {
    excellent: 0.9,
    good: 0.7,
    great: 0.8,
    amazing: 0.9,
    wonderful: 0.85,
    terrible: -0.9,
    bad: -0.7,
    awful: -0.85,
    horrible: -0.9,
    poor: -0.7,
  };

  /**
   * Classify text into categories
   */
  classifyText(text: string, categories: string[]): TextClassificationResult {
    const words = this.tokenize(text);
    const scores: Record<string, number> = {};

    for (const category of categories) {
      const categoryWords = category.toLowerCase().split(' ');
      let score = 0;

      for (const word of words) {
        if (categoryWords.includes(word)) {
          score += 1;
        }
      }

      scores[category] = score / Math.max(words.length, 1);
    }

    const maxCategory = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];

    return {
      text,
      category: maxCategory[0],
      confidence: maxCategory[1],
      scores,
    };
  }

  /**
   * Analyze sentiment of text
   */
  analyzeSentiment(text: string): SentimentResult {
    const words = this.tokenize(text);
    let sentimentScore = 0;
    let matchCount = 0;

    for (const word of words) {
      if (this.sentimentWords[word]) {
        sentimentScore += this.sentimentWords[word];
        matchCount++;
      }
    }

    const score = matchCount > 0 ? sentimentScore / matchCount : 0;
    const sentiment = score > 0.1 ? 'positive' : score < -0.1 ? 'negative' : 'neutral';

    return {
      text,
      sentiment,
      score,
      confidence: Math.min(1, Math.abs(score) + matchCount * 0.1),
    };
  }

  /**
   * Extract named entities from text
   */
  extractEntities(text: string): Entity[] {
    const entities: Entity[] = [];
    const patterns = [
      {
        type: 'PERSON' as const,
        regex: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g,
      },
      {
        type: 'DATE' as const,
        regex: /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g,
      },
      {
        type: 'MONEY' as const,
        regex: /\$\d+(?:,\d{3})*(?:\.\d{2})?\b/g,
      },
      {
        type: 'ORGANIZATION' as const,
        regex: /\b[A-Z][a-z]+ (?:Inc|Corp|Ltd|LLC)\b/g,
      },
    ];

    for (const pattern of patterns) {
      let match;
      const regex = new RegExp(pattern.regex);
      while ((match = regex.exec(text)) !== null) {
        entities.push({
          text: match[0],
          type: pattern.type,
          start: match.index,
          end: match.index + match[0].length,
          confidence: 0.85,
        });
      }
    }

    return entities;
  }

  /**
   * Extract topics from text
   */
  extractTopics(text: string, topCount: number = 5): Topic[] {
    const words = this.tokenize(text);
    const wordFreq: Record<string, number> = {};

    for (const word of words) {
      if (!this.stopWords.has(word) && word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    }

    const sorted = Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, topCount);

    const maxFreq = sorted[0]?.[1] || 1;

    return sorted.map(([word, freq]) => ({
      name: word,
      keywords: [word],
      weight: freq / maxFreq,
    }));
  }

  /**
   * Detect language of text
   */
  detectLanguage(text: string): LanguageDetectionResult {
    const languagePatterns: Record<string, RegExp> = {
      en: /\b(the|and|or|is|are|be|been|being)\b/gi,
      es: /\b(el|la|de|que|y|o|es|son|ser)\b/gi,
      fr: /\b(le|la|de|et|ou|est|sont|être)\b/gi,
      de: /\b(der|die|das|und|oder|ist|sind|sein)\b/gi,
      fa: /[\u0600-\u06FF]/g,
    };

    const scores: Record<string, number> = {};

    for (const [lang, pattern] of Object.entries(languagePatterns)) {
      const matches = text.match(pattern) || [];
      scores[lang] = matches.length;
    }

    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const topLanguage = sorted[0];

    return {
      language: topLanguage[0],
      confidence: topLanguage[1] / Math.max(text.length / 5, 1),
      alternatives: sorted.slice(1, 3).map(([lang, score]) => ({
        language: lang,
        confidence: score / Math.max(text.length / 5, 1),
      })),
    };
  }

  /**
   * Tokenize text into words
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.replace(/[^\w]/g, ''))
      .filter((word) => word.length > 0);
  }

  /**
   * Calculate text similarity using cosine similarity
   */
  calculateSimilarity(text1: string, text2: string): number {
    const words1 = this.tokenize(text1);
    const words2 = this.tokenize(text2);

    const set1 = new Set(words1);
    const set2 = new Set(words2);

    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  /**
   * Generate text summary
   */
  summarizeText(text: string, sentenceCount: number = 3): string {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    if (sentences.length <= sentenceCount) {
      return text;
    }

    // Score sentences by keyword frequency
    const words = this.tokenize(text);
    const wordFreq: Record<string, number> = {};

    for (const word of words) {
      if (!this.stopWords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    }

    const scoredSentences = sentences.map((sentence, index) => {
      const sentenceWords = this.tokenize(sentence);
      const score = sentenceWords.reduce((sum, word) => sum + (wordFreq[word] || 0), 0);
      return { sentence: sentence.trim(), score, index };
    });

    return scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, sentenceCount)
      .sort((a, b) => a.index - b.index)
      .map((s) => s.sentence)
      .join('. ');
  }

  /**
   * Extract keywords from text
   */
  extractKeywords(text: string, count: number = 10): string[] {
    const words = this.tokenize(text);
    const wordFreq: Record<string, number> = {};

    for (const word of words) {
      if (!this.stopWords.has(word) && word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    }

    return Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, count)
      .map(([word]) => word);
  }
}

export default NLPIntegration;
