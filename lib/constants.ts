// Brand Colors
// Used in JavaScript files where CSS variables aren't available
export const BRAND_COLOR = '#212a3b'; // Dark blue-gray - primary brand color
export const BRAND_COLOR_HOVER = '#3d485e'; // Medium blue-gray - hover state color

/**
 * Sample Books Array
 * Contains popular books across various genres:
 * - Programming/Technical books (Clean Code, Design Patterns, etc.)
 * - Business/Self-help (Rich Dad Poor Dad, Atomic Habits, etc.)
 * - Classic Literature (1984, Pride and Prejudice, etc.)
 * - Science Fiction (Dune, The Hobbit, etc.)
 * - Psychology/Memoir (Thinking Fast and Slow, Educated, etc.)
 * 
 * Each book object contains:
 * - _id: Unique identifier for the book
 * - title: Book title
 * - author: Author name(s)
 * - slug: URL-friendly version of the title (used for navigation)
 * - coverURL: Direct link to Open Library book cover (via ISBN)
 * - coverColor: Hex color for the book cover background (fallback color)\n */
 export const sampleBooks = [
    {
        _id: '1',
        title: 'Clean Code',
        author: 'Robert Cecil Martin',
        slug: 'clean-code',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '2',
        title: 'JavaScript: The Definitive Guide',
        author: 'David Flanagan',
        slug: 'javascript-the-definitive-guide',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780596805524-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '3',
        title: 'Brave New World',
        author: 'Aldous Huxley',
        slug: 'brave-new-world',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '4',
        title: 'Rich Dad Poor Dad',
        author: 'Robert Kiyosaki',
        slug: 'rich-dad-poor-dad',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '5',
        title: 'Deep Work',
        author: 'Cal Newport',
        slug: 'deep-work',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '6',
        title: 'How to Win Friends and Influence People',
        author: 'Dale Carnegie',
        slug: 'how-to-win-friends-and-influence-people',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780671027032-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '7',
        title: 'The Power of Habit',
        author: 'Charles Duhigg',
        slug: 'the-power-of-habit',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9781400069286-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '8',
        title: 'Atomic Habits',
        author: 'James Clear',
        slug: 'atomic-habits',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '9',
        title: 'The Courage to Be Disliked',
        author: 'Fumitake Koga & Ichiro Kishimi',
        slug: 'the-courage-to-be-disliked',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9781501197274-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '10',
        title: '1984',
        author: 'George Orwell',
        slug: '1984',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '11',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        slug: 'the-great-gatsby',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '12',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        slug: 'to-kill-a-mockingbird',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '13',
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        slug: 'the-hobbit',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '14',
        title: 'Dune',
        author: 'Frank Herbert',
        slug: 'dune',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '15',
        title: 'Design Patterns',
        author: 'Gang of Four',
        slug: 'design-patterns',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '16',
        title: 'Start with Why',
        author: 'Simon Sinek',
        slug: 'start-with-why',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9781591846444-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '17',
        title: 'Mindset',
        author: 'Carol S. Dweck',
        slug: 'mindset',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780345472328-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '18',
        title: 'The Lean Startup',
        author: 'Eric Ries',
        slug: 'the-lean-startup',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '19',
        title: 'Educated',
        author: 'Tara Westover',
        slug: 'educated',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '20',
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        slug: 'thinking-fast-and-slow',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780374275631-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '21',
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        slug: 'the-alchemist',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '22',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        slug: 'pride-and-prejudice',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '23',
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        slug: 'the-catcher-in-the-rye',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780316769174-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '24',
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        slug: 'sapiens',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '25',
        title: 'A Short History of Nearly Everything',
        author: 'Bill Bryson',
        slug: 'a-short-history-of-nearly-everything',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780767908184-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '26',
        title: 'Guns, Germs, and Steel',
        author: 'Jared Diamond',
        slug: 'guns-germs-and-steel',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780393317558-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '27',
        title: 'The Silk Roads',
        author: 'Peter Frankopan',
        slug: 'the-silk-roads',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9781101912379-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '28',
        title: 'The Diary of a Young Girl',
        author: 'Anne Frank',
        slug: 'the-diary-of-a-young-girl',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780553296983-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '29',
        title: 'Prisoners of Geography',
        author: 'Tim Marshall',
        slug: 'prisoners-of-geography',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9781501121470-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '30',
        title: 'The Revenge of Geography',
        author: 'Robert D. Kaplan',
        slug: 'the-revenge-of-geography',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780812982220-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '31',
        title: 'National Geographic Kids Almanac',
        author: 'National Geographic Kids',
        slug: 'national-geographic-kids-almanac',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9781426376085-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '32',
        title: 'How to Lie with Maps',
        author: 'Mark Monmonier',
        slug: 'how-to-lie-with-maps',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780226435923-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '33',
        title: 'Alice in Wonderland',
        author: 'Lewis Carroll',
        slug: 'alice-in-wonderland',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780141439761-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '34',
        title: 'The Little Prince',
        author: 'Antoine de Saint-Exupery',
        slug: 'the-little-prince',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '35',
        title: 'The Jungle Book',
        author: 'Rudyard Kipling',
        slug: 'the-jungle-book',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780141325293-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '36',
        title: 'The Adventures of Tom Sawyer',
        author: 'Mark Twain',
        slug: 'the-adventures-of-tom-sawyer',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780486400778-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '37',
        title: 'Aesop\'s Fables',
        author: 'Aesop',
        slug: 'aesops-fables',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780486280202-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '38',
        title: 'Treasure Island',
        author: 'Robert Louis Stevenson',
        slug: 'treasure-island',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780141321004-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '39',
        title: 'Around the World in Eighty Days',
        author: 'Jules Verne',
        slug: 'around-the-world-in-eighty-days',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780141366296-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '40',
        title: 'The Story of the World',
        author: 'Susan Wise Bauer',
        slug: 'the-story-of-the-world',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9781933339009-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '41',
        title: 'The Prince',
        author: 'Niccolò Machiavelli',
        slug: 'the-prince',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780140449150-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '42',
        title: 'Democracy in America',
        author: 'Alexis de Tocqueville',
        slug: 'democracy-in-america',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780226805368-L.jpg',
        coverColor: '#f8f4e9',
    },
    {
        _id: '43',
        title: 'The Republic',
        author: 'Plato',
        slug: 'the-republic',
        coverURL: 'https://covers.openlibrary.org/b/isbn/9780141442433-L.jpg',
        coverColor: '#f8f4e9',
    },
];

