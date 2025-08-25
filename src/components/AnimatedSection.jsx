import useScrollAnimation from '../hooks/useScrollAnimation';

const AnimatedSection = ({ 
  children, 
  className = '', 
  animationType = 'reveal-up',
  delay = 0,
  id,
  ...restProps
}) => {
  const ref = useScrollAnimation();

  return (
    <div 
      ref={ref}
      id={id}
      className={`${animationType} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
      {...restProps}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;