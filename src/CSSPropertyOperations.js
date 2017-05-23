/**
 * CSS Property Operations
 */
// 循环设置元素的styles，调用setStyleValue设置每个值
export function setStyle(elemStyle, styles) {
    for (let styleName in styles) {
        if (styles.hasOwnProperty(styleName)) {
            setStyleValue(elemStyle, styleName, styles[styleName])
        }
    }
}
// 删除css样式
export function removeStyle(elemStyle, styles) {
    for (let styleName in styles) {
        if (styles.hasOwnProperty(styleName)) {
            elemStyle[styleName] = ''
        }
    }
}
// 对比newStyle和现有的样式，对比差异，设置css
export function patchStyle(elemStyle, style, newStyle) {
    if (style === newStyle) {
        return
    }
    if (!newStyle && style) {
        removeStyle(elemStyle, style)
        return
    } else if (newStyle && !style) {
        setStyle(elemStyle, newStyle)
        return
    }

    for (let key in style) {
        if (newStyle.hasOwnProperty(key)) {
            if (newStyle[key] !== style[key]) {
                setStyleValue(elemStyle, key, newStyle[key])
            }
        } else {
            elemStyle[key] = ''
        }
    }
    for (let key in newStyle) {
        if (!style.hasOwnProperty(key)) {
            setStyleValue(elemStyle, key, newStyle[key])
        }
    }
}

/**
 * CSS properties which accept numbers but are not in units of "px".
 */
// 不需要加pc单位的
const isUnitlessNumber = {
    animationIterationCount: 1,
    borderImageOutset: 1,
    borderImageSlice: 1,
    borderImageWidth: 1,
    boxFlex: 1,
    boxFlexGroup: 1,
    boxOrdinalGroup: 1,
    columnCount: 1,
    flex: 1,
    flexGrow: 1,
    flexPositive: 1,
    flexShrink: 1,
    flexNegative: 1,
    flexOrder: 1,
    gridRow: 1,
    gridColumn: 1,
    fontWeight: 1,
    lineClamp: 1,
    lineHeight: 1,
    opacity: 1,
    order: 1,
    orphans: 1,
    tabSize: 1,
    widows: 1,
    zIndex: 1,
    zoom: 1,

    // SVG-related properties
    fillOpacity: 1,
    floodOpacity: 1,
    stopOpacity: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeMiterlimit: 1,
    strokeOpacity: 1,
    strokeWidth: 1,
}
function prefixKey(prefix, key) {
    return prefix + key.charAt(0).toUpperCase() + key.substring(1)
}

let prefixes = ['Webkit', 'ms', 'Moz', 'O']
// 加前缀，比如传入background，遍历prefixes ，变成
//     WebkitBackground
//     msBackground
//     MozBackground
//     OBackground
// 四个 吧isUnitlessNumber扩充为带前缀的版本

Object.keys(isUnitlessNumber).forEach(function(prop) {
    prefixes.forEach(function(prefix) {
        isUnitlessNumber[prefixKey(prefix, prop)] = 1
    })
})
// 数字的正则
let RE_NUMBER = /^-?\d+(\.\d+)?$/
// 设置css的函数，单位是否加px单位，然后直接elemStyle.background = 'red'或者.width='200px'
function setStyleValue(elemStyle, styleName, styleValue) {

    if (!isUnitlessNumber[styleName] && RE_NUMBER.test(styleValue)) {
        elemStyle[styleName] = styleValue + 'px'
        return
    }

    if (styleName === 'float') {
        styleName = 'cssFloat'
    }

    if (styleValue == null || typeof styleValue === 'boolean') {
        styleValue = ''
    }

    elemStyle[styleName] = styleValue
}