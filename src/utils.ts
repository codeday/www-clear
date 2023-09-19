import assert from 'assert';
import { JSONSchema7Type } from 'json-schema';
import { DateTime } from 'luxon';
import { TypedDocumentNode } from 'urql';
import { InputMaybe } from 'generated/gql/graphql';
import { ClearFieldUpdateInput, Connect, Create, CreateOrConnect, FieldConfiguration, FieldsConfiguration } from './components/CRUD/create';

export function camelToTilte(string: string): string {
  // https://stackoverflow.com/a/7225450
  const result = string.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export type KeysMatching<T extends object, V> = {
  [K in keyof T]-?: T[K] extends V | undefined ? K : never;
}[keyof T];

export type BaseFieldsConfiguration<T extends TypedDocumentNode<any, { data: any }>> = Pick<
  FieldsConfiguration<T>['data'],
  KeysMatching<FieldsConfiguration<T>['data'], { _type: 'string' | 'number' | 'date-time' | 'array' | 'boolean' }>
>;

export function injectUpdateFields<T extends BaseFieldsConfiguration<TypedDocumentNode<{}, { data: any }>>>(
  createFields: T,
  object: {
    [P in keyof T]: T[P] extends FieldConfiguration<infer A> | undefined
      ? A extends { set?: infer B }
        ? A extends DateTime
          ? A
          : B
        : A extends Connect | CreateOrConnect | Create
        ? never
        : A
      : T[P];
  },
): {
  [P in keyof T]: T[P] & {
    update: true;
    schema: { default: JSONSchema7Type };
  };
} {
  const out: ReturnType<typeof injectUpdateFields> = {};
  for (const field in createFields) {
    if (Object.hasOwn(object, field)) {
      const val = object[field];
      const fc = createFields[field];
      if (fc._type === 'array' && !Array.isArray(val)) {
        throw new Error('Array field error');
      } else if (Array.isArray(val) && fc._type !== 'array') {
        throw new Error('Non array field error');
      } else if (fc._type === 'connect' || fc._type === 'create' || fc._type === 'createOrConnect') {
        throw new Error('creation types should not be used in standard fields');
      }

      // @ts-ignore
      out[field] = {
        ...fc,
        update: true,
        schema: {
          ...fc.schema,
          default: DateTime.isDateTime(val) ? val.toISO() : val === undefined ? null : val,
        },
      };
    }
  }
  // @ts-ignore
  return out;
}
