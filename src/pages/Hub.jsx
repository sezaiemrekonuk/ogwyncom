import AnimatedSection from '../components/AnimatedSection';

const Hub = () => {
  return (
    <>
      <AnimatedSection 
        animationType="content-section" 
        style={{ paddingTop: '12rem', paddingBottom: '6rem' }}
      >
        <a href="#" className="section-tag">OGW HUB</a>
        <h1 className="page-title">Dijital Ekosistemimizin<br />Kalbi: OGW HUB</h1>
        <p className="section-description">
          Tüm dijital operasyonlarınızı tek merkezden yönetebileceğiniz, 
          veriye dayalı kararlar alabileceğiniz ve ekibinizle kolayca işbirliği yapabileceğiniz platform.
        </p>
      </AnimatedSection>

      <div className="ai-features-container">
        <div className="ai-feature-block">
          <div className="ai-feature-image" style={{ backgroundImage: "url('images/team-crm.jpg')" }}></div>
          <div className="ai-feature-text">
            <h3>Ekip Yönetimi & CRM</h3>
            <p>
              Projelerinizi, ekip üyelerinizi ve müşteri ilişkilerinizi tek platformda yönetin. 
              Gerçek zamanlı işbirliği araçları ve akıllı görev dağılımı ile verimliliğinizi artırın.
            </p>
          </div>
        </div>

        <div className="ai-feature-block reverse">
          <div className="ai-feature-image" style={{ backgroundImage: "url('images/trends.jpg')" }}></div>
          <div className="ai-feature-text">
            <h3>Trend Analizi & İçgörüler</h3>
            <p>
              Sektörünüzdeki en güncel trendleri takip edin, rakip analizleri yapın ve 
              yapay zeka destekli öngörülerle bir adım önde olun.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hub;