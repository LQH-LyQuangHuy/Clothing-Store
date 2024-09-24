
import classNames from "classnames/bind";

import { Select, InputNumber } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from "react";

import styles from './ProductContent.module.scss'
import toast, {Toaster} from "react-hot-toast";

const cx = classNames.bind(styles)

function ProductContent({data }) {
    const [showForm, setShowForm] = useState(false)
    const [value, setValue] = useState([]);
    const [nameProduct, setNameProduct] = useState('');
    const [thumbnailProduct, setThumbnailProduct] = useState('');
    const [price, setPrice] = useState(0);
    const [priceProduct, setPriceProduct] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [salepriceProduct, setSalePriceProduct] = useState(0);
    const [descriptionProduct, setDescriptionProduct] = useState('');
    const [category, setCategory] = useState([]);
    const [isDelete, setIsDelete] = useState(false);
    const [edit, setEdit] = useState(false);
    const [productID, setProductID] = useState(null);
    const [product, setProduct] = useState(null);
    const [updateName, setUpdateName] = useState('')
    const [updateThumbnail, setUpdateThumbnail] = useState('')
    const [updateCategory, setUpdateCategory] = useState([])
    const [updateCategoryValue, setUpdateCategoryValue] = useState([])
    const [updatePrice, setUpdatePrice] = useState(0)
    const [updatePriceValue, setUpdatePriceValue] = useState('')
    const [updateDiscount, setUpdateDiscount] = useState(0)
    const [updateDiscountValue, setUpdateDiscountValue] = useState('')
    const [updateDescription, setUpdateDescription] = useState('')
    const [isEdited, setIsEdited] = useState(false)
    

    const MAX_COUNT = 5;
    const suffix = (
        <>
          <span>
            {value.length} / {MAX_COUNT}
          </span>
          <DownOutlined />
        </>
    );

    const handleSetPrice = (e) => {
        
        let formattPrice = e.target.value.replace(/\D/g, '')
        
        if ( formattPrice != 0 || formattPrice != '') {
            setPrice(parseInt(formattPrice) )

        }

        formattPrice = formattPrice.replace(/\$\s?|(,*)/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        
            
        setPriceProduct(formattPrice)
    }

    const handleSetDiscount = (e) => {
        let formattDiscounnt = e.target.value.replace(/\D/g, '')
        
        if ( formattDiscounnt != 0 || formattDiscounnt != '') {
            setDiscount(parseInt(formattDiscounnt) )

        }

        formattDiscounnt = formattDiscounnt.replace(/\$\s?|(,*)/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
           
        setSalePriceProduct(formattDiscounnt)
    }

    const handleSetUpdatePrice = (e) => {
        
        let formattPrice = e.target.value.replace(/\D/g, '')
        
        if ( formattPrice != 0 || formattPrice != '') {
            setUpdatePrice(parseInt(formattPrice) )
        }

        formattPrice = formattPrice.replace(/\$\s?|(,*)/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        
            
        setUpdatePriceValue(formattPrice)
        if(!isEdited) {
            setIsEdited(true)
        }
    }

    const handleSetUpdateDiscount = (e) => {
        let formattDiscounnt = e.target.value.replace(/\D/g, '')
        
        if ( formattDiscounnt != 0 || formattDiscounnt != '') {
            setUpdateDiscount(parseInt(formattDiscounnt) )
        }

        formattDiscounnt = formattDiscounnt.replace(/\$\s?|(,*)/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
           
        setUpdateDiscountValue(formattDiscounnt)
        if(!isEdited) {
            setIsEdited(true)
        }
    }
        
    
    const handleShowFormAddProduct = useCallback(()=>{
        setShowForm(true)
    },[showForm])

    const handleHidenFormAddProduct = useCallback(()=>{
        setShowForm(false)
    },[showForm])

    const handleAddProduct = useCallback((e)=>{
        if (nameProduct == '') {
            toast.error('Chưa nhập tên sản phẩm');
        }
        else if (thumbnailProduct == '') {
            toast.error('Chưa có link ảnh sản phẩm')
        }
        else if (category.length == 0) {
            toast.error('Chưa chọn thể loại')
        }
        else if (descriptionProduct == '') {
            toast.error('Chưa có mô tả thông tin sản phẩm')
        }
        else {
            const formAdd =  {
                name: nameProduct,
                price,
                description: descriptionProduct,
                thumbnail: [thumbnailProduct],
                category,
                sale: discount != 0 ? discount : null
            }
            
            fetch('http://localhost:5000/product/add', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formAdd)
            })
                .then(res => res.json())
                .then(newProduct => console.log(newProduct))
            window.location.reload()
        }
    },[nameProduct, thumbnailProduct, priceProduct, salepriceProduct, descriptionProduct, category])
    
    const handleDeleteProduct = (e) => {
        fetch(`http://localhost:5000/product/delete?id=${productID}`,{
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.status) {
                toast.success('Xóa sản phẩm thành công!')
            }
        })
        .catch((error => toast.error('Xóa không thành công!')))
        .finally(()=> {
            setProductID(null)
            setIsDelete(false)
            window.location.reload()
        })
    }
    const handleCancelDeleteProduct = (e) => {
        setProductID(null)
        setIsDelete(false)
    }

    const handleGetProductInfo = async (e) => {
        await fetch(`http://localhost:5000/product/${e.target.dataset.id}`)
            .then(res=> res.json())
            .then(product => {
                
                setProduct(product)
            })
            .catch(error => console.log(error.message))
            .finally(()=>{
                setProductID(e.target.dataset.id)
                setEdit(true)
            })

    }

    const handleEditProductInfo =  (e) => {  
        const updateProduct = {
            id: productID,
            name: updateName,
            price: updatePrice,
            category: updateCategory,
            sale: updateDiscount,
            description: updateDescription
        }
        
        if(isEdited) {
            fetch('http://localhost:5000/product/update', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updateProduct)
            })
                .then(res => res.json())
                .then(result => console.log('result'+ result))
            
            window.location.reload()
        }
    }

    useEffect(()=>{
        if(product) {
            setUpdateName(product.name)
            setUpdateThumbnail(product.thumbnail[0])
            const categoryArray = product.category.map((cate)=> cate.slug)
            setUpdateCategoryValue(categoryArray)
            setUpdatePriceValue(product.price.toLocaleString("vi-VN"))
            if(product.sale) {
                setUpdateDiscountValue(product.sale.toLocaleString("vi-VN"))
            }
            setUpdateDescription(product.description)
        }
    },[product])

    return ( 
        <div className={cx('wrapper')}>
            <div className="grid grid-cols-12 mb-4 border-b-2 py-2">
                <div className="col-span-8 text-xl font-bold">Sản Phẩm</div>
                <div className="text-center text-xl ">Giá</div>
                <div className="text-end text-xl ">Giảm giá</div>
                <div className="col-span-2 text-center text-xl " >
                    <button className={cx('add-product')} onClick={handleShowFormAddProduct}>Thêm sản phẩm</button>
                </div>
            </div>
            <div className="mb-10">
                { data ?
                    <>
                        { data?.items?.map((item)=>(
                            <div key={item._id} className={cx('item',"grid grid-cols-12")}>
                                <div className={cx("col-span-8 flex")}>
                                    <div className="w-16 h-24 mr-5">
                                        <img src={item?.thumbnail?.[0]} className="h-full rounded"/>
                                    </div>
                                    <div className="">{item?.name}</div>
                                </div>
                                <div className=" flex justify-end items-center font-bold">{`${item?.price?.toLocaleString('vi-VN')} đ`}</div>
                                <div className=" flex justify-end items-center font-bold">{`${item?.sale*item?.price?.toLocaleString('vi-VN')} đ`}</div>
                                <div className="col-span-2 flex justify-evenly items-center" >
                                    <button 
                                        className={cx('btn',"border-2 border-black rounded px-2")} 
                                        data-id={item._id}
                                        onClick={handleGetProductInfo}
                                    >
                                        Sửa
                                    </button>
                                    <button 
                                        className={cx('btn',"border-2 border-black rounded px-2")} 
                                        data-id={item._id} 
                                        onClick={(e)=> {
                                            setProductID(e.target.dataset.id)
                                            setIsDelete(true)
                                        }}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        ))
                        }
                    </>
                    :
                    null
                }
            </div>
            { showForm && 
                <div className={cx('modal')}>
                    <div className={cx('add-product-container', 'relative py-10')}>
                        <button className="absolute flex justify-center top-0 right-0 items-center w-10 h-10" onClick={handleHidenFormAddProduct}>X</button>
                        <div className="flex flex-col px-5  mb-5">
                            <label htmlFor="name-product" className=" mb-2">Tên sản phẩm</label>
                            <input 
                                id="name-product" 
                                className="border-2 rounded py-1 px-4 outline-none" 
                                value={nameProduct} 
                                onChange={(e)=> setNameProduct(e.target.value)} 
                                placeholder="Nhập tên sản phẩm"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="flex flex-col px-5  mb-5">
                                <label htmlFor="img-product" className=" mb-2">Link ảnh</label>
                                <input 
                                    id="img-product" 
                                    className="border-2 rounded py-1 px-4 outline-none"
                                    value={thumbnailProduct} 
                                    onChange={(e)=> setThumbnailProduct(e.target.value)} 
                                    placeholder="Link ảnh"
                                    required
                                />
                            </div>
                            <div className="flex flex-col px-5 mb-5">
                            <label htmlFor="category" className=" mb-2">Thể loại</label>
                            <Select
                                mode="multiple"
                                maxCount={MAX_COUNT}
                                value={value}
                                style={{
                                    width: '100%',
                                }}
                                onChange={(value, option)=>{
                                    const category = option.map((option)=>{
                                        return {
                                            slug: option.value,
                                            type: option.label
                                        }
                                        
                                    })
                                    setCategory(category)
                                    setValue(value)
                                }}
                                
                                suffixIcon={suffix}
                                placeholder="Chọn thể loại"
                                options={[
                                    {
                                        value: 'ao',
                                        label: 'Áo',
                                    },
                                    {
                                        value: 'ao-thun',
                                        label: 'Áo thun',
                                    },
                                    {
                                    value: 'quan',
                                    label: 'Quần',
                                    },
                                    {
                                    value: 'quan-dai',
                                    label: 'Quần dài',
                                    },
                                    {
                                        value: 'quan-short',
                                        label: 'Quần Shorts',
                                        },
                                    {
                                    value: 'tat',
                                    label: 'Tất',
                                    },
                                    {
                                    value: 'mu',
                                    label: 'Mũ',
                                    },
                                    
                                    {
                                    value: 'phu-kien',
                                    label: 'Phụ Kiện',
                                    },
                                    
                                    {
                                    value: 'sport',
                                    label: 'Đồ thể thao',
                                    },
                                    {
                                        value: 'do-hang-ngay',
                                        label: 'Đồ hằng ngày',
                                    },
                                ]}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="flex flex-col px-5  mb-5">
                                <label htmlFor="price-product" className=" mb-2">Giá sản phẩm</label>
                                <div className="grid grid-cols-3">
                                    <input 
                                        id="price-product"
                                        className="w-full py-1 px-2 border-2 rounded col-span-2"
                                        value={priceProduct}
                                        onChange={handleSetPrice}
                                        maxLength={11}
                                        
                                    />
                                    <input className="text-center" value={'VND'} disabled/>
                                </div>
                            </div>
                            <div className="flex flex-col px-5  mb-5">
                                <label htmlFor="sale-price-product" className=" mb-2">Giảm giá</label>
                                <div  className="grid grid-cols-3">
                                    <input 
                                        id="sale-price-product" 
                                        className=" col-span-2 border-2 rounded py-1 px-4 outline-none" 
                                        value={salepriceProduct} 
                                        onChange={handleSetDiscount} 
                                        placeholder="Giảm giá"
                                        maxLength={11}
                                        required
                                    />
                                    <input className="text-center" value={'VND'} disabled/>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col px-5  mb-5">
                            <label htmlFor="detail-product" className=" mb-2">Mô tả</label>
                            <textarea id="detail-product" className="h-40 border-2 rounded py-1 px-4 outline-none resize-none" value={descriptionProduct} onChange={(e)=> setDescriptionProduct(e.target.value)} placeholder="Nhập thông tin chi tiết sản phẩm..."/>
                        </div>
                        <div className="flex justify-end px-5">
                            <button className="bg-black text-white px-3 py-1 rounded" onClick={handleAddProduct}>Thêm mới</button>
                        </div>
                    </div>
                </div>
            }
            {isDelete && 
                <div className="fixed top-0 right-0 bottom-0 left-0 h-screen w-full">
                    <div className="confirm-delete flex flex-col absolute top-24 left-1/2 -translate-x-1/2 w-80 min-h-28 px-5 py-2 text-black bg-white rounded shadow-2xl">
                        <div className="flex-1 text-center text-black">Bạn muốn xóa sản phẩm?</div>
                        <div className="flex justify-end">
                            <button className="text-white px-2 py-1 rounded bg-red-700 mr-4" onClick={handleDeleteProduct}>Xóa</button>
                            <button className="text-white px-2 py-1 rounded bg-black" onClick={handleCancelDeleteProduct}>Hủy</button>
                        </div>
                    </div>
                </div>
            }
            {edit &&
                <div className={cx('modal-edit', 'fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center h-screen w-full')}>
                    <div className="">
                        <div className={cx('add-product-container', 'relative py-10')}>
                            <button className="absolute flex justify-center top-0 right-0 items-center w-10 h-10" onClick={()=>setEdit(false)}>X</button>
                            <div className="flex flex-col px-5  mb-5">
                                <label htmlFor="name-product" className=" mb-2">Tên sản phẩm</label>
                                <input 
                                    id="name-product" 
                                    className="border-2 rounded py-1 px-4 outline-none" 
                                    value={updateName} 
                                    onChange={(e)=> {
                                        setUpdateName(e.target.value)
                                        if(!isEdited) {
                                            setIsEdited(true)
                                        }
                                    }} 
                                    placeholder="Nhập tên sản phẩm"
                                    
                                />
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="flex flex-col px-5  mb-5">
                                    <label htmlFor="img-product" className=" mb-2">Link ảnh</label>
                                    <input 
                                        id="img-product" 
                                        className="border-2 rounded py-1 px-4 outline-none"
                                        value={updateThumbnail} 
                                        onChange={(e)=> {
                                            setUpdateThumbnail(e.target.value)
                                            if(!isEdited) {
                                                setIsEdited(true)
                                            }
                                        }} 
                                        placeholder="Link ảnh"
                                      
                                    />
                                </div>
                                <div className="flex flex-col px-5 mb-5">
                                <label htmlFor="category" className=" mb-2">Thể loại</label>
                                <Select
                                    mode="multiple"
                                    maxCount={MAX_COUNT}
                                    value={updateCategoryValue}
                                    style={{
                                        width: '100%',
                                    }}
                                    onChange={(value, option)=>{
                                        const category = option.map((option)=>{
                                            return {
                                                slug: option.value,
                                                type: option.label
                                            }
                                            
                                        })
                                        setUpdateCategory(category)
                                        setUpdateCategoryValue(value)
                                        if(!isEdited) {
                                            setIsEdited(true)
                                        }
                                        
                                    }}
                                    
                                    suffixIcon={suffix}
                                    placeholder="Chọn thể loại"
                                    options={[
                                        {
                                            value: 'ao',
                                            label: 'Áo',
                                        },
                                        {
                                            value: 'ao-thun',
                                            label: 'Áo thun',
                                        },
                                        {
                                            value: 'quan',
                                            label: 'Quần',
                                        },
                                        {
                                            value: 'quan-dai',
                                            label: 'Quần dài',
                                        },
                                        {
                                            value: 'quan-short',
                                            label: 'Quần Shorts',
                                            },
                                        {
                                            value: 'tat',
                                            label: 'Tất',
                                        },
                                        {
                                            value: 'mu',
                                            label: 'Mũ',
                                        },
                                        
                                        {
                                            value: 'phu-kien',
                                            label: 'Phụ Kiện',
                                        },
                                        
                                        {
                                            value: 'sport',
                                            label: 'Đồ thể thao',
                                        },
                                        {
                                            value: 'do-hang-ngay',
                                            label: 'Đồ hằng ngày',
                                        },
                                    ]}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2">
                                <div className="flex flex-col px-5  mb-5">
                                    <label htmlFor="price-product" className=" mb-2">Giá sản phẩm</label>
                                    <div className="grid grid-cols-3">
                                        <input 
                                            id="price-product"
                                            className="w-full py-1 px-2 border-2 rounded col-span-2"
                                            value={updatePriceValue}
                                            onChange={handleSetUpdatePrice}
                                            maxLength={11}
                                            placeholder="Giá sản phẩm"
                                        />
                                        <input className="text-center" value={'VND'} disabled/>
                                    </div>
                                </div>
                                <div className="flex flex-col px-5  mb-5">
                                    <label htmlFor="sale-price-product" className=" mb-2">Giảm giá</label>
                                    <div  className="grid grid-cols-3">
                                        <input 
                                            id="sale-price-product" 
                                            className=" col-span-2 border-2 rounded py-1 px-4 outline-none" 
                                            value={updateDiscountValue} 
                                            onChange={handleSetUpdateDiscount} 
                                            maxLength={11}
                                            placeholder="Giảm giá"
                                            
                                        />
                                        <input className="text-center" value={'VND'} disabled/>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col px-5  mb-5">
                                <label htmlFor="detail-product" className=" mb-2">Mô tả</label>
                                <textarea 
                                    id="detail-product" 
                                    className="h-40 border-2 rounded py-1 px-4 outline-none resize-none" 
                                    value={updateDescription} 
                                    onChange={(e)=> {
                                        setUpdateDescription(e.target.value)
                                        if(!isEdited) {
                                            setIsEdited(true)
                                        }
                                    }} 
                                    placeholder="Nhập thông tin chi tiết sản phẩm..."
                                    />
                            </div>
                            <div className="flex justify-end px-5">
                                <button className="bg-black text-white px-3 py-1 rounded" onClick={handleEditProductInfo}>Lưu chỉnh sửa</button>
                            </div>
                        </div>
                    </div> 
                </div>
            }
            <Toaster/>
        </div>
    );
}

export default ProductContent;