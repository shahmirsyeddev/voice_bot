// lib/dialogFlows.js

export const flows = {
  onboarding: [
    {
      id: 1,
      type: "singleChoice",
      questionText: "What should I call you?",
    },
    {
      id: 2,
      type: "multipleChoice",
      questionText:
        "Let's understand your business better: what's your industry?",
      options: [
        "Professional Services",
        "Healthcare",
        "Retail",
        "Construction",
        "Manufacturing",
        "Technology",
        "Hospitality",
        "Other",
      ],
    },
    {
      id: 3,
      type: "multipleChoice",
      questionText: "What's your current business status?",
      subText: "Where are you in your business journey?",
      options: [
        "Just Starting",
        "Established Business",
        "Growing Business",
        "Scaling Business",
        "Mature Business",
        "Other",
      ],
    },
    {
      id: 4,
      type: "multipleChoice",
      questionText: "What are your current business challenges?",
      options: [
        "Ahh... people issues",
        "I don't earn enough",
        "Not enough leads are coming into my business",
        "Cash flow is a nightmare",
        "What am I doing? Where do I go?",
        "None of the above",
        "All of the above",
      ],
    },
    {
      id: 5,
      type: "multipleChoice",
      questionText: "What's your main goal?",
      options: [
        "Grow at a steady rate",
        "Have a lean, mean fighting machine",
        "Build a team of high performers",
        "We have a great customer base, let's keep them",
        "Just make business easier",
        "Increase the value of my business",
        "Take over the world",
        "Give me the life I want",
        "Disrupt, disrupt, disrupt",
      ],
    },
    {
      id: 6,
      type: "multipleChoice",
      questionText:
        "Imagine I have a magic wand, where will we be together in 10 years?",
      options: [
        "On a beach",
        "In a fast car and with a yacht",
        "Invested and set up for life",
        "Still building the empire",
        "Volunteering my time",
        "Retired",
        "Beating the door down continuing to grow",
        "Mentoring and sitting on a board or two",
      ],
    },
    {
      id: 7,
      type: "multipleChoice",
      questionText:
        "As your super-powered business partner, if we were to focus our attention on something, what would it be?",
      options: [
        "Startup Guidance",
        "Rapid Turnaround",
        "Breaking through to the next level",
        "Digital Transformation",
        "Strategy and Planning",
        "Financial Planning and Management",
        "Marketing Strategy",
        "Team Management",
      ],
    },
    {
      id: 8,
      type: "multipleChoice",
      questionText: "What's your typical business day like?",
      options: [
        "Mostly working from home",
        "Physical store — on the floor",
        "Hybrid Business Model",
        "Service-based business",
        "Managing multiple locations with a HQ",
        "Warehouse and/or we make stuff",
        "On the road and on the tools",
      ],
    },
    {
      id: 9,
      type: "multipleChoice",
      questionText: "What's your revenue target?",
      options: [
        "Less than $10,000",
        "$10,000 – $100,000",
        "$100,000 – $500,000",
        "$500,000 – $1M",
        "$1M+",
        "$5M+",
        "$10M+",
      ],
    },
    {
      id: 10,
      type: "multipleChoice",
      questionText: "How much money do you want in your pocket?",
      options: [
        "Less than $10,000",
        "$10,000 – $100,000",
        "$100,000 – $500,000",
        "$500,000 – $1M",
        "$1M+",
        "$5M+",
        "$10M+",
      ],
    },
  ],
};
