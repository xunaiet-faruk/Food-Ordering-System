import Footer from "../../Shared/Footer";
import Banner from "./Banner";
import Categories from "./Categories";
import Features from "./Features";
import Testimonials from "./Testimonials";

const Home = () => {
    return (
        <div className=" bg-gradient-to-br from-orange-50 via-white to-pink-50  overflow-hidden container mx-auto w-full">
            <Banner />
            <Categories/>
            <Features/>
            <Testimonials/>
            <Footer/>
        </div>
    );
};

export default Home;