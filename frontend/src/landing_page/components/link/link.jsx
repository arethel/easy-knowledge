export const Link = ({
    children,
    href,
    padding,
    color,
    background,
    text_decoration_line,
    font,
    border_radius,
    margin,
    sm_margin,
    sm_text_align,
    hover_transition,
    hover_background,
    transition,
    onClick,
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
    
    return <a href={href} style={{
        padding: padding,
        color: color,
        background: background,
        textDecorationLine: text_decoration_line,
        fontFamily: fontStyles.fontFamily,
        fontWeight: fontStyles.fontWeight,
        fontSize: fontStyles.fontSize,
        lineHeight: fontStyles.lineHeight,
        borderRadius: border_radius,
        margin: margin,
        '@media (max-width: 576px)': {
            margin: sm_margin,
            textAlign: sm_text_align,
        },
        transition: transition,
        ':hover': {
            background: hover_background,
            transition: hover_transition,
        },
    }}
    onClick={onClick}>
        {children}
    </a>;
}