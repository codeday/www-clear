import React, { useState } from 'react';
import { Box, BoxProps, Button, Text, Heading, HeadingProps } from '@codeday/topo/Atom';
import { useColorModeValue } from '@codeday/topo/Theme';
import { UiAdd, UiX } from '@codeday/topocons';
import { StrictRJSFSchema } from '@rjsf/utils';
import { UiSchema } from '@rjsf/chakra-ui';
import assert from 'assert';
import { TypedDocumentNode, VariablesOf } from '@graphql-typed-document-node/core';
import { OperationDefinitionNode } from 'graphql';
import { DateTime } from 'luxon';
import { camelToTilte } from 'src/utils';
import { client } from 'src/urqlclient';
import {
  ClearBoolFieldUpdateOperationsInput,
  ClearDateTimeFieldUpdateOperationsInput,
  ClearEnumDiscountTypeFieldUpdateOperationsInput,
  ClearEnumEmailWhenFromFieldUpdateOperationsInput,
  ClearEnumTicketTypeFieldUpdateOperationsInput,
  ClearEnumWebhookServiceFieldUpdateOperationsInput,
  ClearEventUpdatemanagersInput,
  ClearFloatFieldUpdateOperationsInput,
  ClearIntFieldUpdateOperationsInput,
  ClearNullableDateTimeFieldUpdateOperationsInput,
  ClearNullableIntFieldUpdateOperationsInput,
  ClearNullableStringFieldUpdateOperationsInput,
  ClearStringFieldUpdateOperationsInput,
} from 'generated/gql/graphql';
import {
  ButtonProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useToasts } from '@codeday/topo/utils';
import { CustomForm as Form } from './CustomForm/CustomForm';

type ClearFieldUpdateInput =
  | ClearStringFieldUpdateOperationsInput
  | ClearDateTimeFieldUpdateOperationsInput
  | ClearBoolFieldUpdateOperationsInput
  | ClearEnumTicketTypeFieldUpdateOperationsInput
  | ClearEnumEmailWhenFromFieldUpdateOperationsInput
  | ClearNullableStringFieldUpdateOperationsInput
  | ClearNullableIntFieldUpdateOperationsInput
  | ClearNullableDateTimeFieldUpdateOperationsInput
  | ClearEnumDiscountTypeFieldUpdateOperationsInput
  | ClearFloatFieldUpdateOperationsInput
  | ClearIntFieldUpdateOperationsInput
  | ClearEnumWebhookServiceFieldUpdateOperationsInput
  | ClearEnumWebhookServiceFieldUpdateOperationsInput
  | ClearEventUpdatemanagersInput;

type ScalarToTypeString<T> = T extends string
  ? 'string'
  : T extends number
  ? 'number'
  : T extends DateTime
  ? 'date-time'
  : T extends boolean
  ? 'boolean'
  : null;

// "T extends object?" feels redundant, and there's probably a better solution to this, but otherwise this doesn't work for optional special types
type IsConnect<T> = T extends object ? ('connect' extends keyof T ? 'connect' : null) : null;
type IsCreate<T> = T extends object ? ('create' extends keyof T ? 'create' : null) : null;
type IsCreateMany<T> = T extends object ? ('createMany' extends keyof T ? 'createMany' : null) : null;
type IsConnectOrCreate<T> = T extends object ? ('connectOrCreate' extends keyof T ? 'connectOrCreate' : null) : null;
type IsArray<T> = T extends object
  ? 'set' extends keyof T
    ? T['set'] extends Array<any>
      ? 'array'
      : null
    : null
  : null;
type IsUpdate<T> = T extends ClearFieldUpdateInput ? 'update' : null;
type IsSpecialType<T> = ScalarToTypeString<T> extends null
  ? IsConnect<T> | IsCreate<T> | IsConnectOrCreate<T> | IsCreateMany<T> | IsArray<T> | IsUpdate<T>
  : null;

type ConnectConfig<T> = { id: string } | Array<{ id: string; name: string }>;

type CreateConfig<T> = 'create' extends keyof T
  ? {
      // eslint-disable-next-line no-use-before-define
      fields: FieldConfiguration<T['create']>;
    }
  : never;

type CreateManyConfig<T> = CreateConfig<T>;

