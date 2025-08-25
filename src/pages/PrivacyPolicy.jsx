import AnimatedSection from '../components/AnimatedSection';

const PrivacyPolicy = () => {
  return (
    <div className="article-page">
      <AnimatedSection>
        <header className="article-header">
          <h1>Gizlilik Politikası</h1>
        </header>
      </AnimatedSection>
      
      <AnimatedSection>
        <article className="article-content">
          <section>
            <h2>Kişisel Verilerin Korunması</h2>
            <p>
              OGW Marketing Studio olarak, kişisel verilerinizin güvenliği bizim için son derece önemlidir. 
              Bu gizlilik politikası, kişisel verilerinizin nasıl toplandığı, işlendiği ve korunduğu hakkında 
              bilgi vermektedir.
            </p>
          </section>
          
          <section>
            <h2>Toplanan Bilgiler</h2>
            <p>
              Web sitemizi ziyaret ettiğinizde veya hizmetlerimizi kullandığınızda, 
              size daha iyi hizmet verebilmek için bazı kişisel bilgilerinizi toplayabiliriz.
            </p>
          </section>
          
          <section>
            <h2>Bilgilerin Kullanımı</h2>
            <p>
              Toplanan bilgiler yalnızca hizmet kalitemizi artırmak, 
              size özel içerikler sunmak ve yasal yükümlülüklerimizi yerine getirmek için kullanılır.
            </p>
          </section>
          
          <section>
            <h2>İletişim</h2>
            <p>
              Gizlilik politikamız hakkında sorularınız varsa, 
              bizimle iletişime geçmekten çekinmeyin.
            </p>
          </section>
        </article>
      </AnimatedSection>
    </div>
  );
};

export default PrivacyPolicy;