import { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/images/logo.png';
import patern from '../../assets/images/pattern.webp';
import { MyContext } from '../../App';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import Button from '@mui/material/Button';
import { Link, useNavigate} from "react-router-dom";
import {supabase} from '../../supabase/client';
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Login = ({setToken}) => {

    let navigate = useNavigate()
    let location = useLocation()
    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setisShowPassword] = useState(false);
    const context = useContext(MyContext);
    const [formData,setFormData] = useState({
        email:"",password:""
    });
    console.log(formData);

    useEffect(() => {
        if (location.pathname === '/') {
          sessionStorage.removeItem('token');
        }
      }, []);


    function handleChange (event){
        setFormData((prevFormData)=>{
            return{
                ...prevFormData,
                [event.target.name]:event.target.value
            }

        })

    }

    async function handleSubmit(e){
        e.preventDefault()
        try{
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            })
            if (error) throw error
            console.log(data)
            setToken(data)
            navigate('/dashboard')
            
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Inicio de Sesion Fallido",
                text: `credenciales incorrectas `,
              });
        }
    }

    

    

    useEffect(() => {
        context.setisHideSidebarAndHeader(true);
    }, []);

    const focusInput = (index) => {
        setInputIndex(index);
    }

    return (
        <>
            <img src={patern} className='loginPatern' />
            <section className="loginSection ">
                <div className="loginBox">
                    <div className='logo text-center'>
                        <img src={Logo} width="60px" />
                        <h5 className='font-weight-bold'>PLANTSISTEM</h5>
                    </div>

                    <div className='wrapper mt-3 card border'>
                        <form onSubmit={handleSubmit} id='login-form' >
                            <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                                <span className='icon'><MdEmail /></span>
                                <input type='email' name='email' onChange={handleChange} className='form-control' require placeholder='ingresa tu email' onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus/>
                            </div>

                            <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                                <span className='icon'><RiLockPasswordFill /></span>
                                <input type={`${isShowPassword === true ? 'text' : 'password'}`} name='password' required onChange={handleChange} className='form-control' placeholder='ingresa tu contraseña' onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)} />

                                <span className='toggleShowPassword' onClick={() => setisShowPassword(!isShowPassword)}>
                                    {
                                        isShowPassword === true ? <IoMdEyeOff /> : <IoMdEye />
                                    }

                                </span>

                            </div>


                            <div className='form-group'>
                                <Button type="submit" className="btn-blue btn-lg w-100 btn-big">Iniciar Sesion</Button>
                            </div>

                      

                        </form>
                    </div>

                    <div className='wrapper mt-3 card border footer p-3'>
                        <span className='text-center'>
                            Aun no tienes una cuenta?
                            <Link to={'/signUp'} className='link color ml-2'>Registrate</Link>
                        </span>
                    </div>

                </div>
            </section>
        </>
    )
}

export default Login;