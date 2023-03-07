
export interface PinData {
    broadcaster_id: string,
    pinner_id: string,
    expireAt: Date,
    key: string
}

export default interface PinItem {
    key: string,
    data: PinData
}