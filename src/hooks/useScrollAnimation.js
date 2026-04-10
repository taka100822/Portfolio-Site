import { useInView } from 'react-intersection-observer';

const useScrollAnimation = (options = {}) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
    ...options,
  });
  return [ref, inView];
};

export default useScrollAnimation;
