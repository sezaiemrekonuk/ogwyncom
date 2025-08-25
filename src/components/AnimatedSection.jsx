import useScrollAnimation from '../hooks/useScrollAnimation';

const AnimatedSection = ({ 
  children, 
  className = '', 
  animationType = 'reveal-up',
  delay = 0 
}) => {
  const ref = useScrollAnimation();

  return (
    <div 
      ref={ref}
      className={`${animationType} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;