export function isUserOwner(bottleSenderId: string | null | undefined, currentUserId: string | null | undefined): boolean {
    if (!bottleSenderId || !currentUserId) return false;
    return bottleSenderId === currentUserId;
}
