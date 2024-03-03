import {
    Menu,
    Item,
    Separator,
    Submenu,
    useContextMenu,
} from "react-contexify";

import './style.css'
import "react-contexify/dist/ReactContexify.css";

const MENU_ID = "book-menu";



export const BookMenu = () => {
    const { show } = useContextMenu({
        id: MENU_ID,
    });

    function handleItemClick({ event, props, triggerEvent, data }) {
        console.log(event, props, triggerEvent, data);
    }
    
    function calculateArea( props ) {
        
        const x = Math.min(props.startPosition.x, props.endPosition.x) / props.startPosition.width * 100
        const width_ = Math.abs(props.startPosition.x - props.endPosition.x) / props.startPosition.width * 100
        if (props.startPosition.page > props.endPosition.page) {
            const temp = props.startPosition
            props.startPosition = props.endPosition
            props.endPosition = temp
        }
        
        const areas = []
        for (let i = props.startPosition.page; i <= props.endPosition.page; i++) {
            let height_ = 100
            let y = 0
            if (i === props.startPosition.page && i < props.endPosition.page) {
                height_ = (props.startPosition.height - props.startPosition.y) / props.startPosition.height * 100
                y = props.startPosition.y / props.startPosition.height * 100
            } else if (i === props.endPosition.page && i > props.startPosition.page) {
                height_ = props.endPosition.y / props.startPosition.height * 100
                y = 0
            } else if (i === props.startPosition.page && i === props.endPosition.page) {
                height_ = Math.abs(props.startPosition.y - props.endPosition.y) / props.startPosition.height * 100
                y = Math.min(props.startPosition.y, props.endPosition.y) / props.startPosition.height * 100
            }
            
            const area = {
                height: height_,
                width: width_,
                left: x,
                top: y,
                pageIndex: i,
            }
            areas.push(area);
        }
        const currentDate = new Date();
        const timestamp = currentDate.getTime();
        const highlight = {
            areas: areas,
            text: '',
            id: timestamp,
            color: 'yellow'
        }
        return highlight
    }
    
    const getTextInsideRectangle = (highlight) => {
        let text = ''
        for (let j = 0; j < highlight.areas.length; j++) {
            const area = highlight.areas[j]
            const page = area.pageIndex
            const textsParent = document.querySelector('.rpv-core__text-layer[data-testid="core__text-layer-' + page + '"]')
            const { clientWidth, clientHeight } = textsParent
            const texts = textsParent.querySelectorAll('span')
            for (let i = 0; i < texts.length; i++) {
                const textElement = texts[i]
                const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = textElement
                // console.log(offsetLeft, offsetTop, offsetWidth, offsetHeight, clientWidth, clientHeight);
                const left = offsetLeft / clientWidth * 100
                const top = offsetTop / clientHeight * 100
                const width = offsetWidth / clientHeight * 100
                const height = offsetHeight / clientWidth * 100
                // console.log(left, top, width, height, area);
                if (left >= area.left && left + width <= area.left + area.width && top >= area.top && top + height <= area.top + area.height) {
                    text += textElement.textContent + ' '
                }
            }
        }
        return text
    }
    
    const sendHighlight = async (client, highlight, book_id) => {
        try {
            const response = await client.post(`api/book/highlight/`, {'book_id':book_id, 'highlight':highlight});
            if (response.data.error === 0) {
                console.log("Highlight saved", highlight);
            }
        } catch (error) {
            console.error("Error saving highlight:", error);
        }
    }
    
    const deleteHighlight = async (client, highlight, book_id) => {
        try {
            const response = await client.post(`api/book/highlight/delete/`, {'book_id':book_id, 'highlight_id':highlight.id});
            if (response.data.error === 0) {
                console.log("Highlight deleted", highlight);
            }
        } catch (error) {
            console.error("Error deleting highlight:", error);
        }
    }
    
    function mark({ event, props }) {
        if (props.textHighlightProps) {
            const textHighlightProps = props.textHighlightProps
            // console.log(textHighlightProps);
            const newHighlightAreas = [...props.highlightAreas_]
            const currentDate = new Date();
            const timestamp = currentDate.getTime();
            const highlight = {
                areas: textHighlightProps.highlightAreas,
                text: textHighlightProps.selectedText,
                id: timestamp,
                color: 'yellow'
            }
            newHighlightAreas.push(highlight)
            
            props.setHighlightAreas_(newHighlightAreas)
            sendHighlight(props.client_, highlight, props.book_id_)
        }
        
        if (props.startPosition !== null && props.endPosition !== null && props.showRectangle && props.textHighlightProps === undefined) {
            const setHighlightAreas = props.setHighlightAreas_
            const highlightAreas = props.highlightAreas_
            const newHighlightAreas = [...highlightAreas]
            const highlight = calculateArea(props);
            highlight.text = getTextInsideRectangle(highlight);
            // console.log(highlight.text);
            newHighlightAreas.push(highlight);
            console.log(newHighlightAreas);
            setHighlightAreas(newHighlightAreas)
            sendHighlight(props.client_, highlight, props.book_id_)
        }
        
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
        }
    }
    
    function unmark({ event, props }) {
        const x_ = props.startPosition.x
        const y_ = props.startPosition.y
        const { height, width } = props.startPosition;
        const page = props.startPosition.page;
        const x = x_ / width * 100
        const y = y_ / height * 100
        
        const highlightAreas = props.highlightAreas_
        const newHighlightAreas = [...highlightAreas]
        
        
        console.log(x, y, page, newHighlightAreas);
        
        for (let i = highlightAreas.length-1; i >=0; i--) {
            const areas = highlightAreas[i].areas
            let unmarked = false
            for (let j = 0; j < areas.length; j++) {
                const area = areas[j]
                if (area.pageIndex === page && x >= area.left && x <= area.left + area.width && y >= area.top && y <= area.top + area.height) {
                    newHighlightAreas.splice(i, 1)
                    unmarked = true
                    break;
                }
            }
            if (unmarked) {
                deleteHighlight(props.client_, highlightAreas[i], props.book_id_)
                break;
            }
        }
        props.setHighlightAreas_(newHighlightAreas)
        
    }
    
    function copy({ event, props }) {
        const selection = window.getSelection();
        if (selection) {
            const text = selection.toString();
            navigator.clipboard.writeText(text);
        }
    }
    
    function displayMenu(e) {
        show({
            event: e,
        });
    }

    return (
        // <div onContextMenu={show}>Right click inside the box</div>
        // <div onContextMenu={displayMenu}>Right click inside the box</div>

        <Menu id={MENU_ID} preventDefaultOnKeydown={false} theme="dark">
            <Item onClick={mark}>Mark</Item>
            <Item onClick={unmark}>Unmark</Item>
            <Item onClick={copy}>Copy</Item>
            {/* <Separator />
            <Item disabled>Disabled</Item>
            <Separator />
            <Submenu label="Submenu">
                <Item onClick={handleItemClick}>Sub Item 1</Item>
                <Item onClick={handleItemClick}>Sub Item 2</Item>
            </Submenu> */}
        </Menu>
    );
}
