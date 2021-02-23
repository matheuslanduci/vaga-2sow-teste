import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./contexts/Auth";

import Routes from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <Routes />
      <ToastContainer />
    </AuthProvider>
  );
}
