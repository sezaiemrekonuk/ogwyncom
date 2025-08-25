import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Bulletin from './pages/Bulletin';
import Broadcast from './pages/Broadcast';
import Hub from './pages/Hub';
import Store from './pages/Store';
import OgwynAI from './pages/OgwynAI';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Article from './pages/Article';
import NotFound from './pages/NotFound';
import CMS from './pages/CMS';
import FirestoreAdmin from './components/FirestoreAdmin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* CMS Routes - No Layout wrapper */}
          <Route path="/cms/*" element={<CMS />} />
          
          {/* Public Routes - With Layout wrapper */}
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/bulten" element={<Bulletin />} />
                <Route path="/broadcast" element={<Broadcast />} />
                <Route path="/hub" element={<Hub />} />
                <Route path="/magaza" element={<Store />} />
                <Route path="/ogwyn-ai" element={<OgwynAI />} />
                <Route path="/iletisim" element={<Contact />} />
                <Route path="/gizlilik-politikasi" element={<PrivacyPolicy />} />
                <Route path="/article/:slug" element={<Article />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;