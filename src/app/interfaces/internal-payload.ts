import { BroadcastPayload } from "./broadcast-payload";
import { Settings } from "./settings";

export interface Self {
    disableActions?: boolean;
    settings?: Settings
}

export interface InternalPayload extends BroadcastPayload {
    self: Self;
}
