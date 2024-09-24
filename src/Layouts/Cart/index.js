
import classNames from "classnames/bind";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons'
import { Row, Col } from "antd";
import { BankOutlined } from '@ant-design/icons'
import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';


import styles from './Cart.module.scss'

const cx = classNames.bind(styles)

function Cart() {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [loading, setLoading] = useState(false)
    const [cart, setCart] = useState({})
    const [paymentType, setPaymentType] = useState(null)
    const [vouchers, setVouchers] = useState(null)
    const [selectedVoucher, setSelectedVoucher] = useState(null)
    const [temporaryMoney, setTemporaryMoney] = useState(0)
    const [discount, setDiscount] = useState(0)
    const [deliveryFee, setDeliveryFee] = useState(0)
    const [totalMoney, setTotalMoney] = useState(0)
    const [reLoadCart, setReLoadCart] = useState(false)
    const [change, setChange] = useState(false)
    const navigate = useNavigate()

    const selectedPayment = useCallback((e)=>{
        const paymentInfo = JSON.parse(e.target.dataset.info)
        setPaymentType(paymentInfo)
    },[])
    
    useEffect(()=>{
        if(cart.userID){
            const name = `${cart.userID.LastName} ${cart.userID.firstName}`
            setName(name)
            setPhone(cart.userID.phone)
            setEmail(cart.userID.email)
            setAddress(cart.userID.address)
        }
    },[cart])

    useEffect(()=>{
        fetch('http://localhost:5000/voucher')
            .then( res => res.json())
            .then(data => setVouchers(data))

        fetch('/cart')
            .then(res => res.json())
            .then(data => {
                if(!data.error) {
                    setCart(data)
                }
            })
    },[loading])

    const handleSelectCheckbox = useCallback((e)=>{
        const checkboxAll = document.querySelector('#check-all')
        const checkbox = document.querySelectorAll('input[name="checkbox"]')
        const checkeditems = document.querySelectorAll('input[name="checkbox"]:checked')
        
        if (e.target.checked) {
            
            const total = temporaryMoney + parseInt(e.target.dataset.price)
            setTemporaryMoney(total)
            
        }
        else {
            const total = temporaryMoney - parseInt(e.target.dataset.price)
            setTemporaryMoney(total)
        
        }
        if (checkeditems.length == checkbox.length) {
            checkboxAll.checked = true
        }
        else {
            checkboxAll.checked = false
        }

        change ? setChange(false) : setChange(true)
    
    },[temporaryMoney, cart])

    useEffect(()=>{
        
        const checkedItems = document.querySelectorAll('input[name="checkbox"]:checked')
        let total = 0 
        if (checkedItems.length > 0) {
            checkedItems.forEach((checkedItem)=>{
                const priceProduct = parseInt(checkedItem.dataset.price)
                total = total + priceProduct
            })
        }
        setTemporaryMoney(total)
        
    },[cart, change])
    

    const handleSelectcheckAll = useCallback(()=>{
        const checkboxAll = document.querySelector('#check-all')
        const checkboxs = document.querySelectorAll('input[name="checkbox"]')
        if (checkboxAll.checked) {
            let total = 0
            checkboxs.forEach((checkbox)=>{
                checkbox.checked = true
                const price = parseInt(checkbox.dataset.price)
                total = total + temporaryMoney + price
            })
            
            setTemporaryMoney(total)
        }

        else {
            checkboxs.forEach((checkbox)=>{
                checkbox.checked = false
            })
            setTemporaryMoney(0)
        }
    },[temporaryMoney, vouchers, cart])

    const handleSetVoucher = useCallback(()=>{
        const voucherInput = document.querySelector('.voucher-input')
        const checkboxs = document.querySelectorAll('input[name="checkbox"]:checked')
        if(checkboxs.length > 0) {
            vouchers.map((voucher)=>{
                if (voucher.code == voucherInput.value) {
                    if (voucher.discount <= 1) {
                        const discount = voucher.discount*temporaryMoney
                        setSelectedVoucher(voucher)
                        setDiscount(discount)
                    }
                    else {
                        setSelectedVoucher(voucher)
                        setDiscount(voucher.discount)
                    }
                }
            })
        }
        else {
            alert("Vui lòng chọn sản phẩm")
        }
        
    },[temporaryMoney,vouchers, cart])

    useEffect(()=> {
        
         if (discount != 0 & deliveryFee == 0 & temporaryMoney != 0) {
            const total =  temporaryMoney - discount
            setTotalMoney(total)
        }
        else if (discount != 0 & deliveryFee != 0 & temporaryMoney != 0) {
            const total =  temporaryMoney - discount + deliveryFee
            setTotalMoney(total)
        }
        else if (deliveryFee !=0 & discount == 0 & temporaryMoney != 0) {
            const total =  temporaryMoney + deliveryFee
            setTotalMoney(total)
        }
        else {
            setTotalMoney(temporaryMoney)
        }

    },[temporaryMoney, discount, deliveryFee, loading, cart])

    
    const handleDeleteItem = useCallback((e)=>{
        loading ? setLoading(false): setLoading(true)
        
        const itemId = e.target.dataset.id
        fetch(`/cart/delete/${itemId}`, {
            method: "DELETE"
        })
        toast.success('Đã xóa sản phẩm')
        window.location.reload()
    },[loading, cart])

    const handleDecQuantityItem = useCallback((e)=>{
        
        if (e.target.nextElementSibling.value > 1 ) {
            loading ? setLoading(false): setLoading(true)
            
            const payload = JSON.parse(e.target.dataset.info)
            fetch('/cart/decquantityitem', {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then(()=> {
                    reLoadCart ? setReLoadCart(false) : setReLoadCart(true)
                    change ? setChange(false) : setChange(true)
                    setTemporaryMoney(0)
                })
                .catch(error => toast.error(error.message))
        }
        
    },[loading, cart]) 

    const handleIncQuantityItem = useCallback((e)=>{
        loading ? setLoading(false): setLoading(true)
        const payload = {
            ...JSON.parse(e.target.dataset.info),
            quantity: 1
        }

        fetch('/cart/add', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(()=> {
                reLoadCart ? setReLoadCart(false) : setReLoadCart(true)
                change ? setChange(false) : setChange(true)
                setTemporaryMoney(0)
            })
            .catch(error => toast.error(error.message))
    },[loading, cart]) 

    const handleOrder = useCallback(()=>{
        const checkboxs = document.querySelectorAll('input[name="checkbox"]:checked')
        const order = []

        checkboxs.forEach((checkbox)=>{
            order.push(JSON.parse(checkbox.dataset.info))
        })

        if (!name) {
            toast.error('Vui lòng điền tên người nhận hàng!')
        }
        else if (!phone) {
            toast.error('Vui lòng điền số điện thoại!')
        }
        else if (!email) {
            toast.error('Vui lòng điền email!')
        }
        else if (!address) {
            toast.error('Vui lòng điền địa chỉ nhận hàng!')
        }
        else {
            if (paymentType) {
                if (paymentType.type == "COD")  {
                    if (checkboxs.length > 0) {
                        loading ? setLoading(false): setLoading(true)
                        const payload = {
                            name,
                            phone,
                            email,
                            address,
                            order,
                            totalMoney
                        }
                        
                        fetch('/order/add', {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(payload)
                        })
                        .then(res=>res.json())
                        .then(data=> {
                            if(!data.error) {
                                toast.success('Đã đặt hàng!')
                                navigate('/cart')
                            }
                            else {
                                toast.error("Đặt hàng không thành công!")
                            }
                        }) 
                    }
                    else {
                        alert('Bạn chưa chọn sản phẩm!')
                    }
                }
                if (paymentType.type == "MOMO") {
                    if (checkboxs.length > 0) {
                        loading ? setLoading(false): setLoading(true)
                        let payload = {
                            name,
                            phone,
                            email,
                            address,
                            order,
                            totalMoney
                        }
                    
                        fetch('/payment/momo', { 
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(payload)
                        })
                            .then(res=>res.json())
                            .then(data=> {
                                if(!data.error) {
                                    payload = {
                                        ...payload,
                                        orderId: data.orderId
                                    }   
                                   
    
                                    fetch('/payment-queue', {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(payload)
                                    }) 
                                        .then(res=>res.json())
                                        .then(data=> console.log('successful'))
    
                                    window.open(data.payUrl, '_blank')
                                    window.location.reload() 
                                }
                                else {
                                    toast.error("Đặt hàng không thành công!")
                                }
                            }) 
                            .catch(error => toast.error(error.massage))
    
                        
                    }
                    else {
                        alert('Bạn chưa chọn sản phẩm!')
                    }
                }
            }
            else {
                alert('Vui lòng chọn phương thưc thanh toán!')
            }
        }
    },[name, phone, email, address, temporaryMoney, discount, deliveryFee, totalMoney, paymentType, cart]) 
        
    return (  
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('info-user', {'pr-8' : true})}>
                    <h2 className={cx({'text-2xl font-bold mb-5' : true})}>Thông tin đặt hàng</h2>
                    <div className={cx({'flex' : true})}>
                        <div className={cx({'flex flex-col pr-3' : true})}>
                            <label>Danh xưng:</label>
                            <div className={cx({'flex flex-1 items-center' : true})}>
                                <div>
                                    <input type="radio" name="name" className={cx({'mr-2' : true})}></input>
                                    <span className={cx({'mr-3' : true})}>Anh</span>
                                </div>
                                <div>
                                    <input type="radio" name="name" className={cx({'mr-2' : true})}></input>
                                    <span>Chị</span>
                                </div>
                            </div>
                        </div>
                        <div className={cx({'flex flex-1' : true})}>
                            <div className={cx({'flex flex-col flex-1 pr-5' : true})}>
                                <label>Họ và tên</label>
                                {cart.userID ?
                                    <input className={cx({'border rounded-3xl py-2 px-3' : true})}  placeholder="Nhập tên của bạn" value={name} onChange={(e)=>setName(e.target.value)}/>
                                    :
                                    <input className={cx({'border rounded-3xl py-2 px-3' : true})} placeholder="Nhập tên của bạn" value={name} onChange={(e)=>setName(e.target.value)}/>
                                }
                            </div>
                            <div className={cx({'flex flex-col flex-1' : true})}>
                                <label>Số điện thoại</label>
                                {cart.userID ?
                                    <input className={cx({'border rounded-3xl py-2 px-3' : true})}  placeholder="Nhập số điện thoại của bạn" value={phone} onChange={(e)=>setPhone(e.target.value)}/>
                                    :
                                    <input className={cx({'border rounded-3xl py-2 px-3' : true})} placeholder="Nhập số điện thoại của bạn" value={phone} onChange={(e)=>setPhone(e.target.value)}/>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={cx({'flex flex-col mb-3' : true})}>
                        <label htmlFor="email" className={cx({'mb-2' : true})}>Email</label>
                        {cart.userID ?
                            <input id="email" className={cx({'border rounded-3xl py-2 px-3' : true})}  placeholder="Theo dõi đơn hàng sẽ được gửi qua Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                            :
                            <input id="email" className={cx({'border rounded-3xl py-2 px-3' : true})} placeholder="Theo dõi đơn hàng sẽ được gửi qua Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>

                        }
                    </div>
                    <div className={cx({'flex flex-col mb-3' : true})}>
                        <label htmlFor="address" className={cx({'mb-2' : true})}>Địa chỉ</label>
                        {cart.userID ?
                            <input id="address" className={cx({'border rounded-3xl py-2 px-3' : true})} placeholder="Nhập địa chỉ (ví dụ: 103 Vạn Phúc, phường Vạn Phúc, Quận 5, TP. Hồ Chí Minh)" value={address} onChange={(e)=>setAddress(e.target.value)}/>
                            :
                            <input id="address" className={cx({'border rounded-3xl py-2 px-3' : true})} placeholder="Nhập địa chỉ (ví dụ: 103 Vạn Phúc, phường Vạn Phúc, Quận 5, TP. Hồ Chí Minh)" value={address} onChange={(e)=>setAddress(e.target.value)}/>

                        }
                    </div>
                    {/* <input className={cx({'border rounded-3xl py-2 px-3' : true})} placeholder="Ghi chú thêm (ví dụ: Giao hàng giờ hành chính)"/> */}
                    <div className="flex flex-col mt-5">
                        <h1 className="text-2xl font-bold mb-3">Hình thức thanh toán</h1>
                        <Row className="h-20 border-2 rounded-xl">
                            <Col className="flex justify-center items-center h-full" span={2}>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    data-info={JSON.stringify({
                                        image: 'https://www.coolmate.me/images/COD.svg',
                                        name: 'COD',
                                        description: 'Thanh toán khi nhận hàng',
                                        type: "COD"
                                    })}
                                    alt="COD"
                                    onClick={selectedPayment}
                                />
                            </Col>
                            <Col className="h-full" span={22}>
                                <Row className="h-full">
                                    <Col className="flex items-center justify-center" span={2}>
                                        <img src="https://www.coolmate.me/images/COD.svg" alt="icon COD"/>
                                    </Col>
                                    <Col className="flex flex-col justify-center pl-3" span={22}>
                                        <Row>COD</Row>
                                        <Row>Thanh toán khi nhận hàng</Row>
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                        <Row className="h-20 border-2 rounded-xl mt-3">
                            <Col className="flex justify-center items-center h-full" span={2}>
                                <input 
                                    type="radio" 
                                    name="payment" 
                                    data-info={JSON.stringify({
                                        image: 'https://www.coolmate.me/images/momo-icon.png',
                                        name: 'Thanh toán MoMo',
                                        description: '',
                                        type: "MOMO"
                                    })} 
                                    alt="MoMo"
                                    onClick={selectedPayment}
                                />
                            </Col>
                            <Col className="h-full" span={22}>
                                <Row className="h-full">
                                    <Col className="flex items-center justify-center" span={2}>
                                        <img src="https://www.coolmate.me/images/momo-icon.png" alt="icon MOMO"/>
                                    </Col>
                                    <Col className="flex flex-col justify-center pl-3" span={22}>
                                        <Row>Thanh toán MoMo</Row>
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                    </div>
                </div>
                <div className={cx('cart')}>
                    <h2 className={cx({'text-2xl font-bold mb-5' : true})}>Giỏ hàng</h2>
                    <div className={cx({'flex flex-col' : true})}>
                        <Row className={cx({'border-b-2 mb-3' : true})}>
                            <Col span={1} className={cx('flex items-center  text-left')}><input id="check-all" type="checkbox" onClick={handleSelectcheckAll}/></Col>
                            <Col span={15} className={cx('flex items-center  text-left text-lg font-bold')} colSpan={2}>Tất cả sản phẩm</Col>
                            <Col span={4} className={cx('flex items-center  justify-center text-lg font-bold')}>Số lượng</Col>
                            <Col span={4} className={cx('flex items-center  justify-center text-lg font-bold')}>Giá</Col>
                        </Row>
                        {cart.items?.length > 0 ?
                            <div>
                                {cart.items.map((item)=>(
                                    <Row key={item._id} className={cx({' pb-3' : true})}>
                                        <Col span={1} className={cx('flex items-center')}>
                                            
                                            <input name="checkbox" type="checkbox" 
                                                data-price={item.productId.price*item.quantity} 
                                                data-info={JSON.stringify({
                                                    itemID: item._id,
                                                    productID: item.productId._id,
                                                    name : item.productId.name,
                                                    size : item.size,
                                                    quantity: item.quantity
                                                })} 
                                                onClick={handleSelectCheckbox}
                                            />
                                        </Col>
                                        <Col span={15} className={cx({'flex' : true})} colSpan={2}>
                                            <img className={cx( 'thumbnail', {'' : true})} src={item.productId.thumbnail[0]} alt={item.productId.name}/>
                                            <div className="flex flex-col h-full ml-3">
                                                <div className="flex flex-col flex-1">
                                                    <p className="font-bold">{item.productId.name}</p>
                                                    <div className="flex justify-center items-center w-28 bg-zinc-200 my-4 py-3 px-2  rounded-3xl">Size: <span className="ml-2">{item.size}</span> </div>
                                                </div>
                                                <button className={cx('delete-btn', {'flex justify-center items-center w-20 text-lg outline-none' : true})} data-id={item._id} onClick={handleDeleteItem}>
                                                    <DeleteOutlined className="mr-2"/> Xóa
                                                </button>
                                            </div>
                                        
                                        </Col>
                                        <Col span={4} className={cx('flex items-center justify-center')}>
                                            <div className={cx('quantity-container',{'flex rounded-3xl border items-center' : true})}>
                                                <button className={cx('decrease', 'btn', {'flex justify-center items-center h-full text-2xl outline-none' : true})} 
                                                    data-info={JSON.stringify({
                                                        productId: item.productId._id,
                                                        size: item.size
                                                    })}
                                                    onClick={handleDecQuantityItem}
                                                >
                                                   -
                                                </button>
                                                <input className={cx({'flex-1 text-center outline-none w-full h-full' : true})}  value={item.quantity} onChange={()=>{}}  disabled/>
                                                <button className={cx('increase', 'btn', {'flex justify-center items-center h-full text-2xl outline-none' : true})} 
                                                    data-info={JSON.stringify({
                                                        productId: item.productId._id,
                                                        size: item.size
                                                    })}
                                                    onClick={handleIncQuantityItem}
                                                >
                                                   +
                                                </button>
                                            </div>
                                        </Col>
                                        <Col span={4} className={cx('flex items-center justify-center font-bold')}>{`${(item.productId.price*item.quantity).toLocaleString("vi-VN")} đ`}</Col>
                                    </Row>
                                ))}
                            </div>
                            :
                            <div className="flex justify-center items-center w-full h-32">Bạn chưa thêm sản phẩm!</div>
                        }
                        
                        <Row className={cx({'flex border-b-2 py-3 ' : true})}>
                            <Row className={cx({'text-lg pb-3 font-bold' : true})}>Voucher</Row>
                            
                            { vouchers ? 
                                vouchers.map((voucher)=>(
                                    <Row key={voucher.code} className={cx('voucher-container')}>
                                        <div className={cx( 'voucher-card', {'flex flex-col rounded-md justify-between py-2' : true})}>
                                            <div>
                                                <p className={cx({'font-bold' : true})}>{voucher.code}</p>
                                                <p>{voucher.description}</p>
                                            </div>
                                            <p>{`HSD: ${voucher.endTime}`}</p>
                                            <div className={cx('check')} >
                                                <div className={cx('checked')}></div>
                                            </div>
                                        </div>
                                    </Row>
                                ))
                                :
                                null
                            }
                            <Row className={cx({'w-full mt-5' : true})}>
                                <Col span={16}>
                                    <input className={cx({'w-full border rounded-3xl py-2 px-3 voucher-input' : true})} maxLength={10}  placeholder="Nhập mã giảm giá"/>
                                </Col>
                                <Col className={cx({'flex w-full justify-end items-center' : true})} span={8}>
                                    <button className={cx('set-voucher',{'flex items-center justify-center h-full border rounded-3xl px-4 font-bold text-white bg-black' : true})} onClick={handleSetVoucher}>Áp dụng Voucher</button>
                                    {/* < className={cx('set-voucher',{'flex items-center justify-center h-full border rounded-3xl px-4 font-bold text-white bg-black' : true})} onClick={handleSetVoucher}>Áp dụng Voucher</> */}
                                </Col>
                            </Row>
                        </Row>
                        <Row className={cx({'w-full border-b-2 pt-3' : true})}>
                            <Row className={cx({'w-full mb-3' : true})}>
                                <Col span={18} className="font-bold">Tạm tính</Col>
                                <Col className={cx({'text-end font-bold' : true})} span={6}>{`${temporaryMoney.toLocaleString("vi-VN")} đ`}</Col>
                            </Row>
                            <Row className={cx({'w-full mb-3' : true})}>
                                <Col span={18} className="font-bold">Giảm giá</Col>
                                <Col className={cx({'text-end font-bold' : true})} span={6}>{`${discount.toLocaleString("vi-VN")} đ`}</Col>
                            </Row>
                            <Row className={cx({'w-full mb-3' : true})}>
                                <Col span={18} className="font-bold">Phí giao hàng</Col>
                                <Col className={cx({'text-end' : true})} span={6}>
                                    { deliveryFee == 0 ? 
                                        <p className="font-bold">Miễn Phí</p>
                                        :
                                        <p className="font-bold">{`${deliveryFee} đ`}</p>
                                    }
                                </Col>
                            </Row>
                        </Row>  
                        <Row className={cx({'w-full pt-3' : true})}>
                            <Col className={cx({'font-bold' : true})} span={18}>Thành tiền</Col>
                            <Col className={cx({'text-end font-bold' : true})} span={6}>{`${totalMoney.toLocaleString("vi-VN")} đ`}</Col>
                        </Row>
                    </div>
                </div>
            </div>
            <Row className={cx({'w-full h-24 bg-white sticky bottom-0 shadow-[0_-5px_10px_rgba(0,0,0,0.08)]' : true})}>
                <Col className={cx({'flex justify-center items-center w-full h-full bg-blue-100' : true})} span={8}>
                    
                    { paymentType ? 
                        <div className="flex items-center justify-center w-full h-full text-lg">
                            <div className="flex justify-center items-center w-10 h-10 mr-3"><img src={paymentType.image} alt="payment"/></div>
                            <div>
                                <p className="text-lg font-bold text-blue-600">{paymentType.name}</p>
                                {paymentType.description && <p className="text-sm">{paymentType.description}</p>}
                            </div>
                        </div>
                        :
                        <p className="text-lg font-bold text-blue-600">Chưa chọn phương thức thanh toán</p>
                    }
                </Col>
                <Col className={cx('use-voucher',{'flex justify-center items-center text-lg w-full h-full bg-blue-100 ' : true})} span={8}>
                    {selectedVoucher ? 
                        <div>
                            <h1 className="text-2xl font-bold text-blue-600">{selectedVoucher.code}</h1>
                            <p className="text-sm">{selectedVoucher.description}</p>
                        </div>
                        :
                        <p className="font-bold text-blue-600">Chưa dùng Voucher</p>
                    }
                </Col>
                <Col className="h-full pr-14" span={8}>
                    <Row className="h-full">
                        <Col className="flex items-center justify-end pr-8" span={14}>
                            <p>Thành tiền: <span className="text-2xl font-bold text-blue-600 pl-3">{`${totalMoney.toLocaleString("vi-VN")} đ`}</span></p>
                        </Col>
                        <Col className="flex items-center justify-center" span={10}>
                            <button className="flex flex-1 justify-center items-center rounded-3xl py-4 px-4 font-bold bg-black text-white" onClick={handleOrder}>ĐẶT HÀNG</button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Toaster/>
        </div>
    );
}

export default Cart;