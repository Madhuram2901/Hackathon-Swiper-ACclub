// Data Management Module
// Handles mock data and data operations

// Mock Events Data
const mockEvents = [
    {
        id: 1,
        title: "Summer Music Festival 2024",
        date: "2024-07-15",
        time: "18:00",
        location: "Central Park, NYC",
        category: "Music",
        price: "$75",
        description: "Join us for an unforgettable evening of live music featuring top artists from around the world.",
        emoji: "🎵",
        tags: ["Music", "Entertainment", "Live Performance"]
    },
    {
        id: 2,
        title: "Tech Innovation Summit",
        date: "2024-08-20",
        time: "09:00",
        location: "Convention Center, SF",
        category: "Technology",
        price: "$150",
        description: "Explore the latest trends in AI, blockchain, and emerging technologies with industry leaders.",
        emoji: "💻",
        tags: ["AIML", "Technology", "Innovation", "Networking"]
    },
    {
        id: 3,
        title: "Food & Wine Tasting",
        date: "2024-06-30",
        time: "17:00",
        location: "Napa Valley, CA",
        category: "Food",
        price: "$95",
        description: "Savor exquisite wines paired with gourmet cuisine from renowned chefs.",
        emoji: "🍷",
        tags: ["Food", "Wine", "Culinary", "Luxury"]
    },
    {
        id: 4,
        title: "Stand-up Comedy Night",
        date: "2024-07-08",
        time: "20:00",
        location: "Laugh Factory, LA",
        category: "Comedy",
        price: "$35",
        description: "Get ready to laugh with the best comedians in town for a night of pure entertainment.",
        emoji: "😂",
        tags: ["Comedy", "Entertainment", "Nightlife"]
    },
    {
        id: 5,
        title: "Art Gallery Opening",
        date: "2024-07-22",
        time: "19:00",
        location: "Modern Art Museum",
        category: "Art",
        price: "Free",
        description: "Experience contemporary art from emerging artists in an exclusive gallery opening.",
        emoji: "🎨",
        tags: ["Art", "Culture", "Exhibition", "Free Event"]
    },
    {
        id: 6,
        title: "Yoga & Wellness Retreat",
        date: "2024-08-05",
        time: "07:00",
        location: "Malibu Beach, CA",
        category: "Wellness",
        price: "$120",
        description: "Rejuvenate your mind and body with morning yoga sessions by the ocean.",
        emoji: "🧘",
        tags: ["Wellness", "Yoga", "Health", "Beach"]
    },
    {
        id: 7,
        title: "Startup Pitch Competition",
        date: "2024-07-28",
        time: "14:00",
        location: "Silicon Valley Hub",
        category: "Business",
        price: "$50",
        description: "Watch innovative startups pitch their ideas to top venture capitalists.",
        emoji: "🚀",
        tags: ["Business", "Startup", "Pitching", "Investment", "DSA"]
    },
    {
        id: 8,
        title: "Jazz Night Under Stars",
        date: "2024-08-12",
        time: "19:30",
        location: "Rooftop Lounge, Chicago",
        category: "Music",
        price: "$60",
        description: "Enjoy smooth jazz performances with stunning city views on our rooftop venue.",
        emoji: "🎺",
        tags: ["Music", "Jazz", "Rooftop", "Nightlife"]
    },
    {
        id: 9,
        title: "AI & Machine Learning Workshop",
        date: "2024-09-15",
        time: "10:00",
        location: "Tech Institute, Boston",
        category: "Technology",
        price: "$200",
        description: "Hands-on workshop covering the fundamentals of AI and machine learning algorithms.",
        emoji: "🤖",
        tags: ["AIML", "Technology", "Workshop", "Learning", "Hands-on"]
    },
    {
        id: 10,
        title: "Cybersecurity Conference 2024",
        date: "2024-10-20",
        time: "09:00",
        location: "Security Center, DC",
        category: "Technology",
        price: "$180",
        description: "Learn about the latest cybersecurity threats and defense strategies from industry experts.",
        emoji: "🔒",
        tags: ["CyberSecurity", "Technology", "Security", "Conference", "Networking"]
    },
    {
        id: 11,
        title: "Web Development Bootcamp",
        date: "2024-11-05",
        time: "09:00",
        location: "Coding Academy, Austin",
        category: "Technology",
        price: "$300",
        description: "Intensive 3-day bootcamp covering modern web development technologies and frameworks.",
        emoji: "🌐",
        tags: ["WebDevelopment", "Technology", "Bootcamp", "Learning", "Coding"]
    },
    {
        id: 12,
        title: "Data Structures & Algorithms Masterclass",
        date: "2024-12-10",
        time: "14:00",
        location: "Computer Science Lab, Stanford",
        category: "Education",
        price: "$150",
        description: "Master DSA concepts with practical examples and coding challenges.",
        emoji: "📊",
        tags: ["DSA", "Education", "Computer Science", "Coding", "Algorithms"]
    }
];

// Data Management Functions
function getEvents() {
    return mockEvents;
}

function getEventById(id) {
    return mockEvents.find(event => event.id === id);
}

function getEventsByCategory(category) {
    return mockEvents.filter(event => event.category === category);
}

function getEventsByTag(tag) {
    return mockEvents.filter(event => event.tags.includes(tag));
}

function getAllTags() {
    const allTags = new Set();
    mockEvents.forEach(event => {
        event.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
}

function searchEvents(query) {
    const lowercaseQuery = query.toLowerCase();
    return mockEvents.filter(event => 
        event.title.toLowerCase().includes(lowercaseQuery) ||
        event.description.toLowerCase().includes(lowercaseQuery) ||
        event.location.toLowerCase().includes(lowercaseQuery) ||
        event.category.toLowerCase().includes(lowercaseQuery) ||
        event.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Export functions for use in other modules
window.DataManager = {
    getEvents,
    getEventById,
    getEventsByCategory,
    getEventsByTag,
    getAllTags,
    searchEvents,
    formatDate
};
