
export const Box = ({
    children,
    display,
    width,
    flex_direction,
    justify_content,
    align_items,
    lg_width,
    lg_align_items,
    lg_margin,
    md_margin,
    sm_margin,
    margin,
    padding,
    sm_padding,
    min_width,
    min_height,
    align_self,
    lg_flex_direction,
    lg_flex_wrap,
    grid_gap,
    font,
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
    
    return <div style={{
        display: display,
        fontFamily: fontStyles.fontFamily,
        fontWeight: fontStyles.fontWeight,
        fontSize: fontStyles.fontSize,
        lineHeight: fontStyles.lineHeight,
        width: width,
        gridGap: grid_gap,
        flexDirection: flex_direction,
        justifyContent: justify_content,
        alignItems: align_items,
        margin: margin,
        padding: padding,
        '@media (max-width: 768px)': {
            margin: sm_margin,
            padding: sm_padding,
        },
        '@media (min-width: 1024px)': {
            margin: lg_margin,
        },
        '@media (min-width: 768px)': {
            margin: md_margin,
        },
        '@media (min-width: 1024px)': {
            width: lg_width,
            alignItems: lg_align_items,
        },
        minWidth: min_width,
        minHeight: min_height,
        alignSelf: align_self,
        flexWrap: lg_flex_wrap,
        
    }}>
        {children}
    </div>;
}