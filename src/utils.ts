import { JSONSchema7Type } from 'json-schema';
import { DateTime } from 'luxon';
import { ClearFieldUpdateInput, FieldConfiguration } from './components/CRUD/create';

export function camelToTilte(string: string): string {
  // https://stackoverflow.com/a/7225450
  const result = string.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function injectUpdateFields(
  createFields: { [key: string]: FieldConfiguration },
  object: { [P in keyof typeof createFields]: ClearFieldUpdateInput['set'] },
): {
  [P in keyof typeof createFields]: (typeof createFields)[P] & {
    update: true;
    schema: { default: JSONSchema7Type };
  };
} {
  const out: { [key: string]: FieldConfiguration<ClearFieldUpdateInput> } = {};
  for (const field in createFields) {
    if (Object.hasOwn(object, field)) {
      const val = object[field];
      if (createFields[field]._type === 'array' && !Array.isArray(val)) {
        throw new Error('Array field error');
      } else if (Array.isArray(val) && createFields[field]._type !== 'array') {
        throw new Error('Non array field error');
      }
      out[field] = {
        ...createFields[field],
        update: true,
        // @ts-ignore - this is safe due to the checks above
        schema: {
          ...createFields[field].schema,
          default: DateTime.isDateTime(val) ? val.toISO() : val === undefined ? null : val,
        },
      };
    }
  }
  // @ts-ignore - this is safe due to the checks above
  return out;
}
