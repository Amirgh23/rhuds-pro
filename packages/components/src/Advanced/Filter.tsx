import React, { useState, useCallback } from 'react';

export interface FilterOption {
  id: string;
  label: string;
  value: any;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range';
  options?: FilterOption[];
  min?: number;
  max?: number;
}

export interface FilterProps {
  groups: FilterGroup[];
  onFilterChange?: (filters: Record<string, any>) => void;
  onApply?: (filters: Record<string, any>) => void;
}

export const Filter: React.FC<FilterProps> = ({ groups, onFilterChange, onApply }) => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = useCallback(
    (groupId: string, value: any) => {
      const newFilters = { ...filters };

      if (groups.find((g) => g.id === groupId)?.type === 'checkbox') {
        const currentValues = newFilters[groupId] || [];
        if (currentValues.includes(value)) {
          newFilters[groupId] = currentValues.filter((v: any) => v !== value);
        } else {
          newFilters[groupId] = [...currentValues, value];
        }
      } else {
        newFilters[groupId] = value;
      }

      setFilters(newFilters);
      onFilterChange?.(newFilters);
    },
    [filters, groups, onFilterChange]
  );

  const handleApply = useCallback(() => {
    onApply?.(filters);
  }, [filters, onApply]);

  const handleReset = useCallback(() => {
    setFilters({});
    onFilterChange?.({});
  }, [onFilterChange]);

  const activeFilterCount = Object.values(filters).filter((v) => {
    if (Array.isArray(v)) return v.length > 0;
    return v !== undefined && v !== null && v !== '';
  }).length;

  return (
    <div
      style={{
        border: '1px solid #666',
        borderRadius: '8px',
        background: '#1a1a1a',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          padding: '15px',
          background: '#1a1a1a',
          border: 'none',
          borderBottom: isExpanded ? '1px solid #666' : 'none',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px',
        }}
      >
        <span>
          Filters{' '}
          {activeFilterCount > 0 && <span style={{ color: '#00ff00' }}>({activeFilterCount})</span>}
        </span>
        <span
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
          }}
        >
          ▼
        </span>
      </button>

      {isExpanded && (
        <div style={{ padding: '15px' }}>
          {groups.map((group) => (
            <div key={group.id} style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  color: '#00ff00',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  fontSize: '12px',
                }}
              >
                {group.label}
              </label>

              {group.type === 'checkbox' && group.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {group.options.map((option) => (
                    <label
                      key={option.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        color: '#aaa',
                        fontSize: '13px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={(filters[group.id] || []).includes(option.value)}
                        onChange={() => handleFilterChange(group.id, option.value)}
                        style={{ marginRight: '8px', cursor: 'pointer' }}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              )}

              {group.type === 'radio' && group.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {group.options.map((option) => (
                    <label
                      key={option.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        color: '#aaa',
                        fontSize: '13px',
                      }}
                    >
                      <input
                        type="radio"
                        name={group.id}
                        checked={filters[group.id] === option.value}
                        onChange={() => handleFilterChange(group.id, option.value)}
                        style={{ marginRight: '8px', cursor: 'pointer' }}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              )}

              {group.type === 'range' && (
                <div>
                  <input
                    type="range"
                    min={group.min || 0}
                    max={group.max || 100}
                    value={filters[group.id] || group.min || 0}
                    onChange={(e) => handleFilterChange(group.id, parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      cursor: 'pointer',
                    }}
                  />
                  <div
                    style={{
                      marginTop: '8px',
                      color: '#666',
                      fontSize: '12px',
                      textAlign: 'center',
                    }}
                  >
                    {filters[group.id] || group.min || 0}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginTop: '20px',
              paddingTop: '15px',
              borderTop: '1px solid #333',
            }}
          >
            <button
              onClick={handleApply}
              style={{
                flex: 1,
                padding: '10px',
                background: '#00ff00',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Apply
            </button>
            <button
              onClick={handleReset}
              style={{
                flex: 1,
                padding: '10px',
                background: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
