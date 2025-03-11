import React from "react";
import { Link } from "react-router-dom";

function Notfound() {
  return (
    <div className="container p-5 text-center">
      <img src="\404 Error Page not Found with people connecting a plug-cuate.png" alt="404 page not found" className="w-75 img-fluid d-block mx-auto"/>
      <Link to="/" className="btn btn-primary px-4 py-2 text-decoration-none">
        Click to go home
      </Link>
    </div>
  );
}

export default Notfound;
