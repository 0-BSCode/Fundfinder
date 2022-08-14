export interface Goal {
    id?: number;
    owner?: string;
    picture?: string;

    title?: string;
    description?: string;
    details?: string;
    maxAmount?: number;
    currentAmount?: number;

    isActive?: boolean;
    funderAddresses?: string[];

    createdAt?: Date;
}