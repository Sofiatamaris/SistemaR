import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { useState } from 'react';
import { IoIosAdd } from "react-icons/io";
import Button from '@mui/material/Button';
import 'react-lazy-load-image-component/src/effects/blur.css';

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


const ProductUpload = () => {

    const [categoryVal, setcategoryVal] = useState('');
    const [subCatVal, setSubCatVal] = useState('');
    const [ratingsValue, setRatingValue] = useState(1);
    const [productRams, setProductRAMS] = useState([]);

    const handleChangeCategory = (event) => {
        setcategoryVal(event.target.value);
    };

    const handleChangeSubCategory = (event) => {
        setSubCatVal(event.target.value);
    };

  

    const handleChangeProductRams = (event) => {
        const {
            target: { value },
        } = event;
        setProductRAMS(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );


    };


    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 res-col">
                    <h5 className="mb-0">Crear Estación</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="#"
                            label="Inicio"
                            icon={<HomeIcon fontSize="small" />}
                        />

                        <StyledBreadcrumb
                            component="a"
                            label="Estaciones"
                            href="#"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                        <StyledBreadcrumb
                            label="Crear Estación"
                            deleteIcon={<ExpandMoreIcon />}
                        />
                    </Breadcrumbs>
                </div>
                <form className='form'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='card p-4 mt-0'>
                                <h5 className='mb-4'>Información básica</h5>

                                <div className='form-group '>
                                    <h6>NOMBRE DE LA ESTACIÓN</h6>
                                    <input type='text' name="name" />
                                </div>

                                <div className='form-group '>
                                    <h6>DESCRIPCION</h6>
                                    <textarea rows={5} cols={10} />
                                </div>


                                <div className='row'>
                                    

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>CANTIDAD DE PLANTAS</h6>
                                            <input type='text' name="price" />
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>VALOR HUMEDAD IDEAL</h6>
                                            <input type='text' name="brand" />
                                        </div>
                                    </div>



                                </div>


                                <div className='row'>

                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>UBICACION </h6>
                                            <input type='text' name="oldPrice" />
                                        </div>
                                    </div>

                                    


                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>VALOR TEMPERATURA IDEAL </h6>
                                            <input type='text' name="countInStock" />
                                        </div>
                                    </div>

                                </div>

                                <Button type="button" className="btn-blue btn-lg btn-big w-100"
                                ><IoIosAdd /> &nbsp; REGISTRAR  </Button>

                                


                            </div>

                            

                        </div>

                    </div>

                </form>

            </div>
        </>
    )
}

export default ProductUpload;