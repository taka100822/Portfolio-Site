import React from 'react';
import { FaXTwitter } from 'react-icons/fa6';
import { FiArrowUpRight } from 'react-icons/fi';
import { useLang } from '../i18n';
import './Contact.css';

const LEAD = `ゲームプランナー採用に関するご相談や、
ポートフォリオについてのご質問は X の DM でお受けしています。
ゲームジャムやインターンシップへのお誘いも歓迎です。`;

const Contact = () => {
  const { t } = useLang();

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <h2 className="section-title">Contact</h2>

        <div className="contact-body">
          <p className="contact-lead">
            {t(LEAD).split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </React.Fragment>
            ))}
          </p>

          <a
            className="contact-link"
            href="https://twitter.com/Taka10822GC"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact-link-logo" aria-hidden="true">
              <FaXTwitter />
            </span>
            <span className="contact-link-text">
              <span className="contact-link-label">{t('X の DM で連絡する')}</span>
              <span className="contact-link-handle">@taka10822GC</span>
            </span>
            <FiArrowUpRight className="contact-link-arrow" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
