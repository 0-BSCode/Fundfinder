const parseNumberForDate = (timeInSeconds: number): Date => {
    return new Date(parseInt(timeInSeconds.toString()) * 1000);
}

export default parseNumberForDate