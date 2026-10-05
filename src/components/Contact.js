import React from 'react';
import { FaXTwitter } from 'react-icons/fa6';
import './Contact.css';

const Contact = () => (
  <section id="contact" className="section contact-section">
    <div className="container">
      <h2 className="section-title">Contact</h2>

      <div className="contact-main">
        <p className="contact-lead">
          ゲームプランナー新卒採用に関するご相談や、ポートフォリオについてのご質問は X の DM でお受けしています。
          ゲームジャムやインターンシップへのお誘いも歓迎です。
        </p>

        <a
          className="contact-x"
          href="https://twitter.com/Taka10822GC"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaXTwitter className="contact-x-icon" aria-hidden="true" />
          <span>
            <span className="contact-x-label">X で DM を送る</span>
            <span className="contact-x-handle">@taka10822GC</span>
          </span>
        </a>
      </div>
    </div>
  </section>
);

export default Contact;
