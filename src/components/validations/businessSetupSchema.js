export const businessSetupSchema = {
    businessName: {
        required: "Business name is required",
        minLength: {
            value: 2,
            message: "Business name must be at least 2 characters long"
        },
        maxLength: {
            value: 100,
            message: "Business name cannot exceed 100 characters"
        }
    },
    address: {
        required: "Business address is required",
        minLength: {
            value: 5,
            message: "Business address must be at least 5 characters long"
        },
        maxLength: {
            value: 255,
            message: "Business address cannot exceed 255 characters"
        }
    },
    businessEmail: {
        required: "Email is required",
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
        }
    },
    contactNumber: {
        required: "Contact number is required",
        pattern: {
            value: /^\+?\s*(?:\([0-9]+\))?[-.\s]*(?:[0-9][-.\s]*){10,15}$/,
            message: "Please enter a valid phone number"
        },
        minLength: {
            value: 10,
            message: "Contact number must be at least 10 digits long"
        },
        maxLength: {
            value: 15,
            message: "Contact number cannot exceed 15 digits"
        }
    }
};