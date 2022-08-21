const parseWeiToText = (amount: number): string => {
    return `${amount === 0? 0: amount.toString().slice(0,-18)} eth`
}

export default parseWeiToText