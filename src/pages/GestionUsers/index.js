import { useContext, useEffect, useState } from "react";
import FormControl from '@mui/material/FormControl';
import Tablesupa2 from "../Tablasupa2";

import Pagination from '@mui/material/Pagination';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

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


const GestionUsers = ({session}) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const ITEM_HEIGHT = 48;

    useEffect(()=>{
        window.scrollTo(0,0);
    },[]);

    return (
        <>
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4">
                    <h5 className="mb-0">Gestionar Usuarios</h5>
        
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <StyledBreadcrumb
                            component="a"
                            href="/dashboard"
                            label="inicio"
                            icon={<HomeIcon fontSize="small" />}
                        />

                        <StyledBreadcrumb
                            label="Gestionar Usuarios"
                            deleteIcon={<ExpandMoreIcon />}

                        />
                        
                    </Breadcrumbs>
                </div>


                <div className="card shadow border-0 p-3 mt-4">
                    <div className="table-responsive mt-3">
                        <FormControl size="small" className="w-100">
                            {session?<Tablesupa2 key={session.user.id} session={session} />:''}
                            
                        </FormControl>
                        


                    </div>


                </div>


                
            </div>
        </>
    )
}

export default GestionUsers;