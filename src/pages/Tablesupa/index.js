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
import Pagination from '@mui/material/Pagination';
import moment from 'moment';
import FormControl from '@mui/material/FormControl';



const App = () => {



  const [users,setUsers]=useState([])
  const [historiales,setHistoriales]=useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [stationCount2, setStationCount2] = useState(0); 

  const [user,setUser]=useState({
    nombre:'',cantplant:'',ubicacion:'',HumIdeal:'',Humidity:'',TemIdeal:'',Temp:''
  })

  const [user2,setUser2]=useState({
    id:'',nombre:'',cantplant:'',ubicacion:'',HumIdeal:'',Humidity:'',TemIdeal:'',Temp:''
  })

  const [historial,setHistorial]=useState({
    Id:'',Humidity:'',Temp:'',created_at:''
  })

  const sortedHistoriales = [...historiales].sort((a, b) => moment(b.created_at).unix() - moment(a.created_at).unix())






  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); 
  }

  const toggleModal2 = () => {
    setIsModalOpen2(!isModalOpen2); 
  }

  const toggleModal3 = () => {
    setIsModalOpen3(!isModalOpen3); 
  }


  useEffect(() => {
    fetchUsers()
    fetchMediciones()
  }, [])
  

  async function fetchUsers() {
    try {
      const { data, error } = await supabase
        .from('Estaciones')
        .select(`
          *,
          Medidas (Id, Temp, Humidity, estacion_id, created_at)
        `)
        .order('id', { ascending: true });
        console.log(data)
  
      if (error) {
        console.error('Error al obtener los datos:', error);
      } else {
        setUsers(data);
        setStationCount2(data.length);
      }
    } catch (error) {
      alert(error)
      console.error('Error inesperado:', error);
    }
  }

  async function fetchMediciones() {
    try {
      const { data, error } = await supabase
        .from('Medidas')
        .select(`* `)
        .order('Id', { ascending: true });
        console.log(data)
  
      if (error) {
        console.error('Error al obtener los datos:', error);
      } else {
        setHistoriales(data);
        
      }
    } catch (error) {
      alert(error)
      console.error('Error inesperado:', error);
    }
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

  async function createUser() {
    try {
      // Comenzamos una transacción
      await supabase.rpc('start_transaction');
  
      // Insertamos la nueva estación
      const { data: stationData, error } = await supabase
        .from('Estaciones')
        .insert({
          nombre: user.nombre,
          cantplant: user.cantplant,
          ubicacion: user.ubicacion,
          HumIdeal: user.HumIdeal,
          TemIdeal: user.TemIdeal,
        })
        .single();
  
      if (error) throw error;
  
      // Confirmamos la transacción
      await supabase.rpc('commit_transaction');
  
      fetchUsers();
      setIsModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Registro Exitoso",
        showConfirmButton: false,
        timer: 1500
      });
    
    } catch (error) {
      // Revertiremos la transacción en caso de error
      await supabase.rpc('rollback');
  
      console.error('Error al crear la estación y las plantas:', error);
    }
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
          .from('Estaciones')
          .delete()
          .eq('id', userId);
  
        fetchUsers(); // Actualiza la lista de usuarios
        Swal.fire({
          title: "¡Eliminado!",
          text: "La estación ha sido eliminada",
          icon: "success"
        });
  
        if (error) {
          console.error('Error al eliminar la estación:', error);
        } else if (data) {
          console.log('Estación eliminada:', data);
          
        }
      }
    });
  }
  async function displayUser(userId) {
    const { data, error } = await supabase
      .from('Estaciones')
      .select(`*, Medidas(Id, Humidity, Temp, created_at)`)
      .eq('id', userId)
      
      .single(); // Busca solo la estación con el ID específico
  
    if (error) {
      console.error('Error al obtener la estación:', error);
      return; // Manejar el error y evitar asignar datos vacíos
    }
    

  
    setUser2(data);
    setIsModalOpen2(true);
  }


  async function updateUser(userId) {
    try {
      // Comenzamos una transacción
      await supabase.rpc('start_transaction');
  
      // Actualizamos la estación
      const { error: stationError } = await supabase
        .from('Estaciones')
        .update({
          id:user2.id,nombre:user2.nombre, cantplant:user2.cantplant ,ubicacion:user2.ubicacion,HumIdeal:user2.HumIdeal,TemIdeal:user2.TemIdeal
        })
        .eq('id', userId);
        
  
      if (stationError) {
        throw stationError;
      }
  
      // Actualizamos las plantas (suponiendo que user2.plantas es un arreglo)
      
      fetchUsers();
      setIsModalOpen2(false);
      Swal.fire({
        icon: "success",
        title: "Registro Actualizado",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      // Si ocurre algún error, revertiremos la transacción
      await supabase.rpc('rollback_transaction');
      console.error('Error al actualizar la estación y las plantas:', error);
      alert(error)
    }
  }
  

  return (
    <div>
        <Container >
          <div className="row cardFilters mt-3">
            <div className="col-md-3">
              <h4>AGREGAR NUEVA ESTACION:</h4>
              <FormControl size="small" className="w-100">
                <Button color="success" onClick={toggleModal} >Crear +</Button>
              </FormControl>
            </div>
           
          </div>
          <br/>
          <br/>
          <Table className="table table-bordered table-striped v-align">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th >NOMBRE </th>
                <th>CANTIDAD DE PLANTAS </th>
                <th>UBICACION</th>
                <th>HUMEDAD IDEAL %</th>
                <th>HUMEDAD ACTUAL %</th>
                <th>TEMPERATURA IDEAL °C</th>
                <th>TEMPERATURA ACTUAL °C</th>
                
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              
                {users.map((user, index)=>
                    <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.nombre}</td>
                        <td>{user.cantplant}</td>
                        <td>{user.ubicacion}</td>
                        <td>{user.HumIdeal}</td>
                        <td>{user.Medidas && user.Medidas.length > 0 ? (
                            user.Medidas.sort((a, b) => moment(b.created_at).format('DD/MM/YYYY HH:mm:ss') - moment(a.created_at).format('DD/MM/YYYY HH:mm:ss'))[0].Humidity || 'Sin datos'
                            ) : 'No hay mediciones'}
                        </td>
                        <td>{user.TemIdeal}</td>
                        <td>{user.Medidas && user.Medidas.length > 0 ? 
                        (user.Medidas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)
                        )[0].Temp || 'Sin datos') : 'No hay mediciones'}</td>
                        
                        <td>
                            <div className=" d-flex align-items-center" >
                      
                                <Button
                                    color="primary"
                                    onClick={()=>{displayUser(user.id)}}
                                    
                                >
                                Editar
                                </Button>{" "}
                                <Button color="danger" onClick={()=>{deleteUser(user.id)}}>Eliminar</Button>
                                <Button color="secondary" onClick={() => setIsModalOpen3(true)}>Historial</Button>
                    
                            </div>
                        </td>
                        
                        
                        
                    </tr>
                    
                    
                )}
                
                
                
            </tbody>
            
            
            
            
          </Table>
        </Container>

        {/* MODAL 1 */}

        <Modal isOpen={isModalOpen} >
          <ModalHeader>
           <div><h3>Agregar nueva estación</h3></div>
          </ModalHeader>

          <ModalBody>
            
            <FormGroup>
              <label>
                Nombre: 
              </label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                Cantidad de plantas: 
              </label>
              <input
                className="form-control"
                name="cantplant"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <label>
                Ubicacion: 
              </label>
              <input
                className="form-control"
                name="ubicacion"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <label>
                Humedad Ideal: 
              </label>
              
              <input
                className="form-control"
                name="HumIdeal"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                Temperatura Ideal: 
              </label>
              <input
                className="form-control"
                name="TemIdeal"
                type="text"
                onChange={handleChange}
              />
            </FormGroup>
            
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              type='submit' onClick={createUser}
            >
              Insertar
            </Button>
            <Button
              className="btn btn-danger"
              onClick={toggleModal}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        {/* MODAL 2 */}

        <Modal isOpen={isModalOpen2} >
          <ModalHeader>
           <div><h3>Editar Registro</h3></div>
          </ModalHeader>

          <ModalBody>
            
            
            <FormGroup>
              <label>
                Nombre: 
              </label>
              <input
                className="form-control"
                name="nombre"
                type="text"
                onChange={handleChange2}
                defaultValue={user2.nombre}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                Cantidad de plantas: 
              </label>
              <input
                className="form-control"
                name="cantplant"
                type="text"
                onChange={handleChange2}
                defaultValue={user2.cantplant}
              />
            </FormGroup>
            <FormGroup>
              <label>
                Ubicacion:  
              </label>
              <input
                className="form-control"
                name="ubicacion"
                type="text"
                onChange={handleChange2}
                defaultValue={user2.ubicacion}
              />
            </FormGroup>
            <FormGroup>
              <label>
                Humedad Ideal: 
              </label>
              <input
                className="form-control"
                name="HumIdeal"
                type="text"
                onChange={handleChange2}
                defaultValue={user2.HumIdeal}
              />
            </FormGroup>
            
            <FormGroup>
              <label>
                Temperatura Ideal: 
              </label>
              <input
                className="form-control"
                name="TemIdeal"
                type="text"
                onChange={handleChange2}
                defaultValue={user2.TemIdeal}
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

        {/* MODAL 3 */}

        <Modal isOpen={isModalOpen3} >
          <ModalHeader>
           <div><h3>Historial de riego</h3></div>
          </ModalHeader>

          <ModalBody>
            
          <Table className="table table-bordered table-striped v-align">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>FECHA</th>
                <th >HUMEDAD </th>
                <th>TEMPERATURA </th>
              </tr>
            </thead>

            <tbody>
              
                {sortedHistoriales.map((historial, index)=>
                    <tr key={historial.Id}>
                        <td>{index + 1}</td>
                        <td>{moment(historial.created_at).format('DD/MM/YYYY HH:mm:ss')}</td>
                        <td>{historial.Humidity}</td>
                        <td>{historial.Temp}</td>
                        
                        
                        
                        
                    </tr>
                    
                    
                )}

            </tbody>
          </Table>
          <ModalFooter>
            <Button 
              color="danger"
              onClick={toggleModal3}
              
              
              
            >
              Cancelar
            </Button>
          </ModalFooter>
          </ModalBody>
        </Modal>

        <div className="table-responsive mt-3">

          <FormControl size="small" className="w-100">
            <div className="d-flex tableFooter">
                <p>Resultados <b>{stationCount2}</b> de <b>{stationCount2}</b> </p>
                <Pagination count={10} color="primary" className="pagination"
                    showFirstButton showLastButton />
            </div>
          </FormControl>

        </div>
    </div>
    
    
  )
}

export default App