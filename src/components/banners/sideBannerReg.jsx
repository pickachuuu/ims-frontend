import banner from '../../assets/Register.png';

const SideBanner = () => {
    return (
        <div className="col-md-6 col-sm-12 col-lg-7 rounded-4 d-flex justify-content-center align-items-center flex-column left-box" 
            style={{ background: '#0358E3' }}>
            <div className="featured-image mb-3">
                <img 
                    src={banner} 
                    className="img-fluid" 
                    style={{ width: '450px' }}
                />
            </div>

            <p className="text-white fs-2" 
            style={{ 
                fontFamily: 'Courier New, Courier, monospace',
                fontWeight: 600 
            }}>
            Streamline your inventory
            </p>
            <small 
                className="text-white text-wrap text-center" 
                style={{ 
                    width: '17rem',
                    fontFamily: 'Courier New, Courier, monospace'
                }}>
                Join us for a purr-fect inventory experience!
            </small>
        </div> 
    )
}

export default SideBanner;