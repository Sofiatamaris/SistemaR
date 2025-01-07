import { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/images/logo.png';
import patern from '../../assets/images/pattern.webp';
import { MyContext } from '../../App';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import {supabase} from '../../supabase/client';
import Swal from "sweetalert2";

const SignUp = () => {

    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setisShowPassword] = useState(false);
    const context = useContext(MyContext);
    const [formData,setFormData] = useState({
        full_name:"",email:"",password:"",
    });
    console.log(formData);
    

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
        

        if (formData.password.length < 8) {
            Swal.fire({
                icon: "error",
                title: "Registro fallido",
                text: "La contraseña debe tener al menos 8 caracteres",
              });
            return;
        }   

        if (formData.full_name.length < 3) {
            Swal.fire({
                icon: "error",
                title: "Registro fallido",
                text: "El username debe tener al menos 3 caracteres",
              });
            return;
        }    

        

        
        try{
            const { data, error } = await supabase.auth.signUp(
                {
                    email: formData.email,
                    password: formData.password,
                    options:{
                        data:{
                            full_name: formData.full_name,
                        }
                    }
                    
                }
                
            )
            
            
            
            if (error) throw error
            Swal.fire({
                title: "¡Registro exitoso!",
                text: "Tu cuenta ha sido creada. Inicia sesión para continuar.",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Iniciar sesión",
              }).then((result) => {
                if (result.isConfirmed) {

                  window.location.href = "/"; 
                }
              });
            } catch (error) {
                alert(error)
                Swal.fire({
                    icon: "error",
                    title: "Registro fallido",
                    text: "El usuario ya esta registrado",
                  });
            }
    }

    useEffect(() => {
        context.setisHideSidebarAndHeader(true);
        window.scrollTo(0,0);
    }, []);

    const focusInput = (index) => {
        setInputIndex(index);
    }

    return (
        <>
            <img src={patern} className='loginPatern' />
            <section className="loginSection">

                

                    <div className='col-md-4 mx-auto d-flex justify-content-center'>
                        <div className="loginBox ">
                            <div className='logo text-center'>
                                <img src={Logo} width="60px" />
                                <h5 className='font-weight-bold'>Registra una nueva cuenta</h5>
                            </div>

                            <div className='wrapper mt-3 card border '>
                                <form onSubmit={handleSubmit}>

                                    <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
                                        <span className='icon'><FaUserCircle /></span>
                                        <input type='text' name='full_name' onChange={handleChange} required className='form-control' placeholder='ingresa tu username' onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus/>
                                    </div>


                                    <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
                                        <span className='icon'><MdEmail /></span>
                                        <input type='email' name='email' onChange={handleChange} required className='form-control' placeholder='ingresa tu correo' onFocus={() => focusInput(1)} onBlur={() => setInputIndex(null)} />
                                    </div>

                                    <div className={`form-group position-relative ${inputIndex === 2 && 'focus'}`}>
                                        <span className='icon'><RiLockPasswordFill /></span>
                                        <input type={`${isShowPassword === true ? 'text' : 'password'}`} name='password'required onChange={handleChange} className='form-control' placeholder='ingresa tu contraseña' onFocus={() => focusInput(2)} onBlur={() => setInputIndex(null)} />

                                        <span className='toggleShowPassword' onClick={() => setisShowPassword(!isShowPassword)}>
                                            {
                                                isShowPassword === true ? <IoMdEyeOff /> : <IoMdEye />
                                            }

                                        </span>

                                    </div>



                                    <div className='form-group'>
                                        <Button type="submit" className="btn-blue btn-lg w-100 btn-big">Registrarse</Button>
                                    </div>

                                   

                                </form>

                                <span className='text-center d-block mt-3'>
                                    Ya tienes una cuenta?
                                    <Link to={'/'} className='link color ml-2'>Inicia Sesion</Link>
                                </span>

                            </div>



                        </div>
                    </div>
                


            </section>
        </>
    )

}

export default SignUp;