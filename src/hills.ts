import { svg } from '@polymer/lit-element'
import { randomNormal, randomUniform } from 'd3-random'
import { path } from 'd3-path'
import house, { road } from './house'

const SCREEN_WIDTH_SVG = screen.width
const SCREEN_HEIGHT_SVG = screen.height
const py = n => n / 100 * SCREEN_HEIGHT_SVG
const px = n => n / 100 * SCREEN_WIDTH_SVG

const hill = ({height, width, vx, stroke, strokeWidth, bottomLeft, fill}) => {
    const controlPoint = quadraticBezierControlPoint({bottomLeft, width, height, vx})
    const hillPath = path()
    hillPath.moveTo(
        bottomLeft[0],
        bottomLeft[1]
    )
    hillPath.quadraticCurveTo(
        controlPoint[0], 
        controlPoint[1],
        bottomLeft[0] + width,
        bottomLeft[1]
    )
    return svg`
        <defs>
            <linearGradient id="hillgradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stop-color="#E87E13" />
                <stop offset="95%" stop-color="#E84013" />
            </linearGradient>
        </defs>
        <path 
            d=${hillPath.toString()}
            class="hill-fill" 
            stroke=${stroke}
            stroke-width=${strokeWidth} 
            fill="url(#hillgradient)"
        />
        <!-- <circle 
            cx=${vx}
            cy=${bottomLeft[1] - height}
            r="10"
            stroke="none"
            fill="blue"
        /> -->
    `
}

const quadraticBezierControlPoint = ({bottomLeft, width, height, vx}) => {
    const px = .5*(4*vx - 2*bottomLeft[0] - width)
    const py = -2*height + bottomLeft[1]
    return [px, py]
}

const hillWithHouse = ({ houseData, hillData }) => svg`
    ${hill(hillData)}
    ${house({
        ...houseData,
        roadLength: hillData.roadLength,
        roadSpan: hillData.width / 2,
        topLeft: [
            hillData.vx - houseData.width / 2, 
            hillData.bottomLeft[1] - hillData.height - houseData.height*.75
        ]
    })}
`

const hillWithRoad = ({hillData}) => svg`
    ${hill(hillData)}
    ${road({
        width: px(1),
        color: "grey",
        start: [hillData.vx, hillData.bottomLeft[1] - hillData.height],
        length: hillData.height,
        span: hillData.width / 2
    })}
`

export default ({colors, numHills, horizon, strokeColors, avgHeight, avgWidth, hillStrokeWidth, house}) => {
    const yPos = randomNormal(py(100), px(5))
    const xPosBelowHorizon = randomUniform(0, px(100))
    const xPosAboveHorizon = randomUniform(px(65), px(100))
    const hillLocations = Array(numHills).fill({}).map(() => {
        const y = yPos()
        if (y > horizon) {
            const x = xPosBelowHorizon()
            return {bottomLeft: [x, y], withHouse: false, withRoad: false}
        } else {
            const x = xPosAboveHorizon()
            return {bottomLeft: [x, y], withHouse: false, withRoad: false}
        }
    })
    const height = () => randomNormal(avgHeight, py(10))() 
    const width = () => randomNormal(avgWidth, px(10))() 
    const hillData = hillLocations.map(({bottomLeft, withHouse, withRoad}) => {
        const w = width()
        return {
            bottomLeft,
            withHouse,
            withRoad,
            height: height(),
            width: w,
            vx: bottomLeft[0] + randomNormal(w / 2, w / 10)(),
            stroke: strokeColors[Math.floor(Math.random() * strokeColors.length)],
            strokeWidth: hillStrokeWidth,
            fill: colors[Math.floor(Math.random() * colors.length)],
            roadLength: 0
        }
    })
    hillData.sort(({bottomLeft: [, y1], height: h1}, {bottomLeft: [, y2], height: h2}) => {
        const peak1 = y1 - h1
        const peak2 = y2 - h2
        if (peak1 > peak2) {
            return 1
        } else if (peak1 === peak2) {
            return 0
        } else {
            return -1
        }
    })
    const houseHillIndex = hillData.findIndex(t => t.vx + house.width / 2 < SCREEN_WIDTH_SVG)
    const houseHill = hillData[houseHillIndex]
    houseHill.withHouse = true
    houseHill.roadLength = houseHill.height
    const houseHillVX = houseHill.vx
    hillData.slice(houseHillIndex + 1).forEach(t => {
        if (Math.abs(houseHillVX - t.vx) <= px(15)) {
            t.withRoad = true
        }
    })
    const hills = hillData.map(a => {
        return a.withHouse 
            ? hillWithHouse({hillData: a, houseData: house}) 
            : (a.withRoad 
                ? hillWithRoad({hillData: a})
                : hill(a))
    })
    return hills
}