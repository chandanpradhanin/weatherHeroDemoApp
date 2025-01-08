import LocalizedStrings from 'react-native-localization';
import english from './english';
import spanish from './spanish';

let strings = new LocalizedStrings({
  en: english,
  es: spanish,
});

(async () => {})();

export default strings;
