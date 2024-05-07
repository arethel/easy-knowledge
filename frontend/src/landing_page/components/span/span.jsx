export const Span = (
    {
        children,
        margin,
        padding,
        color,
        font_size,
        font_weight,
        text_align,
        cursor,
        display,
        sm_font_size,
        sm_margin,
        sm_padding,
        lg_font_size,
        lg_margin,
        lg_padding,
        onClick,
        font,
        overflow_wrap,
        word_break,
        white_space,
        text_indent,
        text_overflow,
        hyphens,
        user_select,
        pointer_events,
    }
) => {
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
    return <span style={{
        fontFamily: fontStyles.fontFamily,
        fontWeight: fontStyles.fontWeight,
        fontSize: fontStyles.fontSize,
        lineHeight: fontStyles.lineHeight,
        margin: margin,
        padding: padding,
        color: color,
        textAlign: text_align,
        cursor: cursor,
        display: display,
        '@media (max-width: 768px)': {
            margin: sm_margin,
            padding: sm_padding,
        },
        '@media (min-width: 1024px)': {
            margin: lg_margin,
            padding: lg_padding,
        },
        overflowWrap: overflow_wrap,
        wordBreak: word_break,
        whiteSpace: white_space,
        textIndent: text_indent,
        textOverflow: text_overflow,
        hyphens: hyphens,
        userSelect: user_select,
        pointerEvents: pointer_events,
    }} onClick={onClick}>{children}</span>;
}