type ArrayConfig<T> = T extends object
  ? 'set' extends keyof T
    ? T['set'] extends Array<infer A>
      ? // eslint-disable-next-line no-use-before-define
        FieldConfiguration<A>
      : never
    : never
  : never;

// eslint-disable-next-line no-use-before-define
type UpdateConfig<T extends ClearFieldUpdateInput> = FieldConfiguration<T['set']> & {
  // @ts-ignore
  // eslint-disable-next-line prettier/prettier
  schema: { default: (typeof T['set']) extends DateTime ? string : T['set'] };
};

type FieldConfiguration<T> =
  // T extends Array<infer A> ? { _type: 'array', items: FieldConfiguration<A> } :
  (T extends undefined ? { required?: boolean } : { required: true }) & {
    _type: NonNullable<IsSpecialType<T> | ScalarToTypeString<T>>;
    schema?: StrictRJSFSchema;
    uiSchema?: UiSchema;
    order?: number;
    title?: string;
  } & (IsArray<T> extends null ? {} : { items?: ArrayConfig<T> }) & // & ( ScalarToTypeString<T> extends never ? { _type: IsSpecialType<T> } : { _type: ScalarToTypeString<T> } )
    (IsConnect<T> extends null ? {} : { connect?: ConnectConfig<T> }) &
    (IsCreate<T> extends null ? {} : { create?: CreateConfig<T> }) &
    (IsCreateMany<T> extends null ? {} : { createMany?: CreateManyConfig<T> }) &
    (IsUpdate<T> extends null ? {} : T extends ClearFieldUpdateInput ? { set: UpdateConfig<T> } : {});
// & ( IsConnectOrCreate<T> extends never ? {} : { connectOrCreate?: ConnectOrCreateConfig<T> } )

type FieldsConfiguration<T extends TypedDocumentNode<any, any>> = {
  [Variable in keyof VariablesOf<T>]: {
    [Field in keyof Omit<
      VariablesOf<T>[Variable],
      Variable extends 'where' ? undefined : 'id' | 'metadata' | 'createdAt' | 'updatedAt'
    >]: FieldConfiguration<VariablesOf<T>[Variable][Field]>;
  };
};

/**
 * @param headingProps - this only exists to allow cosmetic fixing of an annoying stylistic bug with hidden fields (relevant when transparently connecting an object).
 * there is absolutely a better way to fix this but I don't have the time
 */
export type CreateModalProps<T extends TypedDocumentNode<any, any>> = {
  mutation: T;
  fields: FieldsConfiguration<T>;
  title?: string;
  headingProps?: HeadingProps;
  buttonProps?: ButtonProps;
  compact?: boolean;
  openButtonIcon?: React.ReactNode;
  onSubmit?: (formData: FormData) => void;
} & BoxProps;

function makeField(field: FieldConfiguration<any>, title: string): { schema: StrictRJSFSchema; uiSchema: UiSchema } {
  const titlePretty = field.title || camelToTilte(title);
  const schema: StrictRJSFSchema = field.schema || {};
  const uiSchema: UiSchema = field.uiSchema || {};
  schema.title = titlePretty;
  if (field._type === 'string') {
    schema.type = 'string';
  } else if (field._type === 'number') {
    schema.type = 'number';
    uiSchema['ui:widget'] ??= 'updown';
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } else if (field._type === 'date-time') {
    schema.type = 'string';
    schema.format = 'date-time';
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } else if (field._type === 'boolean') {
    schema.type = 'boolean';
  } else if (field._type === 'array') {
    schema.type = 'object';
    schema.title = '';
    // @ts-ignore
    const f = makeField(field.items as unknown as FieldConfiguration<any>, '');
    schema.properties = {
      set: {
        title: '',
        description: titlePretty,
        type: 'array',
        items: f.schema,
      },
    };
    uiSchema.set = f.uiSchema;
  } else if (field._type === 'connect') {
    if (!field.connect) throw new Error('Field with connect type must have connect key');
    schema.title = '';
    if (field.connect instanceof Array) {
      schema.properties = {
        connect: {
          type: 'object',
          title: '',
          properties: {
            id: {
              title: titlePretty,
              type: 'string',
              oneOf: field.connect.map((c) => ({ const: c.id, title: c.name })),
            },
          },
        },
      };
      uiSchema.connect = {
        id: {
          'ui:options': {
            chakra: {
              mb: '-8',
            },
          },
        },
      };
    } else {
      // if an array isn't passed, we will force this value and hide it from the user
      schema.properties = {
        connect: {
          type: 'object',
          title: '',
          properties: {
            id: {
              type: 'string',
              default: field.connect.id,
              writeOnly: true,
            },
          },
        },
      };
      uiSchema.connect = {
        id: {
          'ui:widget': 'hidden',
        },
      };
    }
  } else if (field._type === 'create') {
  } else if (field._type === 'connectOrCreate') {
  } else if (field._type === 'createMany') {
  } else if (field._type === 'update') {
    schema.type = 'object';
    schema.title = '';
    // @ts-ignore
    const f = makeField(field.set, title);
    // @ts-ignore
    if (field.set._type === 'array') {
      // this needs to be treated differently because otherwise it results in set.set
      schema.properties = f.schema.properties;
      uiSchema.set = f.uiSchema.set;
    } else {
      schema.properties = {
        set: f.schema,
      };
      // @ts-ignore
      schema.properties.set.type = [f.schema.type, 'null'];
      uiSchema.set = f.uiSchema;
    }
  } else {
    schema.type = 'null';
    schema.description = `unsupported: ${field._type}`;
  }
  return {
    schema,
    uiSchema,
  };
}

