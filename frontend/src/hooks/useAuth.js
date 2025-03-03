import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../redux/authSlice"
import { jwtDecode } from 'jwt-decode'

const useAuth = () => {
    const token = useSelector(selectCurrentToken)
    let isManager = false
    let status = "Customer"

    if (token) {
        const decoded = jwtDecode(token)
        const username = decoded.username;
        const role = decoded.role;
        const id = decoded.id;


        return { username, role, status, id }
    }

    return { username: '', role: [], isManager, status }
}
export default useAuth;