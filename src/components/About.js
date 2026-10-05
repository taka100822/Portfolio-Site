import React from 'react';
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

const ABOUT_TEXT = [
  {
    heading: '自己紹介',
    body:
      `京都にある**大学院**で**ゲームのインタラクションに関する研究**を行いながら、ゲーム制作に取り組んでいます。
    また、**ゲーム制作団体「TOMSN」の代表**としてチームを率い、第2弾タイトルの開発を進めています。`,
  },
  {
    heading: 'これまでの経験',
    body:
      `個人でのゲーム開発からスタートし、**ゲームジャムの参加**や**「TOMSN」設立によるチーム開発・マネジメント**を経験してきました。さらに、**企業でのアルバイト・インターンシップ**で企画を実際の形にする経験を積んできました。
    また、**学会発表**に登壇するなど研究活動にも注力しています。加えて、**タイへ短期留学**を通じて、視野を広げました。`,
  },
  {
    heading: '目指すこと',
    body:
      `私は、ゲーム体験を通じて**人々の心に残り続ける価値**を届けたいと考えています。プレイした瞬間の楽しさにとどまらず、「出会えてよかった」と思えるような、**人生の中で意味を持つ体験**を生み出したいです。
    これまで、ゲーム制作や研究活動を通じてプレイヤー体験の設計に向き合い、実際に人の感情を動かす経験を積んできました。今後は、体験の根幹を設計し、**人々の記憶に残り続けるコンテンツ**を創り続けていきます。`,
  },
];

const HOBBIES = [
  { src: 'hobby/hobby-piano.jpg',  label: 'ピアノ' },
  { src: 'hobby/hobby-bike.jpg',   label: 'バイク' },
  { src: 'hobby/hobby-basket.jpg', label: 'バスケ' },
  { src: 'hobby/hobby-travel.jpg', label: '旅行' },
];

const IMAGE_BASE = `${process.env.PUBLIC_URL}/Image/`;

const About = () => (
  <section id="about" className="section about-section">
    <div className="container">
      <h2 className="section-title">About</h2>

      <div className="about-intro">
        <figure className="about-photo">
          <img src={`${IMAGE_BASE}me.jpeg`} alt="Taka10" />
          <figcaption>Taka10 / 27卒ゲームプランナー志望</figcaption>
        </figure>

        <div className="about-text">
          {ABOUT_TEXT.map(({ heading, body }) => (
            <div key={heading} className="about-block">
              <h3>{heading}</h3>
              <p>{renderText(body)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="about-skills">
        <h3 className="about-subheading">できること</h3>
        <dl className="skill-rows">
          {skillsData.map(({ title, items }) => (
            <div key={title} className="skill-row">
              <dt>{title}</dt>
              <dd>
                <ul>
                  {items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="about-hobbies">
        <h3 className="about-subheading">趣味</h3>
        <ul className="hobby-list">
          {HOBBIES.map(({ src, label }) => (
            <li key={label}>
              <img src={`${IMAGE_BASE}${src}`} alt="" loading="lazy" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default About;
