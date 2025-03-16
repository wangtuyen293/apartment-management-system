import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";

const useAuth = () => {
    const [cookies] = useCookies(["accessToken"]);
    const token = cookies.accessToken;

    if (!token) {
        return { username: "", role: "Guest", isManager: false, id: null };
    }

    try {
        const decoded = jwtDecode(token);
        const { username, role, id } = decoded;
        const isManager = role === "Manager";

        return { username, role, isManager, id };
    } catch (error) {
        console.error("Error decoding token:", error);
        return { username: "", role: "Guest", isManager: false, id: null };
    }
};

export default useAuth;
