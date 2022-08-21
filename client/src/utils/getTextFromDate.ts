import { Months } from "src/enums/months"

const getTextFromDate = (date: Date): string => {
    const months = Object.values(Months)
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    return `${months[month]} ${day}, ${year}`
}

export default getTextFromDate