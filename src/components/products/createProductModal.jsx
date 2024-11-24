import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Select, MenuItem, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const CreateProductModal = ({ isOpen, onRequestClose, categories, suppliers }) => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm();

    const onFormSubmit = async (data) => {
        try {
            const token = Cookies.get('authToken');
            const payload = {
                productName: data.productName,
                quantity: data.quantity || 0, 
                price: data.price || 0, 
                categoryID: data.categoryID || null, 
                supplierID: data.supplierID || null, 
            };

            const response = await axios.post('http://localhost:3000/api/products/create', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.data) {
                setError('root', { type: 'server', message: 'Failed to create product.' });
            }

            if (response.status === 201) {
                onRequestClose();
            }

        } catch (error) {
            console.error("Error creating product:", error); 
            setError('root', { type: 'server', message: 'Failed to create product.' });
        }
    };

    return (
        <Dialog open={isOpen} onClose={onRequestClose}>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Product Name"
                        fullWidth
                        {...register("productName", {
                            required: 'Product name is required',
                            maxLength: { value: 255, message: 'Product name cannot exceed 255 characters' }
                        })}
                        error={!!errors.productName}
                        helperText={errors.productName ? errors.productName.message : ''}
                    />
                    <TextField
                        margin="dense"
                        label="Quantity"
                        type="number"
                        fullWidth
                        {...register("quantity", {
                            required: 'Quantity is required',
                            min: { value: 0, message: 'Quantity cannot be negative' },
                            valueAsNumber: true
                        })}
                        defaultValue={0} 
                        error={!!errors.quantity}
                        helperText={errors.quantity ? errors.quantity.message : ''}
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        type="number"
                        fullWidth
                        {...register("price", {
                            required: 'Price is required',
                            min: { value: 0, message: 'Price cannot be negative' },
                            valueAsNumber: true
                        })}
                        defaultValue={0} 
                        error={!!errors.price}
                        helperText={errors.price ? errors.price.message : ''}
                    />
                    <Select
                        margin="dense"
                        fullWidth
                        displayEmpty
                        defaultValue=""
                        {...register("categoryID")}
                    >
                        <MenuItem value="">
                            <em>Select Category (Optional)</em>
                        </MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category.categoryID} value={category.categoryID}>
                                {category.categoryName}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                        margin="dense"
                        fullWidth
                        displayEmpty
                        defaultValue="" 
                        {...register("supplierID")}
                    >
                        <MenuItem value="">
                            <em>Select Supplier (Optional)</em>
                        </MenuItem>
                        {suppliers.map((supplier) => (
                            <MenuItem key={supplier.supplierID} value={supplier.supplierID}>
                                {supplier.supplierName}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.root && <div className='text-danger mt-2'>{errors.root.message}</div>}
                    <DialogActions>
                        <Button onClick={onRequestClose} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Create Product
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateProductModal;