import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from '@mui/material/Button';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useState, useEffect } from 'react'
import {supabase} from '../../supabase/client';
import Avatar from '../Avatar/index.js'
import Avatar2 from '../Avatar2/index.js'



//breadcrumb code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});


function EditUsers({session}) {

    const [loading, setLoading] = useState(true)
    const [full_name, setUsername] = useState(null)
    const [roll, setRole] = useState(null)
    const [birthday, setBirthDay] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)
    const [email, setEmail] = useState(null)

    useEffect(() => {
        let ignore = false
        async function getProfile() {
          setLoading(true)
          const { user } = session
    
          const { data, error } = await supabase
            .from('profiles')
            .select(`full_name, roll, birthday, avatar_url, email`)
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
              setEmail(data.email)
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
          email,
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
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                    <h5 className="mb-0">Editar Usuario</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="/dashboard"
                            label="Inicio"
                            icon={<HomeIcon fontSize="small" />}
                        />

                        <StyledBreadcrumb
                            component="a"
                            label="Editar usuario"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>
                <form onSubmit={updateProfile} className='form'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='card p-4 mt-0'>
                                <h5 className='mb-4'>Información básica</h5>


                                <div className='row'>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>USERNAME</h6>
                                            <input id="full_name" type="text" value={full_name || ''} onChange={(e) => setUsername(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>ROLL</h6>
                                            <input id="roll" type="text" required value={roll || ''} onChange={(e) => setRole(e.target.value)}/>
                                        </div>
                                    </div>
                                    



                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>CORREO</h6>
                                            <input id="email" type="text" value={session.user.email} disabled onChange={(e) => setEmail(e.target.value)}/>
                                        </div>
                                    </div>

                                </div>


                                <div className='row'>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>FECHA DE NACIMIENTO</h6>
                                            <input id="birthday" type="date" required value={birthday || ''} onChange={(e) => setBirthDay(e.target.value)} />
                                        </div>
                                    </div>


                                </div>

                                <div >
                                    <div className="imagesUploadSec">
                                        <h6 className="mb-4">FOTO DE PERFIL:</h6>

                                        <div className='imgUploadBox d-flex align-items-center'>

                                            
                                            <Avatar
                                            url={avatar_url}
                                            size={150}
                                            onUpload={(event, url) => {
                                                updateProfile(event, url)
                                              }}
                                            />

                                            
                                           


                                        </div>

                            <br />

                            <Button type="submit" disabled={loading} className="btn-blue btn-lg btn-big w-100"
                            ><FaCloudUploadAlt /> &nbsp; ACTUALIZAR   </Button>
                        </div>
                        
                    </div>

                               
                            </div>

                        </div>

                    </div>


                    
                </form>

            </div>
        </>
    )
}

export default EditUsers;