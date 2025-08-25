import useScrollAnimation from '../hooks/useScrollAnimation';

const BroadcastCard = ({ broadcast, delay = 0 }) => {
  const ref = useScrollAnimation();

  return (
    <div 
      ref={ref}
      className="broadcast-card scale-in" 
      style={{ transitionDelay: `${delay}s` }}
    >
      <iframe
        data-testid="embed-iframe"
        style={{ borderRadius: '12px' }}
        src={broadcast.spotifyUrl}
        width="100%"
        height="152"
        frameBorder="0"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title={broadcast.title}
      ></iframe>
    </div>
  );
};

export default BroadcastCard;