import { toast } from 'react-toastify';
import { Bounce } from 'react-toastify';

const ProdToast = (message, options = {}) => {
    toast(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
            backgroundColor: '#0d6efd', 
            color: '#FFFFFF', 
        },
        transition: Bounce,
        ...options, 
    });
};

export default ProdToast;