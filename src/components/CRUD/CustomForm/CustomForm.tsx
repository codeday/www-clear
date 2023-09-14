import Form, { withTheme } from '@rjsf/core';
import { Theme } from '@rjsf/chakra-ui';
import SelectWidget from './SelectWidget';
import UpDownWidget from './UpDownWidget';

if (Theme.widgets) {
  Theme.widgets.SelectWidget = SelectWidget;
  Theme.widgets.UpDownWidget = UpDownWidget;
}

export const CustomForm: typeof Form = withTheme(Theme);
