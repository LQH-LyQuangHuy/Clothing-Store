
import classNames from "classnames/bind";
import { Carousel } from 'antd';
import styles from './Home.module.scss'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles)

function Home() {
    const [products, setProducts] = useState([])
    const [banners, setBanners] = useState([])
    const [trousers, setTrousers] = useState([])
    const [TShirt, setTShirt] = useState([])
    useEffect(()=>{
        (async()=>{
            await Promise.all([fetch('http://localhost:5000/product'), fetch('http://localhost:5000/banner'), fetch('http://localhost:5000/product/t-shirt') ,fetch('http://localhost:5000/product/trousers')])
                .then(async (results) => await Promise.all([results[0].json(), results[1].json(), results[2].json(), results[3].json()]))
                .then((data) =>{
                    setProducts(data[0])
                    setBanners(data[1])
                    setTShirt(data[2])
                    setTrousers(data[3])
                })
        })()
    },[])
    
    return (  
      
        <div className={cx('wrapper')}>
            <Carousel
                arrows 
                infinite={true}
                draggable = {true}
                autoplay={true}

            >
                {banners.map((banner) => (
                    <div key={banner._id} className={cx('banner-container')}>
                        <img  src={banner.image} alt={banner.name}></img>
                    </div>
                ))}
            </Carousel>
            <div className={cx('section', 'section-2')}>
                <div className={cx('heading-container')}>
                    <h1 className={cx('heding-section-2')}>{products?.title}</h1>
                    <Link className={cx('see-more-btn')}>Xem thêm</Link>
                </div>
                <div className={cx('content-section-2')}>
                    {products?.items?.map((product) =>{
                        return (
                            <div key={product.name} className={cx('product')}>
                                <Link to={`/san-pham/${product._id}`} state={product._id} className={cx('thumbnail')} data-star={product.star}>
                                    <img src={product.thumbnail[0] || product.thumbnail[1]} alt="thumbnail"/>
                                    <div className={cx('size-product')}>
                                        <div className={cx('title-size')}>Thêm nhanh vào giỏ hàng +</div>
                                        <div className={cx('size-container')}>
                                            <div className={cx('size-btn')}>S</div>
                                            <div className={cx('size-btn')}>M</div>
                                            <div className={cx('size-btn')}>L</div>
                                            <div className={cx('size-btn')}>XL</div>
                                            <div className={cx('size-btn')}>2XL</div>
                                            <div className={cx('size-btn')}>3XL</div>
                                        </div>
                                    </div>
                                </Link>
                                <div className={cx('info-container')}>
                                    <Link to={`/san-pham/${product._id}`} state={product._id} className={cx('name-product')}>{product.name}</Link>
                                    {product.sale  ?
                                        <div className={cx('price-container')}>
                                            <div className={cx('sale-price-product')} data-sale="- 40%">{`${(product.price * product.sale).toLocaleString("vi-VN")}đ`}</div>
                                            <div className={cx('origin-price-product', {'sale' : product.sale})}>{`${product.price.toLocaleString("vi-VN")}đ`}</div>
                                        </div>
                                        
                                        :
                                        <div className={cx('origin-price-product')}>{`${product.price.toLocaleString("vi-VN")}đ`}</div>
                                    }
                                    
                                </div>
                                <div className={cx('refund-product')}>Hoàn tiền x2 Coolcash</div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className={cx('section', 'section-3')}>
                <div className={cx('heading-container')}>
                    <h1 className={cx('heding-section-3')}>{TShirt?.title}</h1>
                    <Link className={cx('see-more-btn')}>Xem thêm</Link>
                </div>
                <div className={cx('content-section-2')}>
                    {TShirt?.items?.map((TShirt) =>{
                        return (
                            <div key={TShirt.name} className={cx('product')}>
                                <Link to={`/san-pham/${TShirt._id}`} state={TShirt._id} className={cx('thumbnail')} data-star={TShirt.star} >
                                    <img src={TShirt.thumbnail[0] || TShirt.thumbnail[1]} alt="thumbnail"/>
                                    <div className={cx('size-product')}>
                                        <div className={cx('title-size')}>Thêm nhanh vào giỏ hàng +</div>
                                        <div className={cx('size-container')}>
                                            <div className={cx('size-btn')}>S</div>
                                            <div className={cx('size-btn')}>M</div>
                                            <div className={cx('size-btn')}>L</div>
                                            <div className={cx('size-btn')}>XL</div>
                                            <div className={cx('size-btn')}>2XL</div>
                                            <div className={cx('size-btn')}>3XL</div>
                                        </div>
                                    </div>
                                </Link>
                                <div className={cx('info-container')}>
                                    <Link to={`/san-pham/${TShirt._id}`} state={TShirt._id} className={cx('name-product')}>{TShirt.name}</Link>
                                    {TShirt.sale ?
                                        <div className={cx('price-container')}>
                                            <div className={cx('sale-price-product')} data-sale="- 40%">{`${(TShirt.price * TShirt.sale).toLocaleString("vi-VN")}đ`}</div>
                                            <div className={cx('origin-price-product', {'sale' : TShirt.sale})}>{`${TShirt.price.toLocaleString("vi-VN")}đ`}</div>
                                        </div>
                                        
                                        :
                                        <div className={cx('origin-price-product')}>{`${TShirt.price.toLocaleString("vi-VN")}đ`}</div>
                                    }
                                    
                                </div>
                                <div className={cx('refund-product')}>Hoàn tiền x2 Coolcash</div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className={cx('section', 'section-4')}>
                <div className={cx('heading-container')}>
                    <h1 className={cx('heding-section-4')}>{trousers?.title}</h1>
                    <Link className={cx('see-more-btn')}>Xem thêm</Link>
                </div>
                <div className={cx('content-section-2')}>
                    {trousers?.items?.map((trousers) =>{
                        return (
                            <div key={trousers.name} className={cx('product')}>
                                <Link to={`/san-pham/${trousers._id}`} state={trousers._id} className={cx('thumbnail')} data-star={trousers.star}>
                                    <img src={trousers.thumbnail[0] || trousers.thumbnail[1]} alt="thumbnail"/>
                                    <div className={cx('size-product')}>
                                        <div className={cx('title-size')}>Thêm nhanh vào giỏ hàng +</div>
                                        <div className={cx('size-container')}>
                                            <div className={cx('size-btn')}>S</div>
                                            <div className={cx('size-btn')}>M</div>
                                            <div className={cx('size-btn')}>L</div>
                                            <div className={cx('size-btn')}>XL</div>
                                            <div className={cx('size-btn')}>2XL</div>
                                            <div className={cx('size-btn')}>3XL</div>
                                        </div>
                                    </div>
                                </Link>
                                <div className={cx('info-container')}>
                                    <Link to={`/san-pham/${trousers._id}`} state={trousers._id} className={cx('name-product')}>{trousers.name}</Link>
                                    {trousers.sale ?
                                        <div className={cx('price-container')}>
                                            <div className={cx('sale-price-product')} data-sale="- 40%">{`${(trousers.price * trousers.sale).toLocaleString("vi-VN")}đ`}</div>
                                            <div className={cx('origin-price-product', {'sale' : trousers.sale})}>{`${trousers.price.toLocaleString("vi-VN")}đ`}</div>
                                        </div>
                                        
                                        :
                                        <div className={cx('origin-price-product')}>{`${trousers.price.toLocaleString("vi-VN")}đ`}</div>
                                    }
                                    
                                </div>
                                <div className={cx('refund-product')}>Hoàn tiền x2 Coolcash</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

export default Home;