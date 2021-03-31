import { svg } from '@polymer/lit-element'
import { scaleLinear } from 'd3-scale'
import { randomNormal } from 'd3-random'
import { zip } from 'd3'
import { path } from 'd3-path'

const SCREEN_WIDTH_SVG = screen.width
const SCREEN_HEIGHT_SVG = screen.height
const py = n => n / 100 * SCREEN_HEIGHT_SVG
const px = n => n / 100 * SCREEN_WIDTH_SVG

export default ({
    topLeft, 
    width, 
    height, 
    logColors, 
    roofColor, 
    doorColor,
    windowSize,
    stroke, 
    strokeWidth, 
    doorStroke, 
    doorStrokeWidth,
    roadColor,
    roadLength,
    roadSpan
}) => {
    const doorWidth = .3 * width
    const doorHeight = .4 * height
    const roofHeight = .4 * height
    const logsHeight = .6 * height
    const numLogs = 6
    return svg`
        ${logs({
            topLeft: [topLeft[0], topLeft[1] + roofHeight], 
            numLogs, 
            colors: logColors, 
            doorWidth, 
            doorHeight, 
            width, 
            height: logsHeight, 
        })}
        ${window({
            topLeft: [
                topLeft[0] + .1*width,
                topLeft[1] + roofHeight + .2*logsHeight
            ],
            color: doorStroke,
            size: windowSize,
            strokeWidth
        })}
        ${window({
            topLeft: [
                topLeft[0] + width - .28*width,
                topLeft[1] + roofHeight + .2*logsHeight
            ],
            color: doorStroke,
            size: windowSize,
            strokeWidth
        })}
        ${door({
            topLeft: [
                topLeft[0] + width / 2 - doorWidth / 2, 
                topLeft[1] + height - doorHeight * 1.1
            ],
            width: doorWidth, 
            height: doorHeight, 
            color: doorColor, 
            stroke: doorStroke, 
            strokeWidth: doorStrokeWidth
        })}
        ${doorKnob({
            position: [
                topLeft[0] + width / 2 - doorWidth / 2 + doorWidth*.65,
                topLeft[1] + height - doorHeight + doorHeight*.4
            ],
            color: doorStroke 
        })}
        ${roof({
            topLeft, 
            width, 
            stroke, 
            strokeWidth, 
            color: roofColor, 
            height: roofHeight 
        })}
        ${road({
            width: px(1),
            color: roadColor,
            start: [topLeft[0] + width / 2, topLeft[1] + height*1.05],
            length: roadLength,
            span: roadSpan
        })}
    `
}


const log = ({color, width, height, topLeft}) => svg`
    <rect 
        fill=${color} 
        x=${topLeft[0]} 
        y=${topLeft[1]} 
        width=${width} 
        height=${height}
    />
`
export const road = ({width, color, start, length, span}) => {
    const roadPath = path()
    roadPath.moveTo(start[0], start[1])
    const randX = randomNormal(start[0], px(5))
    roadPath.quadraticCurveTo(randX(), start[1] + length*.9, randX(), start[1] + length)
    return svg`
        <path 
            d=${roadPath.toString()}
            stroke=${color}
            stroke-width=${width}
            fill="none"
        />
    `
}

const window = ({topLeft, color, size, strokeWidth}) => svg`
    <rect 
        x=${topLeft[0]} 
        y=${topLeft[1]} 
        height=${size} 
        width=${size} 
        fill="none" 
        stroke=${color} 
        stroke-width=${strokeWidth}
    />
    <rect 
        x=${topLeft[0] + size / 2 - strokeWidth / 2}
        y=${topLeft[1]}
        width=${strokeWidth}
        height=${size}
        fill=${color}
        stroke="none"
    />
    <rect 
        x=${topLeft[0]}
        y=${topLeft[1] + size / 2 - strokeWidth / 2}
        width=${size}
        height=${strokeWidth}
        fill=${color}
        stroke="none"
    />
`

const logs = ({topLeft, width, height, doorWidth, doorHeight, colors, numLogs}) => {
    const logsAboveDoor = ({color, position, height}) => log({color, topLeft: [topLeft[0], position], width, height})
    const logsBelowDoor = ({color, position, height}) => svg`${[
        log({color, topLeft: [topLeft[0], position], width: (width - doorWidth) / 2, height}),
        log({color, topLeft: [topLeft[0] + width / 2 + doorWidth / 2, position], width: (width - doorWidth) / 2, height})
    ]}`
    const logPositions = scaleLinear().domain([0, height]).ticks(numLogs).map(t => t + topLeft[1])
    const logColors = Array(numLogs).fill("").map((t, i) => i % 2 === 0 ? colors[0] : colors[1])
    const makeLogs = p => p.position > doorHeight ? logsAboveDoor(p) : logsBelowDoor(p)
    const logHeight = height / numLogs
    const logData = zip(logPositions, logColors).map(([p, c]) => ({ color: c, position: p, height: logHeight}))
    return logData.map(makeLogs)
}

const doorKnob = ({position, color}) => svg`
    <circle cx=${position[0]} cy=${position[1]} r=${px(.3)} fill=${color} stroke="none"/>
`

const door = ({topLeft, width, height, color, stroke, strokeWidth}) => svg`
    <rect 
        fill=${color} 
        stroke=${stroke} 
        stroke-width=${strokeWidth} 
        x=${topLeft[0]} 
        y=${topLeft[1]} 
        width=${width} 
        height=${height}
    />
`

const roof = ({topLeft, width, height, color, stroke, strokeWidth}) => svg`
    <polygon
        points="
            ${topLeft[0]}, ${topLeft[1] + height} 
            ${topLeft[0] + width/2}, ${topLeft[1]} 
            ${topLeft[0] + width}, ${topLeft[1] + height}
        "
        fill=${color} 
        stroke=${stroke} 
        stroke-width=${strokeWidth} 
    />
`