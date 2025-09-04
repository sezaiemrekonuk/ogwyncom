import Header from './Header';
import Footer from './Footer';
import { ImageLoadingProvider } from '../hooks/useImageLoader.jsx';
import GlobalImageLoader from './GlobalImageLoader';

const Layout = ({ children }) => {
  return (
    <ImageLoadingProvider>
      <Header />
      <main>{children}</main>
      <Footer />
      <GlobalImageLoader />
    </ImageLoadingProvider>
  );
};

export default Layout;