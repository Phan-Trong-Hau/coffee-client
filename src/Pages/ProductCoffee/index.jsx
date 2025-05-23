import { useEffect, useState } from 'react';
import Breadcrumb from '../../Components/Breadcrumb';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ProductApi } from '../../Api/product';
import { Image } from 'cloudinary-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { CartApi } from '../../Api/cart';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './ProductCoffee.scss';

const mainIngredients = [
  {
    image: {
      src: 'https://res.cloudinary.com/ok-but-first-coffee/image/upload/v1729966125/Mornin_Brazil_Nuts_mmr1re.png',
      alt: 'Mornin Brazil Nuts',
    },
    icon: {
      src: 'https://res.cloudinary.com/ok-but-first-coffee/image/upload/v1729966124/Mornin_-Icon1_de3lb1.png',
      alt: 'Mornin Icon',
    },
    name: 'Brazil Nuts',
    subtext: 'The most important',
  },
  {
    image: {
      src: 'https://res.cloudinary.com/ok-but-first-coffee/image/upload/v1729966125/Mornin_grapefruit_zahntg.png',
      alt: 'Mornin Grapefruit',
    },
    icon: {
      src: 'https://res.cloudinary.com/ok-but-first-coffee/image/upload/v1729966125/Mornin_-icon2_j2cric.png',
      alt: 'Mornin Icon',
    },
    name: 'grapefruit',
    subtext: 'Fresh and healthy',
  },
  {
    image: {
      src: 'https://res.cloudinary.com/ok-but-first-coffee/image/upload/v1729966125/Mornin_Oak_efbzso.png',
      alt: 'Mornin Oak',
    },
    icon: {
      src: 'https://res.cloudinary.com/ok-but-first-coffee/image/upload/v1729966124/Mornin_-icon3_fzgicq.png',
      alt: 'Mornin Icon',
    },
    name: 'Oak',
    subtext: 'Rich in Nutrients',
  },
];

const additionalIngredients = [
  {
    image: {
      src: 'https://res.cloudinary.com/ok-but-first-coffee/image/upload/v1730449660/mornin-coffee_czc32d.svg',
      alt: 'Mornin coffee',
    },
    name: 'Specialty Grade Coffee',
  },
  {
    image: {
      src: 'https://res.cloudinary.com/ok-but-first-coffee/image/upload/v1730449659/mornin-crafted_b0jkkg.svg',
      alt: 'Mornin crafted',
    },
    name: 'Responsibly sourced',
  },
  {
    image: {
      src: 'https://res.cloudinary.com/ok-but-first-coffee/image/upload/v1730449659/mornin-arabica_zgtr8l.svg',
      alt: 'Mornin arabica',
    },
    name: '100% Arabica',
  },
  {
    image: {
      src: 'https://res.cloudinary.com/ok-but-first-coffee/image/upload/v1730449658/mornin-altitute_yit8oq.svg',
      alt: 'Mornin altitute',
    },
    name: 'High altitude',
  },
  {
    image: {
      src: 'https://res.cloudinary.com/ok-but-first-coffee/image/upload/v1730449659/mornin-origin_mbpak4.svg',
      alt: 'Mornin origin',
    },
    name: 'Single Origin',
  },
  {
    image: {
      src: 'https://res.cloudinary.com/ok-but-first-coffee/image/upload/v1730449660/mornin-artisan_hvp0ap.svg',
      alt: 'Mornin artisan',
    },
    name: 'Small Batch Artisan Roasted',
  },
  {
    image: {
      src: 'https://res.cloudinary.com/ok-but-first-coffee/image/upload/v1730449659/mornin-responsible_xd8d8v.svg',
      alt: 'Mornin responsible',
    },
    name: 'Hand crafted',
  },
  {
    image: {
      src: 'https://res.cloudinary.com/ok-but-first-coffee/image/upload/v1730449659/mornin-location_x9kykq.svg',
      alt: 'Mornin location',
    },
    name: 'Exotic Farm Location',
  },
];

