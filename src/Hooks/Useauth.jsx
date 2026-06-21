import { useContext } from "react";
import { AuthContext } from "../Authentication/Probider/Authcontext";

const useAuth = () => {
    const auth = useContext(AuthContext);
    return auth;
};

export default useAuth;