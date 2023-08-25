// eslint-disable-next-line node/no-unpublished-import
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  debug: false,
  overwrite: true,
  ignoreNoDocuments: true,
  schema: 'https://graph.codeday.org',
  documents: ['src/**/*.tsx', 'src/**/*.ts'],
  generates: {
    'generated/gql/schema.graphql': {
      plugins: ['schema-ast'],
    },
    // 'generated/gql/mock.ts': {
    //   plugins: ['typescript-mock-data'],
    //   config: {
    //     terminateCircularRelationships: true,
    //     typesFile: './graphql.ts',
    //     prefix: 'mock',
    //     enumValues: 'keep',
    //     typeNames:  'keep',
    //     defaultScalarType: 'never',
    //     defaultNullableToNull: true,
    //     scalars: {
    //       ClearDateTime: 'luxon#DateTime',
    //     }
    //   },
    // },
    'generated/gql/urql-introspection.json': {
      plugins: ['urql-introspection'],
      config: {
        includeScalars: true,
      },
    },
    'generated/gql/': {
      preset: 'client',
      presetConfig: {
        skipTypename: false,
        // fragmentMasking: false
        fragmentMasking: {
          unmaskFunctionName: 'getFragmentData',
        },
      },
      config: {
        namingConvention: 'keep',
        // nonOptionalTypename: true,
        defaultScalarType: 'never', // This is set to never as a way to get an error when an enum isn't implemented, without
        // using `strictScalars` because that would require us to define a bunch of Scalars that are never actually needed
        scalars: {
          ClearDateTime: 'types/scalars#ClearDateTime',
          ClearJSON: 'types/scalars#ClearJSON',
        },
      },
    },
  },
};

export default config;
