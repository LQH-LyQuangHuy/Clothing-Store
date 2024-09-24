
import classNames from "classnames/bind";

import styles from './UserInfo.module.scss'
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

const cx = classNames.bind(styles)

function UserInfo() {
    const [show, setShow] = useState(null)
    const [user, setUser] = useState(null)
    const [firstName, setFirstName] = useState('')
    const [LastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')

    useEffect(()=>{
        fetch('/auth/user')
        .then(res=> res.json())
        .then(userInfo=>{
            setUser(userInfo)
            setFirstName(userInfo.firstName)
            setLastName(userInfo.LastName)
            setEmail(userInfo.email)
            setPhone(userInfo.phone)
            setAddress(userInfo.address)
        })
    },[])

    const  handleEditUserInfo = useCallback((e) => {
        const firstNameInput = document.querySelector('input[name="first-name"]')
        const LastNameInput = document.querySelector('input[name="last-name"]')
        const emailInput = document.querySelector('input[name="email"]')
        const phoneInput = document.querySelector('input[name="phone"]')
        const addressInput = document.querySelector('input[name="address"]')
       
        
        firstNameInput.disabled =  false
        LastNameInput.disabled = false
        emailInput.disabled = false
        phoneInput.disabled = false
        addressInput.disabled = false
        setShow(true)
    },[user])

    const handleSaveUserInfo = useCallback((e)=>{
        const updateUserInfo = {
            firstName,
            LastName,
            email,
            phone,
            address
        }

        fetch('/auth/update-userInfo', {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateUserInfo)
        })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                if(result.error) {
                    toast.error('Cập nhật thông tin không thành công!')
                }
                else {
                    toast.success('Cập nhật thông tin thành công!')
                    window.location.reload()
                }

            })
            .catch(error => toast.error('Cập nhật thông tin không thành công!'))

    },[firstName, LastName, email, phone, address])

    function handleCancelEditUserInfo () {
        const firstNameInput = document.querySelector('input[name="first-name"]')
        const LastNameInput = document.querySelector('input[name="last-name"]')
        const emailInput = document.querySelector('input[name="email"]')
        const phoneInput = document.querySelector('input[name="phone"]')
        const addressInput = document.querySelector('input[name="address"]')
       
        
        firstNameInput.disabled =  true
        LastNameInput.disabled = true
        emailInput.disabled = true
        phoneInput.disabled = true
        addressInput.disabled = true

        setShow(false)
        setFirstName(user.firstName)
        setLastName(user.LastName)
        setEmail(user.email)
        setPhone(user.phone)
        setAddress(user.address)
    }
    
    return (  
        <div className={cx('wrapper')}>
            {user && 
                <div>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Thông tin người dùng</h2>
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">Tên:</label>
                                    <div className="mt-2">
                                        <input 
                                            className="block w-full rounded-md border-0 px-4 py-1.5 text-g/ray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                            name="first-name" 
                                            value={firstName} 
                                            onChange={(e)=>setFirstName(e.target.value)}
                                            disabled 
                                        />
                                    </div>
                                </div> 

                                <div className="sm:col-span-3">
                                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">Họ:</label>
                                    <div className="mt-2">
                                        <input 
                                            className="block w-full rounded-md border-0 px-4 py-1.5 text-g/ray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            name="last-name"
                                            value={LastName} 
                                            onChange={(e)=>setLastName(e.target.value)}
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email:</label>
                                    <div className="mt-2">
                                        <input 
                                            className="block w-full rounded-md border-0 px-4 py-1.5 text-g/ray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            name="email"
                                            value={email}  
                                            onChange={(e)=>setEmail(e.target.value)}
                                            disabled 
                                        />
                                    </div>
                                </div>
                                
                                <div className="sm:col-span-3">
                                    <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">Số điện thoại:</label>
                                    <div className="mt-2">
                                        <input 
                                            className="block w-full rounded-md border-0 px-4 py-1.5 text-g/ray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            name="phone" 
                                            value={phone} 
                                            onChange={(e)=>setPhone(e.target.value)}
                                            disabled 
                                        />
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">Địa chỉ:</label>
                                    <div className="mt-2">
                                        <input 
                                            className="block w-full rounded-md border-0 px-4 py-1.5 text-g/ray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            name="address"
                                            value={address} 
                                            onChange={(e)=>setAddress(e.target.value)}
                                            disabled 
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>                
                    </div>
                    {!show ?
                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <div 
                                className="rounded-md bg-indigo-600 px-3  py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" 
                                onClick={handleEditUserInfo}
                            >
                                Chỉnh sửa
                            </div> 
                        </div>                       
                        :
                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <button 
                                type="button" 
                                className="text-sm font-semibold leading-6 text-gray-900"
                                onClick={handleCancelEditUserInfo}
                            >
                                Cancel
                            </button>
                            <button 
                                className="rounded-md bg-indigo-600 px-3  py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" 
                                onClick={handleSaveUserInfo}
                            >
                                Save
                            </button>
                        </div>
                    }
                </div>
            }
            <Toaster/>
        </div>
    );
}

export default UserInfo;