
import classNames from "classnames/bind";

import styles from './Order.module.scss'
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles)

function Order() {
    const [orders, setOrders]= useState([])
    useEffect(()=>{
        fetch('/order')
        .then(res=>res.json())
        .then(order => {
            setOrders(order)
        })
    },[])
    
    
    return (  
        <div className={cx('wrapper')}>
            <h1 className="text-xl mb-5 ">Đơn mua</h1>
            {orders.length > 0 ? 
                <>
                    {orders.map((order)=>(
                        <div key={order._id} className={cx('item',"flex flex-col px-2 py-2 justify-center rounded border-2")}>
                            <div className="mb-5">
                                <div> {`Người nhận: ${order.name}`}</div>
                                <div> {`Số điện thoại: ${order.phone}`}</div>
                                <div> {`Email: ${order.email}`}</div>
                                <div> {`Địa chỉ nhận hàng: ${order.address}`}</div>
                            </div>
                            {order.order.map((item)=>(    
                                <div key={order._id} className="flex flex-col ">
                                    <div className="flex mb-5">
                                        <div className="w-20 h-28 mr-5">
                                            <img src={item.productID.thumbnail[0]} className="h-full rounded object-cover"/>
                                        </div>
                                        <div className="">
                                            <h1 className=" font-bold">{item.name}</h1>
                                            <p className="py-2">{`Size: ${item.size}`}</p>
                                            <p >{`Số lượng: ${item.quantity}`}</p>
                                        </div>
                                    </div>
                                        
                                </div>

                            ))}
                            <div className="flex flex-1 justify-end items-end font-bold">
                                {`Thành tiền: ${order.totalMoney.toLocaleString('vi-VN')} đ`}
                            </div>
                        </div>
                    ))}
                </>
                :
                <div className="flex flex-col">
                    <p className="text-center">Bạn chưa có đơn hàng!</p>
                    <div className="flex justify-center mt-5">
                        <Link to={'/'} className="bg-black text-white px-3 py-1 rounded">Quay lại trang chủ</Link>
                    </div>
                </div>
            }
        </div>
    );
}

export default Order;