const parseTextForDateTime = (date: string): number => {
    const time = new Date(date).getTime();
    const timeInSeconds = Math.floor(time / 1000)

    return timeInSeconds
}

export default parseTextForDateTime