import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://graph.codeday.org",
  documents: ["src/**/*.tsx", "src/**/*.gql"],
  generates: {
    "schema.graphql": {
      plugins: ["schema-ast"]
    },
    "src/graphql/types.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
    // "src/graphql/fields.ts": {
    //   plugins: ['plugin-fieldTypeObjects.ts']
    // },
    "src/gql/": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
