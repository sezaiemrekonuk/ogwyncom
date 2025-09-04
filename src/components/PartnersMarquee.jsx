import partnersData from '../data/partners.json';
import ImageLoader from './ImageLoader';

const PartnersMarquee = () => {
  const partners = partnersData.partners;
  // Duplicate partners for seamless scrolling
  const duplicatedPartners = [...partners, ...partners];

  return (
    <div className="hero-partners-wrapper">
      <div className="partners-marquee reveal-up">
        <div className="partners-track">
          {duplicatedPartners.map((partner, index) => (
            <ImageLoader
              key={`${partner.id}-${index}`}
              src={partner.logo}
              alt={`${partner.name} Logo`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnersMarquee;