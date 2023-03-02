export interface User {    
    id: string;
    login: string;
    email?: string;
    display_name?: string;
    profile_image_url?: string;

    broadcaster_type?: string;
    created_at?: Date;
    description?: string;
    offline_image_url?: string;
    type?: string;
    view_count?: number;
}
