// Test the JSX transpiler

function transpileJSX(code: string): string {
  let result = code;

  // Handle JSX expressions - convert <Component prop={value} /> to React.createElement(Component, {prop: value})
  // This is a simplified transpiler that handles basic JSX patterns

  // First, handle self-closing tags with attributes
  result = result.replace(/<(\w+)([^/>]*)\/>/g, (match, tagName, attrs) => {
    const props = parseAttributes(attrs);
    const isComponent = /^[A-Z]/.test(tagName);
    const componentRef = isComponent ? tagName : `'${tagName}'`;
    return `React.createElement(${componentRef}, ${props})`;
  });

  // Handle opening and closing tags
  result = result.replace(/<(\w+)([^>]*)>([\s\S]*?)<\/\1>/g, (match, tagName, attrs, children) => {
    const props = parseAttributes(attrs);
    const isComponent = /^[A-Z]/.test(tagName);
    const componentRef = isComponent ? tagName : `'${tagName}'`;
    const childrenStr = children.trim() ? `, ${children}` : '';
    return `React.createElement(${componentRef}, ${props}${childrenStr})`;
  });

  return result;
}

function parseAttributes(attrString: string): string {
  if (!attrString.trim()) {
    return 'null';
  }

  const attrs: Record<string, string> = {};
  const attrRegex = /(\w+)(?:=(?:{([^}]*)}|"([^"]*)"|'([^']*)'|(\w+)))?/g;
  let match;

  while ((match = attrRegex.exec(attrString)) !== null) {
    const key = match[1];
    const value = match[2] || match[3] || match[4] || match[5] || 'true';
    attrs[key] = value;
  }

  if (Object.keys(attrs).length === 0) {
    return 'null';
  }

  const propsStr = Object.entries(attrs)
    .map(([key, value]) => {
      // If value looks like a JS expression (starts with { or is a variable), use it as-is
      if (value.startsWith('{') || /^[a-zA-Z_$][\w$]*$/.test(value)) {
        return `${key}: ${value}`;
      }
      // Otherwise, treat it as a string
      return `${key}: "${value}"`;
    })
    .join(', ');

  return `{${propsStr}}`;
}

// Test cases
const test1 = '<div>Hello</div>';
console.log('Test 1:', transpileJSX(test1));
// Expected: React.createElement('div', null, Hello)

const test2 = '<Component prop="value" />';
console.log('Test 2:', transpileJSX(test2));
// Expected: React.createElement(Component, {prop: "value"})

const test3 = '<div style={{ color: "red" }}>Text</div>';
console.log('Test 3:', transpileJSX(test3));
// Expected: React.createElement('div', {style: { color: "red" }}, Text)
