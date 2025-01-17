import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./responsive.css";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { createContext, useEffect, useState } from "react";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Products from "./pages/Products";
import ProductUpload from "./pages/ProductUpload";
import GestionUsers from "./pages/GestionUsers";
import EditUsers from "./pages/EditUser";

import {supabase} from './supabase/client';


const MyContext = createContext();

function App() {


  
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isHideSidebarAndHeader, setisHideSidebarAndHeader] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  const [token,setToken] = useState(false)
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])



  if(token){
    sessionStorage.setItem('token',JSON.stringify(token))
  }

  useEffect(() => {
    if(sessionStorage.getItem('token')){
      let data = JSON.parse(sessionStorage.getItem('token'))
      setToken(data)
    }
  },   [])

  
  

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openNav = () => {
    setIsOpenNav(true);
  };

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isHideSidebarAndHeader,
    setisHideSidebarAndHeader,
    theme,
    setTheme,
    windowWidth,
    openNav,
    isOpenNav,
    setIsOpenNav
  };

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
      {isHideSidebarAndHeader !== true && (<>{session && <Header key={session.user.id} session={session} />}</>)}

        <div className="main d-flex">
          {isHideSidebarAndHeader !== true && (
            <>
            <div className={`sidebarOverlay d-none ${isOpenNav===true && 'show'}`} onClick={()=>setIsOpenNav(false)}></div>
              <div
                className={`sidebarWrapper ${
                  isToggleSidebar === true ? "toggle" : ""
                } ${isOpenNav === true ? "open" : ""}`}
              >
                {token?<Sidebar/>:''}
              </div>
            </>
          )}
         

          <div
            className={`content ${isHideSidebarAndHeader === true && "full"} ${
              isToggleSidebar === true ? "toggle" : ""
            }`}
            
          >
            <Routes>
              <Route path="/" exact={true} element={<Login setToken={setToken} />} />
              {token?<Route path="/dashboard" exact={true} element={<Dashboard />} />:""}
              {session?<Route path="/gestionUsers" exact={true} element={<GestionUsers key={session.user.id} session={session}/>} />:''}
              {session?<Route path="/EditUser" exact={true} element={<EditUsers key={session.user.id} session={session} />} />:''}
              <Route path="/signUp" exact={true} element={<SignUp />} />
              <Route path="/products" exact={true} element={<Products />} />
              <Route path="/product/upload" exact={true} element={<ProductUpload />}
              />
            </Routes>
          </div>
        </div>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext };
