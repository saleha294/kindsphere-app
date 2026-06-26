
import { supabase } from "@/lib/supabase";

/**
 * Marks a connection request as accepted.
 * @param connectionId - The UUID of the row in the 'connections' table.
 */

export async function fetchPendingConnections(userId: string) {
    const { data, error } = await supabase
        .from('connections')
        .select('*')
        .eq('receiver_id', userId)
        .eq('status', 'pending');

    if (error) throw error;
    return data;
}

export async function acceptConnection(connectionId: string) {
    try {
        const { data, error } = await supabase
            .from('connections')
            .update({ status: 'accepted' })
            .eq('id', connectionId)
            .select();

        if (error) throw error;

        // Return a structured object
        return { success: true, data };
    } catch (err) {
        console.error("Error:", err);
        return { success: false, error: err };
    }
}