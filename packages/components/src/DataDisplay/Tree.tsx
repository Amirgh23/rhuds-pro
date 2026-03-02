/**
 * Tree Component
 * Hierarchical tree view with expand/collapse and lazy loading
 */

import React, { useMemo, useState } from 'react';
import { useTheme } from '@rhuds/core';
import { TreeProps, TreeNode } from './types';

interface TreeNodeProps<T = any> {
  node: TreeNode<T>;
  level: number;
  expanded: boolean;
  onExpand: (key: string) => void;
  onCollapse: (key: string) => void;
  onNodeClick: (node: TreeNode<T>) => void;
  selectedNode?: string;
  onNodeSelect: (key: string) => void;
  theme: any;
  animationDuration: number;
}

/**
 * Tree Node Component
 */
const TreeNodeComponent: React.FC<TreeNodeProps> = ({
  node,
  level,
  expanded,
  onExpand,
  onCollapse,
  onNodeClick,
  selectedNode,
  onNodeSelect,
  theme,
  animationDuration,
}) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (expanded) {
      onCollapse(node.key);
    } else {
      if (node.lazyLoad && !node.children) {
        setLoading(true);
        try {
          await node.lazyLoad();
        } finally {
          setLoading(false);
        }
      }
      onExpand(node.key);
    }
  };

  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNode === node.key;

  const nodeStyle: React.CSSProperties = {
    paddingLeft: `${level * 1.5}rem`,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem',
    cursor: 'pointer',
    backgroundColor: isSelected ? theme.currentMode.tokens.colors.primary : 'transparent',
    opacity: isSelected ? 0.2 : 1,
    transition: `background-color ${animationDuration}ms ease-in-out`,
    userSelect: 'none',
  };

  const toggleStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: theme.currentMode.tokens.colors.primary,
    fontWeight: 'bold',
    visibility: node.expandable || hasChildren ? 'visible' : 'hidden',
  };

  const childrenContainerStyle: React.CSSProperties = {
    maxHeight: expanded ? '1000px' : '0px',
    overflow: 'hidden',
    transition: `max-height ${animationDuration}ms ease-in-out`,
  };

  return (
    <div>
      <div
        style={nodeStyle}
        onClick={() => {
          onNodeClick(node);
          onNodeSelect(node.key);
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = '0.8';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = isSelected ? '0.2' : '1';
        }}
      >
        {(node.expandable || hasChildren) && (
          <div style={toggleStyle} onClick={(e) => {
            e.stopPropagation();
            handleToggle();
          }}>
            {loading ? '⟳' : expanded ? '▼' : '▶'}
          </div>
        )}
        {node.icon && <span>{node.icon}</span>}
        <span style={{ color: node.disabled ? theme.currentMode.tokens.colors.primary : theme.currentMode.tokens.colors.text, opacity: node.disabled ? 0.5 : 1 }}>
          {node.render ? node.render(node) : node.label}
        </span>
      </div>
      {hasChildren && (
        <div style={childrenContainerStyle}>
          {node.children!.map((child) => (
            <TreeNodeComponent
              key={child.key}
              node={child}
              level={level + 1}
              expanded={expanded && child.expanded}
              onExpand={onExpand}
              onCollapse={onCollapse}
              onNodeClick={onNodeClick}
              selectedNode={selectedNode}
              onNodeSelect={onNodeSelect}
              theme={theme}
              animationDuration={animationDuration}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Tree Component
 */
export const Tree: React.FC<TreeProps> = ({
  nodes,
  expandedNodes: controlledExpandedNodes = [],
  onExpand,
  onCollapse,
  onNodeClick,
  selectedNode,
  onNodeSelect,
  animationDuration = 300,
  className,
  style,
}) => {
  const themeContext = useTheme();
  const theme = (themeContext as any).currentMode?.tokens || (themeContext as any);
  const [internalExpandedNodes, setInternalExpandedNodes] = useState<string[]>(controlledExpandedNodes);

  const expandedNodes = controlledExpandedNodes.length > 0 ? controlledExpandedNodes : internalExpandedNodes;

  const handleExpand = (key: string) => {
    const newExpanded = [...expandedNodes, key];
    setInternalExpandedNodes(newExpanded);
    onExpand?.(key);
  };

  const handleCollapse = (key: string) => {
    const newExpanded = expandedNodes.filter((k) => k !== key);
    setInternalExpandedNodes(newExpanded);
    onCollapse?.(key);
  };

  const containerStyle = useMemo<React.CSSProperties>(() => {
    return {
      backgroundColor: theme.currentMode.tokens.colors.background,
      color: theme.currentMode.tokens.colors.text,
      borderRadius: '4px',
      overflow: 'hidden',
      ...style,
    };
  }, [theme, style]);

  return (
    <div className={className} style={containerStyle}>
      {nodes.map((node) => (
        <TreeNodeComponent
          key={node.key}
          node={node}
          level={0}
          expanded={expandedNodes.includes(node.key)}
          onExpand={handleExpand}
          onCollapse={handleCollapse}
          onNodeClick={onNodeClick || (() => {})}
          selectedNode={selectedNode}
          onNodeSelect={onNodeSelect || (() => {})}
          theme={theme}
          animationDuration={animationDuration}
        />
      ))}
    </div>
  );
};

Tree.displayName = 'Tree';

