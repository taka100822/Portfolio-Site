import React from 'react';
import { motion } from 'framer-motion';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { fadeUpVariants, staggerContainer, titleMotionProps } from '../constants/animations';
import { skillsData } from '../constants/skills';
import './Skills.css';

const Skills = () => {
  const [ref, inView] = useScrollAnimation();

  return (
    <section id="skills" className="section" ref={ref}>
      <div className="container">
        <motion.h2 className="section-title" {...titleMotionProps(inView)}>
          Skills
        </motion.h2>

        <motion.div
          className="skills-grid"
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {skillsData.map((skill) => (
            <motion.div
              key={skill.title}
              className="skill-card"
              variants={fadeUpVariants}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{ '--skill-color': skill.color }}
            >
              <div className="skill-icon-wrap">
                <skill.icon />
              </div>
              <div className="skill-body">
                <h3 className="skill-title">{skill.title}</h3>
                <p className="skill-description">{skill.description}</p>
                <div className="skill-details">
                  {skill.details.map((detail) => (
                    <span key={detail} className="skill-tag">{detail}</span>
                  ))}
                </div>
              </div>
              <div
                className="skill-glow"
                style={{ background: `radial-gradient(ellipse at 0% 50%, ${skill.color}18 0%, transparent 65%)` }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
