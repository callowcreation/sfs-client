
export interface PinData {
    broadcaster_id: string,
    pinner_id: string,
    expire_at: Date,
    key: string
}

export default interface PinItem {
    key: string,
    data: PinData
}