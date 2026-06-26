export interface Bottle {
    id: string;
    sender_id: string;
    content: string;
    category: 'Other' | 'Advice' | 'Vent' | 'Question';
    status: 'drifting' | 'captured' | 'replied';
    created_at: string;
    recipient_id?: string;
}