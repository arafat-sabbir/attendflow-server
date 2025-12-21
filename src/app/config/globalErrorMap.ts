import { z } from 'zod';

// Title-case helper
const toTitleCase = (s: string) =>
  s
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_\-]/g, ' ')
    .replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
    .trim();

z.config({
  customError: (issue) => {
    const path = Array.isArray(issue.path) ? issue.path : [];
    const field = path.length ? toTitleCase(String(path[path.length - 1])) : 'Field';

    switch (issue.code) {
      case 'invalid_type':
        if (issue.input === undefined) {
          return `${field} is required`;
        }
        return `${field} must be a ${issue.expected}`;

      case 'too_small':
        if (issue.type === 'string' && issue.minimum === 1) {
          return `${field} cannot be empty`;
        }
        return `${field} must have at least ${issue.minimum} ${issue.type}${issue.minimum === 1 ? '' : 's'
          }`;

      case 'too_big':
        return `${field} must have at most ${issue.maximum} ${issue.type}${issue.maximum === 1 ? '' : 's'
          }`;

      case 'unrecognized_keys':
        return `Unrecognized key(s): ${(issue.keys || []).join(', ')}`;

      case 'invalid_union':
        return `${field} does not match any allowed type`;

      case 'invalid_value':
        if (!issue.input) {
          return `${field} is required`;
        }
        if (issue.values && issue.values.length > 0) {
          return `${field} must be one of: ${issue.values.join(', ')}`;
        }
        return `${field} has an invalid value`;

      default:
        return 'Invalid input';
    }
  },
});
