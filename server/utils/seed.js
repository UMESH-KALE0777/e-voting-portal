const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('../models/Student');

dotenv.config();

const fourthYearStudents = [
    // Actual 4th Year Cohort
    { usn: '3PD22AI018', name: 'MANASA', year: 4, section: 'A' },
    { usn: '3PD22AI041', name: 'PRABHANJAN KULKARNI', year: 4, section: 'A' },
    { usn: '3PD23AI003', name: 'AHSA IFRA', year: 4, section: 'A' },
    { usn: '3PD23AI004', name: 'AKHILESH', year: 4, section: 'A' },
    { usn: '3PD23AI005', name: 'AKHILESH', year: 4, section: 'A' },
    { usn: '3PD23AI006', name: 'AKSHATA', year: 4, section: 'A' },
    { usn: '3PD23AI007', name: 'AKSHATA BUDIHAL', year: 4, section: 'A' },
    { usn: '3PD23AI008', name: 'ALANGE CHAITANY', year: 4, section: 'A' },
    { usn: '3PD23AI009', name: 'AQEEB JAVEED', year: 4, section: 'A' },
    { usn: '3PD23AI010', name: 'ASHWINI', year: 4, section: 'A' },
    { usn: '3PD23AI011', name: 'AVANTIKA', year: 4, section: 'A' },
    { usn: '3PD23AI013', name: 'BHUMIKA', year: 4, section: 'A' },
    { usn: '3PD23AI014', name: 'CHANNAVEER', year: 4, section: 'A' },
    { usn: '3PD23AI015', name: 'CHANNAVEER N MATH', year: 4, section: 'A' },
    { usn: '3PD23AI017', name: 'HARSHITA', year: 4, section: 'A' },
    { usn: '3PD23AI019', name: 'KRUTIKA RAJKUMAR KATKE', year: 4, section: 'A' },
    { usn: '3PD23AI020', name: 'MALLIKARJUN', year: 4, section: 'A' },
    { usn: '3PD23AI021', name: 'MANISH KSHEMANAND HEBLE', year: 4, section: 'A' },
    { usn: '3PD23AI022', name: 'MIRZA UZAIF BAIG', year: 4, section: 'A' },
    { usn: '3PD23AI023', name: 'MOHAMMED ABDUL HAFEEZ', year: 4, section: 'A' },
    { usn: '3PD23AI024', name: 'MOHAMMED ABU RAIYAN', year: 4, section: 'A' },
    { usn: '3PD23AI025', name: 'MOHAMMED AMEER HAMZA', year: 4, section: 'A' },
    { usn: '3PD23AI026', name: 'MOHAMMED ARSHAD KHAN', year: 4, section: 'A' },
    { usn: '3PD23AI027', name: 'MOHAMMED ASIM', year: 4, section: 'A' },
    { usn: '3PD23AI028', name: 'MOHAMMED BADARUDDIN', year: 4, section: 'A' },
    { usn: '3PD23AI029', name: 'MOHAMMED FURQAN', year: 4, section: 'A' },
    { usn: '3PD23AI031', name: 'MOHAMMED KASHIF HUSSAIN AMAN', year: 4, section: 'A' },
    { usn: '3PD23AI033', name: 'MOHAMMED NADEEM', year: 4, section: 'A' },
    { usn: '3PD23AI034', name: 'MOHAMMED SHAHEED', year: 4, section: 'A' },
    { usn: '3PD23AI035', name: 'MOHAMMED ZEESHAN', year: 4, section: 'A' },
    { usn: '3PD23AI037', name: 'NEERAJ', year: 4, section: 'A' },
    { usn: '3PD23AI039', name: 'PRATIKSHA NARENDRA MARCHAREDDI', year: 4, section: 'A' },
    { usn: '3PD23AI041', name: 'RAMYA R D', year: 4, section: 'A' },
    { usn: '3PD23AI042', name: 'RUCHITHA B', year: 4, section: 'A' },
    { usn: '3PD23AI044', name: 'SANJEEV REDDY', year: 4, section: 'A' },
    { usn: '3PD23AI046', name: 'SHARANBASAPPA CHITTE', year: 4, section: 'A' },
    { usn: '3PD23AI048', name: 'SHUBHAM THOMBRE', year: 4, section: 'A' },
    { usn: '3PD23AI049', name: 'SNEHA RAJKUMAR NILOOR', year: 4, section: 'A' },
    { usn: '3PD23AI050', name: 'SOHEL MAIBUB HAVALDAR', year: 4, section: 'A' },
    { usn: '3PD23AI051', name: 'SUKANYA', year: 4, section: 'A' },
    { usn: '3PD23AI052', name: 'SURYAKANTH HONAKATTI', year: 4, section: 'A' },
    { usn: '3PD23AI054', name: 'SYED ABDUS SABUR', year: 4, section: 'A' },
    { usn: '3PD23AI055', name: 'UMESH KALE', year: 4, section: 'A' },
    { usn: '3PD23AI057', name: 'VAISHNAVI', year: 4, section: 'A' },
    { usn: '3PD24AI400', name: 'NOORUSAHER', year: 4, section: 'A' },
    { usn: '3PD24AI401', name: 'SOUMYA', year: 4, section: 'A' },
    { usn: '3PD24AI402', name: 'SUMA', year: 4, section: 'A' },
    { usn: '3PD24AI403', name: 'SUMIT S HOSALLI', year: 4, section: 'A' },
    { usn: '3PD24AI404', name: 'VEERESH', year: 4, section: 'A' },
    { usn: '3PD24AI405', name: 'VIKRAM', year: 4, section: 'A' },

    // 10 Extra Dummy Data Accounts for Testing
    { usn: 'TEST001', name: 'Test Student 1', year: 4, section: 'A' },
    { usn: 'TEST002', name: 'Test Student 2', year: 4, section: 'A' },
    { usn: 'TEST003', name: 'Test Student 3', year: 4, section: 'A' },
    { usn: 'TEST004', name: 'Test Student 4', year: 4, section: 'A' },
    { usn: 'TEST005', name: 'Test Student 5', year: 4, section: 'A' },
    { usn: 'TEST006', name: 'Test Student 6', year: 4, section: 'A' },
    { usn: 'TEST007', name: 'Test Student 7', year: 4, section: 'A' },
    { usn: 'TEST008', name: 'Test Student 8', year: 4, section: 'A' },
    { usn: 'TEST009', name: 'Test Student 9', year: 4, section: 'A' },
    { usn: 'TEST010', name: 'Test Student 10', year: 4, section: 'A' }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Wipe previous student records cleanly
        await Student.deleteMany({});
        console.log('Old student records cleared.');

        // Inject the complete 60-student batch (50 real + 10 test)
        await Student.insertMany(fourthYearStudents);
        console.log(`Successfully seeded ${fourthYearStudents.length} students to the database!`);

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();