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
    
    function mark({ event, props }) {
        
        console.log(event, props);
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
            <Item onClick={handleItemClick}>Item 2</Item>
            <Separator />
            <Item disabled>Disabled</Item>
            <Separator />
            <Submenu label="Submenu">
                <Item onClick={handleItemClick}>Sub Item 1</Item>
                <Item onClick={handleItemClick}>Sub Item 2</Item>
            </Submenu>
        </Menu>
    );
}
