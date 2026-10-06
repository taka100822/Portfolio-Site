import React, { useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n';
import './Header.css';

const NAV_ITEMS = [
  { name: 'About', href: '#about' },
  { name: 'Works', href: '#works' },
  { name: 'Timeline', href: '#timeline' },
  { name: 'Links', href: '#links' },
  { name: 'Contact', href: '#contact' },
];

const pad = (n) => String(n).padStart(2, '0');

const Header = () => {
  const headerRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(null);
  const { lang, setLang, t } = useLang();

  // スクロール量と読み進めた割合（下端の進捗線に使う）
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      setScrolled(window.scrollY > 50);
      headerRef.current?.style.setProperty('--progress', progress.toFixed(4));
    };
    const handleScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // 画面中央にあるセクションのナビを点灯させる
  useEffect(() => {
    const sections = NAV_ITEMS
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((section) => observer.observe(section));

    const clearAtTop = () => {
      if (window.scrollY < window.innerHeight * 0.5) setActive(null);
    };
    window.addEventListener('scroll', clearAtTop, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', clearAtTop);
    };
  }, []);

  // メニューを開いている間は背面をスクロールさせない・Esc で閉じる
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      ref={headerRef}
      className={`header ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'is-open' : ''}`}
    >
      <div className="header-inner">
        <a className="header-logo" href="#top" onClick={closeMenu}>
          <img
            className="header-mark"
            src={`${process.env.PUBLIC_URL}/Image/favicon.png`}
            alt=""
            width="36"
            height="36"
          />
          <span className="header-logo-text">
            <span className="header-logo-name">Taka10</span>
            <span className="header-logo-sub">PORTFOLIO</span>
          </span>
        </a>

        <button
          type="button"
          className="header-lang"
          lang={lang === 'ja' ? 'en' : 'ja'}
          aria-label={lang === 'ja' ? 'Switch to English' : '日本語に切り替える'}
          onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
        >
          <span className={lang === 'ja' ? 'is-current' : ''}>JA</span>
          <span className="header-lang-sep" aria-hidden="true">/</span>
          <span className={lang === 'en' ? 'is-current' : ''}>EN</span>
        </button>

        <button
          className="header-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          aria-label={menuOpen ? t('メニューを閉じる') : t('メニューを開く')}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <nav id="site-nav" className="header-nav" aria-label={t('ページ内リンク')}>
          <ol>
            {NAV_ITEMS.map((item, i) => (
              <li key={item.name} style={{ '--i': i }}>
                <a
                  href={item.href}
                  onClick={closeMenu}
                  className={active === item.href ? 'is-active' : ''}
                  aria-current={active === item.href ? 'location' : undefined}
                >
                  <span className="header-nav-num" aria-hidden="true">{pad(i + 1)}</span>
                  <span className="header-nav-name">{item.name}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <span className="header-progress" aria-hidden="true" />
    </header>
  );
};

export default Header;
