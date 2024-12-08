const aiInsightsDatabase = {
    blockchain: [
      {
        title: "Ethereum's Latest Scalability Breakthrough",
        description: "New layer-2 solution promises to reduce transaction costs by 80%",
        link: "https://example.com/ethereum-scalability",
        source: "Crypto Weekly",
        tags: ["blockchain", "ethereum", "technology"],
        publishedDate: "2024-02-15"
      },
      {
        title: "Blockchain in Supply Chain: Real-World Use Cases",
        description: "How major corporations are implementing blockchain for transparency",
        link: "https://example.com/blockchain-supply-chain",
        source: "Tech Innovations Journal",
        tags: ["blockchain", "supply-chain", "enterprise"],
        publishedDate: "2024-01-22"
      },
      {
        title: "Decentralized Finance (DeFi) Trends 2024",
        description: "Exploring the latest developments in decentralized financial technologies",
        link: "https://example.com/defi-trends",
        source: "Financial Disruption Magazine",
        tags: ["blockchain", "finance", "defi"],
        publishedDate: "2024-03-01"
      }
    ],
    ai: [
      {
        title: "Generative AI: Beyond the Hype",
        description: "Comprehensive analysis of AI's real-world impact across industries",
        link: "https://example.com/generative-ai-insights",
        source: "AI Quarterly",
        tags: ["artificial intelligence", "technology", "innovation"],
        publishedDate: "2024-02-10"
      },
      {
        title: "Ethical AI Development: New Global Standards",
        description: "International consortium establishes groundbreaking AI ethics guidelines",
        link: "https://example.com/ai-ethics",
        source: "Technology and Society Review",
        tags: ["ai", "ethics", "policy"],
        publishedDate: "2024-01-30"
      },
      {
        title: "Machine Learning Breakthroughs in Healthcare",
        description: "How AI is revolutionizing medical diagnostics and treatment",
        link: "https://example.com/ai-healthcare",
        source: "Medical Technology Insights",
        tags: ["ai", "healthcare", "machine-learning"],
        publishedDate: "2024-02-25"
      }
    ],
    huddle: [
      {
        title: "Remote Collaboration: The Future of Team Meetings",
        description: "How AI-powered platforms are transforming team interactions",
        link: "https://example.com/remote-collaboration",
        source: "Future of Work Journal",
        tags: ["huddle", "remote-work", "collaboration"],
        publishedDate: "2024-02-05"
      },
      {
        title: "AI-Enhanced Video Conferencing: A Deep Dive",
        description: "Exploring cutting-edge technologies in virtual meeting platforms",
        link: "https://example.com/ai-video-conferencing",
        source: "Tech Innovation Review",
        tags: ["huddle", "ai", "video-conferencing"],
        publishedDate: "2024-01-15"
      },
      {
        title: "Improving Team Productivity with Smart Meeting Tools",
        description: "How AI-driven platforms are changing team collaboration",
        link: "https://example.com/team-productivity",
        source: "Business Technology Magazine",
        tags: ["huddle", "productivity", "team-collaboration"],
        publishedDate: "2024-03-10"
      }
    ],
    nextjs: [
      {
        title: "Next.js 14: Game-Changing Features for Web Developers",
        description: "Comprehensive overview of the latest Next.js framework updates",
        link: "https://example.com/nextjs-14-features",
        source: "Web Development Insider",
        tags: ["nextjs", "web-development", "react"],
        publishedDate: "2024-02-20"
      },
      {
        title: "Server-Side Rendering: Next.js Best Practices",
        description: "Advanced techniques for optimizing web application performance",
        link: "https://example.com/nextjs-ssr",
        source: "Code Optimization Journal",
        tags: ["nextjs", "web-development", "performance"],
        publishedDate: "2024-01-25"
      },
      {
        title: "Next.js in Enterprise: Scaling Web Applications",
        description: "How large companies are leveraging Next.js for complex web solutions",
        link: "https://example.com/nextjs-enterprise",
        source: "Enterprise Tech Review",
        tags: ["nextjs", "enterprise", "web-development"],
        publishedDate: "2024-03-05"
      }
    ]
  };
  
  
  function getInsightsForTopic(topic) {
    const normalizedTopic = topic.toLowerCase();
    const topicData = aiInsightsDatabase[normalizedTopic];
    
    return topicData ? {
      title: `Insights about ${topic}`,
      description: `${topicData.length} relevant articles and insights about ${topic} have been found.`,
      articles: topicData
    } : null;
  }
  
  export { aiInsightsDatabase, getInsightsForTopic };