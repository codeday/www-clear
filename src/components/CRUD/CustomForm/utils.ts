// This is a copy of https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/chakra-ui/src/utils.ts as this file is not exported
import { ChakraProps, shouldForwardProp } from '@chakra-ui/react';
import { UiSchema } from '@rjsf/utils';

type ChakraUiOptions = UiSchema['ui:options'] & { chakra?: ChakraProps };

export interface ChakraUiSchema extends Omit<UiSchema, 'ui:options'> {
  // eslint-disable-next-line sonarjs/no-duplicate-string
  'ui:options'?: ChakraUiOptions;
}

interface GetChakraProps {
  uiSchema?: ChakraUiSchema;
}

export function getChakra({ uiSchema = {} }: GetChakraProps): ChakraProps {
  const chakraProps = (uiSchema['ui:options'] && uiSchema['ui:options'].chakra) || {};

  Object.keys(chakraProps).forEach((key) => {
    /**
     * Leveraging `shouldForwardProp` to remove props
     *
     * This is a utility function that's used in `@chakra-ui/react`'s factory function.
     * Normally, it prevents ChakraProps from being passed to the DOM.
     * In this case we just want to delete the unknown props. So we flip the boolean.
     */
    if (shouldForwardProp(key)) {
      delete (chakraProps as any)[key];
    }
  });

  return chakraProps;
}
