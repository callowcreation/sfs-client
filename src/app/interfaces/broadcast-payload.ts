export interface Environment {
    cycle: string;
    version: string;
    timestamp: number;
}

export interface BroadcastPayload {
    environment?: Environment;
}