export const productSchema = {
    productName: {
        required: "Product name is required",
        maxLength: {
            value: 255,
            message: "Product name cannot exceed 255 characters"
        }
    },
    quantity: {
        required: "Quantity is required",
        min: {
            value: 0,
            message: "Quantity cannot be negative"
        },
        validate: {
            isInteger: value => Number.isInteger(value) || "Quantity must be an integer"
        }
    },
    price: {
        required: "Price is required",
        min: {
            value: 0,
            message: "Price cannot be negative"
        }
    },
    categoryID: {
        required: "Category ID is required",
        validate: {
            isInteger: value => Number.isInteger(value) || "Category ID must be an integer"
        }
    },
    supplierID: {
        required: "Supplier ID is required",
        validate: {
            isInteger: value => Number.isInteger(value) || "Supplier ID must be an integer"
        }
    }
};