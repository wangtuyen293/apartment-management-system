import { Carousel } from "react-bootstrap";
import banner1 from "../assets/images/banner/banner1.jpg";
import banner2 from "../assets/images/banner/banner2.jpg";
import banner3 from "../assets/images/banner/banner3.jpg";
import "../assets/css/Banner.css"

const Banner = () => {
    return (
        <>
            <Carousel fade>
                <Carousel.Item>
                    <div className="carousel-image">
                        <img
                            className="d-block w-100"
                            src={banner1}
                            alt="Banner FPT Plaza 1"
                            style={{ height: "100vh", objectFit: "cover" }}
                        />
                    </div>
                    <Carousel.Caption className="carousel-text">
                        <h3>Welcome to FPT Plaza</h3>
                        <p>Find your dream apartment today</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <div className="carousel-image">
                        <img
                            className="d-block w-100"
                            src={banner2}
                            alt="Banner FPT Plaza 1"
                            style={{ height: "100vh", objectFit: "cover" }}
                        />
                    </div>
                    <div className="carousel-overlay"></div>
                    <Carousel.Caption className="carousel-text">
                        <h3>Luxury Living Awaits</h3>
                        <p>Explore our premium apartments</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={banner3}
                        alt="Banner FPT Plaza 1"
                        style={{ height: "100vh", objectFit: "cover" }}
                    />
                    <Carousel.Caption className="carousel-text">
                        <h3>Perfect Place, Perfect Life</h3>
                        <p>
                            The best living experience in the heart of the city
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </>
    );
};

export default Banner;
