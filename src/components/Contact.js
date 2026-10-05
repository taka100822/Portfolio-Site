import React from 'react';
import { FaXTwitter } from 'react-icons/fa6';
import { linksData } from '../constants/links';
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

      <div className="contact-links">
        <h3>ほかの場所での活動</h3>
        <ul>
          {linksData.map((link) => (
            <li key={link.title}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <link.icon className="contact-link-icon" aria-hidden="true" />
                <span className="contact-link-title">{link.title}</span>
                <span className="contact-link-desc">{link.description}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default Contact;
