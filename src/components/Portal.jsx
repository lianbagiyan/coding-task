import {
    memo,
    useLayoutEffect,
    useState
} from 'react';
import { createPortal } from 'react-dom';

const _Portal = ({ rootId, children }) => {
    const [container, setContainer] = useState();

    useLayoutEffect(() => {
        setContainer(rootId ? document.getElementById(rootId) : document.body);
    }, [rootId]);

    return container ? createPortal(children, container) : null;
};

export const Portal = memo(_Portal);