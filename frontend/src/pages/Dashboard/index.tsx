import { UserContext } from "@/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom"

const index = () => {
  
  const navigate = useNavigate();
  
  const userContext = useContext(UserContext);
  if(!userContext){
    return;
  }

  const {adm} = userContext;

  if(!adm){
    navigate("/");
  }

  return (
    <div>index</div>
  )
}

export default index