const trimUsername = (username: string, limit?: number): string => {
    const finalLength = limit? limit - 1: 9
    let res = `${username}`

    if (username.length > finalLength) {
        res = `${username.slice(0, finalLength)}...`
    }

    return res
}

export default trimUsername