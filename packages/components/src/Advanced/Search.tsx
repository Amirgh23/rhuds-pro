import React, { useRef, useState, useCallback, useEffect } from 'react';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
}

export interface SearchProps {
  onSearch?: (query: string) => Promise<SearchResult[]>;
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
  debounceMs?: number;
  maxResults?: number;
}

export const Search: React.FC<SearchProps> = ({
  onSearch,
  onResultSelect,
  placeholder = 'Search...',
  debounceMs = 300,
  maxResults = 10,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout>();

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        if (onSearch) {
          const searchResults = await onSearch(searchQuery);
          setResults(searchResults.slice(0, maxResults));
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [onSearch, maxResults]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      setShowResults(true);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        performSearch(value);
      }, debounceMs);
    },
    [performSearch, debounceMs]
  );

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      setQuery(result.title);
      setShowResults(false);
      setResults([]);

      if (!history.includes(result.title)) {
        setHistory([result.title, ...history].slice(0, 5));
      }

      onResultSelect?.(result);
    },
    [history, onResultSelect]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #666',
          borderRadius: '8px',
          padding: '10px 15px',
          background: '#1a1a1a',
        }}
      >
        <span style={{ color: '#666', marginRight: '10px' }}>🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontSize: '14px',
          }}
        />
        {query && (
          <button
            onClick={handleClear}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {showResults && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '5px',
            background: '#1a1a1a',
            border: '1px solid #666',
            borderRadius: '8px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          {isLoading && (
            <div style={{ padding: '15px', textAlign: 'center', color: '#666' }}>Loading...</div>
          )}

          {!isLoading && results.length > 0 && (
            <div>
              {results.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #333',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#333';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ color: '#00ff00', fontWeight: 'bold' }}>{result.title}</div>
                  {result.description && (
                    <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
                      {result.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!isLoading && results.length === 0 && query && (
            <div style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
              No results found
            </div>
          )}

          {!isLoading && results.length === 0 && !query && history.length > 0 && (
            <div>
              <div style={{ padding: '10px 15px', color: '#666', fontSize: '12px' }}>
                Recent Searches
              </div>
              {history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setQuery(item);
                    performSearch(item);
                  }}
                  style={{
                    padding: '10px 15px',
                    borderBottom: '1px solid #333',
                    cursor: 'pointer',
                    color: '#aaa',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#333';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  🕐 {item}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
