require('dotenv').config();
const { sequelize } = require('../config/dbConfig');
require('../models/index');
const { User, Post, Comment, Like, Follow, Conversation, Message, Notification } = require('../models/index');
const bcrypt = require('bcrypt');

const seed = async () => {
    try {
        await sequelize.sync();
        console.log('🔄 Starting large seed...');

        // ─── 0. CLEAR ALL DATA ───────────────────────────────
        await Notification.destroy({ where: {} });
        await Message.destroy({ where: {} });
        await Conversation.destroy({ where: {} });
        await Like.destroy({ where: {} });
        await Comment.destroy({ where: {} });
        await Follow.destroy({ where: {} });
        await Post.destroy({ where: {} });
        await User.destroy({ where: {} });
        console.log('🗑️ Cleared all data');

        // ─── 1. USERS ────────────────────────────────────────
        const hashedPassword = await bcrypt.hash('123456', 10);

        const usersData = [
            { id: '00000001-0000-0000-0000-000000000001', firstname: 'Ahmed', lastname: 'Hassan', username: 'ahmed_hassan', email: 'ahmed.hassan@test.com', bio: 'Software Engineer | Coffee lover ☕' },
            { id: '00000001-0000-0000-0000-000000000002', firstname: 'Sara', lastname: 'Mohamed', username: 'sara_m', email: 'sara.mohamed@test.com', bio: 'UI/UX Designer | Making things beautiful ✨' },
            { id: '00000001-0000-0000-0000-000000000003', firstname: 'Omar', lastname: 'Khalil', username: 'omar_k', email: 'omar.khalil@test.com', bio: 'Full Stack Developer | Open source enthusiast 🚀' },
            { id: '00000001-0000-0000-0000-000000000004', firstname: 'Nour', lastname: 'Ibrahim', username: 'nour_ibrahim', email: 'nour.ibrahim@test.com', bio: 'Photographer | Capturing moments 📸' },
            { id: '00000001-0000-0000-0000-000000000005', firstname: 'Karim', lastname: 'Samir', username: 'karim_samir', email: 'karim.samir@test.com', bio: 'Data Scientist | AI enthusiast 🤖' },
            { id: '00000001-0000-0000-0000-000000000006', firstname: 'Hana', lastname: 'Ali', username: 'hana_ali', email: 'hana.ali@test.com', bio: 'Marketing Manager | Brand strategist 💡' },
            { id: '00000001-0000-0000-0000-000000000007', firstname: 'Youssef', lastname: 'Tarek', username: 'youssef_t', email: 'youssef.tarek@test.com', bio: 'Mobile Developer | iOS & Android 📱' },
            { id: '00000001-0000-0000-0000-000000000008', firstname: 'Layla', lastname: 'Nasser', username: 'layla_n', email: 'layla.nasser@test.com', bio: 'Content Creator | Writing is my passion ✍️' },
            { id: '00000001-0000-0000-0000-000000000009', firstname: 'Ziad', lastname: 'Farouk', username: 'ziad_farouk', email: 'ziad.farouk@test.com', bio: 'DevOps Engineer | Cloud & Infrastructure ☁️' },
            { id: '00000001-0000-0000-0000-000000000010', firstname: 'Mona', lastname: 'Sayed', username: 'mona_sayed', email: 'mona.sayed@test.com', bio: 'Graphic Designer | Art & creativity 🎨' },
            { id: '00000001-0000-0000-0000-000000000011', firstname: 'Tarek', lastname: 'Adel', username: 'tarek_adel', email: 'tarek.adel@test.com', bio: 'Backend Developer | Node.js expert 🔧' },
            { id: '00000001-0000-0000-0000-000000000012', firstname: 'Dina', lastname: 'Mostafa', username: 'dina_mostafa', email: 'dina.mostafa@test.com', bio: 'Product Manager | Building great products 📦' },
            { id: '00000001-0000-0000-0000-000000000013', firstname: 'Khaled', lastname: 'Mansour', username: 'khaled_m', email: 'khaled.mansour@test.com', bio: 'Cybersecurity Expert | Keeping things safe 🔐' },
            { id: '00000001-0000-0000-0000-000000000014', firstname: 'Rania', lastname: 'Fouad', username: 'rania_fouad', email: 'rania.fouad@test.com', bio: 'Frontend Developer | React enthusiast ⚛️' },
            { id: '00000001-0000-0000-0000-000000000015', firstname: 'Amr', lastname: 'Shawky', username: 'amr_shawky', email: 'amr.shawky@test.com', bio: 'Game Developer | Unity & Unreal 🎮' },
            { id: '00000001-0000-0000-0000-000000000016', firstname: 'Mariam', lastname: 'Hossam', username: 'mariam_h', email: 'mariam.hossam@test.com', bio: 'Machine Learning Engineer | Neural networks 🧠' },
            { id: '00000001-0000-0000-0000-000000000017', firstname: 'Bassem', lastname: 'Fathy', username: 'bassem_f', email: 'bassem.fathy@test.com', bio: 'Blockchain Developer | Web3 & DeFi 🔗' },
            { id: '00000001-0000-0000-0000-000000000018', firstname: 'Yasmin', lastname: 'Galal', username: 'yasmin_g', email: 'yasmin.galal@test.com', bio: 'Digital Marketing | SEO & Growth hacking 📈' },
            { id: '00000001-0000-0000-0000-000000000019', firstname: 'Sherif', lastname: 'Lotfy', username: 'sherif_l', email: 'sherif.lotfy@test.com', bio: 'Solutions Architect | Enterprise systems 🏗️' },
            { id: '00000001-0000-0000-0000-000000000020', firstname: 'Aya', lastname: 'Ragab', username: 'aya_ragab', email: 'aya.ragab@test.com', bio: 'Startup Founder | Entrepreneur & Dreamer 💫' },
            { id: '00000001-0000-0000-0000-000000000021', firstname: 'Mohamed', lastname: 'Emad', username: 'mo_emad', email: 'mo.emad@test.com', bio: 'QA Engineer | Making sure things work ✅' },
            { id: '00000001-0000-0000-0000-000000000022', firstname: 'Salma', lastname: 'Gamal', username: 'salma_g', email: 'salma.gamal@test.com', bio: 'Business Analyst | Turning data into insights 📊' },
            { id: '00000001-0000-0000-0000-000000000023', firstname: 'Hossam', lastname: 'Badr', username: 'hossam_b', email: 'hossam.badr@test.com', bio: 'Network Engineer | Keeping you connected 🌐' },
            { id: '00000001-0000-0000-0000-000000000024', firstname: 'Nadia', lastname: 'Saad', username: 'nadia_saad', email: 'nadia.saad@test.com', bio: 'HR Manager | People & Culture 🤝' },
            { id: '00000001-0000-0000-0000-000000000025', firstname: 'Fady', lastname: 'Wahid', username: 'fady_wahid', email: 'fady.wahid@test.com', bio: 'Video Editor | Storytelling through film 🎬' },
            { id: '00000001-0000-0000-0000-000000000026', firstname: 'Noha', lastname: 'Helmy', username: 'noha_helmy', email: 'noha.helmy@test.com', bio: 'Software Architect | Clean code advocate 🏛️' },
            { id: '00000001-0000-0000-0000-000000000027', firstname: 'Mahmoud', lastname: 'Nabil', username: 'mahmoud_n', email: 'mahmoud.nabil@test.com', bio: 'Embedded Systems | IoT developer 🔌' },
            { id: '00000001-0000-0000-0000-000000000028', firstname: 'Doaa', lastname: 'Shehab', username: 'doaa_sh', email: 'doaa.shehab@test.com', bio: 'Technical Writer | Documenting the future 📝' },
            { id: '00000001-0000-0000-0000-000000000029', firstname: 'Adel', lastname: 'Ramzy', username: 'adel_ramzy', email: 'adel.ramzy@test.com', bio: 'IT Manager | Leading tech teams 👨‍💼' },
            { id: '00000001-0000-0000-0000-000000000030', firstname: 'Heba', lastname: 'Selim', username: 'heba_selim', email: 'heba.selim@test.com', bio: 'Cloud Architect | AWS & Azure expert ☁️' },
        ];

        await User.bulkCreate(usersData.map((u,index) => ({
            ...u,
            password: hashedPassword,
            phone: '01012345678',
            isVerified: true,
            accountStatus: 'active',
            profilePicture: `https://i.pravatar.cc/300?img=${(index % 70) + 1}`
        })), { individualHooks: false });
        console.log('✅ 30 Users created');

        // ─── 2. FOLLOWS ──────────────────────────────────────
        const followsData = [
            // Ahmed follows
            { followerId: '00000001-0000-0000-0000-000000000001', followedId: '00000001-0000-0000-0000-000000000002' },
            { followerId: '00000001-0000-0000-0000-000000000001', followedId: '00000001-0000-0000-0000-000000000003' },
            { followerId: '00000001-0000-0000-0000-000000000001', followedId: '00000001-0000-0000-0000-000000000004' },
            { followerId: '00000001-0000-0000-0000-000000000001', followedId: '00000001-0000-0000-0000-000000000005' },
            // Sara follows
            { followerId: '00000001-0000-0000-0000-000000000002', followedId: '00000001-0000-0000-0000-000000000001' },
            { followerId: '00000001-0000-0000-0000-000000000002', followedId: '00000001-0000-0000-0000-000000000003' },
            { followerId: '00000001-0000-0000-0000-000000000002', followedId: '00000001-0000-0000-0000-000000000006' },
            { followerId: '00000001-0000-0000-0000-000000000002', followedId: '00000001-0000-0000-0000-000000000007' },
            // Omar follows
            { followerId: '00000001-0000-0000-0000-000000000003', followedId: '00000001-0000-0000-0000-000000000001' },
            { followerId: '00000001-0000-0000-0000-000000000003', followedId: '00000001-0000-0000-0000-000000000002' },
            { followerId: '00000001-0000-0000-0000-000000000003', followedId: '00000001-0000-0000-0000-000000000005' },
            { followerId: '00000001-0000-0000-0000-000000000003', followedId: '00000001-0000-0000-0000-000000000008' },
            // Nour follows
            { followerId: '00000001-0000-0000-0000-000000000004', followedId: '00000001-0000-0000-0000-000000000001' },
            { followerId: '00000001-0000-0000-0000-000000000004', followedId: '00000001-0000-0000-0000-000000000010' },
            { followerId: '00000001-0000-0000-0000-000000000004', followedId: '00000001-0000-0000-0000-000000000002' },
            // Karim follows
            { followerId: '00000001-0000-0000-0000-000000000005', followedId: '00000001-0000-0000-0000-000000000001' },
            { followerId: '00000001-0000-0000-0000-000000000005', followedId: '00000001-0000-0000-0000-000000000016' },
            { followerId: '00000001-0000-0000-0000-000000000005', followedId: '00000001-0000-0000-0000-000000000003' },
            // Hana follows
            { followerId: '00000001-0000-0000-0000-000000000006', followedId: '00000001-0000-0000-0000-000000000002' },
            { followerId: '00000001-0000-0000-0000-000000000006', followedId: '00000001-0000-0000-0000-000000000018' },
            { followerId: '00000001-0000-0000-0000-000000000006', followedId: '00000001-0000-0000-0000-000000000020' },
            // Youssef follows
            { followerId: '00000001-0000-0000-0000-000000000007', followedId: '00000001-0000-0000-0000-000000000002' },
            { followerId: '00000001-0000-0000-0000-000000000007', followedId: '00000001-0000-0000-0000-000000000003' },
            { followerId: '00000001-0000-0000-0000-000000000007', followedId: '00000001-0000-0000-0000-000000000015' },
            // Layla follows
            { followerId: '00000001-0000-0000-0000-000000000008', followedId: '00000001-0000-0000-0000-000000000003' },
            { followerId: '00000001-0000-0000-0000-000000000008', followedId: '00000001-0000-0000-0000-000000000028' },
            { followerId: '00000001-0000-0000-0000-000000000008', followedId: '00000001-0000-0000-0000-000000000001' },
            // More follows
            { followerId: '00000001-0000-0000-0000-000000000009', followedId: '00000001-0000-0000-0000-000000000030' },
            { followerId: '00000001-0000-0000-0000-000000000009', followedId: '00000001-0000-0000-0000-000000000003' },
            { followerId: '00000001-0000-0000-0000-000000000010', followedId: '00000001-0000-0000-0000-000000000004' },
            { followerId: '00000001-0000-0000-0000-000000000010', followedId: '00000001-0000-0000-0000-000000000002' },
            { followerId: '00000001-0000-0000-0000-000000000011', followedId: '00000001-0000-0000-0000-000000000001' },
            { followerId: '00000001-0000-0000-0000-000000000011', followedId: '00000001-0000-0000-0000-000000000026' },
            { followerId: '00000001-0000-0000-0000-000000000012', followedId: '00000001-0000-0000-0000-000000000020' },
            { followerId: '00000001-0000-0000-0000-000000000012', followedId: '00000001-0000-0000-0000-000000000002' },
            { followerId: '00000001-0000-0000-0000-000000000013', followedId: '00000001-0000-0000-0000-000000000009' },
            { followerId: '00000001-0000-0000-0000-000000000014', followedId: '00000001-0000-0000-0000-000000000001' },
            { followerId: '00000001-0000-0000-0000-000000000014', followedId: '00000001-0000-0000-0000-000000000003' },
            { followerId: '00000001-0000-0000-0000-000000000015', followedId: '00000001-0000-0000-0000-000000000007' },
            { followerId: '00000001-0000-0000-0000-000000000016', followedId: '00000001-0000-0000-0000-000000000005' },
            { followerId: '00000001-0000-0000-0000-000000000017', followedId: '00000001-0000-0000-0000-000000000003' },
            { followerId: '00000001-0000-0000-0000-000000000018', followedId: '00000001-0000-0000-0000-000000000006' },
            { followerId: '00000001-0000-0000-0000-000000000019', followedId: '00000001-0000-0000-0000-000000000030' },
            { followerId: '00000001-0000-0000-0000-000000000020', followedId: '00000001-0000-0000-0000-000000000006' },
            { followerId: '00000001-0000-0000-0000-000000000020', followedId: '00000001-0000-0000-0000-000000000012' },
        ];

        await Follow.bulkCreate(followsData);
        console.log('✅ Follows created');

        // ─── 3. POSTS ────────────────────────────────────────
        const posts = await Post.bulkCreate([
            { userId: '00000001-0000-0000-0000-000000000001', content: 'Just finished building a new REST API with Node.js and Express. The performance improvements are incredible! 🚀', type: 'image', privacy: 'Public',  mediaUrls: [
                'https://picsum.photos/1200/800'
            ], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000001', content: 'Coffee and code, the perfect combination ☕💻 Working on a new project today!', type: 'image', privacy: 'Public', mediaUrls: [
            'https://picsum.photos/seed/coffee-dev/800/600'
            ], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000002', content: 'Just redesigned our app\'s onboarding flow. User testing showed a 40% improvement in completion rate! 🎨✨', type: 'image', privacy: 'Public', mediaUrls: [
                'https://picsum.photos/seed/uiux-design/1200/900'
            ], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000002', content: 'Design tip of the day: Always design for the user, not for yourself. Empathy is the key to great UX! 💡', type: 'image', privacy: 'Public', mediaUrls: [
                'https://picsum.photos/seed/design-system/900/700'
            ], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000003', content: 'Open source is the future! Just made my 100th contribution to GitHub. Feeling proud! 🌟', type: 'image', privacy: 'Public', mediaUrls: [
                'https://picsum.photos/seed/github-open-source/1280/720'
            ], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000003', content: 'Working on a full-stack project using React, Node.js, and PostgreSQL. The stack is amazing! 💪', type: 'image', privacy: 'Friends-only', mediaUrls: [
                'https://picsum.photos/seed/fullstack-react/1200/800'
            ], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000004', content: 'Golden hour photography is my absolute favorite. The way light plays with shadows is magical! 📸', type: 'image', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000004', content: 'Just got a new lens for my camera. Can\'t wait to try it out this weekend! 📷✨', type: 'text', privacy: 'Public', mediaUrls: [
                'https://picsum.photos/seed/camera-lens/1200/900'
            ], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000005', content: 'Just trained a new ML model that achieves 97% accuracy on the test dataset. AI is incredible! 🤖📊', type: 'image', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000005', content: 'Data is the new oil. But clean data is gold. Always spend time on data preprocessing! 💎', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000006', content: 'Successful brand launch today! Months of hard work finally paying off. Proud of the whole team! 🎉', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000007', content: 'React Native vs Flutter - which one do you prefer for cross-platform development? Share your thoughts! 📱', type: 'image', privacy: 'Public',mediaUrls: [
                'https://picsum.photos/seed/mobile-dev/1200/800'
            ], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000008', content: 'Writing is not just about words. It\'s about connecting with your reader on a deeper level. ✍️❤️', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000009', content: 'Kubernetes deployment successful! Zero downtime deployments are a game changer for DevOps. ☁️🔧', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000010', content: 'Color theory is fascinating. Understanding how colors interact can transform your designs! 🎨🌈', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000011', content: 'Just optimized a database query from 3 seconds to 50ms. The power of proper indexing! ⚡🔧', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000012', content: 'Great product meeting today! Aligned the team on Q4 roadmap. Exciting things coming! 📦🗺️', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000013', content: 'Security tip: Always use strong, unique passwords and enable 2FA on all your accounts! 🔐💪', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000014', content: 'Just learned about React Server Components. The future of React is looking amazing! ⚛️🚀', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000015', content: 'Released my indie game on Steam! Three years of hard work finally available to the world! 🎮🎉', type: 'image', privacy: 'Public', mediaUrls: [
                    'https://picsum.photos/seed/gaming/1280/720'
                ], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000016', content: 'Neural networks are basically inspired by the human brain. The more we learn about neuroscience, the better our AI! 🧠💡', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000017', content: 'Blockchain is not just about cryptocurrency. The use cases for decentralized systems are endless! 🔗🌍', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000018', content: 'SEO is a long game. Consistency and quality content are the keys to organic growth! 📈✨', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000019', content: 'Microservices architecture is powerful but complex. Choose the right architecture for your scale! 🏗️⚙️', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000020', content: 'Year 2 of my startup journey. The ups and downs are real, but the learning is priceless! 💫🚀', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000021', content: 'Automation testing saved us from 3 major bugs this sprint. QA is not optional, it\'s essential! ✅🔍', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000022', content: 'Data tells stories. Learning to read between the numbers is what makes a great analyst! 📊📖', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000023', content: 'Network latency is the silent killer of app performance. Always profile your network calls! 🌐⚡', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000024', content: 'Great company culture starts with listening to your employees. People are your greatest asset! 🤝❤️', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000025', content: 'Just completed editing a short film. Storytelling through video is a beautiful art form! 🎬🎭', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000026', content: 'Clean code is not a luxury, it\'s a necessity. Future you will thank present you! 🏛️💻', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000027', content: 'IoT is connecting everything. Building a smart home system from scratch is incredibly rewarding! 🔌🏠', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000028', content: 'Documentation is the gift you give to future developers. Write it with love! 📝💝', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000029', content: 'Led a successful digital transformation project. The key is change management, not just technology! 👨‍💼🔄', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
            { userId: '00000001-0000-0000-0000-000000000030', content: 'Multi-cloud strategy is the future. Don\'t put all your eggs in one cloud basket! ☁️🌍', type: 'text', privacy: 'Public', mediaUrls: [], likesCount: 0, commentsCount: 0 },
        ]);
        console.log('✅ 35 Posts created');

        // ─── 4. COMMENTS ─────────────────────────────────────
        const comments = await Comment.bulkCreate([
            { userId: '00000001-0000-0000-0000-000000000002', postId: posts[0].id, content: 'Great work Ahmed! Node.js is really powerful 🚀', parentId: null },
            { userId: '00000001-0000-0000-0000-000000000003', postId: posts[0].id, content: 'Which framework did you use? Express or Fastify?', parentId: null },
            { userId: '00000001-0000-0000-0000-000000000005', postId: posts[0].id, content: 'Amazing! Performance is key 💪', parentId: null },
            { userId: '00000001-0000-0000-0000-000000000014', postId: posts[0].id, content: 'Would love to see the code! Share it on GitHub?', parentId: null },
            { userId: '00000001-0000-0000-0000-000000000001', postId: posts[2].id, content: 'This is amazing! A 40% improvement is huge Sara!', parentId: null },
            { userId: '00000001-0000-0000-0000-000000000007', postId: posts[2].id, content: 'Great results! What was the main change that made the difference?', parentId: null },
            { userId: '00000001-0000-0000-0000-000000000010', postId: posts[2].id, content: 'UX improvements always pay off! 🎨', parentId: null },
            { userId: '00000001-0000-0000-0000-000000000001', postId: posts[4].id, content: 'Congratulations on 100 contributions! That\'s a huge milestone! 🎉', parentId: null },
            { userId: '00000001-0000-0000-0000-000000000002', postId: posts[4].id, content: 'Open source is amazing. Which projects do you contribute to?', parentId: null },
            { userId: '00000001-0000-0000-0000-000000000009', postId: posts[8].id, content: '97% accuracy is impressive! What was your dataset size?', parentId: null },
            { userId: '00000001-0000-0000-0000-000000000003', postId: posts[8].id, content: 'ML is changing everything! Great work Karim 🤖', parentId: null },
            { userId: '00000001-0000-0000-0000-000000000001', postId: posts[14].id, content: 'Proper indexing is a game changer! Great optimization! ⚡', parentId: null },
            { userId: '00000001-0000-0000-0000-000000000003', postId: posts[18].id, content: 'React Server Components are revolutionary! Can\'t wait to use them in production!', parentId: null },
            { userId: '00000001-0000-0000-0000-000000000007', postId: posts[11].id, content: 'I prefer Flutter for its performance and single codebase!', parentId: null },
            { userId: '00000001-0000-0000-0000-000000000014', postId: posts[11].id, content: 'React Native has a bigger community though!', parentId: null },
            { userId: '00000001-0000-0000-0000-000000000002', postId: posts[19].id, content: 'Congratulations! Playing it now! 🎮', parentId: null },
            { userId: '00000001-0000-0000-0000-000000000003', postId: posts[25].id, content: 'Clean code is an investment in the future! Totally agree! 🏛️', parentId: null },
            { userId: '00000001-0000-0000-0000-000000000001', postId: posts[27].id, content: 'Documentation saves lives! Or at least saves hours of debugging 😄', parentId: null },
        ]);
        console.log('✅ Comments created');

        // Replies
        await Comment.bulkCreate([
            { userId: '00000001-0000-0000-0000-000000000001', postId: posts[0].id, content: 'Thanks Sara! I used Express with some custom middleware 😊', parentId: comments[0].id },
            { userId: '00000001-0000-0000-0000-000000000001', postId: posts[0].id, content: 'Used Express! It\'s still my go-to for REST APIs', parentId: comments[1].id },
            { userId: '00000001-0000-0000-0000-000000000002', postId: posts[2].id, content: 'We simplified the steps and added progress indicators! Small changes, big impact!', parentId: comments[5].id },
            { userId: '00000001-0000-0000-0000-000000000005', postId: posts[8].id, content: 'Used 50,000 samples! Quality data makes all the difference', parentId: comments[9].id },
            { userId: '00000001-0000-0000-0000-000000000011', postId: posts[14].id, content: 'Composite indexes are the secret weapon! 🔥', parentId: comments[11].id },
        ]);
        console.log('✅ Replies created');

        // Update commentsCount
        await Post.update({ commentsCount: 4 }, { where: { id: posts[0].id } });
        await Post.update({ commentsCount: 3 }, { where: { id: posts[2].id } });
        await Post.update({ commentsCount: 2 }, { where: { id: posts[4].id } });
        await Post.update({ commentsCount: 2 }, { where: { id: posts[8].id } });
        await Post.update({ commentsCount: 1 }, { where: { id: posts[11].id } });
        await Post.update({ commentsCount: 1 }, { where: { id: posts[14].id } });
        await Post.update({ commentsCount: 1 }, { where: { id: posts[18].id } });
        await Post.update({ commentsCount: 2 }, { where: { id: posts[19].id } });
        await Post.update({ commentsCount: 1 }, { where: { id: posts[25].id } });
        await Post.update({ commentsCount: 1 }, { where: { id: posts[27].id } });

        // ─── 5. LIKES ────────────────────────────────────────
        const likesData = [
            { userId: '00000001-0000-0000-0000-000000000002', postId: posts[0].id },
            { userId: '00000001-0000-0000-0000-000000000003', postId: posts[0].id },
            { userId: '00000001-0000-0000-0000-000000000004', postId: posts[0].id },
            { userId: '00000001-0000-0000-0000-000000000005', postId: posts[0].id },
            { userId: '00000001-0000-0000-0000-000000000014', postId: posts[0].id },
            { userId: '00000001-0000-0000-0000-000000000001', postId: posts[2].id },
            { userId: '00000001-0000-0000-0000-000000000003', postId: posts[2].id },
            { userId: '00000001-0000-0000-0000-000000000007', postId: posts[2].id },
            { userId: '00000001-0000-0000-0000-000000000010', postId: posts[2].id },
            { userId: '00000001-0000-0000-0000-000000000001', postId: posts[4].id },
            { userId: '00000001-0000-0000-0000-000000000002', postId: posts[4].id },
            { userId: '00000001-0000-0000-0000-000000000008', postId: posts[4].id },
            { userId: '00000001-0000-0000-0000-000000000001', postId: posts[6].id },
            { userId: '00000001-0000-0000-0000-000000000002', postId: posts[6].id },
            { userId: '00000001-0000-0000-0000-000000000010', postId: posts[6].id },
            { userId: '00000001-0000-0000-0000-000000000003', postId: posts[8].id },
            { userId: '00000001-0000-0000-0000-000000000009', postId: posts[8].id },
            { userId: '00000001-0000-0000-0000-000000000016', postId: posts[8].id },
            { userId: '00000001-0000-0000-0000-000000000001', postId: posts[10].id },
            { userId: '00000001-0000-0000-0000-000000000002', postId: posts[10].id },
            { userId: '00000001-0000-0000-0000-000000000006', postId: posts[10].id },
            { userId: '00000001-0000-0000-0000-000000000001', postId: posts[14].id },
            { userId: '00000001-0000-0000-0000-000000000003', postId: posts[14].id },
            { userId: '00000001-0000-0000-0000-000000000014', postId: posts[18].id },
            { userId: '00000001-0000-0000-0000-000000000003', postId: posts[18].id },
            { userId: '00000001-0000-0000-0000-000000000001', postId: posts[18].id },
            { userId: '00000001-0000-0000-0000-000000000002', postId: posts[19].id },
            { userId: '00000001-0000-0000-0000-000000000007', postId: posts[19].id },
            { userId: '00000001-0000-0000-0000-000000000015', postId: posts[19].id },
            { userId: '00000001-0000-0000-0000-000000000001', postId: posts[24].id },
            { userId: '00000001-0000-0000-0000-000000000012', postId: posts[24].id },
            { userId: '00000001-0000-0000-0000-000000000006', postId: posts[24].id },
            { userId: '00000001-0000-0000-0000-000000000003', postId: posts[25].id },
            { userId: '00000001-0000-0000-0000-000000000011', postId: posts[25].id },
            { userId: '00000001-0000-0000-0000-000000000001', postId: posts[27].id },
            { userId: '00000001-0000-0000-0000-000000000008', postId: posts[27].id },
        ];

        await Like.bulkCreate(likesData);

        // Update likesCount
        await Post.update({ likesCount: 5 }, { where: { id: posts[0].id } });
        await Post.update({ likesCount: 4 }, { where: { id: posts[2].id } });
        await Post.update({ likesCount: 3 }, { where: { id: posts[4].id } });
        await Post.update({ likesCount: 3 }, { where: { id: posts[6].id } });
        await Post.update({ likesCount: 3 }, { where: { id: posts[8].id } });
        await Post.update({ likesCount: 3 }, { where: { id: posts[10].id } });
        await Post.update({ likesCount: 2 }, { where: { id: posts[14].id } });
        await Post.update({ likesCount: 3 }, { where: { id: posts[18].id } });
        await Post.update({ likesCount: 3 }, { where: { id: posts[19].id } });
        await Post.update({ likesCount: 3 }, { where: { id: posts[24].id } });
        await Post.update({ likesCount: 2 }, { where: { id: posts[25].id } });
        await Post.update({ likesCount: 2 }, { where: { id: posts[27].id } });
        console.log('✅ Likes created');

        // ─── 6. CONVERSATIONS & MESSAGES ─────────────────────
        const conv1 = await Conversation.create({ user1Id: '00000001-0000-0000-0000-000000000001', user2Id: '00000001-0000-0000-0000-000000000002' });
        const conv2 = await Conversation.create({ user1Id: '00000001-0000-0000-0000-000000000001', user2Id: '00000001-0000-0000-0000-000000000003' });
        const conv3 = await Conversation.create({ user1Id: '00000001-0000-0000-0000-000000000002', user2Id: '00000001-0000-0000-0000-000000000006' });
        const conv4 = await Conversation.create({ user1Id: '00000001-0000-0000-0000-000000000003', user2Id: '00000001-0000-0000-0000-000000000005' });
        const conv5 = await Conversation.create({ user1Id: '00000001-0000-0000-0000-000000000004', user2Id: '00000001-0000-0000-0000-000000000010' });

        await Message.bulkCreate([
            { conversationId: conv1.id, senderId: '00000001-0000-0000-0000-000000000001', text: 'Hey Sara! Loved your latest design work 🎨', isRead: true },
            { conversationId: conv1.id, senderId: '00000001-0000-0000-0000-000000000002', text: 'Thank you Ahmed! That means a lot coming from you! 😊', isRead: true },
            { conversationId: conv1.id, senderId: '00000001-0000-0000-0000-000000000001', text: 'Can we collaborate on a project together?', isRead: true },
            { conversationId: conv1.id, senderId: '00000001-0000-0000-0000-000000000002', text: 'Absolutely! I would love that! Let\'s set up a call!', isRead: false },
            { conversationId: conv2.id, senderId: '00000001-0000-0000-0000-000000000003', text: 'Ahmed! Saw your REST API post. Impressive work!', isRead: true },
            { conversationId: conv2.id, senderId: '00000001-0000-0000-0000-000000000001', text: 'Thanks Omar! Been working on it for weeks 😅', isRead: true },
            { conversationId: conv2.id, senderId: '00000001-0000-0000-0000-000000000003', text: 'Would you mind sharing the repo?', isRead: false },
            { conversationId: conv3.id, senderId: '00000001-0000-0000-0000-000000000002', text: 'Hana! Your brand launch was amazing! 🎉', isRead: true },
            { conversationId: conv3.id, senderId: '00000001-0000-0000-0000-000000000006', text: 'Thank you Sara! The team worked so hard on it!', isRead: true },
            { conversationId: conv4.id, senderId: '00000001-0000-0000-0000-000000000005', text: 'Omar, what\'s your take on microservices vs monolith?', isRead: true },
            { conversationId: conv4.id, senderId: '00000001-0000-0000-0000-000000000003', text: 'Depends on the scale! Monolith first, microservices when needed!', isRead: true },
            { conversationId: conv4.id, senderId: '00000001-0000-0000-0000-000000000005', text: 'That makes sense! Thanks for the insight 🙏', isRead: false },
            { conversationId: conv5.id, senderId: '00000001-0000-0000-0000-000000000004', text: 'Mona! Your color theory post was so educational! 🌈', isRead: true },
            { conversationId: conv5.id, senderId: '00000001-0000-0000-0000-000000000010', text: 'I\'m glad you found it helpful Nour! 😊', isRead: false },
        ]);
        console.log('✅ Conversations & Messages created');

        // ─── 7. NOTIFICATIONS ────────────────────────────────
        await Notification.bulkCreate([
            { userId: '00000001-0000-0000-0000-000000000001', senderId: '00000001-0000-0000-0000-000000000002', type: 'like', postId: posts[0].id, isRead: false },
            { userId: '00000001-0000-0000-0000-000000000001', senderId: '00000001-0000-0000-0000-000000000003', type: 'like', postId: posts[0].id, isRead: false },
            { userId: '00000001-0000-0000-0000-000000000001', senderId: '00000001-0000-0000-0000-000000000002', type: 'comment', postId: posts[0].id, isRead: true },
            { userId: '00000001-0000-0000-0000-000000000001', senderId: '00000001-0000-0000-0000-000000000003', type: 'comment', postId: posts[0].id, isRead: true },
            { userId: '00000001-0000-0000-0000-000000000001', senderId: '00000001-0000-0000-0000-000000000004', type: 'follow', isRead: false },
            { userId: '00000001-0000-0000-0000-000000000001', senderId: '00000001-0000-0000-0000-000000000005', type: 'follow', isRead: true },
            { userId: '00000001-0000-0000-0000-000000000002', senderId: '00000001-0000-0000-0000-000000000001', type: 'like', postId: posts[2].id, isRead: false },
            { userId: '00000001-0000-0000-0000-000000000002', senderId: '00000001-0000-0000-0000-000000000001', type: 'comment', postId: posts[2].id, isRead: false },
            { userId: '00000001-0000-0000-0000-000000000002', senderId: '00000001-0000-0000-0000-000000000001', type: 'follow', isRead: true },
            { userId: '00000001-0000-0000-0000-000000000003', senderId: '00000001-0000-0000-0000-000000000001', type: 'like', postId: posts[4].id, isRead: false },
            { userId: '00000001-0000-0000-0000-000000000003', senderId: '00000001-0000-0000-0000-000000000001', type: 'comment', postId: posts[4].id, isRead: true },
            { userId: '00000001-0000-0000-0000-000000000005', senderId: '00000001-0000-0000-0000-000000000003', type: 'like', postId: posts[8].id, isRead: false },
            { userId: '00000001-0000-0000-0000-000000000005', senderId: '00000001-0000-0000-0000-000000000009', type: 'comment', postId: posts[8].id, isRead: false },
            { userId: '00000001-0000-0000-0000-000000000001', senderId: '00000001-0000-0000-0000-000000000002', type: 'message', isRead: false },
            { userId: '00000001-0000-0000-0000-000000000001', senderId: '00000001-0000-0000-0000-000000000003', type: 'message', isRead: false },
        ]);
        console.log('✅ Notifications created');

        console.log('\n🎉 Seeding completed successfully!');
        console.log('\n📋 Login credentials for all 30 users:');
        console.log('Password: 123456');
        console.log('Example: ahmed.hassan@test.com / 123456');
        process.exit(0);

    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seed();