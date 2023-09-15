import { useEffect, useRef } from 'react';

function useInfiniteScroll(callback) {
    const observer = useRef(null);

    useEffect(() => {
        observer.current = new IntersectionObserver((entries) => {
            const lastEntry = entries[entries.length - 1];

            if (lastEntry.isIntersecting) {
                callback();
            }
        }, {
            threshold: 0.5,
        });

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [callback]);

    const observe = (target) => {
        if (observer.current) {
            observer.current.observe(target);
        }
    };

    return { observe };
}

export default useInfiniteScroll;