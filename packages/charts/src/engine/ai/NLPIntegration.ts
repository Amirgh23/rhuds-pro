/**
 * Natural Language Processing Integration
 * NLP capabilities for text analysis and understanding
 *
 * ادغام پردازش زبان طبیعی
 * قابلیت های NLP برای تجزیه و تحلیل و درک متن
 */

import { EventEmitter } from 'events';

export interface SentimentResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
}

export interface Entity {
  text: string;
  type: 'PERSON' | 'LOCATION' | 'ORGANIZATION' | 'DATE' | 'MONEY' | 'OTHER';
  start: number;
  end: number;
  confidence: number;
}

export interface TextClassificationResult {
  text: string;
  category: string;
  probability: number;
  alternatives: Array<{ category: string; probability: number }>;
}

export interface Topic {
  id: string;
  keywords: string[];
  weight: number;
}

export interface LanguageDetectionResult {
  language: string;
  confidence: number;
  alternatives: Array<{ language: string; confidence: number }>;
}

export class NLPIntegration extends EventEmitter {
  private sentimentLexicon: Map<string, number> = new Map();
  private entityPatterns: Map<string, RegExp> = new Map();
  private classifiers: Map<string, any> = new Map();
  private topicModels: Map<string, Topic[]> = new Map();
  private languageModels: Map<string, any> = new Map();

  constructor() {
    super();
    this.initializeSentimentLexicon();
    this.initializeEntityPatterns();
    this.initializeLanguageModels();
  }

  /**
   * Analyze sentiment of text
   */
  analyzeSentiment(text: string): SentimentResult {
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    let count = 0;

    for (const word of words) {
      const sentiment = this.sentimentLexicon.get(word);
      if (sentiment !== undefined) {
        score += sentiment;
        count++;
      }
    }

    const normalizedScore = count > 0 ? score / count : 0;
    const sentiment =
      normalizedScore > 0.1 ? 'positive' : normalizedScore < -0.1 ? 'negative' : 'neutral';
    const confidence = Math.min(1, Math.abs(normalizedScore) + 0.5);

    this.emit('sentiment:analyzed', {
      text: text.substring(0, 50),
      sentiment,
      score: normalizedScore,
    });

    return {
      text,
      sentiment,
      score: normalizedScore,
      confidence,
    };
  }

  /**
   * Extract entities from text
   */
  extractEntities(text: string): Entity[] {
    const entities: Entity[] = [];

    // Person names (simple pattern)
    const personPattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
    let match;
    while ((match = personPattern.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'PERSON',
        start: match.index,
        end: match.index + match[0].length,
        confidence: 0.7,
      });
    }

