import { createIntl as _createIntl, createIntlCache, IntlConfig, IntlShape } from 'react-intl';

/*const onError = config.REACT_INTL_VERBOSE
  ? (message: string) => {
      if (!message.startsWith('[React Intl] Missing message:')) {
        // eslint-disable-next-line no-console
        console.error(message)
      }
    }
  : () => null*/
const onError = () => null;

const intlConfig: Partial<IntlConfig> = {
  onError,
  textComponent: 'span',
};

const cache = createIntlCache();

let intl = _createIntl(
  {
    locale: 'en',
    messages: {},
    ...intlConfig,
  },
  cache,
);
function createIntl(config: IntlConfig): void {
  intl = _createIntl({ ...config, ...intlConfig }, cache);
}
const get = (): IntlShape => intl;
export default get;
export { createIntl };