function makeFormProps<T extends TypedDocumentNode>(
  fields: FieldsConfiguration<T>,
): { schema: StrictRJSFSchema; uiSchema: UiSchema } {
  const schema: StrictRJSFSchema = {
    type: 'object',
    properties: {},
    required: [],
  };
  const uiSchema: UiSchema = {};
  for (const variable in fields) {
    if (Object.hasOwn(fields, variable)) {
      assert(schema.properties !== undefined);
      schema.properties[variable] = {
        type: 'object',
        title: '',
        properties: {},
        required: [],
      };
      uiSchema[variable] = {};
      for (const field in fields[variable]) {
        if (Object.hasOwn(fields[variable], field)) {
          // @ts-ignore
          assert(Array.isArray(schema.properties[variable].required));
          // @ts-ignore
          if (fields[variable][field].required) schema.properties[variable].required.push(field);
          // @ts-ignore
          const fieldSchema = makeField(fields[variable][field] as FieldConfiguration<any>, field.toString());
          // @ts-ignore
          assert(schema.properties[variable].properties !== undefined);
          // @ts-ignore
          schema.properties[variable].properties[field] = fieldSchema.schema;
          uiSchema[variable][field] = fieldSchema.uiSchema;
        }
      }
    }
  }
  console.log(uiSchema);
  return {
    schema,
    uiSchema,
  };
}

export function CreateModal<T extends TypedDocumentNode<any, any>>({
  mutation,
  fields,
  children,
  title: t,
  headingProps,
  buttonProps,
  compact = false,
  openButtonIcon: openButton,
  onSubmit,
  ...props
}: CreateModalProps<T>) {
  const [formData, setFormData] = useState<FormData>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const operation = mutation.definitions[0] as OperationDefinitionNode;
  const { success, error } = useToasts();
  const title = t || camelToTilte(operation.name?.value.replace(new RegExp(operation.operation, 'i'), '') || 'unknown');
  return (
    <Box display="inline" m={1} {...props}>
      <Button onClick={onOpen} {...buttonProps}>
        <>
          {openButton || <UiAdd />}
          {!compact && <>&nbsp;{title}</>}
        </>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading {...headingProps}>{title}</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form
              {...makeFormProps(fields)}
              showErrorList={false}
              autoComplete="off"
              liveValidate
              disabled={isSubmitting}
              formData={formData}
              onChange={(e) => setFormData(e.formData)}
              onSubmit={async () => {
                if (formData) {
                  setIsSubmitting(true);
                  if (onSubmit) onSubmit(formData);
                  const res = await client.mutation(mutation, { ...formData });
                  setIsSubmitting(false);
                  if (res.error) {
                    error(res.error.name, res.error.message);
                  }
                  onClose();
                }
              }}
            >
              <Button type="submit">{title}</Button>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
