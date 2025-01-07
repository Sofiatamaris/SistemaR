import Button from '@mui/material/Button';
import { MdDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { FaCartArrowDown } from "react-icons/fa6";
import { IoMdAnalytics } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { Link , useNavigate} from 'react-router-dom';
import { useContext, useState} from 'react';
import { IoMdLogOut } from "react-icons/io";
import { MyContext } from '../../App';
import { FaUser } from "react-icons/fa";
import {supabase} from '../../supabase/client';



const Sidebar = () => {

    let navigate = useNavigate()

    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

    const context = useContext(MyContext);

    const isOpenSubmenu = (index) => {
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu)

    }
    

    function handleLogout() {
      
        supabase.auth.signOut()
          .then(() => {
            sessionStorage.removeItem('token');
            navigate('/');
            // Aquí puedes agregar acciones adicionales, como mostrar un mensaje de éxito
          })
          .catch(error => {
            console.error(error);
            // Manejar errores, como mostrar un mensaje de error al usuario
          });
      }

    
    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>
                        <Link to="/dashboard">
                            <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                                <span className='icon'><MdDashboard /></span>
                                Inicio
                              
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/products">
                            <Button className={`w-100 ${activeTab === 1 ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                                <span className='icon'><IoMdAnalytics /></span>
                                Gestionar Estaciones
                                
                            </Button>
                        </Link>
                    </li>
                    
                    <li>
                        <Link to="/gestionUsers">
                            <Button className={`w-100 ${activeTab === 2 ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                                <span className='icon'><FaUser /></span>
                                Gestionar usuarios
                                
                            </Button>
                        </Link>
                    </li>

                    <li>
                        <Link to="/EditUser">
                            <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
                                <span className='icon'><IoIosSettings /></span>
                                Editar Usuario
                            </Button>
                        </Link>
                    </li>

                    

                </ul>


                <br />

                <div className='logoutWrapper'>
                    <div className='logoutBox'>
                        
                        <Button onClick={handleLogout} variant="contained"><IoMdLogOut /> Salir</Button>
                        
                    </div>
                </div>

            </div>
        </>
    )
}

export default Sidebar;