import { Goal } from "src/types/goal";
import parseNumberForDate from "./parseNumberForDate";

const parseResponseForGoal = (response: any): Goal => {
    let goal:Goal = {};

    if (response.length) {
        goal.id = response[0],
        goal.owner = response[1],
        goal.title = response[2],
        goal.description = response[3],
        goal.details = response[4],
        goal.picture = response[5],
        goal.createdAt = parseNumberForDate(response[6]),
        goal.deadline = parseNumberForDate(response[7]),
        goal.maxAmount = parseInt(response[8].toString()),
        goal.currentAmount = parseInt(response[9].toString()),
        goal.isActive = response[10]
    }

    return goal;
}

export default parseResponseForGoal