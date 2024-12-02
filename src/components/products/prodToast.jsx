import { toast } from 'react-toastify';
import { Bounce } from 'react-toastify';

const ProdToast = (message, options = {}) => {
    toast.success(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        ...options
});
};

export default ProdToast;