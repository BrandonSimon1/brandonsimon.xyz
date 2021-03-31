import { svg } from '@polymer/lit-element'

const SCREEN_WIDTH_SVG = screen.width
const SCREEN_HEIGHT_SVG = screen.height
const py = n => n / 100 * SCREEN_HEIGHT_SVG
const px = n => n / 100 * SCREEN_WIDTH_SVG

export default ({position, radius, color}) => svg`
    <circle 
        cx=${position[0]}
        cy=${position[1]}
        r=${radius}
        fill=${color}
        stroke="none"
    />
`

export const sky = ({sunPosition, horizon}) => svg`
    <defs>
        <radialGradient id="skygradient" cx="10%" cy="10%" r="100%">
            <stop offset="0%" stop-color="red" />
            <stop offset="25%" stop-color="orange"/>
            <stop offset="100%" stop-color="white" />
        </radialGradient>
    </defs>
    <rect 
        x="0"
        y="0"
        width="100%"
        height=${horizon}
        fill="url(#skygradient)"
    />
`