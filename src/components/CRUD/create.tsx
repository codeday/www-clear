import React, { useState } from 'react';
import { Box, BoxProps, Button, Heading, HeadingProps } from '@codeday/topo/Atom';
import { UiAdd } from '@codeday/topocons';
import { StrictRJSFSchema } from '@rjsf/utils';
import { UiSchema } from '@rjsf/chakra-ui';
import assert from 'assert';
import { ResultOf, TypedDocumentNode, VariablesOf } from '@graphql-typed-document-node/core';
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
  ClearEventCreatemanagersInput,
  ClearEventUpdatemanagersInput,
  ClearFloatFieldUpdateOperationsInput,
  ClearIntFieldUpdateOperationsInput,
  ClearNullableDateTimeFieldUpdateOperationsInput,
  ClearNullableIntFieldUpdateOperationsInput,
  ClearNullableStringFieldUpdateOperationsInput,
  ClearStringFieldUpdateOperationsInput,
  ClearWebhookType,
  CreateTicketMutation,
  InputMaybe,
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
import { DocumentType, graphql } from 'generated/gql';
import { CustomForm as Form } from './CustomForm/CustomForm';

export type ClearFieldUpdateInput =
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

export type Connect = { connect?: {} | null | undefined };
export type Create = { create?: {} | null | undefined };
export type CreateOrConnect = Create & Connect & { createOrConnect?: {} | null | undefined };

export type FieldTypes =
  | boolean
  | string
  | number
  | DateTime
  | ClearFieldUpdateInput
  | ClearEventCreatemanagersInput
  | Connect
  | Create
  | CreateOrConnect;

type ScalarToTypeString<T> = T extends string
  ? 'string'
  : T extends Number
  ? 'number'
  : T extends DateTime
  ? 'date-time'
  : T extends boolean
  ? 'boolean'
  : null;

type IsConnect<T> = T extends Connect ? 'connect' : null;
type IsCreate<T> = T extends Create ? 'create' : null;
type IsCreateMany<T> = T extends { createMany?: {} | null | undefined } ? 'createMany' : null;
type IsCreateOrConnect<T> = T extends CreateOrConnect ? 'createOrConnect' : null;
type IsArray<T> = T extends { set?: string[] | null | undefined } ? 'array' : null;

type IsUpdate<T> = T extends ClearFieldUpdateInput
  ? // eslint-disable-next-line no-use-before-define
    NonNullable<ScalarToTypeString<T['set']> | IsSpecialType<T['set']>>
  : null;
type IsSpecialType<T> = IsConnect<T> | IsCreate<T> | IsCreateOrConnect<T> | IsCreateMany<T> | IsArray<T> | IsUpdate<T>;

type ConnectConfig<T> = T extends Connect ? { id: string } | Array<{ id: string; name: string }> : never;

type CreateConfig<T> = T extends { create: {} }
  ? {
      // eslint-disable-next-line no-use-before-define
      fields: FieldConfiguration<T['create']>;
    }
  : never;

type CreateManyConfig<T> = CreateConfig<T>;

type ArrayConfig<T> = T extends { set: Array<infer A extends FieldTypes> }
  ? // eslint-disable-next-line no-use-before-define
    FieldConfiguration<A>
  : never;

export type StringIfEnum<T> = T extends string ? string : T;

export type FieldConfiguration<T = InputMaybe<FieldTypes | undefined>> =
  // T extends Array<infer A> ? { _type: 'array', items: FieldConfiguration<A> } :
  (T extends any | undefined ? { required?: boolean } : { required: true }) & {
    _type: NonNullable<IsSpecialType<T> | ScalarToTypeString<T>>;
    schema?: StrictRJSFSchema;
    uiSchema?: UiSchema;
    order?: number;
    title?: string;
  } & (IsArray<T> extends null ? {} : { items?: ArrayConfig<T> }) & // & ( ScalarToTypeString<T> extends never ? { _type: IsSpecialType<T> } : { _type: ScalarToTypeString<T> } )
    (IsConnect<T> extends null ? {} : { connect?: ConnectConfig<T> }) &
    // (IsCreate<T> extends null ? {} : { create?: CreateConfig<T> }) &
    // (IsCreateMany<T> extends null ? {} : { createMany?: CreateManyConfig<T> }) &
    (IsUpdate<T> extends null
      ? {}
      : T extends ClearFieldUpdateInput
      ? { update: true; schema: { default: T['set'] extends DateTime ? string : StringIfEnum<T['set']> } }
      : {});
// & ( IsConnectOrCreate<T> extends never ? {} : { connectOrCreate?: ConnectOrCreateConfig<T> } )

export type FieldsConfiguration<T extends TypedDocumentNode<any, any>> = {
  [Variable in keyof VariablesOf<T>]: {
    [Field in keyof Omit<
      VariablesOf<T>[Variable],
      Variable extends 'where' ? never : 'id' | 'metadata' | 'createdAt' | 'updatedAt'
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
  onSubmit?: (res: ResultOf<T>) => void;
} & BoxProps;

function makeField(field: FieldConfiguration, title: string): { schema: StrictRJSFSchema; uiSchema: UiSchema } {
  const titlePretty = field.title || camelToTilte(title);
  let schema: StrictRJSFSchema = { ...field.schema };
  let uiSchema: UiSchema = { ...field.uiSchema };
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
    const f = makeField(field.items as unknown as FieldConfiguration, '');
    schema.properties = {
      set: {
        title: '',
        description: titlePretty,
        type: 'array',
        items: { ...f.schema },
      },
    };
    uiSchema.set = { ...f.uiSchema };
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } else if (field._type === 'create') {
    // } else if (field._type === 'connectOrCreate') {
    // } else if (field._type === 'createMany') {
  } else {
    schema.type = 'null';
    schema.description = `unsupported: ${field._type}`;
  }
  // @ts-ignore
  if (field.update) {
    const setSchema = { ...schema };
    const setUiSchema = { ...uiSchema };
    if (field._type === 'array') {
      // this needs to be treated differently because otherwise it results in set.set
      schema = { ...setSchema.properties };
      uiSchema = { set: { ...setUiSchema.set } };
    } else {
      schema = {
        type: 'object',
        title: '',
        properties: {
          set: {
            ...setSchema,
          },
        },
      };
      // @ts-ignore
      schema.properties.set.type = [setSchema.type, 'null'];
      uiSchema = { set: { ...setUiSchema } };
    }
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
          const fieldSchema = makeField(fields[variable][field] as FieldConfiguration, field.toString());
          // @ts-ignore
          assert(schema.properties[variable].properties !== undefined);
          // @ts-ignore
          schema.properties[variable].properties[field] = { ...fieldSchema.schema };
          uiSchema[variable][field] = { ...fieldSchema.uiSchema };
        }
      }
    }
  }
  console.log(fields, schema, uiSchema);
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
                  const res = await client.mutation(mutation, { ...formData });
                  if (onSubmit) onSubmit(res);
                  setIsSubmitting(false);
                  if (res.error) {
                    error(res.error.name, res.error.message);
                  } else {
                    success('Created!');
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
