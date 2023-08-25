export default {
  baseDir: '.',
  schema: ['generated/gql/schema.graphql'],
  documents: ['src/**/*.{ts,tsx}'],
  languageService: {
    enableValidation: false, // To prevent conflicts with graphql-eslint, although i dont think this option actually works
  },
};
