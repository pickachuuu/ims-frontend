const CategoryModal = () => {



    return (
        <div className={`modal fade ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{mode === 'edit' ? 'Edit Product' : 'Create New Product'}</h5>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={onFormSubmit}>
                            {serverError && <div className="alert alert-danger">{serverError}</div>}
                            <div className="mb-3">
                                <label htmlFor="productName" className="form-label">Category Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.productName ? 'is-invalid' : ''}`}
                                    id="productName"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleChange}
                                />
                                {errors.productName && <div className="invalid-feedback">{errors.productName}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="productName" className="form-label">Description</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.productName ? 'is-invalid' : ''}`}
                                    id="productName"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleChange}
                                />
                                {errors.productName && <div className="invalid-feedback">{errors.productName}</div>}
                            </div>

                            <div className="d-flex justify-content-end">
                                <button type="button" className="btn btn-secondary me-2" onClick={onRequestClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {mode === 'edit' ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );  
}


export default CategoryModal;