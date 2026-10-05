import React, { useEffect, useState } from 'react';
import './Header.css';

const NAV_ITEMS = [
  { name: 'About', href: '#about' },
  { name: 'Works', href: '#works' },
  { name: 'Timeline', href: '#timeline' },
  { name: 'Links', href: '#links' },
  { name: 'Contact', href: '#contact' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'is-open' : ''}`}>
      <div className="header-inner">
        <a className="header-logo" href="#top" onClick={closeMenu}>Taka10</a>

        <button
          className="header-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <nav id="site-nav" className="header-nav" aria-label="ページ内リンク">
          {NAV_ITEMS.map((item) => (
            <a key={item.name} href={item.href} onClick={closeMenu}>{item.name}</a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
