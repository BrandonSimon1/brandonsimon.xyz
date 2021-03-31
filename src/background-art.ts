import { LitElement, html } from '@polymer/lit-element'
import hills from './hills'
import sun, { sky } from './sun'
import sea from './sea'
import cloud from './cloud'

const SCREEN_WIDTH_SVG = screen.width
const SCREEN_HEIGHT_SVG = screen.height
const py = n => n / 100 * SCREEN_HEIGHT_SVG
const px = n => n / 100 * SCREEN_WIDTH_SVG

class BackgroundArt extends LitElement {
    createRenderRoot() {
        return this
    }

    render() {
        return html`
            <svg width="100vw" height="100vh" viewBox="0 0 ${px(100)} ${py(100)}" preserveAspectRatio="none">
                ${sky({
                    sunPosition: [px(10), py(10)],
                    horizon: py(70)
                })}
                ${sea({
                    horizon: py(70),
                    color: 'lightblue'
                })}
                ${sun({
                    position: [px(10), py(10)],
                    radius: px(10),
                    color: 'red'
                })}
                ${cloud({
                    numBalls: 5,
                    center: [px(75), px(10)],
                    size: px(20),
                    color: "white"
                })}
                ${hills({
                    horizon: py(70),
                    colors: ['#FFA815', '#E87E13', '#E87E13', '#E84013', '#FF2415'], 
                    avgHeight: py(50), 
                    avgWidth: px(40), 
                    hillStrokeWidth: px(.3), 
                    strokeColors: ['grey'],
                    numHills: Math.round(px(.5)),
                    house: {
                        width: px(8),
                        height: py(20),
                        logColors: ["red", "brown"],
                        roofColor: "brown",
                        doorColor: "red",
                        stroke: "grey",
                        strokeWidth: px(.3),
                        doorStroke: "white",
                        doorStrokeWidth: px(.2),
                        windowSize: px(1.5),
                        roadColor: "grey"
                    }
                })}
            </svg>
        `
    }
}

customElements.define('background-art', BackgroundArt)
