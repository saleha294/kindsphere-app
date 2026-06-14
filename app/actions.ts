'use server';

// Define TypeScript interfaces for our anonymous response inputs and responses
export interface Responseinput {
  content: string;
  category: 'support' | 'gratitude' | 'confession' | 'Response';
  lat?: number;
  lng?: number;
}

export interface ResponseRecord {
  id: string;
  content: string;
  category: 'support' | 'gratitude' | 'confession' | 'Response';
  lat: number;
  lng: number;
  timestamp: string;
}

export interface ActionResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Pool of mock response  messages (virtual bottles) representing entries dropped onto the sphere
const MOCK_BOTTLES: ResponseRecord[] = [
  {
    id: 'b1',
    content: 'Sending warmth to whoever is studying late tonight. You are capable of amazing things!',
    category: 'support',
    lat: 40.7128,
    lng: -74.006,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'b2',
    content: 'Thankful for the small cup of coffee a stranger bought me today. It turned my whole week around.',
    category: 'gratitude',
    lat: 34.0522,
    lng: -118.2437,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'b3',
    content: 'I confessed my dream of starting a bakery to someone today. They laughed, but I am still going to do it.',
    category: 'confession',
    lat: 51.5074,
    lng: -0.1278,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'b4',
    content: 'If you are reading this, please take a deep breath. Release your shoulders. You are doing just fine.',
    category: 'support',
    lat: 35.6762,
    lng: 139.6503,
    timestamp: new Date().toISOString(),
  },
  {
    id: 'b5',
    content: 'I really love the clean design of this platform. It feels like a breath of fresh air on the internet.',
    category: 'Response',
    lat: -33.8688,
    lng: 151.2093,
    timestamp: new Date().toISOString(),
  },
];

/**
 * Server Action to submit new anonymous response (dropping a virtual bottle onto the sphere).
 * Later, this will perform Supabase database writes.
 */
export async function submitRequest(
  input: Responseinput
): Promise<ActionResponse<ResponseRecord>> {
  // Simulate database insert latency (800ms)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Basic validation
  if (!input.content || input.content.trim().length < 5) {
    return {
      success: false,
      message: 'Response message must be at least 5 characters long.',
    };
  }

  // Generate a mock successfully saved record
  const mockRecord: ResponseRecord = {
    id: `b_${Math.random().toString(36).substr(2, 9)}`,
    content: input.content.trim(),
    category: input.category,
    // Assign random coordinates if not provided (representing global drop points)
    lat: input.lat ?? parseFloat((Math.random() * 140 - 70).toFixed(4)),
    lng: input.lng ?? parseFloat((Math.random() * 360 - 180).toFixed(4)),
    timestamp: new Date().toISOString(),
  };

  console.log(`[Server Action] Submitted new response bottle:`, mockRecord);

  return {
    success: true,
    message: 'Your bottle of support has been cast into the sphere successfully.',
    data: mockRecord,
  };
}

/**
 * Server Action to fetch a random response bottle from the global grid/sphere.
 * Later, this will run a Supabase randomized select query.
 */
export async function getRandomRequest(): Promise<ActionResponse<ResponseRecord>> {
  // Simulate database fetch latency (500ms)
  await new Promise((resolve) => setTimeout(resolve, 500));

  const randomIndex = Math.floor(Math.random() * MOCK_BOTTLES.length);
  const selectedBottle = MOCK_BOTTLES[randomIndex];

  // Refresh timestamp to look current
  const data: ResponseRecord = {
    ...selectedBottle,
    timestamp: new Date().toISOString(),
  };

  console.log(`[Server Action] Selected random Response bottle:`, data);

  return {
    success: true,
    message: 'Successfully retrieved a random bottle of support.',
    data,
  };
}
