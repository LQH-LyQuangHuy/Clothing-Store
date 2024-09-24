
import classNames from "classnames/bind";
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState,useRef } from "react";


import styles from './Header.module.scss'
import useDebounce from '~/Hooks/useDebounce'
import useConvertSlug from '~/Hooks/useConvertSlug'

const cx = classNames.bind(styles)


function Header() {
    const [show, setShow] = useState(false)
    const [showSearchResult, setShowSearchResult] = useState(false)
    const [login, setlogin] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [value, setValue] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [confirmPassword, setConfirmPassword] = useState('')
    const [user, setUser] = useState(null)
    const debounce = useDebounce(value, 500)
    const slug = useConvertSlug(debounce)
    const searchRef = useRef()
    
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(()=>{
        fetch('/auth/user')
        .then(res=> res.json())
        .then(data=>{
            if(!data.error) {
                setUser(data)
            }
        })
    },[show])

    const handleLogin = useCallback(()=>{
        
        if (!username) {
            toast.error('Bạn chưa nhập tài khoản!')
            return
        }

        if (!password) {
            toast.error('Bạn chưa nhập mật khẩu!')
            return
        }

        const payload = {
            username,
            password
        } 

        fetch('/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        })
        .then(res=> res.json())
        .then(user=>{
            if(!user.error) {
                toast.success("Đăng nhập thành công!")
                setShow(false)
                // navigate('/', {state: user})
            }
            else {
                toast.error(user.error)
            }
        })
        
    },[username, password]) 

    async function handleAccessCart () {
        await fetch('/cart')
        .then(res=> res.json())
        .then(data=> {
            if(data.error) {
                alert('Để truy cập giỏ hàng, bạn cần phải đăng nhập tài khoản!')
                return
            }
            navigate('/cart', )

        })
        .catch(error => console.log("Error:", error))
    }

    useEffect(()=>{
        if (slug) {
            fetch(`http://localhost:5000/product/search?search=${slug}`)
            .then(res=> res.json())
            .then(searchResults => setSearchResults(searchResults))
        }
    },[slug])

    
    useEffect(()=>{
        if(!value) {
            setSearchResults([])
        }
    },[value])

   
    if(searchRef.current) {
        searchRef.current.addEventListener('focus', ()=>{
            setShowSearchResult(true)
        })
        searchRef.current.addEventListener('blur', ()=>{
            setShowSearchResult(false)
        })
       
    }
    

    return (  
        <div className={cx('wrapper')}>
            <Link to={'/'} className={cx('nav', 'logo')}>
                <img src="https://www.coolmate.me/images/logo-coolmate-new.svg?v=1" alt="Logo"></img>
            </Link>
            <div className={cx('nav', 'product')}>
                <div className="flex justify-center items-center h-full">Sản Phẩm</div>
                <div className={cx('sub-nav', 'sub-product', {'shadow-2xl rounded-b-lg' : true})}>
                    <div className={cx('col-sub-nav')}>
                        <h4>Áo nam</h4>
                        <Link to={'/the-loai/ao-thun'} state={'ao-thun'} className={cx('category')}>Áo thun</Link>
                        <Link to={'/the-loai/ao-the-thao'} state={'sport'} className={cx('category')}>Áo thể thao</Link>
                        <Link to={'/the-loai/tank-top'} state={'tank-top'} className={cx('category')}>Áo tanktop</Link>
                    </div>
                    <div className={cx('col-sub-nav')}>
                        <h4>Quần nam</h4>
                        <Link className={cx('category')} to={'/the-loai/quan-dai'} state={'quan-dai'}>Quần dài</Link>
                        <Link className={cx('category')} to={'/the-loai/quan-shorts'} state={'quan-short'}>Quần shorts</Link>
                        <Link className={cx('category')} to={'/the-loai/quan-jeans'} state={'quan-jeans'}>Quần jeans</Link>
                    </div>
                    <div className={cx('col-sub-nav')}>
                        <h4>Phụ kiện</h4>
                        <Link className={cx('category')} to={'/the-loai/tat'} state={'tat'}>Tất/Vớ</Link>
                        <Link className={cx('category')}to={'/the-loai/mu'} state={'mu'}>Mũ/Nón</Link>
                        
                    </div>

                </div>
            </div>
            <Link to={'/the-loai/do-the-thao'} state={'sport'} className={cx('nav')}>Đồ thể thao</Link>
            <Link to={'/the-loai/do-hang-ngay'} state={'do-hang-ngay'} className={cx('nav')}>Mặc hằng ngày</Link>
            <div className={cx('search', 'text-black')}>
                <input ref={searchRef} placeholder="Tìm kiếm sản phẩm..." value={value} onChange={(e)=> setValue(e.target.value)}></input>
                {showSearchResult && 
                    <div className={cx('searchResults-wrapper',"shadow-2xl")}>
                    { searchResults.length > 0 ?
                        <>
                            {searchResults.map((searchResult)=>(
                                <Link key={searchResult._id} className={cx('searchResult',"flex text-black")}
                                    onClick={(e)=>{
                                        e.preventDefault()
                                        setValue('')
                                        setSearchResults([])
                                        navigate(`/san-pham/${searchResult._id}`, {
                                            state: searchResult._id
                                        })
                                    }}
                                >
                                    <div className="w-16 h-20">
                                        <img className="h-full rounded" src={searchResult.thumbnail[0]}/>
                                    </div>
                                    <div>
                                        <h1>{searchResult.name}</h1>
                                        <p className="font-bold mt-1">{`${searchResult.price.toLocaleString('vi-VN')} đ`}</p>
                                    </div>
                                </Link>
                            ))}
                        </>
                        :
                        <div className="flex justify-center items-center h-24 text-black">
                            Kết quả tìm kiếm
                        </div>
                    }
                </div>
                }
            </div>
            <div className={cx('nav', 'cart', 'nav-icon')} onClick={handleAccessCart}>
                <img src="https://www.coolmate.me/images/header/icon-cart-white-new.svg?v=1" alt="cart"/>
            </div>
            { !user ?
                <div className={cx('nav', 'account', 'nav-icon')} 
                    onClick={async()=>{
                        setShow(true)
                    }}
                >
                    <img src="https://www.coolmate.me/images/header/icon-account-white-new.svg" alt="account" />
                </div>
                :
                <div className={cx('nav', 'account', 'nav-icon', 'relative')} >
                    {user.username}
                    <div className={cx('sub-account',"hidden flex-col absolute top-full right-0  bg-gray-200 shadow-2xl rounded-b-lg ")}>
                        <Link to={'/user'} className={cx('option',"text-black normal-case py-1 px-4 w-max block")}>Thông tin người dùng</Link>
                        { user.role == 'admin' && <Link to={'/admin'} className={cx('option',"text-black normal-case py-1 px-4 block")}>Quản lí sản phẩm</Link> }
                        <Link to={'/don-mua'} className={cx('option',"text-black normal-case py-1 px-4 block")}>Đơn mua</Link>
                        <div className={cx('option',"text-black normal-case py-1 px-4 rounded-b-lg")} 
                            onClick={()=>{
                                fetch('/auth/logout')
                                window.location.href = '/'
                            }}
                        >
                            Đăng xuất
                        </div>
                    </div>
                </div>
            }
            {show && 
                <div className={cx('modal')} 
                onClick={()=>{
                    if(login) {
                        setlogin(false)
                    }
                    setShow(false)
                }}
                >
                    { !login ?
                        <div className={cx('login-form', {'relative flex flex-col justify-center px-20 rounded-md' : true})} onClick={(e)=>{e.stopPropagation()}}>
                            <button className="absolute flex justify-center items-center rounded-full w-8 h-8 -top-4 -right-4 bg-black" 
                                onClick={()=> {
                                    if(login) {
                                        setlogin(false)
                                    }
                                    setShow(false)
                                }}
                            >
                                X
                            </button>
                            <label htmlFor="username" className="font-bold mb-2 text-black">Tài khoản</label>
                            <input id="username" name="username" className="w-full text-black py-2 px-3 border-2 rounded-3xl " placeholder="Nhập tài khoản" 
                                value={username} 
                                onChange={(e)=>setUsername(e.target.value)}
                            />
                            <label htmlFor="password" className="font-bold mt-3 mb-2 text-black">Mật khẩu</label>
                            <input id="password" name="password" className="w-full text-black py-2 px-3 border-2 rounded-3xl " placeholder="Nhập mật khẩu" 
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                            />
                            <button type="submit" className="mt-8 py-2 px-3 bg-black rounded-3xl" onClick={handleLogin}>Đăng nhập</button>
                            <p className="text-center text-black mt-2">Bạn chưa có tài khoản? <button className="text-blue-700" onClick={()=>{setlogin(true)}}>Click vào đây để đăng kí!</button></p>
                        </div>
                        :
                        <div className={cx('login-form', {'relative flex flex-col justify-center px-20 rounded-md' : true})} onClick={(e)=>{e.stopPropagation()}}>
                            <button className="absolute flex justify-center items-center rounded-full w-8 h-8 -top-4 -right-4 bg-black" 
                                onClick={()=> {
                                    if(login) {
                                        setlogin(false)
                                    }
                                    setShow(false)
                                }}
                            >
                                X
                            </button>
                            <label htmlFor="username" className="font-bold mb-2 text-black">Tài khoản</label>
                            <input id="username" name="username" className="w-full text-black py-2 px-3 border-2 rounded-3xl " placeholder="Nhập tài khoản" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                            <label htmlFor="email" className="font-bold mt-2 mb-2 text-black">Email</label>
                            <input id="email" name="email" className="w-full text-black  py-2 px-3 border-2 rounded-3xl " placeholder="Nhập tài khoản" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                            <label htmlFor="password" className="font-bold mt-3 mb-2 text-black">Mật khẩu</label>
                            <input id="password" name="password" className="w-full text-black py-2 px-3 border-2 rounded-3xl " placeholder="Nhập mật khẩu" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                            <label htmlFor="confirmPassword" className="font-bold mt-3 mb-2 text-black">Xác nhận mật khẩu</label>
                            <input id="confirmPassword" name="confirmPassword" className="w-full text-black py-2 px-3 border-2 rounded-3xl " placeholder="Nhập lại mật khẩu"/>
                            <button type="submit" className="mt-8 py-2 px-3 bg-black rounded-3xl">Đăng kí ngay</button>
                            <button className="text-blue-700 text-center mt-2" onClick={()=>{setlogin(false)}}>Quay lại</button>
                        </div>
                    }
                </div>
            }
            
            <Toaster/>
        </div>
    );
}

export default Header;