import React, { useState, useEffect } from 'react';
import { ConsoleMessage } from './hooks/useConsoleCapture';
import './PlaygroundConsole.css';

interface PlaygroundConsoleProps {
  messages: ConsoleMessage[];
  onClear: () => void;
}

export function PlaygroundConsole({ messages, onClear }: PlaygroundConsoleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'log' | 'warn' | 'error'>('all');
  const [expandedMessages, setExpandedMessages] = useState<Set<number>>(new Set());
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredMessages = messages.filter((msg) => filter === 'all' || msg.type === filter);

  const errorCount = messages.filter((m) => m.type === 'error').length;
  const warnCount = messages.filter((m) => m.type === 'warn').length;

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'error':
        return '#FF6B6B';
      case 'warn':
        return '#FFD93D';
      case 'info':
        return '#6BCB77';
      default:
        return '#A8DADC';
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warn':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📝';
    }
  };

  const toggleMessageExpand = (idx: number) => {
    const newExpanded = new Set(expandedMessages);
    if (newExpanded.has(idx)) {
      newExpanded.delete(idx);
    } else {
      newExpanded.add(idx);
    }
    setExpandedMessages(newExpanded);
  };

  const truncateMessage = (msg: string, maxLength: number = 200) => {
    return msg.length > maxLength ? msg.substring(0, maxLength) + '...' : msg;
  };

  return (
    <div className={`playground-console ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="console-header">
        <button
          className="console-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? '▼' : '▶'} Console
        </button>

        <div className="console-stats">
          {errorCount > 0 && <span className="stat error-stat">❌ {errorCount}</span>}
          {warnCount > 0 && <span className="stat warn-stat">⚠️ {warnCount}</span>}
          <span className="stat total-stat">📝 {messages.length}</span>
        </div>

        {isExpanded && (
          <div className="console-controls">
            <select
              className="console-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">All</option>
              <option value="log">Logs</option>
              <option value="warn">Warnings</option>
              <option value="error">Errors</option>
            </select>
            <button className="console-clear" onClick={onClear} title="Clear Console">
              Clear
            </button>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="console-content">
          {filteredMessages.length === 0 ? (
            <div className="console-empty">
              <span>No messages</span>
            </div>
          ) : (
            <div className="console-messages">
              {filteredMessages.map((msg, idx) => {
                const isExpanded = expandedMessages.has(idx);
                const displayMessage = isExpanded ? msg.message : truncateMessage(msg.message);
                const isLong = msg.message.length > 200;

                return (
                  <div
                    key={idx}
                    className="console-message"
                    style={{ borderLeftColor: getMessageColor(msg.type) }}
                  >
                    <span className="message-icon">{getMessageIcon(msg.type)}</span>
                    <span className="message-type">{msg.type.toUpperCase()}</span>
                    <span className="message-text">{displayMessage}</span>
                    {isLong && (
                      <button
                        className="message-expand-btn"
                        onClick={() => toggleMessageExpand(idx)}
                        title={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? '▲' : '▼'}
                      </button>
                    )}
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
