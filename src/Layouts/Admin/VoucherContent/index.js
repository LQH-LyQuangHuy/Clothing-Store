
import classNames from "classnames/bind";

import styles from './VoucherContent.module.scss'
import { useCallback, useState } from "react";
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import toast, { Toaster } from "react-hot-toast";

dayjs.extend(customParseFormat);

const cx = classNames.bind(styles)

function VoucherContent({data}) {
    const dateFormat = 'DD/MM/YYYY';
    const [show, setShow] = useState(false)
    const [voucherCode, setVoucherCode] = useState('')
    const [discount, setDiscount] = useState(0)
    const [discountValue, setDiscountValue] = useState('')
    const [description, setDescription] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    const handleHidenAddForm = useCallback(()=>{
        setShow(false)
        setVoucherCode('')
        setDiscount(0)
        setDescription('')
        setStartTime('')
        setEndTime('')
    },[show])

    const handleAddVoucher = useCallback(()=>{
        if (!voucherCode) {
            toast.error("Chưa nhập mã Voucher!")
        }
        else if (!discount) {
            toast.error("Chưa nhập số tiền giảm!")
        }
        else if (!description) {
            toast.error("Chưa nhập chính sách áp dụng!")
        }
        else if (!startTime) {
            toast.error("Vui lòng chọn ngày bắt đầu !")
        }
        else if (!endTime) {
            toast.error("Vui lòng chọn ngày kết thúc!")
        }
        else {
            const newVoucher = {
                code: voucherCode,
                discount,
                description,
                startTime,
                endTime
            }
            
            fetch('/voucher/add', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newVoucher)
            })
            .then(() => window.location.reload())
            
        }

    },[voucherCode, discount, description, startTime, endTime])

    function handleDeleteVoucher (e) {
        const voucherId = e.target.dataset.id
        fetch(`http://localhost:5000/voucher/delete/${voucherId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(result => {
                if (result.error) {
                    toast.error('Voucher không tồn tại!')
                }
                else {
                    toast.success('Đã xóa thành công!')
                }
            })
    }

    const handleUpdateVoucher = useCallback((e)=> {
        const voucherId = e.target.dataset.id
        const updateVoucher = {
            code: voucherCode,
            discount,
            description, 
            startTime, 
            endTime
        }
        fetch(`http://localhost:5000/voucher/delete/${voucherId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateVoucher)
        })
            .then(res => res.json())
            .then(result => {
                if (result.error) {
                    toast.error('Voucher không tồn tại!')
                }
                else {
                    toast.success('Cập nhật thành công!')
                }
            })
    },[voucherCode, discount, description, startTime, endTime])
    
    return ( 
        <div className={cx('wrapper')}>
            {data ?
                <div className="relative">
                    <div className="grid grid-cols-2 pb-3">
                        <h1 className="text-xl font-bold">Voucher</h1>
                        <button className={cx('add-voucher', 'max-w-max')} onClick={()=>setShow(true)}>Thêm Voucher</button>
                    </div>
                   
                    {data.items?.map((voucher)=>(
                        <div key={voucher._id} className={cx('voucher',"grid grid-cols-5")}>
                            <div className="grid grid-cols-2 col-span-4">
                                <div className="">
                                    <div>{voucher.code}</div>
                                    <div>{voucher.description}</div>
                                </div>
                                <div>{voucher.discount}</div>
                                <div>{`Thời gian bắt đầu: ${voucher.startTime}`}</div>
                                <div>{`Hạn sử dụng ${voucher.endTime}`}</div>
                            </div>
                            <div className="flex justify-center items-center">
                                <button className="bg-black text-white px-3 py-1 rounded" data-id={voucher._id} onClick={handleDeleteVoucher}>Xóa</button>
                            </div>
                        </div>
                    ))}
                    {show && 
                        <div 
                            className={cx( 'modal', "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen flex ")} 
                            onClick={(e)=>{
                                setShow(false)
                            }}
                        >
                            <div 
                                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col rounded bg-white p-5 shadow-2xl"
                                onClick={(e)=>{
                                    e.stopPropagation()
                                }}
                            >
                                <button className="absolute top-0 right-0 px-5 py-1" onClick={handleHidenAddForm}>X</button>
                                <div className="grid grid-cols-2 mb-2 gap-5">
                                    <div className="flex flex-col">
                                        <label htmlFor="voucher-code" className="mb-1">Mã Voucher</label>
                                        <input 
                                            id="voucher-code" 
                                            className="px-2 py-1 rounded border border-gray-600 outline-none" 
                                            placeholder="Nhập mã Voucher"
                                            value={voucherCode}
                                            onChange={(e)=>setVoucherCode(e.target.value.toUpperCase())}
                                            maxLength={8}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="discout" className="mb-1">Giảm giá</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <input 
                                                id="discout" 
                                                className="px-2 py-1 rounded border border-gray-600 outline-none col-span-2" 
                                                placeholder="Nhập số tiền giảm"
                                                value={discountValue}
                                                onChange={(e)=>{
                                                    let valueFormat = e.target.value.replace(/\D/g, '')
                
                                                    if ( valueFormat != 0 || valueFormat != '') {
                                                        setDiscount(parseInt(valueFormat) )
                                                    }
        
                                                    valueFormat = valueFormat.replace(/\$\s?|(,*)/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                    setDiscountValue(valueFormat)
                                                    
                                                }}
                                            />
                                            <input
                                                className="text-center px-2 py-1 rounded border border-gray-600 outline-none col-span-1"
                                                value={'VND'} 
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col mb-2">
                                    <label htmlFor="applicable-policy" className="mb-1">Chính sách áp dụng</label>
                                    <textarea 
                                        id="applicable-policy" 
                                        className="min-h-20 rounded border border-gray-600 outline-none px-2 py-1 max-h-56" 
                                        placeholder="Thông tin chính sách áp dụng..."
                                        value={description}
                                        onChange={(e)=> setDescription(e.target.value)}
                                    />
                                </div>
                                <label htmlFor="applicable-policy" className="mb-1">Thời gian áp dụng</label>
                                <div>
                                    <DatePicker
                                        placeholder= "Bắt đầu"
                                        defaultValue={dayjs('09-03-2019', dateFormat)}
                                        format={dateFormat}
                                        onChange={(date, dateString)=>{
                                            setStartTime(dateString)
                                            
                                        }}
                                    />
                                    <span className="mx-2">đến</span>
                                    <DatePicker
                                        placeholder= "Kết thúc"
                                        defaultValue={dayjs('09-03-2025', dateFormat)}
                                        format={dateFormat}
                                        onChange={(date, dateString)=>{
                                            setEndTime(dateString)
                                            
                                        }}
                                    />
                                </div>
                                <div className="flex flex-row-reverse mt-5">
                                    <button 
                                        className="px-3 py-1 rounded bg-black text-white"
                                        onClick={handleAddVoucher}
                                    >
                                        Thêm vào
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                : null
            }
            <Toaster />
        </div>
    );
}

export default VoucherContent;