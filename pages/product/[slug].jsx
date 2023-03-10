import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from 'react-icons/ai';

import { client, urlFor } from '../../lib/client';
import { Product } from '../../components';
import useStateContext from '../../context/StateContext.js';

const ProductDetails = ({ product, products }) => {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const { qty, decQty, incQty, resetQty, addToCart, setShowCart } =
    useStateContext();

  const { image, name, details, price } = product;

  useEffect(() => {
    const handleRouteChange = () => {
      // reset the previous selected quantity to 1 when the user navigates to another page
      resetQty();
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  const handleBuyNow = () => {
    addToCart(product, qty);
    setShowCart(true);
  };

  return (
    <div>
      <div className='product-detail-container'>
        <div>
          <div className='image-container'>
            <img
              src={urlFor(image && image[index])}
              className='product-detail-image'
            />
          </div>

          <div className='small-images-container'>
            {image?.map((item, i) => (
              <img
                key={item._key}
                src={urlFor(item)}
                className={
                  i === index ? 'small-image selected-image' : 'small-image'
                }
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className='product-detail-desc'>
          <h1>{name}</h1>

          <div className='reviews'>
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>

            <p>(20)</p>
          </div>

          <h4>Details: </h4>
          <p>{details}</p>
          <p className='price'>${price}</p>

          <div className='quantity'>
            <h3>Quantity:</h3>

            <p className='quantity-desc'>
              <span className='minus' onClick={decQty}>
                <AiOutlineMinus />
              </span>

              <span className='num'>{qty}</span>

              <span className='plus' onClick={incQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>

          <div className='buttons'>
            <button
              type='button'
              className='add-to-cart'
              onClick={() => addToCart(product, qty)}
            >
              Add to Cart
            </button>

            <button type='button' className='buy-now' onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className='maylike-products-wrapper'>
        <h2>YOU MAY ALSO LIKE</h2>

        <div className='marquee'>
          <div className='maylike-products-container track'>
            {products.map(item => {
              if (item._id !== product._id) {
                return <Product key={item._id} product={item} />;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }
  `;

  const products = await client.fetch(query);

  const paths = products.map(product => ({
    params: {
      slug: product.slug.current,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product"]';

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return {
    props: { products, product },
  };
};

export default ProductDetails;
