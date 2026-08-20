import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export { toast };

export function AjaliToastContainer() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
    />
  );
}
