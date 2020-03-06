/**
 * Scroll3DPerspective
 * Author: Cullen Johnson (https://github.com/cullenjohnson)
 * 
 * Attach to an element to shift the CSS perspective-origin property relative to the scroll position.
 * 
 * Feel free to use or modify this to fit your needs.
 */
export class Scroll3DPerspective {
    /**
     * @param el The element to apply the effect to.
     * @param shiftAmount The percent amount you would like the perspective to shift when the user scrolls past. (default 50)
     * @param initialPerspectiveOriginYPercent The initial Y value (as a percent) of the element's perspective-origin. (default 50)
     * @param scrollPastOffset number of pixels to offset the check for the scrollpast callback (default 0)
     * @param scrollPastCallback function to run when the user scrolls down beyond the height of the element
     * @param scrollUpIntoCallback function to run when the scrolls up to the element again.
     */
    constructor(el, shiftAmount = 50, initialPerspectiveOriginYPercent = 50, scrollPastOffset = 0, scrollPastCallback = null, scrollUpIntoCallback = null) {
        this.el = el;
        this.shiftAmount = shiftAmount;
        this.initialPerspectiveOriginY = initialPerspectiveOriginYPercent;
        this.scrollPastOffset = scrollPastOffset
        this.scrollPastCallback = scrollPastCallback;
        this.scrollUpIntoCallback = scrollUpIntoCallback;
        this._attachListener();
    }

    _attachListener() {
        window.addEventListener('scroll', this._listener.bind(this));
        this._listener();
    }

    _listener(e=null) {
        const containerTop = this.el.getBoundingClientRect().top,
            containerHeight = this.el.getBoundingClientRect().height,
            scrollPos = Math.min(window.scrollY, containerHeight),
            newPerspectiveOriginY = Math.round(this._scale(
                    scrollPos,
                    containerTop,
                    containerHeight,
                    this.initialPerspectiveOriginY,
                    this.initialPerspectiveOriginY + this.shiftAmount
            )),
            perspectiveOrigin = `50% ${newPerspectiveOriginY}%`;

        if (scrollPos >= containerHeight - this.scrollPastOffset && typeof(this.scrollPastCallback) === 'function') {
            this.scrollPastCallback.call();
        } else {
            this.scrollUpIntoCallback.call();
        }

        this.el.style['perspectiveOrigin'] = perspectiveOrigin;
    }

    /**
     * Scale a number to fit a range.
     * @param num 
     * @param initialMin 
     * @param initialMax 
     * @param scaledMin 
     * @param scaledMax 
     */
    _scale(num, initialMin, initialMax, scaledMin, scaledMax) {
        return (num - initialMin) * (scaledMax - scaledMin) / (initialMax - initialMin) + scaledMin;
    }
};