const ProductDetail = () => {
  const [product, setProduct] = useState({});
  const [imageSingle, setImageSingle] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [bagSize, setBagSize] = useState(0);
  const [grind, setGrind] = useState('');
  const [notification, setNotification] = useState({
    show: false,
    message: '',
  });
  const navigate = useNavigate();
  const handleChangeImageSingle = (image) => {
    setImageSingle(image);
  };

  const params = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productId = params.id;
        const result = await ProductApi.getProduct(productId);
        setProduct(result);
      } catch (error) {
        if (error.response.status === 404) navigate('/404');
        console.log(error);
      }
    };

    fetchData();
  }, [params, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setImageSingle(product.productImages?.[0]);
    setBagSize(product.bagSize?.[0]);
    setGrind(product.grind?.[0]);

    document.title = `Buy Freshly Roasted Coffee Beans Online | ${product.name} | OKBF`;
  }, [product]);

  const handleChangeQuantity = (e) => {
    if (e.target.innerText === '+') {
      setQuantity(quantity + 1);
    } else if (e.target.innerText === '-') {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    } else {
      const value = Number(e.target.value);
      if (value < 1) setQuantity(1);
      else setQuantity(value);
    }
  };

  const handleChangeGrind = (item) => {
    setGrind(item);
  };

  const handleChangeBagSize = (item) => {
    setBagSize(item);
  };

  const addToCart = async () => {
    try {
      const item = {
        id: product._id,
        title: product.name,
        img: product.productImages?.[0],
        price: product.price,
        path: `/coffee/${product._id}`,
        quantity: quantity,
        type: 'coffee',
        options: {
          bagSize: bagSize,
          grind: grind,
        },
      };

      await CartApi.addToCart(item);

      // Show notification
      setNotification({
        show: true,
        message: `Added ${quantity} ${product.name} to cart successfully!`,
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setNotification({
        show: true,
        message: 'Failed to add item to cart',
      });
    }
  };

  const ShowImage = () => {
    return (
      <>
        <div
          className="product-image-single"
          style={{
            background: `url(
              https://res.cloudinary.com/ok-but-first-coffee/image/upload/c_scale/${product.imageBackground}
            ) no-repeat center center`,
          }}
        >
          <Image
            cloudName="ok-but-first-coffee"
            publicId={imageSingle}
            crop="scale"
            className="product-img"
          />
        </div>
        <Swiper
          className="product-image-list "
          modules={[Navigation]}
          slidesPerView={3}
          navigation={true}
        >
          {product.productImages?.map((image, index) => {
            return (
              <SwiperSlide
                className={`image-item ${image === imageSingle ? 'active' : ''}`}
                key={index}
                onClick={() => handleChangeImageSingle(image)}
              >
                <Image
                  cloudName="ok-but-first-coffee"
                  publicId={image}
                  crop="scale"
                  className="product-img"
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </>
    );
  };

  console.log({ product });

  return (
    <>
      <main className="product-coffee">
        {notification.show && (
          <div className="cart-notification">
            <div className="notification-content">
              <span>{notification.message}</span>
              <button
                onClick={() => setNotification({ show: false, message: '' })}
              >
                ×
              </button>
            </div>
          </div>
        )}
        <section
          style={{ background: `${product.color?.colorBackground}` }}
          className="product-detail"
        >
          <Breadcrumb
            breadcrumb={product.name}
            list={[{ title: 'Coffee Shop', path: '/collections/coffee-shop' }]}
          />
          <div className="container">
            <div className="product-order">
              <div className="product-image">
                <ShowImage />
              </div>
              <div className="product-info">
                <h1 className="product-name">{product.name}</h1>
                <div className="product-price">${product.price}</div>
                <div className="product-note">
                  <Link to="/pages/policies">Shipping</Link> calculated at
                  checkout.
                </div>
                <div className="product-bag-size">
                  <h3 className="bag-size-title">
                    BAG SIZE * <span>{bagSize} OZ</span>
                  </h3>

                  {product.bagSize?.map((item, index) => (
                    <div
                      className="bag-size-item"
                      key={index}
                      onClick={() => handleChangeBagSize(item)}
                    >
                      <Image
                        cloudName="ok-but-first-coffee"
                        publicId={product.imageExtra.imgBag}
                        crop="scale"
                        className="product-img"
                      />
                      <span>{item} OZ</span>
                    </div>
                  ))}
                </div>
                <div className="product-grind">
                  <h3 className="grind-title">
                    GRIND * <span>{grind}</span>
                  </h3>

                  {product.grind?.map((item, index) => (
                    <div
                      className="grind-item"
                      key={index}
                      onClick={() => handleChangeGrind(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div
                  className="product-subscription"
                  style={{
                    border: `1px solid ${product.color?.colorBorder}`,
                  }}
                >
                  <div className="subscription-head">
                    <div className="subscription-left">
                      <Image
                        cloudName="ok-but-first-coffee"
                        publicId={product.imageExtra?.imgSub}
                        crop="scale"
                        className="product-img"
                      />
                    </div>
                    <div className="subscription-right">
                      <h3 className="subscription-title">Subscription</h3>
                      <p className="subscription-content">
                        Products are automatically delivered on your schedule.
                        No obligation, modify or cancel your subscription
                        anytime.
                      </p>
                    </div>
                  </div>
                  <div className="subscription-body">
                    <h4>SUBSCRIBE AND SAVE UPTO 10% OFF</h4>

                    <Link
                      to="/products/coffee-club-subscription"
                      style={{
                        background: `${product.color?.colorSub}`,
                        border: `2px solid ${product.color?.colorSub}`,
                      }}
                    >
                      SUBSCRIBE
                    </Link>
                  </div>
                </div>
                <div className="product-quantity">
                  <h3 className="quantity-title">QUANTITY *</h3>
                  <div className="quantity-input">
                    <button onClick={handleChangeQuantity}>-</button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleChangeQuantity}
                      onClick={handleChangeQuantity}
                      min={1}
                      step={1}
                    />
                    <button onClick={handleChangeQuantity}>+</button>
                  </div>
                </div>
                <div className="product-subtotal">
                  <span>Subtotal ${(product.price * quantity).toFixed(2)}</span>
                </div>
                <button className="btn-add" onClick={addToCart}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="product-overview">
          <div className="container">
            <div className="product-making">
              {product.making?.map((item, index) => (
                <div key={index} className="making-item">
                  <div className="img-wrap">
                    <Image
                      cloudName="ok-but-first-coffee"
                      publicId={item.img}
                      crop="scale"
                      className="product-img"
                    />
                  </div>

                  {index === 0 ? (
                    <h3>PROFILE:</h3>
                  ) : index === 1 ? (
                    <h3>ORIGIN:</h3>
                  ) : (
                    <h3>ROAST:</h3>
                  )}

                  <span>{item.title}</span>
                </div>
              ))}
            </div>
            <div className="product-description">
              <h2 className="product-description-title">PRODUCT DESCRIPTION</h2>
              <p className="product-description-content">
                {product.description}
              </p>
            </div>

            <div className="product-ingredients">
              <div className="main-ingredients">
                <div className="img">
                  {mainIngredients.map((ingredient, index) => (
                    <div className="img-wrap" key={index}>
                      <img
                        className="img-fluid_main"
                        src={ingredient.image.src}
                        alt={ingredient.image.alt}
                      />
                      <img
                        className="img-fluid_icon"
                        src={ingredient.icon.src}
                        alt={ingredient.icon.alt}
                      />
                    </div>
                  ))}
                </div>

                <div className="text">
                  {mainIngredients.map((ingredient, index) => (
                    <div className="item" key={index}>
                      <p className="main-text">{ingredient.name}</p>
                      <p className="sub-text">{ingredient.subtext}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="sub-ingredients">
                <img
                  src="https://res.cloudinary.com/ok-but-first-coffee/image/upload/v1730449797/product-line_1_ytiabm.svg"
                  class="img-fluid_line"
                  alt="product line"
                />
              </div>

              <div className="additional-ingredients">
                <div className="additional-top">
                  <div className="additional-left">
                    {additionalIngredients.map(
                      (ingredient, index) =>
                        index < 3 && (
                          <div className={`item item-${index}`} key={index}>
                            <div className="img-fluid">
                              <img
                                src={ingredient.image.src}
                                alt={ingredient.image.alt}
                              />
                            </div>
                            <p>{ingredient.name}</p>
                          </div>
                        ),
                    )}
                  </div>
                  <div className="center-additional">
                    <img
                      src="https://res.cloudinary.com/ok-but-first-coffee/image/upload/v1729966125/Mornin_coffee_glass_d8b4yv.png"
                      alt="additional ingredients"
                    />
                  </div>
                  <div className="additional-right">
                    {additionalIngredients.map(
                      (ingredient, index) =>
                        index >= 3 &&
                        index < 6 && (
                          <div className={`item item-${index}`} key={index}>
                            <div className="img-fluid">
                              <img
                                src={ingredient.image.src}
                                alt={ingredient.image.alt}
                              />
                            </div>
                            <p>{ingredient.name}</p>
                          </div>
                        ),
                    )}
                  </div>
                </div>
                <div className="additional-bottom">
                  {additionalIngredients.map(
                    (ingredient, index) =>
                      index >= 6 && (
                        <div className={`item item-${index}`} key={index}>
                          <div className="img-fluid">
                            <img
                              src={ingredient.image.src}
                              alt={ingredient.image.alt}
                            />
                          </div>
                          <p>{ingredient.name}</p>
                        </div>
                      ),
                  )}
                </div>
              </div>
            </div>
            <div className="product-discription">
              {product.discription?.map((item, index) => (
                <div key={index} className="discription-item">
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="product-comment">
          <div className="container">
            <div></div>
          </div>
        </section>
        <section className="product-recommended">
          <div className="container">
            <div></div>
          </div>
        </section>
        <section className="product-recently-viewed">
          <div className="container">
            <div></div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ProductDetail;
