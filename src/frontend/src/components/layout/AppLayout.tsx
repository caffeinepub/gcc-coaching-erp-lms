import { ReactNode, useState } from 'react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from '../../i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Heart } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import LanguageToggle from '../common/LanguageToggle';
import AdminNav from './AdminNav';
import StudentNav from './StudentNav';
import TeacherNav from './TeacherNav';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isAdmin, isStudent, isTeacher, userProfile } = useCurrentUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    if (isAdmin) {
      navigate({ to: '/admin' });
    } else if (isTeacher) {
      navigate({ to: '/teacher' });
    } else if (isStudent) {
      navigate({ to: '/student' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                {isAdmin && <AdminNav onNavigate={() => setMobileMenuOpen(false)} />}
                {isTeacher && <TeacherNav onNavigate={() => setMobileMenuOpen(false)} />}
                {isStudent && <StudentNav onNavigate={() => setMobileMenuOpen(false)} />}
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <button onClick={handleLogoClick} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/assets/generated/app-logo.dim_512x512.png" alt={t('brand.name')} className="h-8 w-8" />
              <span className="font-bold text-lg hidden sm:inline">{t('brand.name')}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {userProfile && (
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {t('common.welcome')}, {userProfile.name}
              </span>
            )}
            <LanguageToggle />
            <LoginButton />
          </div>
        </div>
      </header>

      <div className="container flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 py-6 pr-6">
          <nav className="sticky top-20">
            {isAdmin && <AdminNav />}
            {isTeacher && <TeacherNav />}
            {isStudent && <StudentNav />}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 py-6">{children}</main>
      </div>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {t('brand.copyright')}. Built with{' '}
            <Heart className="inline h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
