import React, { type FC } from 'react';

type TLayoutProps = {
    children: React.ReactNode;
    className?: string;
}

const Layout: FC<TLayoutProps> = ({ children,className }) => {
  return (
    <div className={'layout'}>
      <header className={'header'}>
        <div>
          <img src='../src/assets/logo.svg' alt='FLOWWOW'/>
        </div>
        <h1 className={'visually-hidden'}>FLOWWOW: ПИОНОВЫЙ ПРЕДСКАЗАТЕЛЬ</h1>
      </header>
      
      <main className={className}>
        {children}
      </main>
    </div>
  );
};

export default Layout;