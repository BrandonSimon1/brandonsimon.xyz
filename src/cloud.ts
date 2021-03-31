import { svg } from '@polymer/lit-element'
import { randomNormal } from 'd3-random'


export default ({color, numBalls, size, center}) => Array(numBalls).fill({}).map(() => svg`
    <circle 
        fill=${color}
        stroke="none"
        r=${size/numBalls}
        cx=${randomNormal(center[0], size/7)()}
        cy=${randomNormal(center[1], size/10)()}
    /> 
`)

  