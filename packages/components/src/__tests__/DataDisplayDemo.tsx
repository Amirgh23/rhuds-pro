/**
 * Data Display Components Demo
 * Demonstrates Table, DataGrid, and Tree components
 */

import React, { useState } from 'react';
import { Table, DataGrid, Tree, CyberCard } from '../index';
import { Text, Button } from '../index';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export const DataDisplayDemo: React.FC = () => {
  const [sortColumn, setSortColumn] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['root']);
  const [selectedNode, setSelectedNode] = useState<string>('root');

  const users: User[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Editor', status: 'Inactive' },
    { id: 4, name: 'David Brown', email: 'david@example.com', role: 'User', status: 'Active' },
    { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'Active' },
    { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: 'User', status: 'Inactive' },
    { id: 7, name: 'Grace Lee', email: 'grace@example.com', role: 'Editor', status: 'Active' },
    { id: 8, name: 'Henry Wilson', email: 'henry@example.com', role: 'User', status: 'Active' },
  ];

  const tableColumns = [
    { key: 'id', label: 'ID', width: 60, sortable: true },
    { key: 'name', label: 'Name', width: 150, sortable: true },
    { key: 'email', label: 'Email', width: 200, sortable: true },
    { key: 'role', label: 'Role', width: 100, sortable: true },
    {
      key: 'status',
      label: 'Status',
      width: 100,
      sortable: true,
      render: (value: string) => (
        <span style={{ color: value === 'Active' ? '#29F2DF' : '#EF3EF1' }}>
          {value}
        </span>
      ),
    },
  ];

  const dataGridColumns = [
    { key: 'id', label: 'ID', width: 60, sortable: true, editable: false },
    { key: 'name', label: 'Name', width: 150, sortable: true, editable: true },
    { key: 'email', label: 'Email', width: 200, sortable: true, editable: true },
    { key: 'role', label: 'Role', width: 100, sortable: true, editable: true },
    {
      key: 'status',
      label: 'Status',
      width: 100,
      sortable: true,
      editable: true,
      render: (value: string) => (
        <span style={{ color: value === 'Active' ? '#29F2DF' : '#EF3EF1' }}>
          {value}
        </span>
      ),
    },
  ];

  const treeNodes = [
    {
      key: 'root',
      label: 'Organization',
      icon: '🏢',
      expandable: true,
      children: [
        {
          key: 'engineering',
          label: 'Engineering',
          icon: '⚙️',
          expandable: true,
          children: [
            { key: 'frontend', label: 'Frontend Team', icon: '💻' },
            { key: 'backend', label: 'Backend Team', icon: '🔧' },
            { key: 'devops', label: 'DevOps Team', icon: '🚀' },
          ],
        },
        {
          key: 'design',
          label: 'Design',
          icon: '🎨',
          expandable: true,
          children: [
            { key: 'ux', label: 'UX Design', icon: '✏️' },
            { key: 'ui', label: 'UI Design', icon: '🎭' },
          ],
        },
        {
          key: 'marketing',
          label: 'Marketing',
          icon: '📢',
          expandable: true,
          children: [
            { key: 'content', label: 'Content Team', icon: '📝' },
            { key: 'social', label: 'Social Media', icon: '📱' },
          ],
        },
      ],
    },
  ];

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0A1225', minHeight: '100vh', color: '#fff' }}>
      <Text variant="h1" style={{ marginBottom: '2rem' }}>
        Data Display Components Demo
      </Text>

      {/* Table Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Table Component
        </Text>
        <div style={{ backgroundColor: '#0A1225', borderRadius: '4px', overflow: 'hidden' }}>
          <Table
            data={users}
            columns={tableColumns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={(col, dir) => {
              setSortColumn(col);
              setSortDirection(dir);
            }}
            onRowClick={(row) => console.log('Row clicked:', row)}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Text>
            Sort Column: {sortColumn || 'None'} | Direction: {sortDirection}
          </Text>
        </div>
      </section>

      {/* DataGrid Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          DataGrid Component (with Virtual Scrolling)
        </Text>
        <div style={{ backgroundColor: '#0A1225', borderRadius: '4px', overflow: 'hidden' }}>
          <DataGrid
            data={users}
            columns={dataGridColumns}
            rowHeight={40}
            visibleRows={5}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={(col, dir) => {
              setSortColumn(col);
              setSortDirection(dir);
            }}
            selectedRows={selectedRows}
            selectionMode="multiple"
            onSelectionChange={setSelectedRows}
            onCellEdit={(rowIndex, colKey, value) => {
              console.log(`Cell edited: Row ${rowIndex}, Column ${colKey}, Value: ${value}`);
            }}
            onRowClick={(row) => console.log('Row clicked:', row)}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Text>
            Selected Rows: {selectedRows.length > 0 ? selectedRows.join(', ') : 'None'}
          </Text>
          <Text style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Double-click cells to edit (Name, Email, Role, Status)
          </Text>
        </div>
      </section>

      {/* Tree Demo */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Tree Component
        </Text>
        <div style={{ backgroundColor: '#0A1225', borderRadius: '4px', padding: '1rem' }}>
          <Tree
            nodes={treeNodes}
            expandedNodes={expandedNodes}
            onExpand={(key) => setExpandedNodes([...expandedNodes, key])}
            onCollapse={(key) => setExpandedNodes(expandedNodes.filter((k) => k !== key))}
            selectedNode={selectedNode}
            onNodeSelect={setSelectedNode}
            animationDuration={300}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Text>
            Selected Node: {selectedNode}
          </Text>
          <Text style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Expanded Nodes: {expandedNodes.join(', ')}
          </Text>
        </div>
      </section>

      {/* Controls */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" style={{ marginBottom: '1rem' }}>
          Controls
        </Text>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button
            onClick={() => {
              setSortColumn(undefined);
              setSortDirection('asc');
            }}
          >
            Reset Sort
          </Button>
          <Button
            onClick={() => {
              setSelectedRows([]);
            }}
          >
            Clear Selection
          </Button>
          <Button
            onClick={() => {
              setExpandedNodes(['root']);
              setSelectedNode('root');
            }}
          >
            Reset Tree
          </Button>
        </div>
      </section>

      {/* CyberCard Section */}
      <section style={{ marginBottom: '3rem' }}>
        <Text variant="h2" color="#1C7FA6" style={{ marginBottom: '1rem' }}>
          CyberCard Component (Cyberpunk Style)
        </Text>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <CyberCard
            title="PROFILE"
            footer="Connect with me"
            socialLinks={{
              facebook: 'https://facebook.com',
              twitter: 'https://twitter.com',
              instagram: 'https://instagram.com',
              whatsapp: 'https://wa.me/1234567890',
            }}
          />
          <CyberCard
            title="CONTACT"
            footer="Social Networks"
          />
        </div>
      </section>
    </div>
  );
};

DataDisplayDemo.displayName = 'DataDisplayDemo';
