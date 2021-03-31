import { svg } from '@polymer/lit-element'

const SCREEN_WIDTH_SVG = screen.width
const SCREEN_HEIGHT_SVG = screen.height
const py = n => n / 100 * SCREEN_HEIGHT_SVG
const px = n => n / 100 * SCREEN_WIDTH_SVG


export default ({horizon, color}) => svg`
    <rect 
        x="0" 
        y=${horizon} 
        height=${py(100) - horizon} 
        width=${px(100)}
        fill=${color}
    />
`