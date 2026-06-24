import Banner from "./Banner";
import Categories from "./Categories";
import Features from "./Features";
import Testimonials from "./Testimonials";

const Home = () => {
    return (
        <div className="container mx-auto">
            <Banner />
            <Categories/>
            <Features/>
            <Testimonials/>
         
        </div>
    );
};

export default Home;