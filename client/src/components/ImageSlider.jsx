import Slider from "react-slick";


const ImageSlider = () => {
  const images = [
    "https://cdn.shopify.com/s/files/1/0840/8370/3830/articles/1667509251-saja-beraam-a7xy_sd1a8w-unsplash.jpg?v=1714646794",
    "https://your-other-images.com/image2.jpg",
    "https://your-other-images.com/image3.jpg",
    "https://your-other-images.com/image4.jpg",
    "https://your-other-images.com/image5.jpg",
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-full mx-auto">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index}>
            <img
              src={src}
              alt={`Image ${index + 1}`}
              className="w-full h-96 object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
