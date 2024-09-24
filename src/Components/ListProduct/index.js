
import classNames from "classnames/bind";
import { Link } from 'react-router-dom'
import styles from './ListProduct.module.scss'

const cx = classNames.bind(styles)

function ListProduct({products , loading, ...props} ) {
    
    return (  
        <div className={cx('wrapper')}>
            { products ? 
                <> 
                    <div className={cx('title',"flex justify-between font-bold text-2xl mb-4")}>
                        {products.title}
                    </div>
                    <div className={cx('cards-container', 'flex flex-wrap')} >
                        {products.items.map((item)=>(
                            <div key={item.name} className={cx('card')}>
                                <Link className={cx('thumbnail')} to={`/san-pham/${item._id}`} state={item._id}>
                                    <img className="rounded" src={item.thumbnail}/>
                                </Link>
                                <div className={cx('info', 'flex flex-col justify-between min-h-24')}>
                                    <Link className="my-2" to={`/san-pham/${item._id}`} state={item._id}>{item.name}</Link>
                                    {item.sale ?
                                        null
                                        :
                                        <div className="font-bold">{`${item.price.toLocaleString('vi-VN')} đ`}</div>
                                    }
                                </div>
                                <div className="text-sm text-gray-400 mt-1">Hoàn tiền x2 Coolcash</div>
                            </div>
                        ))}
                    </div>
                </>
                :
                null
            }
        </div>
    );
}

export default ListProduct;