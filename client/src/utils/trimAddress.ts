const trimAddress = (address?: string): string => {
    return `${address?.slice(0,9)}...`
}

export default trimAddress