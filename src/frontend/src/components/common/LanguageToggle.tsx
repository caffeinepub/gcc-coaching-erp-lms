import { Button } from '@/components/ui/button';
import { useTranslation } from '../../i18n/I18nProvider';

export default function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      className="font-medium"
    >
      {language === 'en' ? 'हिन्दी' : 'EN'}
    </Button>
  );
}
