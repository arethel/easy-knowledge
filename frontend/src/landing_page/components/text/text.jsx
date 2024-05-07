export const Text = ({
    children,
    margin,
    color,
    font,
    lg_text_align,
    text_align,
    sm_font,
    md_font,
    sm_width,
    display,
    align_content,
    padding,
    background,
    border_radius,
    align_items,
    justify_content,
    width,
    height,
}) => {
    const parseFont = (fontValue) => {
        const resolvedFontValue = getComputedStyle(document.documentElement).getPropertyValue(fontValue).trim();
        const parts = resolvedFontValue.split(/\s+/);
        const fontSizeParts = parts[2].split('/');
        
        return {
            fontWeight: parts[1],
            fontSize: fontSizeParts[0],
            lineHeight: fontSizeParts[1],
            fontFamily: parts.slice(3).join(' '),
        };
    };
    

    const fontStyles = font ? parseFont(font) : {};
    
    return (
        <div style={{
            margin: margin,
            color: color,
            fontFamily: fontStyles.fontFamily,
            fontWeight: fontStyles.fontWeight,
            fontSize: fontStyles.fontSize,
            lineHeight: fontStyles.lineHeight,
            textAlign: text_align,
            display: display,
            alignItems: align_content,
            padding: padding,
            '@media (max-width: 576px)': {
                fontFamily: sm_font,
                width: sm_width,
            },
            '@media (min-width: 768px)': {
                textAlign: lg_text_align,
            },
            '@media (min-width: 1024px)': {
                fontFamily: md_font,
            },
            background: background,
            borderRadius: border_radius,
            alignItems: align_items,
            justifyContent: justify_content,
            width: width,
            height: height,
            
        }}>
            {children}
        </div>
    );
};
