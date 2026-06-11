// lib/requests.ts — shared mock data for the dashboard feed and detail pages

export type FeedRequest = {
  id: number;
  handle: string;
  category: "Career" | "Relationships" | "Creative" | "Health";
  excerpt: string;
  fullText: string;
  time: string;
  views: number;
  responses: number;
};

export const ALL_REQUESTS: FeedRequest[] = [
  {
    id: 1,
    handle: "DriftingLeaf_92",
    category: "Career",
    excerpt:
      "I've been at my first job for a year and feel completely stuck. My manager is nice but doesn't give me any real responsibility. Should I leave or try to push harder here?",
    fullText:
      "I've been at my first job for exactly one year now and I'm genuinely struggling with whether to stay or go. My manager is a kind person — they're supportive in a general sense — but they never delegate any real projects to me. I spend most of my day on repetitive tasks that a junior intern could handle. I've tried to express that I want more responsibility, but the conversations never go anywhere concrete.\n\nI'm 24, and I feel like I'm watching my peers at other companies grow at twice my pace. My skills aren't being challenged. On the other hand, the job is stable, the team culture is warm, and leaving after one year feels like giving up too soon.\n\nDo I stay and push harder for a promotion or project ownership? Or do I trust my instincts that this environment won't ever give me what I need?",
    time: "2h ago",
    views: 127,
    responses: 8,
  },
  {
    id: 2,
    handle: "QuietThunder_7",
    category: "Relationships",
    excerpt:
      "My best friend is making choices that are genuinely hurting them, but whenever I bring it up they get defensive. How do you support someone who won't listen?",
    fullText:
      "My best friend of 8 years has been in a relationship I'm worried about. The dynamic seems unhealthy — they cancel plans last minute, they've stopped talking about their own dreams, and I've seen them cry after phone calls they say were \"fine.\"\n\nEvery time I try to gently raise my concern, they shut down. Last time I said something, they told me I was \"being dramatic\" and didn't speak to me for two weeks. But then they came back like nothing happened.\n\nI love this person deeply and I'm terrified of losing them as a friend. But I'm also terrified of watching them disappear into something that's making them smaller. How do you hold space for someone who isn't ready to see what you can see? And when does caring cross into overstepping?",
    time: "4h ago",
    views: 84,
    responses: 3,
  },
  {
    id: 3,
    handle: "SilverMoon_44",
    category: "Creative",
    excerpt:
      "I used to paint every day. Now I haven't picked up a brush in 6 months. Every time I try, I feel paralyzed by the blank canvas. How do I break this block?",
    fullText:
      "I've been a painter since I was 12. It has always been the place where I felt most like myself — the only space where my thoughts quieted down. For the past 6 months, I haven't touched a canvas once.\n\nI don't know exactly when or why it stopped. Part of me thinks it's because I started sharing my work online two years ago, and slowly I began making work I thought people would respond to rather than work that felt true to me. The validation became the point, and then when the validation fluctuated, I stopped feeling safe creating at all.\n\nNow I sit in front of a blank canvas and feel a kind of dread I've never felt before. It doesn't feel like laziness. It feels like grief.\n\nHas anyone broken through this kind of block? Not the kind where you're uninspired — but the kind where the act of creating feels like it has too much riding on it?",
    time: "6h ago",
    views: 210,
    responses: 14,
  },
  {
    id: 4,
    handle: "WanderingStar_12",
    category: "Health",
    excerpt:
      "Trying to rebuild a healthy relationship with food after years of tracking every calorie. The anxiety of not knowing is overwhelming. Does it get easier?",
    fullText:
      "For six years I tracked every calorie I ate. At first it felt like control and discipline. Over time, it became something I couldn't turn off — eating anything without logging it first caused genuine panic. Social dinners were exhausting. Vacations were planned around food macro spreadsheets.\n\nI've been in therapy for eight months and my therapist has encouraged me to stop tracking entirely and learn to listen to my body again. I'm trying. But the anxiety of not knowing — of eating a meal and not knowing its exact nutritional composition — is still overwhelming most days.\n\nI'm not asking for dietary advice. I'm asking: for those who've been through something similar, did the anxiety actually get quieter? How long did it take before eating felt neutral again rather than terrifying? And how did you tolerate the discomfort of not knowing while you were getting there?",
    time: "11h ago",
    views: 156,
    responses: 9,
  },
  {
    id: 5,
    handle: "OceanBreeze_88",
    category: "Career",
    excerpt:
      "Just got promoted to manager and I feel like an imposter. My team is older and more experienced than me. How do I earn their respect without being overbearing?",
    fullText:
      "Three weeks ago I was promoted to team lead at 27. Most of my team members are between 33 and 48, with significantly more industry experience than me. The promotion came from above — I didn't campaign for it — which makes it feel even more fragile.\n\nI can tell some of them are skeptical. One senior member responds to my suggestions with polite but pointed pushback. Another is outwardly warm but routes decisions around me to my former manager.\n\nI genuinely believe I have something to offer — I see patterns they miss, I think cross-functionally, and I care deeply about the team's wellbeing. But I don't want to perform authority. I want to earn genuine respect. And I'm terrified of getting it wrong in a way that damages relationships I'll need for years.\n\nHow do you earn trust when you're younger than the people you're leading?",
    time: "Yesterday",
    views: 342,
    responses: 21,
  },
  {
    id: 6,
    handle: "EmberGlow_3",
    category: "Relationships",
    excerpt:
      "I realized I don't actually like my friend group, I'm just afraid of being alone. How do you start over and find your real people in your late 20s?",
    fullText:
      "A few months ago I had a strange, clarifying moment. I was sitting in a group dinner with my friends — people I've known for years — and I realized I was bored. Not temporarily. Genuinely bored, and also slightly uncomfortable, and definitely performing a version of myself I don't really recognize.\n\nI love these people in an abstract way. We have history. But I don't think I actually like who I am around them. The conversations stay surface-level by unspoken agreement. Nobody talks about what they're actually going through. It's safe and hollow.\n\nI'm 28. I work remotely. Most of the easy, proximity-based ways of meeting people have closed down. The idea of \"putting yourself out there\" sounds exhausting and somewhat infantilizing at this age.\n\nHow do you actually find new people who feel like home — not just people who are convenient — when you're an adult with no obvious shared spaces?",
    time: "Yesterday",
    views: 412,
    responses: 35,
  },
];

export const TAG_STYLES: Record<string, string> = {
  Career:        "bg-[hsl(14,66%,62%)]/10  text-[hsl(14,66%,62%)]  border-[hsl(14,66%,62%)]/20",
  Relationships: "bg-[hsl(150,25%,61%)]/10 text-[hsl(150,25%,61%)] border-[hsl(150,25%,61%)]/20",
  Creative:      "bg-purple-500/10 text-purple-600 border-purple-500/20",
  Health:        "bg-blue-500/10   text-blue-600   border-blue-500/20",
};
