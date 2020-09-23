import Range from './tools/range';
import Submenu from './submenuBase';
import templateHtml from './template/submenu/zoom';
import {toInteger, assignmentForDestroy} from '../util';
import {defaultZoomRangeValus} from '../consts';

const CLOCKWISE = 30;
const COUNTERCLOCKWISE = -30;

/**
 * Zoom ui class
 * @class
 * @ignore
 */
class Zoom extends Submenu {
    constructor(subMenuElement, {locale, makeSvgIcon, menuBarPosition, usageStatistics}) {
        super(subMenuElement, {
            locale,
            name: 'zoom',
            makeSvgIcon,
            menuBarPosition,
            templateHtml,
            usageStatistics
        });
        this._value = 0;

        this._els = {
            zoomButton: this.selector('.tie-retate-button'),
            zoomRange: new Range({
                slider: this.selector('.tie-zoom-range'),
                input: this.selector('.tie-ratate-range-value')
            }, defaultZoomRangeValus)
        };
    }

    /**
     * Destroys the instance.
     */
    destroy() {
        this._removeEvent();
        this._els.zoomRange.destroy();

        assignmentForDestroy(this);
    }

    setRangeBarAngle(type, angle) {
        let resultAngle = angle;

        if (type === 'zoom') {
            resultAngle = parseInt(this._els.zoomRange.value, 10) + angle;
        }

        this._setRangeBarRatio(resultAngle);
    }

    _setRangeBarRatio(angle) {
        this._els.zoomRange.value = angle;
    }

    /**
     * Add event for zoom
     * @param {Object} actions - actions for crop
     *   @param {Function} actions.zoom - zoom action
     *   @param {Function} actions.setAngle - set angle action
     */
    addEvent(actions) {
        this.eventHandler.rotationAngleChanged = this._changeZoomForButton.bind(this);

        // {zoom, setAngle}
        this.actions = actions;
        this._els.zoomButton.addEventListener('click', this.eventHandler.rotationAngleChanged);
        this._els.zoomRange.on('change', this._changeZoomForRange.bind(this));
    }

    /**
     * Remove event
     * @private
     */
    _removeEvent() {
        this._els.zoomButton.removeEventListener('click', this.eventHandler.rotationAngleChanged);
        this._els.zoomRange.off();
    }

    /**
     * Change zoom for range
     * @param {number} value - angle value
     * @param {boolean} isLast - Is last change
     * @private
     */
    _changeZoomForRange(value, isLast) {
        const angle = toInteger(value);
        this.actions.setAngle(angle, !isLast);
        this._value = angle;
    }

    /**
     * Change zoom for button
     * @param {object} event - add button event object
     * @private
     */
    _changeZoomForButton(event) {
        const button = event.target.closest('.tui-image-editor-button');
        const angle = this._els.zoomRange.value;

        if (button) {
            const zoomType = this.getButtonType(button, ['counterclockwise', 'clockwise']);
            const zoomAngle = {
                clockwise: CLOCKWISE,
                counterclockwise: COUNTERCLOCKWISE
            }[zoomType];
            const newAngle = parseInt(angle, 10) + zoomAngle;
            const isRotatable = newAngle >= -360 && newAngle <= 360;
            if (isRotatable) {
                this.actions.zoom(zoomAngle);
            }
        }
    }
}

export default Zoom;
