import React, { type FC } from 'react';
import { useNavigate } from 'react-router-dom';

type TLayoutProps = {
    children: React.ReactNode;
    className?: string;
}

const Layout: FC<TLayoutProps> = ({ children, className }) => {
  const navigate = useNavigate();

  return (
    <div className={'layout'}>
      <header className={'header'}>
        <button
          type="button"
          className="header-logo"
          onClick={() => navigate('/')}
          aria-label="На главную"
        >
          <img src='../src/assets/logo.svg' alt='FLOWWOW'/>
        </button>
        <h1 className={'visually-hidden'}>FLOWWOW: ПИОНОВЫЙ ПРЕДСКАЗАТЕЛЬ</h1>
      </header>
      
      <main className={className}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
