/**
 * GraphQL Schema Definition
 * تعریف Schema GraphQL برای API
 *
 * Features:
 * - Type definitions
 * - Query schema
 * - Mutation schema
 * - Subscription schema
 */

export const GraphQLSchemaDefinition = `
  scalar DateTime
  scalar JSON

  enum ChartType {
    LINE
    BAR
    PIE
    SCATTER
    BUBBLE
    HEATMAP
    NETWORK
    TREEMAP
    SANKEY
    GANTT
  }

  enum UserRole {
    ADMIN
    EDITOR
    VIEWER
    GUEST
  }

  type Chart {
    id: String!
    name: String!
    type: ChartType!
    data: JSON!
    config: JSON!
    createdAt: DateTime!
    updatedAt: DateTime!
    owner: User!
    shared: Boolean!
    permissions: [Permission!]!
  }

  type User {
    id: String!
    name: String!
    email: String!
    role: UserRole!
    createdAt: DateTime!
    charts: [Chart!]!
  }

  type Permission {
    id: String!
    userId: String!
    chartId: String!
    role: UserRole!
    grantedAt: DateTime!
  }

  type Query {
    chart(id: String!): Chart
    charts(limit: Int, offset: Int): [Chart!]!
    user(id: String!): User
    users(limit: Int, offset: Int): [User!]!
    searchCharts(query: String!, limit: Int): [Chart!]!
    getChartStats(chartId: String!): JSON!
    getUserStats(userId: String!): JSON!
  }

  type Mutation {
    createChart(name: String!, type: ChartType!, data: JSON!, config: JSON!): Chart!
    updateChart(id: String!, name: String, data: JSON, config: JSON): Chart!
    deleteChart(id: String!): Boolean!
    shareChart(chartId: String!, userId: String!, role: UserRole!): Permission!
    revokeAccess(permissionId: String!): Boolean!
    createUser(name: String!, email: String!, role: UserRole!): User!
    updateUser(id: String!, name: String, role: UserRole): User!
    deleteUser(id: String!): Boolean!
  }

  type Subscription {
    chartUpdated(chartId: String!): Chart!
    userCreated: User!
    chartDeleted(chartId: String!): String!
  }
`;

export interface GraphQLSchemaConfig {
  types: Map<string, any>;
  queries: Map<string, any>;
  mutations: Map<string, any>;
  subscriptions: Map<string, any>;
}

export class GraphQLSchemaBuilder {
  private config: GraphQLSchemaConfig;

  constructor() {
    this.config = {
      types: new Map(),
      queries: new Map(),
      mutations: new Map(),
      subscriptions: new Map(),
    };
    this.initializeDefaultTypes();
  }

  private initializeDefaultTypes(): void {
    // Scalar types
    this.config.types.set('DateTime', { kind: 'SCALAR' });
    this.config.types.set('JSON', { kind: 'SCALAR' });

    // Enum types
    this.config.types.set('ChartType', {
      kind: 'ENUM',
      values: [
        'LINE',
        'BAR',
        'PIE',
        'SCATTER',
        'BUBBLE',
        'HEATMAP',
        'NETWORK',
        'TREEMAP',
        'SANKEY',
        'GANTT',
      ],
    });

    this.config.types.set('UserRole', {
      kind: 'ENUM',
      values: ['ADMIN', 'EDITOR', 'VIEWER', 'GUEST'],
    });

    // Object types
    this.config.types.set('Chart', {
      kind: 'OBJECT',
      fields: {
        id: { type: 'String!' },
        name: { type: 'String!' },
        type: { type: 'ChartType!' },
        data: { type: 'JSON!' },
        config: { type: 'JSON!' },
        createdAt: { type: 'DateTime!' },
        updatedAt: { type: 'DateTime!' },
        owner: { type: 'User!' },
        shared: { type: 'Boolean!' },
        permissions: { type: '[Permission!]!' },
      },
    });

    this.config.types.set('User', {
      kind: 'OBJECT',
      fields: {
        id: { type: 'String!' },
        name: { type: 'String!' },
        email: { type: 'String!' },
        role: { type: 'UserRole!' },
        createdAt: { type: 'DateTime!' },
        charts: { type: '[Chart!]!' },
      },
    });

    this.config.types.set('Permission', {
      kind: 'OBJECT',
      fields: {
        id: { type: 'String!' },
        userId: { type: 'String!' },
        chartId: { type: 'String!' },
        role: { type: 'UserRole!' },
        grantedAt: { type: 'DateTime!' },
      },
    });
  }

  addQuery(name: string, config: any): void {
    this.config.queries.set(name, config);
  }

  addMutation(name: string, config: any): void {
    this.config.mutations.set(name, config);
  }

  addSubscription(name: string, config: any): void {
    this.config.subscriptions.set(name, config);
  }

  getSchema(): GraphQLSchemaConfig {
    return this.config;
  }

  getSchemaString(): string {
    return GraphQLSchemaDefinition;
  }
}
