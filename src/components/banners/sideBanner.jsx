import banner from '../../assets/rb_18760.png';

const SideBanner = () => {
    return (
        <div className="col-md-7 col-sm-12 col-lg-7 rounded-4 d-flex justify-content-center align-items-center flex-column left-box order-sm-1 order-md-1 order-1"
        style={{
            background: "#0358E3"
        }}>
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
            Catalog
            </p>
            <small 
                className="text-white text-wrap text-center" 
                style={{ 
                    width: '17rem',
                    fontFamily: 'Courier New, Courier, monospace'
                }}>
                Organizing your inventory with purr-fection.
            </small>
        </div> 
    )
}

export default SideBanner;