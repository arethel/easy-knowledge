import './style.css'

export const Section = ({ children,
    padding,
    background,
    md_padding,
    sm_padding,
    flex_direction,
    flex_wrap,}) => {
    return (
        <div style={{
            padding: padding,
            background: background,
            '@media (max-width: 768px)': {
                padding: sm_padding,
            },
            '@media (min-width: 768px)': {
                padding: md_padding,
            },
            display: 'flex',
            flexDirection: flex_direction,
            flexWrap: flex_wrap,
        }}>
            {children}
        </div>
    );
}