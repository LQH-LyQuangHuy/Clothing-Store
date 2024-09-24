
import classNames from "classnames/bind";

import styles from './Toast.module.scss'

const cx = classNames.bind(styles)

function Toast({
    info = {
        name: 'Tên sản phẩn',
        size: 'L',
        quantity: '1',
        thumbnail: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/April2024/QKK.EC.DEN8.jpg',
        type: 'success'
    }
}) {
    return (  
        <div className={cx('wrapper', 'shadow-2xl px-2 py-4 rounded')}>
            <div className="text-center font-bold py-2 mb-2 border-b-2">Đã thêm vào giỏ hàng</div>
            <div className="flex">
                <div className="w-16 h-24 ">
                    <img className="h-full object-cover rounded" src={info.thumbnail}  alt={info.thumbnail}/>
                </div>
                <div className="flex flex-col px-4">
                    <h1>{info.name}</h1>
                    <p>{`Size: ${info.size}`}</p>
                    <p>{`Số lượng: ${info.quantity}`}</p>
                </div>
            </div>
        </div>
    );
}

export default Toast;