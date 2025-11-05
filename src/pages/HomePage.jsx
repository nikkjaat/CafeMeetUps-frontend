import Hero from '../components/Hero';
import Categories from '../components/Categories';
import HowItWorks from '../components/HowItWorks';
import SuccessStories from '../components/SuccessStories';
import Blog from '../components/Blog';
import About from '../components/About';
import Footer from '../components/Footer';

const HomePage = ({ navigate }) => {
  return (
    <>
      <Hero navigate={navigate} />
      <Categories navigate={navigate} showLimited={true} />
      <HowItWorks navigate={navigate} />
      <SuccessStories navigate={navigate} showLimited={true} />
      <Blog navigate={navigate} showLimited={true} />
      <About />
      <Footer />
    </>
  );
};

export default HomePage;