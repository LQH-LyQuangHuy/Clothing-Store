import classNames from "classnames/bind";
import { Pagination } from "antd";
import { useCallback, useEffect, useState } from "react";

import styles from './Admin.module.scss'
import ProductContent from "./ProductContent";
import OrderContent from "./OrderContent";
import VoucherContent from "./VoucherContent";

const cx = classNames.bind(styles)

function Admin() {
    const [slug, setSlug] = useState('product')
    const [page, setPage] = useState(1)
    const [content, setContent] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
  

    const handleSelectedContent = useCallback((e)=>{
        const activeCls = cx('active')
        const optionSelected = document.querySelector(`.${activeCls}`) 
        optionSelected.classList.remove(activeCls) 
        e.target.classList.add(activeCls)
        setSlug(e.target.dataset.slug)
        
    },[slug])
    
    
    useEffect(()=>{
        setIsLoading(true)
        switch (slug) {
            case 'product':
                fetch(`/product?page=${page}`)
                .then(res=>res.json())
                .then(data=> setContent(data))
                .finally(()=>setIsLoading(false))
                break
            case 'voucher':
                fetch('/voucher/admin')
                .then(res=>res.json())
                .then(data=> setContent(data))
                .finally(()=>setIsLoading(false))
                break
            case 'order':
                fetch('/order/admin')
                .then(res=>res.json())
                .then(data=>setContent(data))
                .finally(()=>setIsLoading(false))
                break
        }
         
    },[slug, page])
    
    return ( 
        <div className={cx("wrapper", 'grid grid-cols-6 text-black')}>
            <div className="flex flex-col  pt-10 h-screen">
                <div className={cx('option','active',"px-10 py-2")} data-slug='product' onClick={handleSelectedContent}>Sản Phẩm</div>
                <div className={cx('option',"px-10 py-2")} data-slug='order' onClick={handleSelectedContent}>Đơn đặt hàng</div>
                <div className={cx('option',"px-10 py-2")} data-slug='voucher' onClick={handleSelectedContent}>Voucher</div>
            </div>
            <div className="content col-span-5 pl-10 pt-10 h-screen pr-24">
                {!isLoading && slug =='product' && <ProductContent data={content}/>}
                {!isLoading && slug =='order' && <OrderContent data={content}/>}
                {!isLoading && slug =='voucher' && <VoucherContent data={content}/>}
                {!isLoading && content && <Pagination className="mt-10" align="center" defaultCurrent={page} total={content?.totalPage*10 || 10} showSizeChanger={false} onChange={(page)=>setPage(page)}/> }

            </div>
        </div>
    );
}

export default Admin;