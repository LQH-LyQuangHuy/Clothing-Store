
import { Route, Routes } from 'react-router-dom';

import '~/App.css';
import Header from '~/Components/Header'
import Footer from '~/Components/Footer'
import Home from '~/Layouts/Home'
import Cart from '~/Layouts/Cart'
import Detail from '~/Layouts/Detail'
import Category from './Layouts/Category';
import UserInfo from './Layouts/UserInfo';
import Order from './Layouts/Order';
import Admin from './Layouts/Admin';
import { useEffect, useState } from 'react';

function App() {
    
    return (
        <div className="App">
            <Header/>
            <Routes>
                <Route path='' Component={Home}/>
                <Route path='/cart' Component={Cart}/>
                <Route path='/user' Component={UserInfo}/>
                <Route path='/don-mua' Component={Order}/>
                <Route path='/admin' Component={Admin}/>
                <Route path='/san-pham/:id' Component={Detail}/>
                <Route path='/the-loai/:slug' Component={Category}/>
            </Routes>
            <Footer/>
        </div>
    );
}

export default App;
