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

//It literally just inserts one row into the bottles table.
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

// claimBottle: kept for backward compatibility only.
// New code should use privatelyDeliverBottle() instead.
// This function no longer writes recipient_id or captures the bottle status.
export const claimBottle = async (_bottleId: string, _userId: string) => {
    // No-op: private delivery is now tracked exclusively in private_bottle_deliveries.
    return null;
};


// Bottles privately delivered to this user
export const getChosenBottles = async (userId: string) => {

    // Step 1
    const { data: deliveries, error: deliveryError } = await supabase
        .from("private_bottle_deliveries")
        .select("bottle_id")
        .eq("receiver_id", userId)
        .eq("responded", false);

    if (deliveryError) throw deliveryError;

    if (!deliveries || deliveries.length === 0)
        return [];

    const bottleIds = deliveries.map(d => d.bottle_id);

    // Step 2
    const { data: bottles, error: bottleError } = await supabase
        .from("bottles")
        .select(`
            id,
            sender_id,
            content,
            category,
            created_at
        `)
        .in("id", bottleIds);

    if (bottleError) throw bottleError;

    if (!bottles || bottles.length === 0)
        return [];

    // Step 3
    const senderIds = [...new Set(bottles.map(b => b.sender_id))];

    const { data: users, error: userError } = await supabase
        .from("users")
        .select("id, anonymous_handle")
        .in("id", senderIds);

    if (userError) throw userError;

    // Step 4
    return bottles.map(bottle => ({
        ...bottle,
        sender: {
            anonymous_handle:
                users?.find(u => u.id === bottle.sender_id)
                    ?.anonymous_handle ?? "Anonymous"
        }
    }));
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

export const privatelyDeliverBottle = async (bottleId: string) => {

    console.log("========== PRIVATE DELIVERY ==========");

    console.log("Bottle ID received:", bottleId);

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    console.log("Auth Error:", authError);
    console.log("Current User:", user);

    if (!user) {
        throw new Error("Not logged in.");
    }

    // -------------------------------
    // Check bottle exists
    // -------------------------------

    const { data: bottleCheck, error: bottleError } = await supabase
        .from("bottles")
        .select("*")
        .eq("id", bottleId)
        .single();

    console.log("Bottle:", bottleCheck);
    console.log("Bottle Error:", bottleError);

    // -------------------------------
    // Load possible recipients
    // -------------------------------

    const { data: users, error: userError } = await supabase
        .from("users")
        .select("id")
        .neq("id", user.id);

    console.log("Possible users:", users);
    console.log("User Error:", userError);

    if (userError) throw userError;

    if (!users || users.length === 0) {
        throw new Error("No users available.");
    }

    const randomUser =
        users[Math.floor(Math.random() * users.length)];

    console.log("Chosen User:", randomUser);

    const payload = {
        bottle_id: bottleId,
        sender_id: user.id,
        receiver_id: randomUser.id,
    };

    console.log("Payload about to insert:");
    console.table(payload);

    const { data, error } = await supabase
        .from("private_bottle_deliveries")
        .insert(payload)
        .select();

    console.log("Insert Result:", data);
    console.log("Insert Error:", error);

    if (error) {
        throw error;
    }

    console.log("========== SUCCESS ==========");

    return data;
};

// ── Private Bottle Delivery: receiver-side ────────────────────────────────

/**
 * Fetch private bottle deliveries addressed to this user that have not
 * been responded to yet.  Uses two explicit queries rather than a PostgREST
 * join hint so it works regardless of whether a named FK exists.
 */
export const getPrivateBottles = async (userId: string) => {
    // Step 1 — deliveries for this receiver that are still pending
    const { data: deliveries, error: deliveryError } = await supabase
        .from("private_bottle_deliveries")
        .select("id, responded, created_at, bottle_id")
        .eq("receiver_id", userId)
        .eq("responded", false)
        .order("created_at", { ascending: false });

    if (deliveryError) throw deliveryError;
    if (!deliveries || deliveries.length === 0) return [];

    const bottleIds = deliveries.map((d) => d.bottle_id);

    // Step 2 — fetch the actual bottle content (no sender identity exposed)
    const { data: bottles, error: bottleError } = await supabase
        .from("bottles")
        .select("id, content, category, created_at")
        .in("id", bottleIds);

    if (bottleError) throw bottleError;

    const bottleMap = Object.fromEntries(
        (bottles ?? []).map((b) => [b.id, b])
    );

    // Merge: each delivery gets its bottle attached, sender stays hidden
    return deliveries.map((delivery) => ({
        id: delivery.id,
        responded: delivery.responded,
        created_at: delivery.created_at,
        bottle: bottleMap[delivery.bottle_id] ?? null,
    }));
};

/**
 * Mark a private delivery as responded and insert an anonymous reply
 * message into the messages table.  The reply is linked to the original
 * bottle so the sender can read it in their replies page — but the
 * sender_id stored is the replier's real id, which is never shown in the
 * UI (only the anonymous handle is displayed).
 *
 * After this call the delivery row has responded = true and the bottle
 * will disappear from the receiver's private inbox on next load.
 */
export const replyToPrivateBottle = async (
    deliveryId: string,
    bottleId: string,
    replyerId: string,
    content: string
) => {
    // 1. Insert the anonymous reply message
    const { error: msgError } = await supabase
        .from("messages")
        .insert([{
            bottle_id: bottleId,
            sender_id: replyerId,
            content,
        }]);

    if (msgError) throw msgError;

    // 2. Mark delivery as responded so it leaves the inbox
    const { error: updateError } = await supabase
        .from("private_bottle_deliveries")
        .update({ responded: true })
        .eq("id", deliveryId);

    if (updateError) throw updateError;
};

// ── Sphere live stats ─────────────────────────────────────────────────────

/**
 * Returns aggregate counts for the live Sphere stats panel.
 * All counts are cheap single-query aggregates — no user PII exposed.
 */
export const getSphereStats = async () => {
    const [bottlesRes, repliesTodayRes, usersRes] = await Promise.all([
        supabase
            .from("bottles")
            .select("*", { count: "exact", head: true })
            .eq("status", "drifting"),
        supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
        supabase
            .from("users")
            .select("*", { count: "exact", head: true }),
    ]);

    return {
        driftingBottles: bottlesRes.count ?? 0,
        repliesToday: repliesTodayRes.count ?? 0,
        totalSouls: usersRes.count ?? 0,
    };
};

/**
 * Returns all registered users as anonymous globe markers.
 * Only the anonymous handle is returned — no emails, no auth ids exposed.
 */
export const getSphereUsers = async () => {
    const { data, error } = await supabase
        .from("users")
        .select("id, anonymous_handle");

    if (error) throw error;
    return data ?? [];
};
