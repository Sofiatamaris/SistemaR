import { IoSearch } from "react-icons/io5";


const SearchBox = ()=>{
    return(
        <div className="searchBox posotion-relative d-flex align-items-center w-100">
            <IoSearch className="mr-2"/>
            <input type="text" placeholder="Search here..."/>
        </div>
    )
}

export default SearchBox;