/**
 * File Upload Validation Configuration
 * Defines size limits and accepted MIME types for PDF and image uploads
 */
// Maximum PDF file size allowed for uploads (50MB)
export const MAX_FILE_SIZE = 50 * 1024 * 1024;
// Accepted PDF MIME type for validation
export const ACCEPTED_PDF_TYPES = ['application/pdf'];
// Maximum image file size allowed for uploads (10MB)
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
// Accepted image MIME types for uploads
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * VAPI Configuration
 * Pre-configured VAPI assistant ID for voice-based AI conversations
 * This ID is set in environment variables and used for initializing voice chat
 */
export const ASSISTANT_ID = process.env.NEXT_PUBLIC_ASSISTANT_ID!;

/**
 * 11Labs Voice Configuration
 * Available voices optimized for natural, engaging book conversations
 * Each voice has:
 * - id: Unique identifier for the voice service
 * - name: Display name in UI
 * - description: Character/tone description for users
 */
export const voiceOptions = {
    // Male voices - suitable for narration and discussion
    dave: { id: 'CYw3kZ02Hs0563khs1Fj', name: 'Dave', description: 'Young male, British-Essex, casual & conversational' },
    daniel: { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', description: 'Middle-aged male, British, authoritative but warm' },
    chris: { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', description: 'Male, casual & easy-going' },
    // Female voices - suitable for narration and discussion
    rachel: { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Young female, American, calm & clear' },
    sarah: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'Young female, American, soft & approachable' },
};

/**
 * Voice Categories
 * Organizes voices into male and female categories for the UI selector
 */
export const voiceCategories = {
    male: ['dave', 'daniel', 'chris'],
    female: ['rachel', 'sarah'],
};

// Default voice
export const DEFAULT_VOICE = 'rachel';

// ElevenLabs voice settings optimized for conversational AI
export const VOICE_SETTINGS = {
    stability: 0.45, // Lower for more emotional, dynamic delivery (0.30-0.50 is natural)
    similarityBoost: 0.75, // Enhances clarity without distortion
    style: 0, // Keep at 0 for conversational AI (higher = more latency, less stable)
    useSpeakerBoost: true, // Improves voice quality
    speed: 1.0, // Natural conversation speed
};

/**
 * VAPI Dashboard Configuration
 * Settings for natural conversation flow and voice chat behavior
 * NOTE: These settings should be configured in the VAPI Dashboard for the assistant
 * They are kept here for reference and documentation purposes
 * 
 * Configuration includes:
 * - Turn-taking: Controls when the assistant starts/stops listening
 * - Timing: Response delays and silence timeouts
 * - Features: Noise cancellation, backchanneling, filler injection
 */
export const VAPI_DASHBOARD_CONFIG = {
    // Turn-taking settings - manages conversation flow
    startSpeakingPlan: {
        smartEndpointingEnabled: true, // Auto-detect when user finishes speaking
        waitSeconds: 0.4, // Wait 0.4s before assistant responds
    },
    stopSpeakingPlan: {
        numWords: 2, // Stop assistant after 2 words of silence
        voiceSeconds: 0.2, // Minimum voice duration before considering stop
        backoffSeconds: 1.0, // Wait 1s before trying again if interrupted
    },
    // Timing settings - response timing configuration
    silenceTimeoutSeconds: 30, // End conversation if silent for 30 seconds
    responseDelaySeconds: 0.4, // Delay before assistant responds
    llmRequestDelaySeconds: 0.1, // Delay for LLM request processing
    // Conversation features - enhance natural dialogue
    backgroundDenoisingEnabled: true, // Remove background noise
    backchannelingEnabled: true, // Allow "mm-hmm", "yeah" responses
    fillerInjectionEnabled: false, // Don't add filler words like "um", "uh"
};

/**
 * Clerk Authentication Appearance Override
 * Customizes the look and feel of Clerk auth components to match our app's brand
 * - Warm literary color scheme (amber, orange, brown tones)
 * - Tailored typography and spacing
 * - Custom button and form field styles
 * 
 * Note: Tailwind requires static class names at build time, so we hardcode color values here
 * instead of using Tailwind classes that would be stripped during build
 */
export const CLERK_AUTH_APPEARANCE_OVERRIDE = {
    // Main container styling
    card: 'shadow-none border-none rounded-xl bg-transparent',
    headerTitle: '!text-2xl font-bold text-[#212a3b]',
    headerSubtitle: '!mt-3 !text-sm text-[#3d485e]',
    socialButtonsBlockButton:
        '!border border-[rgba(33,42,59,0.12)] hover:bg-[#212a3b]/10 transition-all h-12 text-lg !rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.08)]',
    socialButtonsBlockButtonText: 'font-medium !text-[#212a3b] !text-lg',
    formButtonPrimary:
        'bg-[#212a3b] hover:bg-[#3d485e] text-white font-medium !border-0 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.08)] normal-case !h-12 !text-lg !rounded-xl',
    formFieldInput:
        '!border !border-[rgba(33,42,59,0.12)] !rounded-xl focus:ring-[#212a3b] focus:border-[#212a3b] !h-12 !min-h-12 !text-lg !bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)]',
    formFieldLabel: 'text-[#212a3b] font-medium text-lg',
    footerActionLink: 'text-[#212a3b] hover:text-[#3d485e] text-base font-medium',
};