    // Dates
    const datePattern = /\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{4}-\d{2}-\d{2}\b/g;
    while ((match = datePattern.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'DATE',
        start: match.index,
        end: match.index + match[0].length,
        confidence: 0.95,
      });
    }

    // Money amounts
    const moneyPattern =
      /\$\d+(?:,\d{3})*(?:\.\d{2})?|\d+(?:,\d{3})*(?:\.\d{2})?\s*(?:USD|EUR|GBP)/g;
    while ((match = moneyPattern.exec(text)) !== null) {
      entities.push({
        text: match[0],
        type: 'MONEY',
        start: match.index,
        end: match.index + match[0].length,
        confidence: 0.9,
      });
    }

    // Organizations (capitalized words)
    const orgPattern = /\b[A-Z]{2,}\b/g;
    while ((match = orgPattern.exec(text)) !== null) {
      if (!entities.some((e) => e.start === match.index)) {
        entities.push({
          text: match[0],
          type: 'ORGANIZATION',
          start: match.index,
          end: match.index + match[0].length,
          confidence: 0.6,
        });
      }
    }

    this.emit('entities:extracted', { text: text.substring(0, 50), count: entities.length });
    return entities;
  }

  /**
   * Classify text into categories
   */
  classifyText(classifierId: string, text: string): TextClassificationResult {
    const classifier = this.classifiers.get(classifierId);
    if (!classifier) throw new Error(`Classifier ${classifierId} not found`);

    const words = text.toLowerCase().split(/\s+/);
    const scores: Record<string, number> = {};

    // Initialize scores
    for (const category of classifier.categories) {
      scores[category] = 0;
    }

    // Calculate scores based on keywords
    for (const word of words) {
      for (const category of classifier.categories) {
        const keywords = classifier.keywords[category] || [];
        if (keywords.includes(word)) {
          scores[category] += 1;
        }
      }
    }

    // Normalize scores
    const maxScore = Math.max(...Object.values(scores));
    const normalized: Record<string, number> = {};
    for (const category of classifier.categories) {
      normalized[category] =
        maxScore > 0 ? scores[category] / maxScore : 1 / classifier.categories.length;
    }

    // Sort by probability
    const sorted = Object.entries(normalized)
      .map(([category, probability]) => ({ category, probability }))
      .sort((a, b) => b.probability - a.probability);

    this.emit('text:classified', {
      text: text.substring(0, 50),
      category: sorted[0].category,
    });

    return {
      text,
      category: sorted[0].category,
      probability: sorted[0].probability,
      alternatives: sorted.slice(1),
    };
  }

  /**
   * Train text classifier
   */
  trainClassifier(
    classifierId: string,
    trainingData: Array<{ text: string; category: string }>
  ): void {
    const categories = [...new Set(trainingData.map((d) => d.category))];
    const keywords: Record<string, Set<string>> = {};

    for (const category of categories) {
      keywords[category] = new Set();
    }

    // Extract keywords for each category
    for (const item of trainingData) {
      const words = item.text.toLowerCase().split(/\s+/);
      for (const word of words) {
        if (word.length > 3) {
          keywords[item.category].add(word);
        }
      }
    }

    // Convert sets to arrays
    const keywordArrays: Record<string, string[]> = {};
    for (const category of categories) {
      keywordArrays[category] = Array.from(keywords[category]);
    }

    this.classifiers.set(classifierId, {
      categories,
      keywords: keywordArrays,
    });

    this.emit('classifier:trained', { classifierId, categories: categories.length });
  }

  /**
   * Extract topics from text collection
   */
  extractTopics(modelId: string, texts: string[], topicCount: number = 5): Topic[] {
    const allWords: Record<string, number> = {};

    // Count word frequencies
    for (const text of texts) {
      const words = text.toLowerCase().split(/\s+/);
      for (const word of words) {
        if (word.length > 3) {
          allWords[word] = (allWords[word] || 0) + 1;
        }
      }
    }

    // Sort by frequency and get top words
    const topWords = Object.entries(allWords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topicCount * 5)
      .map(([word]) => word);

    // Create topics
    const topics: Topic[] = [];
    for (let i = 0; i < topicCount; i++) {
      const start = i * 5;
      const end = Math.min(start + 5, topWords.length);
      topics.push({
        id: `topic-${i}`,
        keywords: topWords.slice(start, end),
        weight: 1 / topicCount,
      });
    }

    this.topicModels.set(modelId, topics);
    this.emit('topics:extracted', { modelId, count: topics.length });
    return topics;
  }

  /**
   * Detect language of text
   */
  detectLanguage(text: string): LanguageDetectionResult {
    const scores: Record<string, number> = {};

    // Simple language detection based on character patterns
    const languages = ['en', 'fa', 'ar', 'fr', 'de', 'es'];
    for (const lang of languages) {
      scores[lang] = 0;
    }

    // Check for Persian characters
    if (/[\u0600-\u06FF]/.test(text)) {
      scores['fa'] += 0.8;
      scores['ar'] += 0.3;
    }

    // Check for Arabic characters
    if (/[\u0600-\u06FF]/.test(text) && !/[\u0600-\u06FF]{2,}/.test(text)) {
      scores['ar'] += 0.5;
    }

    // Check for common English patterns
    if (/[a-z]{2,}/.test(text.toLowerCase())) {
      scores['en'] += 0.7;
    }

    // Check for French patterns
    if (/\b(le|la|de|et|un|une)\b/i.test(text)) {
      scores['fr'] += 0.5;
    }

    // Check for German patterns
    if (/\b(der|die|das|und|ein|eine)\b/i.test(text)) {
      scores['de'] += 0.5;
    }

    // Check for Spanish patterns
    if (/\b(el|la|de|y|un|una)\b/i.test(text)) {
      scores['es'] += 0.5;
    }

    // Normalize scores
    const total = Object.values(scores).reduce((sum, s) => sum + s, 0);
    const normalized: Record<string, number> = {};
    for (const lang of languages) {
      normalized[lang] = total > 0 ? scores[lang] / total : 1 / languages.length;
    }

    // Sort by confidence
    const sorted = Object.entries(normalized)
      .map(([language, confidence]) => ({ language, confidence }))
      .sort((a, b) => b.confidence - a.confidence);

    this.emit('language:detected', {
      text: text.substring(0, 30),
      language: sorted[0].language,
    });

    return {
      language: sorted[0].language,
      confidence: sorted[0].confidence,
      alternatives: sorted.slice(1),
    };
  }

  /**
   * Tokenize text
   */
  tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter((token) => token.length > 0);
  }

  /**
   * Remove stopwords
   */
  removeStopwords(tokens: string[], language: string = 'en'): string[] {
    const stopwords: Record<string, Set<string>> = {
      en: new Set([
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
        'is',
        'are',
      ]),
      fa: new Set(['و', 'در', 'به', 'از', 'که', 'این', 'آن', 'است', 'هستند']),
    };

    const stops = stopwords[language] || stopwords['en'];
    return tokens.filter((token) => !stops.has(token));
  }

  /**
   * Calculate text similarity (Jaccard similarity)
   */
  calculateSimilarity(text1: string, text2: string): number {
    const tokens1 = new Set(this.tokenize(text1));
    const tokens2 = new Set(this.tokenize(text2));

    const intersection = new Set([...tokens1].filter((t) => tokens2.has(t)));
    const union = new Set([...tokens1, ...tokens2]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Private helper: Initialize sentiment lexicon
   */
  private initializeSentimentLexicon(): void {
    const positive = [
      'good',
      'great',
      'excellent',
      'amazing',
      'wonderful',
      'fantastic',
      'love',
      'best',
      'awesome',
      'perfect',
    ];
    const negative = [
      'bad',
      'terrible',
      'awful',
      'horrible',
      'hate',
      'worst',
      'poor',
      'disappointing',
      'useless',
      'broken',
    ];

    for (const word of positive) {
      this.sentimentLexicon.set(word, 1);
    }
    for (const word of negative) {
      this.sentimentLexicon.set(word, -1);
    }
  }

  /**
   * Private helper: Initialize entity patterns
   */
  private initializeEntityPatterns(): void {
    this.entityPatterns.set('PERSON', /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
    this.entityPatterns.set('DATE', /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g);
    this.entityPatterns.set('MONEY', /\$\d+(?:,\d{3})*(?:\.\d{2})?/g);
  }

  /**
   * Private helper: Initialize language models
   */
  private initializeLanguageModels(): void {
    this.languageModels.set('en', {
      name: 'English',
      patterns: [/[a-z]{2,}/i],
    });
    this.languageModels.set('fa', {
      name: 'Persian',
      patterns: [/[\u0600-\u06FF]{2,}/],
    });
  }
}
