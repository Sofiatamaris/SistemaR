
import React, { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import logo from '../../assets/images/logo.png';
import userdefault from '../../assets/images/userdefault.png';
import Button from '@mui/material/Button';
import { MdMenuOpen } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import { IoShieldHalfSharp } from "react-icons/io5";
import { MyContext } from '../../App';
import Avatar2 from '../../pages/Avatar2/index.js'
import {supabase} from '../../supabase/client';

const Header = ({session}) => {
  
    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpennotificationDrop, setisOpennotificationDrop] = useState(false);
    const openMyAcc = Boolean(anchorEl);
    const openNotifications = Boolean(isOpennotificationDrop);

    const context = useContext(MyContext)

    const handleOpenMyAccDrop = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMyAccDrop = () => {
        setAnchorEl(null);
    };

    const handleOpenotificationsDrop = () => {
        setisOpennotificationDrop(true)
    }

    const handleClosenotificationsDrop = () => {
        setisOpennotificationDrop(false)
    }

   
    const changeTheme=()=>{
       if(context.theme==="dark"){
        context.setTheme("light");
       }
       else{
        context.setTheme("dark");
       }
    }
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)
    const [full_name, setUsername] = useState(null)
    const [roll, setRole] = useState(null)
    const [birthday, setBirthDay] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)

    useEffect(() => {
        let ignore = false
        async function getProfile() {
          setLoading(true)
          const { user } = session
    
          const { data, error } = await supabase
            .from('profiles')
            .select(`full_name, roll, birthday, avatar_url`)
            .eq('id', user.id)
            .single()
    
          if (!ignore) {
            if (error) {
              console.warn(error)
            } else if (data) {
              setUsername(data.full_name)
              setRole(data.roll)
              setBirthDay(data.birthday)
              setAvatarUrl(data.avatar_url)
            }
          }
    
          setLoading(false)
        }
    
        getProfile()
    
        return () => {
          ignore = true
        }
      }, [session])

    async function updateProfile(event, avatarUrl) {
        event.preventDefault()
    
        setLoading(true)
        const { user } = session
    
        const updates = {
          id: user.id,
          full_name,
          roll,
          birthday,
          avatar_url: avatarUrl,
          updated_at: new Date(),
        }
    
        const { error } = await supabase.from('profiles').upsert(updates)
    
        if (error) {
          alert(error.message)
        } else {
          setAvatarUrl(avatarUrl)
          
        }
        setLoading(false)
      }

    
    return (
        <>
            <header className="d-flex align-items-center">
                <div className="container-fluid w-100">
                    <div className="row d-flex align-items-center w-100">
                        {/* Logo Wraooer */}
                        <div className="col-sm-2 part1">
                            <div className="d-flex align-items-center logo ">
                                <img src={logo} />
                                <span className="ml-2">PLANTSISTEM</span>
                            </div>
                        </div>


                        {   
                            context.windowWidth>992 && 
                            <div className="col-sm-3 d-flex align-items-center part2 res-hide">
                            <Button className="rounded-circle mr-3" onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
                                {
                                    context.isToggleSidebar === false ? <MdMenuOpen /> : <MdOutlineMenu />
                                }
                            </Button>
                          
                            </div>
                            
 
                        }
                       

                        <div className="col-sm-7 d-flex align-items-center justify-content-end part3">
                            <Button className="rounded-circle mr-3" onClick={changeTheme}>
                                <MdOutlineLightMode />
                            </Button>

                        {

                            context.windowWidth<992 && 
                            <div className='dropdownWrapper position-relative'>

                            <Button className="rounded-circle mr-3" onClick={() => context.setIsOpenNav(!context.isToggleSidebar)}>
                                {
                                    context.isOpenNav === false ? <MdMenuOpen /> : <MdOutlineMenu />
                                }
                            </Button>
                            </div>
                        }



                          

                                
                           

                            {
                                context.isLogin !== true ?
                                    <Link to={'/'}><Button className='btn-blue btn-lg btn-round'>Sign In</Button></Link>
                                    :

                                    <div className="myAccWrapper">
                                        <Button className="myAcc d-flex align-items-center"
                                            
                                        >
                                            <div className="userImg">
                                                <span className="rounded-circle">
                                                    {avatar_url ? (
                                                        <Avatar2
                                                            url={avatar_url}
                                                            size={40}
                                                            onUpload={(event, url) => updateProfile(event, url)}
                                                        />
                                                    ) : (
                                                        <img src={userdefault}  />
                                                    )}
                                                </span>
                                            </div>

                                            <div className="userInfo res-hide">
                                                <h4>{full_name}</h4>
                                                
                                            </div>
                                            

                                        </Button>

                                        <Menu
                                            anchorEl={anchorEl}
                                            id="account-menu"
                                            open={openMyAcc}
                                            onClose={handleCloseMyAccDrop}
                                            onClick={handleCloseMyAccDrop}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        >

                                            <MenuItem onClick={handleCloseMyAccDrop}>
                                                <ListItemIcon>
                                                    <PersonAdd fontSize="small" />
                                                </ListItemIcon>
                                                My Account
                                            </MenuItem>
                                            <MenuItem onClick={handleCloseMyAccDrop}>
                                                <ListItemIcon>
                                                    <IoShieldHalfSharp />
                                                </ListItemIcon>
                                                Reset Password
                                            </MenuItem>
                                            <MenuItem onClick={() => supabase.auth.signOut()}>
                                                <ListItemIcon>
                                                    <Logout fontSize="small" />
                                                </ListItemIcon>
                                                Logout
                                            </MenuItem>
                                        </Menu>


                                    </div>

                            }





                        </div>

                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;