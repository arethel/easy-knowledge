import './style.css'
 
export const SubType = ({ title, options, subscribtions_data, subscribtion_type, only_text = false }) => {
    return (
        <div className={`sub-type ${only_text ? 'only-text' : ''}`}>
            
            <div className={`title ${only_text ? 'only-text' : ''}`}>{title}</div>
            {
                options && options.map((option, index) => {
                    return (
                        <div key={index} className='option'>
                            <div className='item'>{option.item}</div>
                        </div>
                    )
                })
            }
            
            {!only_text ?<div className='subscribe-button'>Subscribe</div>:null}
        </div>
    )
}