import React from 'react';
import { motion } from 'framer-motion';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { slideInLeftVariants, staggerContainer, titleMotionProps } from '../constants/animations';
import { timelineData, getTypeColor, getTypeLabel } from '../constants/timeline';
import './Timeline.css';

const Timeline = () => {
  const [ref, inView] = useScrollAnimation();

  return (
    <section id="timeline" className="section timeline-section" ref={ref}>
      <div className="container">
        <motion.h2 className="section-title" {...titleMotionProps(inView)}>
          Timeline
        </motion.h2>

        <motion.div
          className="timeline"
          variants={staggerContainer(0.3)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <div className="timeline-line" />

          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              variants={slideInLeftVariants}
            >
              <div
                className="timeline-content"
                style={{ '--type-color': getTypeColor(item.type) }}
              >
                <div className="timeline-header">
                  <div className="timeline-date">
                    <span className="year">{item.year}</span>
                    <span className="month">/  {item.month}</span>
                  </div>
                  <span className="type-badge">{getTypeLabel(item.type)}</span>
                </div>

                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-description">{item.description}</p>

                <div className="timeline-details">
                  {item.details.map((detail) => (
                    <span key={detail} className="detail-tag">{detail}</span>
                  ))}
                </div>

                {item.noteLink && (
                  <div className="timeline-link">
                    <a href={item.noteLink} target="_blank" rel="noopener noreferrer" className="note-link">
                      📝 noteで詳しく見る
                    </a>
                  </div>
                )}
              </div>

              <div
                className="timeline-dot"
                style={{ backgroundColor: getTypeColor(item.type) }}
              >
                <item.icon />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Timeline;
