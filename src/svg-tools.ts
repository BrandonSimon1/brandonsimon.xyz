import { repeat } from 'lit-html/directives/repeat'
import { prop, sortBy, flatten } from 'ramda'

interface Placement {
    x: number
    y: number
    z: number
    height: number
    width: number
    depth: number
    px?: (p: number) => number
    py?: (p: number) => number
    pz?: (p: number) => number
}

const Px = (width, x) => p => p / 100 * width + x
const Py = (height, y) => p => p / 100 * height + y
const Pz = (depth, z) => p => p / 100 * depth + z

const placementHelpers = ({x, y, z, height, width, depth}: Placement) => ({
    px: Px(height, x),
    py: Py(width, y),
    pz: Pz(depth, z)
})

export const place = 
    (placingFn: (placement: Placement, props: any) => Placement) => 
        (templateFn, name) => 
            parent => 
                props => {
                    const parentPlacement = {...parent, ...placementHelpers(parent)}
                    const { z, ...xy } = placingFn(parentPlacement, props)
                    return {z, name, template: templateFn({...props, ...xy})}
                }

export const renderMany = (...components) => repeat(
    sortBy(prop('z'))(flatten(components)),
    prop('name'),
    prop('template')
)


