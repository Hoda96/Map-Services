import { Link, useRouteError } from "react-router-dom";
import Root from "./Root";

function NotFound(){

const error = useRouteError();

// function handleNotFound(){
//     return <Root/>;
// }


    return <div> 
        <h1 className="not-found">Oops!</h1>
        <p className="not-found-text">Page not found :(</p>
        {/* <p className="not-found-text">{error.statusText || error.message}</p> */}
        <Link to={"/"} className="backBtn" >Back to Home</Link>
    </div>
}
export default NotFound;