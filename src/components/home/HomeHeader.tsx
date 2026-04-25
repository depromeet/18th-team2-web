import hapalinLogo from '@/assets/images/hapalin-logo.png';
import iconPerson from '@/assets/icons/icon-person.svg';

export function HomeHeader() {
  return (
    <header className="flex h-11.5 items-center justify-between px-4">
      <img src={hapalinLogo} alt="해파링 로고" className="h-7.5" />
      <img src={iconPerson} alt="프로필" className="h-6 w-6" />
    </header>
  );
}
