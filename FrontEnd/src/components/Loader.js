import '../styles/loader.css'
import BounceLoader from "react-spinners/BounceLoader";
import React from "react"
const Loader = () => {
    return(
    <div className="loader">
        <div className="sweet-loading">
            <BounceLoader
                size={27}
                color={"blue"}
                loading={true}
            />
        </div>
        <p style={{fontSize: '24px' }}>Loading</p>
    </div>
    );
  };

  export default Loader;