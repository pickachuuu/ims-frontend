import banner from '../../assets/rb_18760.png';

const SideBanner = () => {
    return (
        <div className="col-md-7 rounded-4 d-flex justify-content-center align-items-center flex-column left-box order-lg-2 order-sm-1" 
            style={{ background: '#103cbe' }}>
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
            Inventory
            </p>
            <small 
                className="text-white text-wrap text-center" 
                style={{ 
                    width: '17rem',
                    fontFamily: 'Courier New, Courier, monospace'
                }}>
                Inventory Management System
            </small>
        </div> 
    )
}

export default SideBanner;