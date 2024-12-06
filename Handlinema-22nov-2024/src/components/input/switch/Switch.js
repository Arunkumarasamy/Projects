import React, { useState } from "react";

const InputSwitch = ({ label, id, checked }) => {
  const [inputCheck, setCheck] = useState(checked ? true : false);


  const nottification =()=>{
    setCheck(!inputCheck)
    console.log(id, inputCheck);
  
    
  }

  return (
    <React.Fragment>
      <input
        type="checkbox"
        className="custom-control-input"
      checked={inputCheck}
        onClick={nottification}
        id={id}
      />
      <label className="custom-control-label" htmlFor={id}>
        {label}
      </label>
    </React.Fragment>
  );
};

export default InputSwitch;
