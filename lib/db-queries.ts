import { Bottle } from '../types/database';
import { supabase } from './supabase';

export const getDriftingBottles = async () => {
    const { data, error } = await supabase
        .from('bottles')
        .select('*')
        .eq('status', 'drifting');

    if (error) throw error;
    return data;
};

export const castBottle = async (content: string, category: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized: User not authenticated with Supabase.");

    const { data, error } = await supabase
        .from('bottles')
        .insert([{
            sender_id: user.id,
            content,
            category,
            status: 'drifting'
        }])
        .select();

    if (error) throw error;
    return data;
};

// --- AUTH / PROFILE ---
export const authUser = async (handle: string, phrase: string, mode: "register" | "login") => {
    const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("anonymous_handle", handle)
        .maybeSingle();

    if (fetchError) throw fetchError;

    if (mode === "register") {
        if (existingUser) throw new Error("Handle already taken");
        const { data, error } = await supabase
            .from("users")
            .insert([{ anonymous_handle: handle, secret_hash: phrase }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    if (!existingUser || existingUser.secret_hash !== phrase) {
        throw new Error("Invalid credentials");
    }
    return existingUser;
};

// --- NEW FUNCTIONS FOR CONNECTIONS & REPLIES ---

// 1. Send a connection request
export const sendConnectionRequest = async (senderId: string, receiverId: string) => {
    // Safety Guard: Prevent self-connection (server-side guard)
    if (senderId === receiverId) throw new Error("Cannot connect to yourself.");

    const { data, error } = await supabase
        .from('connections')
        .insert([{
            sender_id: senderId,
            receiver_id: receiverId,
            status: 'pending'
        }])
        .select();

    if (error) throw error;
    return data;
};

// 2. Accept a connection request
export const acceptConnection = async (connectionId: string) => {
    const { data, error } = await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId);

    if (error) throw error;
    return data;
};

// 3. Send a reply (creates a connection, a message, and locks the bottle)
export const sendReplyToBottle = async (bottleId: string, senderId: string, content: string) => {
    // 1. Get the bottle owner (receiver)
    const { data: bottle, error: fetchErr } = await supabase
        .from('bottles')
        .select('sender_id')
        .eq('id', bottleId)
        .single();

    if (fetchErr) throw fetchErr;
    if (!bottle?.sender_id) throw new Error("Bottle has no owner to reply to.");

    // Server-side guard: Prevent owner from replying to their own bottle
    if (bottle.sender_id === senderId) {
        throw new Error("Cannot reply to your own bottle.");
    }

    // 2. Create the connection
    const { data: connection, error: connErr } = await supabase
        .from('connections')
        .insert([{
            sender_id: senderId,
            receiver_id: bottle.sender_id,
            status: 'accepted'
        }])
        .select()
        .single();

    if (connErr) throw connErr;

    // 3. Insert the message, linking the connection_id
    /* SQL IF FAILS:
       ALTER TABLE public.messages ADD COLUMN connection_id UUID REFERENCES public.connections(id);
    */
    const { data: message, error: msgError } = await supabase
        .from('messages')
        .insert([{
            bottle_id: bottleId,
            connection_id: connection.id,
            sender_id: senderId,
            content
        }])
        .select();

    if (msgError) throw msgError;

    // 4. Update the bottle status to 'locked' so no one else can reply
    const { error: bottleError } = await supabase
        .from('bottles')
        .update({ status: 'locked' })
        .eq('id', bottleId);

    if (bottleError) throw bottleError;

    return message;
};

// Add this to lib/db-queries.ts
export const getMyMessages = async (userId: string) => {
    const { data, error } = await supabase
        .from('messages')
        .select(`
            id,
            content,
            created_at,
            bottle:bottles(id, content) 
        `)
        // This assumes the original sender is the one who 'owns' the bottle
        .eq('bottles.sender_id', userId);

    if (error) throw error;
    return data;
};

export const getMyReplies = async (userId: string) => {
    // Fetches all messages where the bottle sender is the current user
    const { data, error } = await supabase
        .from('messages')
        .select(`
            content, 
            created_at, 
            sender:users(anonymous_handle),
            bottle:bottles(content)
        `)
        .eq('bottles.sender_id', userId);

    if (error) throw error;
    return data;
};

// Fetch requests where the current user is the receiver
export const getPendingConnections = async (userId: string) => {
    const { data, error } = await supabase
        .from('connections')
        .select(`
            id,
            sender:users(anonymous_handle)
        `)
        .eq('receiver_id', userId)
        .eq('status', 'pending');

    if (error) throw error;
    return data;
};

// Fetch requests that are already accepted
export const getAcceptedConnections = async (userId: string) => {
    const { data, error } = await supabase
        .from('connections')
        .select(`
            id,
            sender:users(anonymous_handle),
            receiver:users(anonymous_handle)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .eq('status', 'accepted');

    if (error) throw error;
    return data;
};

export const sendMessage = async (connectionId: string, senderId: string, text: string) => {
    const { data, error } = await supabase
        .from('messages')
        .insert([{
            connection_id: connectionId,
            sender_id: senderId,
            content: text
        }]);

    if (error) throw error;
    return data;
};