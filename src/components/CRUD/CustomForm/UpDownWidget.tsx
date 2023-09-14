import { FocusEvent } from 'react';
import {
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  FormControl,
  FormLabel,
} from '@codeday/topo/Atom';
import {
  ariaDescribedByIds,
  labelValue,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from '@rjsf/utils';
import { getChakra } from './utils';

// Copy of https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/chakra-ui/src/UpDownWidget/UpDownWidget.tsx
// Primary reason for modification is to include the `precision` parameter in `NumberInput` (this improves UX)

function precision(a: number): number {
  if (!Number.isFinite(a)) return 0;
  let e = 1;
  let p = 0;
  while (Math.round(a * e) / e !== a) {
    e *= 10;
    p += 1;
  }
  return p;
}

export default function UpDownWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>(
  props: WidgetProps<T, S, F>,
) {
  const {
    id,
    uiSchema,
    readonly,
    disabled,
    label,
    hideLabel,
    value,
    onChange,
    onBlur,
    onFocus,
    rawErrors,
    required,
    schema,
  } = props;

  const chakraProps = getChakra({ uiSchema });

  const _onChange = (value: string | number) => onChange(value);
  const _onBlur = ({ target: { value } }: FocusEvent<HTMLInputElement | any>) => onBlur(id, value);
  const _onFocus = ({ target: { value } }: FocusEvent<HTMLInputElement | any>) => onFocus(id, value);

  return (
    <FormControl
      mb={1}
      {...chakraProps}
      isDisabled={disabled || readonly}
      isRequired={required}
      isReadOnly={readonly}
      isInvalid={rawErrors && rawErrors.length > 0}
    >
      {labelValue(
        <FormLabel fontWeight="normal" htmlFor={id}>
          {label}
        </FormLabel>,
        hideLabel || !label,
      )}
      <NumberInput
        value={value ?? ''}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        aria-describedby={ariaDescribedByIds<T>(id)}
        precision={schema.multipleOf ? precision(schema.multipleOf) : undefined}
        min={schema.minimum}
        max={schema.maximum}
      >
        <NumberInputField id={id} name={id} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </FormControl>
  );
}
