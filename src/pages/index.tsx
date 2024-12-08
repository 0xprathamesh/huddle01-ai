import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, ArrowRight, Zap, BookOpen, Newspaper } from 'lucide-react';
import {getInsightsForTopic, aiInsightsDatabase} from "../utils/index"
// Simulated AI Recommendation Component
// const AIRecommendation = ({ topic }) => {
//   const [recommendation, setRecommendation] = useState(null);

//   useEffect(() => {
//     // Simulated AI recommendation logic
//     const fetchRecommendation = async () => {
//       if (topic) {
//         // In a real app, this would be an API call to an AI service
//         setRecommendation({
//           title: `Insights about ${topic}`,
//           description: `Relevant articles and context about ${topic} have been found.`,
//           articles: [
//             { 
//               title: `Latest Updates on ${topic}`, 
//               link: "https://huddle01.com/",
//               source: "AI Insights"
//             }
//           ]
//         });
//       }
//     };

//     fetchRecommendation();
//   }, [topic]);

//   if (!recommendation) return null;

//   return (
//     <div className="fixed bottom-4 right-4 w-80 bg-neutral-800 rounded-xl shadow-2xl border-2 border-neutral-700 p-4 animate-slide-in">
//       <div className="flex items-center mb-3">
//         <Zap className="mr-2 text-yellow-500" size={24} />
//         <h3 className="text-lg font-bold text-neutral-100">AI Insights</h3>
//       </div>
//       <p className="text-neutral-400 text-sm mb-3">{recommendation.description}</p>
//       {recommendation.articles.map((article, index) => (
//         <div 
//           key={index} 
//           className="bg-neutral-750 p-3 rounded-lg mb-2 flex items-center hover:bg-neutral-700 transition-colors"
//         >
//           <Newspaper className="mr-2 text-blue-400" size={20} />
//           <div>
//             <h4 className="text-neutral-200 font-semibold text-sm">{article.title}</h4>
//             <a 
//               href={article.link} 
//               className="text-xs text-blue-300 hover:underline"
//             >
//               View Article
//             </a>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };
const AIRecommendation = ({ topic }) => {
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      if (topic) {
        // Use the getInsightsForTopic function to fetch relevant insights
        const insights = getInsightsForTopic(topic);
        
        if (insights) {
          setRecommendation(insights);
        } else {
          // Fallback if no specific insights are found
          setRecommendation({
            title: `No Insights for ${topic}`,
            description: `No specific articles found for ${topic}. Try a different topic.`,
            articles: []
          });
        }
      }
    };

    fetchRecommendation();
  }, [topic]);

  if (!recommendation || recommendation.articles.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-neutral-800 rounded-xl shadow-2xl border-2 border-neutral-700 p-4 animate-slide-in z-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Zap className="mr-2 text-yellow-500" size={24} />
          <h3 className="text-lg font-bold text-neutral-100">AI Insights</h3>
        </div>
        <span className="text-xs text-neutral-400">
          {recommendation.articles.length} articles
        </span>
      </div>

      <p className="text-neutral-400 text-sm mb-3">{recommendation.description}</p>

      <div className="max-h-64 overflow-y-auto">
        {recommendation.articles.map((article, index) => (
          <div
            key={index}
            className="bg-neutral-750 p-3 rounded-lg mb-2 flex items-center hover:bg-neutral-700 transition-colors group"
          >
            <Newspaper className="mr-3 text-blue-400 flex-shrink-0" size={20} />
            <div className="flex-grow">
              <h4 className="text-neutral-200 font-semibold text-sm line-clamp-2">
                {article.title}
              </h4>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-neutral-400">
                  {article.source}
                </span>
                <span className="text-xs text-neutral-500">
                  {new Date(article.publishedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-300 hover:text-blue-200 transition-colors opacity-0 group-hover:opacity-100"
            >
              <ArrowRight size={16} />
            </a>
          </div>
        ))}
      </div>

      {recommendation.articles.length > 3 && (
        <div className="text-center mt-3">
          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            View All Articles
          </button>
        </div>
      )}
    </div>
  );
};
// Navbar Component
const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-neutral-900 border-b border-neutral-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Mic className="mr-2 text-blue-500" size={24} />
            <h1 className="text-xl font-bold text-neutral-100 tracking-wide">
              HuddleAI
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              className="text-neutral-300 hover:text-neutral-100 transition-colors flex items-center"
            >
              <BookOpen className="mr-2" size={20} />
              Docs
            </a>
            <a 
              href="#" 
              className="text-neutral-300 hover:text-neutral-100 transition-colors flex items-center"
            >
              <Zap className="mr-2" size={20} />
              Features
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default function Home() {
  const [roomTitle, setRoomTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const router = useRouter();

  const generateRoom = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch("/api/create-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: roomTitle || "Huddle01 Room",
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create room');
      }
      const data = await response.json();
      router.push(`/${data.roomId}`);
    } catch (err) {
      setError('Failed to generate room. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      <Navbar />
      
      <div className="pt-24 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-neutral-900 border-2 border-neutral-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-neutral-800 p-6 border-b border-neutral-700">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-center flex items-center justify-center">
              <Mic className="mr-3 text-blue-500" size={28} />
              Create AI Meeting Room
            </h2>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <label 
                htmlFor="roomTitle" 
                className="block text-sm font-bold mb-2 text-neutral-400"
              >
                Room Title (Optional)
              </label>
              <input
                id="roomTitle"
                type="text"
                value={roomTitle}
                onChange={(e) => setRoomTitle(e.target.value)}
                placeholder="Enter room title"
                className="w-full bg-neutral-800 text-neutral-100 px-3 py-2 
                  border-2 border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  rounded-lg text-sm"
              />
            </div>

            <div className="mb-4">
              <label 
                htmlFor="aiTopic" 
                className="block text-sm font-bold mb-2 text-neutral-400"
              >
                AI Insights Topic (Optional)
              </label>
              <input
                id="aiTopic"
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="Enter topic for AI insights"
                className="w-full bg-neutral-800 text-neutral-100 px-3 py-2 
                  border-2 border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  rounded-lg text-sm"
              />
            </div>

            {error && (
              <div className="mb-4 text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            <button
              onClick={generateRoom}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-blue-600 text-white 
                hover:bg-blue-700 
                transition-colors duration-200 rounded-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center"
            >
              {isLoading ? 'Generating...' : 'Generate Room'}
              <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </div>

      {aiTopic && <AIRecommendation topic={aiTopic} />}
    </div>
  );
}

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function Home() {
//   const [roomTitle, setRoomTitle] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const generateRoom = async () => {
//     setIsLoading(true);
//     setError('');

//     try {
//       const response = await fetch("/api/create-room", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           title: roomTitle || "Huddle01 Room",
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to create room');
//       }

//       const data = await response.json();
//       router.push(`/${data.roomId}`);
//     } catch (err) {
//       setError('Failed to generate room. Please try again.');
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-neutral-900 text-neutral-100 border-2 border-neutral-700 rounded-lg">
//         <div className="p-6 border-b-2 border-neutral-700">
//           <h2 className="text-xl font-bold uppercase tracking-wider text-center">
//             Create Meeting Room
//           </h2>
//         </div>
        
//         <div className="p-6">
//           <div className="mb-4">
//             <label 
//               htmlFor="roomTitle" 
//               className="block text-sm font-bold mb-2 text-neutral-400"
//             >
//               Room Title (Optional)
//             </label>
//             <input
//               id="roomTitle"
//               type="text"
//               value={roomTitle}
//               onChange={(e) => setRoomTitle(e.target.value)}
//               placeholder="Enter room title"
//               className="w-full bg-neutral-800 text-neutral-100 px-3 py-2 
//                 border-2 border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 
//                 rounded-lg text-sm"
//             />
//           </div>

//           {error && (
//             <div className="mb-4 text-red-500 text-sm text-center">
//               {error}
//             </div>
//           )}

//           <button
//             onClick={generateRoom}
//             disabled={isLoading}
//             className="w-full px-4 py-2 bg-neutral-700 text-neutral-100 
//               border-2 border-neutral-600 hover:bg-neutral-600 
//               transition-colors duration-200 rounded-lg
//               disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? 'Generating...' : 'Generate Room'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }