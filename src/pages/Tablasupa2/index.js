
import React,{useState, useEffect} from 'react';
import {supabase} from '../../supabase/client';
import Swal from "sweetalert2";
import {
  Table,
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  ModalFooter,
} from "reactstrap";
import Select from '@mui/material/Select';
import SearchBox from "../SearchBox";
import FormControl from '@mui/material/FormControl';
import Avatar2 from '../Avatar2';
import Pagination from '@mui/material/Pagination';
import MenuItem from '@mui/material/MenuItem';


const App = ({session}) => {


  
  const [users,setUsers]=useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [stationCount, setStationCount] = useState(0); 
  const [showBy, setshowBy] = useState('');

  

  const [user,setUser]=useState({
    full_name:'',avatar_url:'',birthday:'',roll:''
  })

  const [user2,setUser2]=useState({
    id:'',full_name:'',avatar_url:'',birthday:'',roll:''
  })

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); 
  }

  const toggleModal2 = () => {
    setIsModalOpen2(!isModalOpen2); 
  }


  console.log(user2)

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




  useEffect(() => {
    fetchUsers()
  }, [])
  

  async function fetchUsers(){
    const {data} = await supabase
      .from('profiles')
      .select('*')
      .order('id', { ascending: true });
      setUsers(data)
      setStationCount(data.length); 



  }

  function handleChange(event){
    
    setUser(prevFormData=>{
      return{
        ...prevFormData,
        [event.target.name]:event.target.value
      }
    })
  }

  function handleChange2(event){
    
    setUser2(prevFormData=>{
      return{
        ...prevFormData,
        [event.target.name]:event.target.value
      }
    })
  }



  async function deleteUser(userId) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se podrá revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Borrar!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Elimina la estación solo si el usuario confirma
        const { data, error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
  
        fetchUsers(); // Actualiza la lista de usuarios
        Swal.fire({
          title: "¡Eliminado!",
          text: "El usuario ha sido eliminado",
          icon: "success"
        });
  
        if (error) {
          console.error('Error al eliminar el usuario:', error);
        } else if (data) {
          console.log('Usuario Eliminado:', data);
          
        }
      }
    });
  }

   function displayUser(userId){

    users.map((user)=>{

        if(user.id==userId){
          setUser2({ id:user.id,full_name:user.full_name, avatar_url:user.avatar_url ,birthday:user.birthday,roll:user.roll})
        }
        setIsModalOpen2(true); 
      



    })

   }


   async function updateUser(userId){

    const { data, error } = await supabase
      .from('profiles')
      .update({ id:user2.id,full_name:user2.full_name, avatar_url:user2.avatar_url ,birthday:user2.birthday,roll:user2.roll})
      .eq('id', userId)

      fetchUsers()
      setIsModalOpen2(false); 
      Swal.fire({
        icon: "success",
        title: "Registro Actualizado",
        showConfirmButton: false,
        timer: 1500
      });
      setTimeout(() => {
        window.location.reload();
      }, 1600)



      if (error){
        console.log(error)
      }
  
      if (data){
        console.log(data)
      }

      


   }

  return (
    <div>
        <Container >
          <div className="row cardFilters mt-3">
            
           

            


           
          </div>
          <br/>
          <br/>
          <Table className="table table-bordered table-striped v-align">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th >USERNAME </th>
                <th>FOTO DE PERFIL</th>
                <th>EMAIL </th>
                <th>ROLL</th>
                <th>FECHA DE NACIMIENTO:</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
                {users.map((user, index)=>
                    <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.full_name}</td>
                        <td>{<Avatar2
                                url={user.avatar_url} 
                                size={50}
                                onUpload={(event, url) => {
                                updateProfile(event, url)
                                }}
                            />}</td>
                        <td>{user.email}</td>
                        <td>{user.roll}</td>
                        <td>{user.birthday}</td>
                        
                        <td>
                            <div className=" d-flex align-items-center" >
                      
                                <Button
                                    color="primary"
                                    onClick={()=>{displayUser(user.id)}}
                                    
                                >
                                Editar
                                </Button>{" "}
                                <Button color="danger" onClick={()=>{deleteUser(user.id)}}>Eliminar</Button>
                    
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
          </Table>
        </Container>

        {/* MODAL 1 */}

        <Modal isOpen={isModalOpen2} >
          <ModalHeader>
           <div><h3>Editar Registro</h3></div>
          </ModalHeader>

          <ModalBody>
            
            <FormGroup>
              <label>
                Username: 
              </label>
              <input
                className="form-control"
                name="full_name"
                type="text"
                onChange={handleChange2}
                defaultValue={user2.full_name}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                Email:  
              </label>
              <input
                className="form-control"
                readOnly
                name="email"
                type="text"
                onChange={handleChange2}
                defaultValue={session.user.email}
              />
            </FormGroup>
            <FormGroup>
              <label>
                Roll: 
              </label>
              <input
                className="form-control"
                name="roll"
                type="text"
                onChange={handleChange2}
                defaultValue={user2.roll}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                Fecha de nacimiento: 
              </label>
              <input
                className="form-control"
                name="birthday"
                type="date"
                onChange={handleChange2}
                defaultValue={user2.birthday}
              />
            </FormGroup>
            
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              type='submit'
              onClick={()=>updateUser(user2.id)}
            >
              Editar
            </Button>
            <Button 
              color="danger"
              onClick={toggleModal2}
              
              
              
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        <div className="table-responsive mt-3">

          <FormControl size="small" className="w-100">
            <div className="d-flex tableFooter">
                <p>Resultados <b>{stationCount}</b> de <b>{stationCount}</b> </p>
                <Pagination count={10} color="primary" className="pagination"
                    showFirstButton showLastButton />
            </div>
          </FormControl>

        </div>
        
    </div>
  )
}

export default App