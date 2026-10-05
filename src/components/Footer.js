import React from 'react';
import { FaXTwitter } from 'react-icons/fa6';
import { FiArrowUp } from 'react-icons/fi';
import { linksData } from '../constants/links';
import './Footer.css';

const NAV_ITEMS = ['About', 'Works', 'Timeline', 'Links', 'Contact'];

const SOCIALS = [
  ...linksData.map(({ title, url, icon }) => ({ title, url, icon })),
  { title: 'X', url: 'https://twitter.com/Taka10822GC', icon: FaXTwitter },
];

const pad = (n) => String(n).padStart(2, '0');

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-row">
        <nav className="footer-nav" aria-label="フッターのページ内リンク">
          <ol>
            {NAV_ITEMS.map((name, i) => (
              <li key={name}>
                <a href={`#${name.toLowerCase()}`}>
                  <span className="footer-nav-num" aria-hidden="true">{pad(i + 1)}</span>
                  {name}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <ul className="footer-social">
          {SOCIALS.map(({ title, url, icon: Icon }) => (
            <li key={title}>
              <a href={url} target="_blank" rel="noopener noreferrer" aria-label={title} title={title}>
                <Icon aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="footer-row footer-bottom">
        <p className="footer-copy">© 2026 Taka10</p>
        <a className="footer-top" href="#top">
          ページの先頭へ
          <FiArrowUp aria-hidden="true" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
