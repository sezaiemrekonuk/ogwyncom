import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import servicesData from '../data/services.json';

const ServiceCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const services = servicesData.services;
  const totalCards = services.length;

  const updateCarousel = () => {
    // This will be handled by CSS classes
  };

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % totalCards);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + totalCards) % totalCards);
  };

  const getCardClass = (index) => {
    let newIndex = index - currentIndex;
    
    if (newIndex < -Math.floor(totalCards / 2)) { 
      newIndex += totalCards; 
    }
    if (newIndex > Math.floor(totalCards / 2)) { 
      newIndex -= totalCards; 
    }

    switch (newIndex) {
      case 0: return 'active';
      case 1: return 'next';
      case -1: return 'prev';
      case 2: return 'far-next';
      case -2: return 'far-prev';
      default: return 'hidden';
    }
  };

  return (
    <div className="hizmetler-carousel-container">
      <div className="hizmetler-carousel">
        {services.map((service, index) => (
          <div
            key={service.id}
            className={`service-card ${getCardClass(index)}`}
            data-service={service.id}
            style={{ backgroundImage: `url('${service.image}')` }}
          >
            <div className="service-card-default">
              <h3>{service.title}</h3>
            </div>
            <div className="service-card-hover">
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="carousel-navigation">
        <button 
          className="nav-btn prev-btn" 
          aria-label="Önceki"
          onClick={prevSlide}
        >
          <ChevronLeft />
        </button>
        <button 
          className="nav-btn next-btn" 
          aria-label="Sonraki"
          onClick={nextSlide}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ServiceCarousel;