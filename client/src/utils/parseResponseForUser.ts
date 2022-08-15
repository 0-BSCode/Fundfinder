import { User } from "src/types/user"
import parseNumberForDate from "./parseNumberForDate";

const parseResponseForUser = (response: any): User => {
    let user:User = {};

    if (response.length) {
        user.id = response[0],
        user.username = response[1],
        user.picture = response[2],
        user.createdAt = parseNumberForDate(response[3]),
        user.activeGoalCount = parseInt(response[4].toString())
    }

    return user;
}

export default parseResponseForUser