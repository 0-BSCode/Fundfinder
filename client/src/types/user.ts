export interface User {
    id?: string;

    username?: string;
    picture?: string;
    activeGoalCount?: number;
    goals?: number[];
    goalsHelped?: number[];

    exists?: boolean;
    createdAt?: Date;
}