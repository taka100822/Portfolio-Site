import React from 'react';
import { useInView } from 'react-intersection-observer';
import { skillsData } from '../constants/skills';
import './About.css';

const renderText = (text) => text.split('\n').map((line, i, arr) => (
  <span key={i}>
    {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
    )}
    {i < arr.length - 1 && <br />}
  </span>
));

const ABOUT_TEXT = {
  intro:
    `**京都工芸繊維大学大学院**で**ゲーム × AI**に関する研究を行いながら、
    ゲーム制作に取り組んでいます。
    また、**ゲーム制作団体「TOMSN」の代表**としてチームを率い、
    第2弾タイトルの開発を進めています。`,
  history:
    `個人開発からスタートし、**ゲームジャムでの受賞**や**「TOMSN」団体設立**による
    **チーム開発・マネジメント**を経験してきました。
    さらに、**企業でのアルバイト・インターンシップ**で経験を積んできました。
    また、**学会発表**に登壇するなど研究活動にも注力しています。
    加えて、**タイへ短期留学**を通じて、視野を広げました。`,
  vision:
    `私は、ゲーム体験を通じて**人々の心に残り続ける価値**を届けたいと考えています。
    プレイした瞬間の楽しさにとどまらず、「出会えてよかった」と思えるような、
    **人生の中で意味を持つ体験**を生み出したいです。
    今後は体験の根幹を設計し、**人々の記憶に残り続けるコンテンツ**を創り続けていきます。`,
};

const HOBBIES = [
  { src: 'hobby/hobby-piano.jpg',  label: 'ピアノ' },
  { src: 'hobby/hobby-bike.jpg',   label: 'バイク' },
  { src: 'hobby/hobby-basket.jpg', label: 'バスケ' },
  { src: 'hobby/hobby-travel.jpg', label: '旅行' },
  { src: 'hobby/hobby-dog.jpg',    label: 'わんちゃん' },
];

const IMAGE_BASE = `${process.env.PUBLIC_URL}/Image/`;

// 企画書の1項目。右の余白に青ペンの注釈が書き込まれる
const Row = ({ label, note, className = '', children }) => {
  const [ref, inView] = useInView({ threshold: 0.4, triggerOnce: true });

  return (
    <div ref={ref} className={`gdd-row ${className} ${inView ? 'is-marked' : ''}`}>
      <dt className="gdd-label">{label}</dt>
      <dd className="gdd-content">{children}</dd>
      {note && (
        <dd className="gdd-note">
          <svg className="gdd-note-arrow" viewBox="0 0 48 24" aria-hidden="true">
            <path d="M46 14 C 34 4, 20 18, 4 12 M4 12 L 12 6 M4 12 L 11 19" />
          </svg>
          <span>{note}</span>
        </dd>
      )}
    </div>
  );
};

const About = () => (
  <section id="about" className="section about-section">
    <div className="container">
      <h2 className="section-title">About</h2>

      <article className="gdd">
        <header className="gdd-header">
          <span className="gdd-doc-type">GAME DESIGN DOCUMENT</span>
          <span className="gdd-doc-meta">企画書 / 作成：Taka10</span>
        </header>

        <dl className="gdd-rows">
          <Row label="タイトル" note="大学院生です" className="gdd-row-title">
            <figure className="gdd-photo">
              <img src={`${IMAGE_BASE}me.jpeg`} alt="Taka10" />
            </figure>
            <div>
              <p className="gdd-title">Taka10</p>
              <p className="gdd-subtitle">27卒 / ゲームプランナー志望</p>
            </div>
          </Row>

          <Row label="コンセプト" note="ブレない軸">
            <p className="gdd-concept">人生の一部となる体験を創造する。</p>
          </Row>

          <Row label="概要" note="第2弾開発中">
            <p className="gdd-text">{renderText(ABOUT_TEXT.intro)}</p>
          </Row>

          <Row label="経緯" note="様々な経験！">
            <p className="gdd-text">{renderText(ABOUT_TEXT.history)}</p>
          </Row>

          <Row label="搭載スキル" note="企画もしつつ、開発も可能です">
            <ul className="gdd-skills">
              {skillsData.map(({ title, icon: CategoryIcon, items }) => (
                <li key={title} className="gdd-skill">
                  <h4 className="gdd-skill-title">
                    <span className="gdd-skill-icon"><CategoryIcon aria-hidden="true" /></span>
                    {title}
                  </h4>
                  <ul className="gdd-skill-items">
                    {items.map(({ name, icon: ItemIcon }) => (
                      <li key={name}>
                        <ItemIcon aria-hidden="true" />
                        {name}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Row>

          <Row label="今後の展望" note="2027年春に、　ゲーム企画職で入社予定！">
            <p className="gdd-text">{renderText(ABOUT_TEXT.vision)}</p>
          </Row>

          <Row label="趣味" note="幅広く取り組んでいます">
            <ul className="hobby-list">
              {HOBBIES.map(({ src, label }) => (
                <li key={label}>
                  <img src={`${IMAGE_BASE}${src}`} alt="" loading="lazy" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </Row>
        </dl>
      </article>
    </div>
  </section>
);

export default About;
