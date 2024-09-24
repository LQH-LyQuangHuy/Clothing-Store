
import classNames from "classnames/bind";

import { useState, useEffect, useCallback, useRef } from "react";
import {  useLocation } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';


import styles from './Detail.module.scss'
import Toast from "~/Components/Toast";


const cx = classNames.bind(styles)

function Detail() {
    const location = useLocation()
    const [info, setInfo] = useState(null)
    const [product, setProduct] = useState(null)
    const [noti, setNoti] = useState(false)
    const [selectedImg, setselectedImg] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const addForm = useRef({})
    const quantityProduct = useRef(null)


    useEffect(()=>{
        (async ()=>{
            await fetch(`http://localhost:5000/product/${location.state}`) 
                .then(res => res.json())
                .then(data => setProduct(data))
                .catch(error => console.log(error))
        })()
    },[location])

    function selectedSize (e) {
        const activeCls = styles["active"]
        const sizeActive = document.querySelector(`.${activeCls}`)
        if (sizeActive) {
            sizeActive.classList.remove(`${activeCls}`)
        }
        e.target.classList.add(`${activeCls}`)
        addForm.current.size = e.target.innerHTML
    }
    
    const addProduct = useCallback(()=>{
        
        if (!addForm.current.size) {
            alert('Bạn chưa chọn Size')
        }
        else {
            const payload = { 
                ...addForm.current,
                productId: product._id,
                quantity : parseInt(quantityProduct.current.value),
            }

            fetch('/cart/add', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            })
            .then(res=> res.json())
            .then(data => { 
                if(data.error) return toast.error('Vui lòng đăng nhập để thêm sản phẩm!')
                toast.success('Đã thêm sản phẩm vào giỏ hàng!')
                
            })

        }
        const info = {
            name: product.name,
            size: addForm.current.size,
            thumbnail: product.thumbnail[0],
            quantity: parseInt(quantityProduct.current.value)
            
        }
        setInfo(info)

    },[product])
    
   

    return (  
        <div className={cx('wrapper')}>
            {product ? 
                <div className="flex justify-end px-56">
                    <div className="flex flex-col w-4/12">
                        <div className="w-full has-[30rem]: mb-3">
                            <img className="w-full rounded" src={selectedImg ? selectedImg : product?.thumbnail?.["0"]} alt={selectedImg || product?.thumbnail?.["0"]}/>
                        </div>
                        <div className="flex"> 
                            {product?.thumbnail?.map((image) => (
                                <button key={image} onClick={()=>{setselectedImg(image)}}><img  className="w-10 h-10 mr-2 rounded" src={image} alt={image}/> </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 pl-10">
                        <h1 className="text-3xl font-bold mb-1">{product?.name}</h1>
                        { product.sale ?
                            <p className="flex items-center text-2xl font-bold ">
                                {(()=>{
                                    const price = product.price*product.sale
                                    addForm.current.price = price
                                    return `${(price)?.toLocaleString("vi-VN")}đ`
                                })()} 
                                <span className="text-sm text-white bg-blue-600 ml-3 px-2 py-1 rounded-lg">{`- ${product.sale} đ`}</span> 
                            </p>

                            :
                            <p className="text-2xl font-bold ">
                                {(()=>{
                                    const price = product.price
                                    return `${price?.toLocaleString("vi-VN")}đ`
                                })()}
                            </p>
                            
                        }
                        <div className="my-5 ">
                            <h1 className="font-bold mb-2">Đặc điểm nổi bật</h1>
                            {product && product.description?.split('-')?.map((desc) => (
                                <p key={desc} className="">{`- ${desc}`}</p>
                            ))}
                        </div>
                        <div className="flex mb-5">
                            <p className="pr-3 border-r-2">Miễn phí giao hàng</p>
                            <p className="pl-3">Giao hàng 1-2 ngày - Hà Nội & TP. Hồ Chí Minh</p>
                        </div>
                        {product?.size?.length > 0 ? 
                            null
                            :
                            <div className="flex flex-wrap mb-5">
                                <button className=" text-center min-w-24 mr-3 py-2 bg-gray-300 rounded-3xl outline-none" onClick={selectedSize}>M</button>
                                <button className=" text-center min-w-24 mr-3 py-2 bg-gray-300 rounded-3xl outline-none" onClick={selectedSize}>L</button>
                                <button className=" text-center min-w-24 mr-3 py-2 bg-gray-300 rounded-3xl outline-none" onClick={selectedSize}>XL</button>
                                <button className=" text-center min-w-24 mr-3 py-2 bg-gray-300 rounded-3xl outline-none" onClick={selectedSize}>2XL</button>
                            </div>
                        }
                        <div className="flex w-28 py-2 border-2 border-black rounded-3xl mb-5">
                            <button className="flex justify-center items-center text-xl h-full w-6 font-bold outline-none" 
                                onClick={()=> {
                                    const input = document.querySelector('.quantity')
                                    if (input.value > 1) {
                                        input.stepDown()
                                    }
                                }}
                            >
                                -
                            </button>

                            <input className="flex-1 w-full text-center outline-none quantity" 
                                ref={quantityProduct}
                                type="number"  
                                value={quantity} 
                                onChange={(e) => {
                                    if (e.target.value <= 20) {
                                        setQuantity(e.target.value)
                                    }
                                }}
                            />

                            <button className="flex justify-center items-center text-xl h-full w-6 font-bold outline-none" 
                                onClick={()=> {
                                    const input = document.querySelector('.quantity')
                                    input.stepUp()
                                }}
                            >
                                +
                            </button>
                        </div>
                        <div className="flex items-start">
                            <button className="px-4 py-2 rounded-3xl text-white bg-black outline-none" onClick={addProduct} >Thêm vào giỏ hàng</button>
                        </div>
                    </div>
                </div>
                :
                null
            }
            <Toaster/>
        </div>
    );
}

export default Detail;