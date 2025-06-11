import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGamepad, FaUnity, FaChartBar, FaUsers, FaCode, FaPencilRuler, FaTools, FaLayerGroup } from 'react-icons/fa';
import './Skills.css';

const Skills = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const skills = [
    {
      icon: FaGamepad,
      title: 'Game Planning',
      description: 'ゲーム企画・仕様書作成',
      details: ['企画立案', '仕様書作成', 'バランス調整', 'レベルデザイン', 'ローカライズ'],
      color: '#ef4444'
    },
    {
      icon: FaUnity,
      title: 'Unity Development',
      description: 'Unity 2D/3D開発',
      details: ['Unity Engine', 'C# Scripting', 'プロトタイプ作成', 'デバッグ'],
      color: '#3b82f6'
    },
    {
      icon: FaChartBar,
      title: 'Data Analysis',
      description: 'データ分析・ユーザー行動解析',
      details: ['Excel分析', 'R', 'UEQ', '多重比較（Bonferroni, Tukey）'],
      color: '#10b981'
    },
    {
      icon: FaUsers,
      title: 'Team Management',
      description: 'チーム開発・進行管理',
      details: ['プロジェクト管理', 'スケジュール調整', 'コミュニケーション', 'プレゼンテーション'],
      color: '#f59e0b'
    },
    {
      icon: FaCode,
      title: 'Technical Skills',
      description: 'プログラミング・技術スキル',
      details: ['C', 'C#', 'Python', 'kotlin', 'Vue.js', 'Nuxt.js', 'Git/GitHub'],
      color: '#8b5cf6'
    },
    {
      icon: FaLayerGroup,
      title: 'Other Skills',
      description: 'その他スキル',
      details: ['Blender', 'Google Workspace', 'Slack', 'Discord', 'Notion'],
      color: '#ec4899'
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="skills" className="section" ref={ref}>
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          Skills
        </motion.h2>

        <motion.div
          className="skills-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="skill-card card"
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="skill-icon" style={{ color: skill.color }}>
                <skill.icon />
              </div>
              
              <h3 className="skill-title">{skill.title}</h3>
              <p className="skill-description">{skill.description}</p>
              
              <div className="skill-details">
                {skill.details.map((detail, detailIndex) => (
                  <span key={detailIndex} className="skill-tag">
                    {detail}
                  </span>
                ))}
              </div>

              <div className="skill-glow" style={{ background: `radial-gradient(circle, ${skill.color}20 0%, transparent 70%)` }}></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;