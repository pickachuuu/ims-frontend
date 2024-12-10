import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
    return (
        <div 
            className={`modal fade ${isOpen ? 'show' : ''}`} 
            style={{ 
                display: isOpen ? 'block' : 'none', 
                backgroundColor: 'rgba(0, 0, 0, 0.5)' 
            }} 
            tabIndex="-1" 
            role="dialog"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirm Delete</h5>
                    </div>
                    <div className="modal-body">
                        <p>{message}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-danger" onClick={onConfirm}>
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;