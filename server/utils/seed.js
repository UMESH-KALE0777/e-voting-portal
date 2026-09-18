const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('../models/Student');
const Candidate = require('../models/Candidate');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🌱 Connected to Atlas for seeding...');

        // Clear existing collections
        await Student.deleteMany({});
        await Candidate.deleteMany({});

        // Seed Sample Students (AIML Cohort)
        await Student.insertMany([
            { usn: '1PD22AI001', name: 'Student 2nd Year A', year: 2, section: 'A' },
            { usn: '1PD22AI061', name: 'Student 2nd Year B', year: 2, section: 'B' },
            { usn: '1PD20AI001', name: 'Student 4th Year', year: 4, section: 'Combined' },
        ]);

        // Seed Sample Candidates
        await Candidate.insertMany([
            // 2nd Year Section A Candidates
            { name: 'Aarav Kumar', image: 'https://via.placeholder.com/150', year: 2, section: 'A', role: 'CR', voteCount: 0 },
            { name: 'Ananya Roy', image: 'https://via.placeholder.com/150', year: 2, section: 'A', role: 'LR', voteCount: 0 },

            // General Secretary (Visible across eligible scoping)
            { name: 'Vikram Singh', image: 'https://via.placeholder.com/150', year: 4, section: 'Combined', role: 'GS', voteCount: 0 },
        ]);

        console.log('✅ Sample data successfully inserted!');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedData();