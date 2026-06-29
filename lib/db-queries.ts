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
export const getMySentBottles = async (userId: string) => {
    const { data, error } = await supabase
        .from("bottles")
        .select(`
            id,
            content,
            category,
            status,
            created_at
        `)
        .eq("sender_id", userId)
        .order("created_at", { ascending: false });

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
export const authUser = async (
    handle: string,
    phrase: string,
    mode: "register" | "login"
) => {

    const email = `${handle}@kindsphere.local`;

    if (mode === "register") {

        // Create Supabase Auth account
        const { data: authData, error: authError } =
            await supabase.auth.signUp({
                email,
                password: phrase,
            });

        if (authError) throw authError;

        if (!authData.user) {
            throw new Error("Registration failed.");
        }

        // Create public profile
        const { data: profile, error: profileError } =
            await supabase
                .from("users")
                .insert([
                    {
                        id: authData.user.id,
                        anonymous_handle: handle,
                    },
                ])
                .select()
                .single();

        if (profileError) throw profileError;

        return profile;
    }

    // LOGIN

    const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
            email,
            password: phrase,
        });

    if (loginError) throw loginError;

    if (!loginData.user) {
        throw new Error("Login failed.");
    }

    const { data: profile, error: profileError } =
        await supabase
            .from("users")
            .select("*")
            .eq("id", loginData.user.id)
            .single();

    if (profileError) throw profileError;

    return profile;
};

// --- NEW FUNCTIONS FOR CONNECTIONS & REPLIES ---

export const sendConnectionRequest = async (
    senderId: string,
    receiverId: string
) => {
    if (senderId === receiverId) {
        throw new Error("Cannot connect to yourself.");
    }

    const { data, error } = await supabase
        .from("connections")
        .insert([
            {
                sender_id: senderId,
                receiver_id: receiverId,
                status: "pending",
            },
        ])
        .select()
        .single();

    if (error) throw error;

    return data;
};

export const acceptConnection = async (
    connectionId: string
) => {
    const { data, error } = await supabase
        .from("connections")
        .update({
            status: "accepted",
        })
        .eq("id", connectionId)
        .select()
        .single();

    if (error) throw error;

    return data;
};

export const getIncomingConnections = async (
    userId: string
) => {
    const { data, error } = await supabase
        .from("connections")
        .select("*")
        .eq("receiver_id", userId)
        .order("created_at", {
            ascending: false,
        });

    if (error) throw error;

    return data;
};

export const getAcceptedConnections = async (
    userId: string
) => {
    const { data, error } = await supabase
        .from("connections")
        .select("*")
        .eq("status", "accepted")
        .or(
            `sender_id.eq.${userId},receiver_id.eq.${userId}`
        )
        .order("created_at", {
            ascending: false,
        });

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
/*export const getMyMessages = async (userId: string) => {
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
*/

export const getMyReplies = async (userId: string) => {

    // Step 1: Get all bottles owned by this user
    const { data: bottles, error: bottleError } = await supabase
        .from("bottles")
        .select("id, content")
        .eq("sender_id", userId);

    if (bottleError) throw bottleError;

    if (!bottles || bottles.length === 0) return [];

    const bottleIds = bottles.map((b) => b.id);

    // Step 2: Get every reply to those bottles
    const { data: messages, error: messageError } = await supabase
        .from("messages")
        .select("*")
        .in("bottle_id", bottleIds);

    if (messageError) throw messageError;

    if (!messages || messages.length === 0) return [];

    // Step 3: Load every sender's anonymous handle
    const senderIds = [...new Set(messages.map((m) => m.sender_id))];

    const { data: users, error: userError } = await supabase
        .from("users")
        .select("id, anonymous_handle")
        .in("id", senderIds);

    if (userError) throw userError;

    // Step 4: Build the object your UI already expects
    return messages.map((message) => {

        const bottle = bottles.find(
            (b) => b.id === message.bottle_id
        );

        const sender = users.find(
            (u) => u.id === message.sender_id
        );

        return {
            id: message.id,
            content: message.content,
            created_at: message.created_at,

            sender: {
                anonymous_handle:
                    sender?.anonymous_handle ?? "Anonymous",
            },

            bottle: {
                content: bottle?.content ?? "",
            },
        };
    });
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

export const getMessages = async (connectionId: string) => {
    const { data, error } = await supabase
        .from("messages")
        .select(`
            id,
            content,
            sender_id,
            created_at
        `)
        .eq("connection_id", connectionId)
        .order("created_at", { ascending: true });

    if (error) throw error;

    return data;
};

// Claim a bottle for later reflection
export const claimBottle = async (bottleId: string, userId: string) => {
    const { data, error } = await supabase
        .from("bottles")
        .update({
            recipient_id: userId,
            status: "captured",
        })
        .eq("id", bottleId)
        .select()
        .single();

    if (error) throw error;

    return data;
};


// Bottles chosen specifically by this user
export const getChosenBottles = async (userId: string) => {
    const { data, error } = await supabase
        .from("bottles")
        .select(`
            id,
            content,
            category,
            created_at,
            sender:users!bottles_sender_id_fkey(
                anonymous_handle
            )
        `)
        .eq("recipient_id", userId)
        .eq("status", "captured")
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
};

export const getDigestStats = async (userId: string) => {
  const { count: bottleCount } = await supabase
    .from("bottles")
    .select("*", { count: "exact", head: true })
    .eq("sender_id", userId);

  const { count: replyCount } = await supabase
    .from("messages")
    .select(
      `
      id,
      bottle:bottles!inner(sender_id)
      `,
      { count: "exact", head: true }
    )
    .eq("bottle.sender_id", userId);

  const { count: connectionCount } = await supabase
    .from("connections")
    .select("*", { count: "exact", head: true })
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .eq("status", "accepted");

  // 👇 ADD THESE
  console.log("Digest Stats for:", userId);
  console.log("Bottle Count:", bottleCount);
  console.log("Reply Count:", replyCount);
  console.log("Connection Count:", connectionCount);

  return {
    bottles: bottleCount ?? 0,
    replies: replyCount ?? 0,
    connections: connectionCount ?? 0,
  };
};

export const getInteractionResonance = async (userId: string) => {

    // Get accepted connections
    const { data: connections, error } = await supabase
        .from("connections")
        .select("sender_id, receiver_id")
        .eq("status", "accepted")
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

    if (error) throw error;

    if (!connections || connections.length === 0) return [];

    // Figure out the OTHER user's ids
    const otherIds = connections.map(c =>
        c.sender_id === userId
            ? c.receiver_id
            : c.sender_id
    );

    // Load their anonymous handles
    const { data: users, error: userError } = await supabase
        .from("users")
        .select("id, anonymous_handle")
        .in("id", otherIds);

    if (userError) throw userError;

    return users.map(user => ({
        handle: user.anonymous_handle,
        score: 1,
        reason: "Connected"
    }));
};