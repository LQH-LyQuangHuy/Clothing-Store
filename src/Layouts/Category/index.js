
import classNames from "classnames/bind";

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Pagination } from "antd";

import slytes from './Category.module.scss'
import ListProduct from "~/Components/ListProduct";


const cx = classNames.bind(slytes)

function Category() {
    const [Category, setCategory] = useState(null)
    const [page, setPage] = useState(1)
    const location = useLocation()
    useEffect(()=>{
        fetch(`http://localhost:5000/product/category/${location.state}?page=${page}`)
        .then(res => res.json())
        .then(data => setCategory(data))
        .catch(error => console.log(error))
    },[Category])

    return (  
        <div className={cx('wrapper')}>
            <ListProduct  products={Category} />
            {Category && <Pagination className="mt-5" align="center" defaultCurrent={1} total={Category.totalPage*10} onChange={(page)=>{setPage(page)}}/>}
        </div>
    );
}

export default Category;