import 'moment/locale/hu';

import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import huHU from 'antd/lib/locale/hu_HU';
import { pick as _pick } from 'lodash-es';
import moment from 'moment';
import React, { ReactElement } from 'react';
import { IntlShape, RawIntlProvider } from 'react-intl';

import intl, { createIntl } from '../../lib/intl';

interface OwnProps {
  children: ReactElement | ReactElement[];
}
type Locale = 'hu' | 'en';
interface ComponentState {
  intl: IntlShape;
  locale: Locale;
}
interface StateProps {
  locale: Locale;
}

type Props = StateProps & OwnProps;

const antLocale = {
  hu: huHU,
  en: enUS,
};

class LanguageProvider extends React.Component<Props> {
  state = {
    intl: intl(),
    locale: 'en',
  };
  static defaultProps = {
    locale: 'en',
  };
  static getDerivedStateFromProps(
    props: Props,
    state: ComponentState,
  ): Partial<ComponentState> | null {
    if (props.locale !== state.locale) {
      moment.locale(props.locale);
      createIntl(_pick(props, ['locale']));
      return {
        intl: intl(),
        locale: props.locale,
      };
    }
    return null;
  }
  render(): React.ReactNode {
    const { locale, children } = this.props;
    return (
      <RawIntlProvider value={this.state.intl}>
        <ConfigProvider locale={antLocale[locale]}>{children}</ConfigProvider>
      </RawIntlProvider>
    );
  }
}

export default LanguageProvider;
