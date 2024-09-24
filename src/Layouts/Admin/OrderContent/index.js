
import classNames from "classnames/bind";

import styles from './OrderContent.module.scss'

const cx = classNames.bind(styles)

function OrderContent({data}) {
    
    return ( 
        <div className={cx('wrapper')}>
            <div className="text-xl font-bold mb-3">Đơn đặt hàng</div>
            {data ? 
                <div className={cx("orders-container")}>
                    {data.items?.map((order)=>(
                        <div key={order._id} className={cx('order', 'border-b-2')}> 
                            <div>{`Khách hàng: ${order.name}`}</div>
                            <div className="grid grid-cols-2">
                                <div>{`Email: ${order.email}`}</div>
                                <div>{`Số điện thoại: ${order.phone}`}</div>
                            </div>
                            <div>{`Địa chỉ nhận hàng: ${order.address}`}</div>
                            <div>
                                Đơn hàng:
                                <div className="pl-5">
                                    
                                    {order.order?.map((item)=>(
                                        <div key={item._id}>
                                            <div>{item.name}</div>
                                            <div className="flex ">
                                                <div className="mr-10">{`Số lượng: ${item.quantity}`}</div>
                                                <div>{`Size: ${item.size}`}</div>
                                            </div>
                                        </div>
                                        
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div></div>
                                <div>{`Thành tiền: ${order.totalMoney?.toLocaleString("vi-VN")} đ`}</div>
                            </div>
                        </div>
                    ))}
                </div>
                :
                null
            }
        </div>
    );
}

export default OrderContent;