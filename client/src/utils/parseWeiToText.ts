const parseWeiToText = (amount?: number): string => {
    return `${amount?.toString().slice(0,-18)} eth`
}

export default parseWeiToText