import { supabase } from "@/lib/utils/supabase";

export const castBottle = async (senderId: string, content: string, category: string) => {
    // 1. Insert the new bottle
    const { data, error } = await supabase
        .from('bottles')
        .insert([
            {
                sender_id: senderId,
                content: content,
                category: category,
                status: 'active',
            },
        ])
        .select();

    if (error) {
        console.error("Error casting bottle:", error);
        throw error;
    }

    return data;
};