const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load .env from the server/ folder regardless of where the command is run from
dotenv.config({ path: path.join(__dirname, '../.env') });

const Student = require('../models/Student');

const allStudents = [
    // ==========================================
    // 2nd Year Cohort
    // ==========================================
    // Section A
    { usn: '3PD25AI001', name: 'AARAV PATIL', year: 2, section: 'A' },
    { usn: '3PD25AI002', name: 'ADITI DESAI', year: 2, section: 'A' },
    { usn: '3PD25AI003', name: 'BHARAT KUMAR', year: 2, section: 'A' },
    { usn: '3PD25AI004', name: 'CHETHAN S', year: 2, section: 'A' },
    { usn: '3PD25AI005', name: 'DEEPA SHARMA', year: 2, section: 'A' },

    // Section B
    { usn: '3PD25AI061', name: 'KARTHIK RAO', year: 2, section: 'B' },
    { usn: '3PD25AI062', name: 'KAVYA REDDY', year: 2, section: 'B' },
    { usn: '3PD25AI063', name: 'MANOJ GOWDA', year: 2, section: 'B' },
    { usn: '3PD25AI064', name: 'NEHA SINGH', year: 2, section: 'B' },
    { usn: '3PD25AI065', name: 'POOJA JOSHI', year: 2, section: 'B' },

    // ==========================================
    // 3rd Year Cohort (Section A)
    // ==========================================
    { usn: '3PD22AI029', name: 'MOHAMMED KAIF KHASAB QURESHI', year: 3, section: 'A' },
    { usn: '3PD22AI036', name: 'NAGARAJ', year: 3, section: 'A' },
    { usn: '3PD23AI032', name: 'MOHAMMED MUKASHIFF EHAN SHAREEF', year: 3, section: 'A' },
    { usn: '3PD23AI036', name: 'MUBHIBUR RAHMAN', year: 3, section: 'A' },
    { usn: '3PD23AI043', name: 'SABOOR HUSSAIN', year: 3, section: 'A' },
    { usn: '3PD23AI053', name: 'SURYATEJA AINAPUR', year: 3, section: 'A' },
    { usn: '3PD23AI058', name: 'YASHRAJ JAGANNATH TENGLI', year: 3, section: 'A' },
    { usn: '3PD23AI059', name: 'YOGESH', year: 3, section: 'A' },
    { usn: '3PD24AI003', name: 'ABHISHEK', year: 3, section: 'A' },
    { usn: '3PD24AI004', name: 'ADI PRABHUDAS BASUDE', year: 3, section: 'A' },
    { usn: '3PD24AI005', name: 'ADITI ANIL RONAD', year: 3, section: 'A' },
    { usn: '3PD24AI006', name: 'AFRA MAHEEN', year: 3, section: 'A' },
    { usn: '3PD24AI008', name: 'AJAY', year: 3, section: 'A' },
    { usn: '3PD24AI009', name: 'ANJALI', year: 3, section: 'A' },
    { usn: '3PD24AI010', name: 'ANJALI', year: 3, section: 'A' },
    { usn: '3PD24AI012', name: 'ANUSHKA A KADGANCHI', year: 3, section: 'A' },
    { usn: '3PD24AI013', name: 'APEKSHA REDDY', year: 3, section: 'A' },
    { usn: '3PD24AI014', name: 'ARUNA', year: 3, section: 'A' },
    { usn: '3PD24AI015', name: 'AYESHA ANAM', year: 3, section: 'A' },
    { usn: '3PD24AI017', name: 'BHAGYA', year: 3, section: 'A' },
    { usn: '3PD24AI020', name: 'BHAGYASHREE G Y', year: 3, section: 'A' },
    { usn: '3PD24AI021', name: 'BHAVANI', year: 3, section: 'A' },
    { usn: '3PD24AI022', name: 'BHAVANI', year: 3, section: 'A' },
    { usn: '3PD24AI023', name: 'CHANDRAKANT', year: 3, section: 'A' },
    { usn: '3PD24AI024', name: 'DHUMAL BALIRAM DAULATRAO', year: 3, section: 'A' },
    { usn: '3PD24AI025', name: 'DIVYARANI', year: 3, section: 'A' },
    { usn: '3PD24AI026', name: 'ETASH S BIDAP', year: 3, section: 'A' },
    { usn: '3PD24AI027', name: 'GAURAV', year: 3, section: 'A' },
    { usn: '3PD24AI028', name: 'GIRIJA', year: 3, section: 'A' },
    { usn: '3PD24AI029', name: 'GOVIND D H', year: 3, section: 'A' },
    { usn: '3PD24AI030', name: 'ICHESHWARI P DABSHETTY', year: 3, section: 'A' },
    { usn: '3PD24AI031', name: 'JEEVAN', year: 3, section: 'A' },
    { usn: '3PD24AI032', name: 'KAVERI', year: 3, section: 'A' },
    { usn: '3PD24AI033', name: 'KAVERI', year: 3, section: 'A' },
    { usn: '3PD24AI034', name: 'KHUSHI', year: 3, section: 'A' },
    { usn: '3PD24AI035', name: 'KHUSHI KADAGANCHI', year: 3, section: 'A' },
    { usn: '3PD24AI036', name: 'KRUTIKA', year: 3, section: 'A' },
    { usn: '3PD24AI038', name: 'MAHALAXMI', year: 3, section: 'A' },
    { usn: '3PD24AI039', name: 'MD AAMAN FAROOQI', year: 3, section: 'A' },
    { usn: '3PD24AI040', name: 'MD ATIF UL HASSAN', year: 3, section: 'A' },
    { usn: '3PD24AI041', name: 'MD OSMAN', year: 3, section: 'A' },
    { usn: '3PD24AI042', name: 'MD SIRAJ NAIK', year: 3, section: 'A' },
    { usn: '3PD24AI044', name: 'MOHAMMED ANAS HUSSAIN', year: 3, section: 'A' },
    { usn: '3PD24AI045', name: 'MOHAMMED ASIF', year: 3, section: 'A' },
    { usn: '3PD24AI046', name: 'MOHAMMED IRSHAD AHMED', year: 3, section: 'A' },
    { usn: '3PD24AI047', name: 'MOHAMMED MUKHTAR', year: 3, section: 'A' },
    { usn: '3PD24AI048', name: 'MOHAMMED OWAISUDDIN', year: 3, section: 'A' },
    { usn: '3PD24AI049', name: 'MOHD NAZEER ALI', year: 3, section: 'A' },
    { usn: '3PD24AI050', name: 'MRUTHUNNJAY', year: 3, section: 'A' },
    { usn: '3PD24AI051', name: 'MUZAMMIL AHMED SIDDIQUI', year: 3, section: 'A' },
    { usn: '3PD24AI052', name: 'NAGESH', year: 3, section: 'A' },
    { usn: '3PD24AI053', name: 'NEELAMMA', year: 3, section: 'A' },
    { usn: '3PD24AI054', name: 'NIRUP N JOSHI', year: 3, section: 'A' },
    { usn: '3PD24AI055', name: 'NITIN VEERABHADRA SALIMANI', year: 3, section: 'A' },
    { usn: '3PD24AI056', name: 'POOJA', year: 3, section: 'A' },
    { usn: '3PD24AI057', name: 'POORNIMA', year: 3, section: 'A' },
    { usn: '3PD24AI060', name: 'PRAJAKTA', year: 3, section: 'A' },
    { usn: '3PD24AI062', name: 'PRAJWAL', year: 3, section: 'A' },
    { usn: '3PD24AI065', name: 'PUNITRAJ', year: 3, section: 'A' },
    { usn: '3PD24AI066', name: 'RAJAMAHMAD MULLA', year: 3, section: 'A' },
    { usn: '3PD24AI083', name: 'SHAIK MUZAMIL', year: 3, section: 'A' },

    // ==========================================
    // 3rd Year Cohort (Section B)
    // ==========================================
    { usn: '3PD24AI011', name: 'ANUSHA DANAPPA BAMMANNI', year: 3, section: 'B' },
    { usn: '3PD24AI018', name: 'BHAGYALAXMI', year: 3, section: 'B' },
    { usn: '3PD24AI019', name: 'BHAGYASHREE', year: 3, section: 'B' },
    { usn: '3PD24AI061', name: 'PRAJWAL', year: 3, section: 'B' },
    { usn: '3PD24AI063', name: 'PRAJWAL D MOTGI', year: 3, section: 'B' },
    { usn: '3PD24AI064', name: 'PRAJWAL MALLIKARJUN DESAI', year: 3, section: 'B' },
    { usn: '3PD24AI067', name: 'RAJOLE SANGITA SHRIKANT', year: 3, section: 'B' },
    { usn: '3PD24AI069', name: 'RAKSHITA', year: 3, section: 'B' },
    { usn: '3PD24AI070', name: 'RAKSHITA', year: 3, section: 'B' },
    { usn: '3PD24AI071', name: 'RATNA', year: 3, section: 'B' },
    { usn: '3PD24AI072', name: 'RENUKA', year: 3, section: 'B' },
    { usn: '3PD24AI073', name: 'RISHIKA', year: 3, section: 'B' },
    { usn: '3PD24AI076', name: 'SAIKUMAR', year: 3, section: 'B' },
    { usn: '3PD24AI077', name: 'SAKSHI S KADALE', year: 3, section: 'B' },
    { usn: '3PD24AI078', name: 'SANDESH', year: 3, section: 'B' },
    { usn: '3PD24AI079', name: 'SNADHYARANI', year: 3, section: 'B' },
    { usn: '3PD24AI080', name: 'SANIYA MUSKAN', year: 3, section: 'B' },
    { usn: '3PD24AI081', name: 'SANNIDHI P ROONGAN', year: 3, section: 'B' },
    { usn: '3PD24AI082', name: 'SHABARI', year: 3, section: 'B' },
    { usn: '3PD24AI084', name: 'SHARAN KUMAR', year: 3, section: 'B' },
    { usn: '3PD24AI085', name: 'SHARANBASAPPA', year: 3, section: 'B' },
    { usn: '3PD24AI086', name: 'SHARANYA S DESHPANDE', year: 3, section: 'B' },
    { usn: '3PD24AI088', name: 'SHIVAKUMAR', year: 3, section: 'B' },
    { usn: '3PD24AI089', name: 'SHIVAKUMAR', year: 3, section: 'B' },
    { usn: '3PD24AI090', name: 'SHIVANI', year: 3, section: 'B' },
    { usn: '3PD24AI091', name: 'SHIVANI PALLERI', year: 3, section: 'B' },
    { usn: '3PD24AI094', name: 'SHREYA', year: 3, section: 'B' },
    { usn: '3PD24AI095', name: 'SHREYA', year: 3, section: 'B' },
    { usn: '3PD24AI096', name: 'SHREYA S POTDAR', year: 3, section: 'B' },
    { usn: '3PD24AI098', name: 'SHREYAS HANAMSAGAR', year: 3, section: 'B' },
    { usn: '3PD24AI099', name: 'SHRIRAKSHA', year: 3, section: 'B' },
    { usn: '3PD24AI100', name: 'SHUBHANGI', year: 3, section: 'B' },
    { usn: '3PD24AI102', name: 'SOMESHWAR', year: 3, section: 'B' },
    { usn: '3PD24AI103', name: 'SOUMAYA RAVIKANT BHOSALE', year: 3, section: 'B' },
    { usn: '3PD24AI104', name: 'SRUSHTI', year: 3, section: 'B' },
    { usn: '3PD24AI105', name: 'SUMEET', year: 3, section: 'B' },
    { usn: '3PD24AI106', name: 'SUMERA KAUSER', year: 3, section: 'B' },
    { usn: '3PD24AI107', name: 'SUMIT', year: 3, section: 'B' },
    { usn: '3PD24AI108', name: 'SUSHMA', year: 3, section: 'B' },
    { usn: '3PD24AI109', name: 'SYED REHAN PASHA', year: 3, section: 'B' },
    { usn: '3PD24AI110', name: 'SYEDA MOHAMMEDI IRTEKHA HUSSAINI', year: 3, section: 'B' },
    { usn: '3PD24AI111', name: 'TARANUM', year: 3, section: 'B' },
    { usn: '3PD24AI113', name: 'VAISHNAVI', year: 3, section: 'B' },
    { usn: '3PD24AI114', name: 'VASHNAVI', year: 3, section: 'B' },
    { usn: '3PD24AI115', name: 'VIDYASAGAR M MANKAR', year: 3, section: 'B' },
    { usn: '3PD24AI116', name: 'VIJETA', year: 3, section: 'B' },
    { usn: '3PD24AI118', name: 'VINAY S Y', year: 3, section: 'B' },
    { usn: '3PD24AI119', name: 'ZAINAB VAZIR', year: 3, section: 'B' },
    { usn: '3PD24AI120', name: 'ZUBEIR AHMED', year: 3, section: 'B' },
    { usn: '3PD24AI121', name: 'ADARSH', year: 3, section: 'B' },
    { usn: '3PD24AI122', name: 'RATABA IMMAMA', year: 3, section: 'B' },
    { usn: '3PD25AI400', name: 'DAKARAJ', year: 3, section: 'B' },
    { usn: '3PD25AI401', name: 'FAIZAN AHMED', year: 3, section: 'B' },
    { usn: '3PD25AI402', name: 'MALKANNAGOUDA', year: 3, section: 'B' },
    { usn: '3PD25AI403', name: 'PRAJWAL', year: 3, section: 'B' },
    { usn: '3PD25AI404', name: 'SANGAMESH HANAMANTH MALLAD', year: 3, section: 'B' },
    { usn: '3PD25AI405', name: 'SANKET PATIL', year: 3, section: 'B' },
    { usn: '3PD25AI406', name: 'SANTOSH SAMBHAJI MALI', year: 3, section: 'B' },
    { usn: '3PD25AI407', name: 'SHAIK ADNAN', year: 3, section: 'B' },
    { usn: '3PD25AI408', name: 'SHAIKH RIZWAN AHMED', year: 3, section: 'B' },
    { usn: '3PD25AI409', name: 'SHARANU', year: 3, section: 'B' },
    { usn: '3PD25AI410', name: 'SHRAVANA', year: 3, section: 'B' },
    { usn: '3PD25AI411', name: 'SYED AYANULLAHA', year: 3, section: 'B' },
    { usn: '3PD25AI412', name: 'ULLAS', year: 3, section: 'B' },

    // ==========================================
    // 4th Year Cohort (Section A)
    // ==========================================
    { usn: '3PD22AI018', name: 'MANASA', year: 4, section: 'A' },
    { usn: '3PD22AI041', name: 'PRABHANJAN KULKARNI', year: 4, section: 'A' },
    { usn: '3PD23AI003', name: 'AHSA IFRA', year: 4, section: 'A' },
    { usn: '3PD23AI004', name: 'AKHILESH', year: 4, section: 'A' },
    { usn: '3PD23AI005', name: 'AKHILESH', year: 4, section: 'A' },
    { usn: '3PD23AI006', name: 'AKSHATA', year: 4, section: 'A' },
    { usn: '3PD23AI007', name: 'AKSHATA BUDIHAL', year: 4, section: 'A' },
    { usn: '3PD23AI008', name: 'ALANGE CHAITANY', year: 4, section: 'A' },
    { usn: '3PD23AI009', name: 'AQEEB JAVEED', year: 4, section: 'A' },
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

    // ==========================================
    // Test / Dummy Accounts
    // ==========================================
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
    // Safety guard: never wipe the student collection on a production database
    if (process.env.NODE_ENV === 'production') {
        console.error('Refusing to seed in production.');
        process.exit(1);
    }

    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI is not set. Check your server/.env file.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Wipe previous student records cleanly
        await Student.deleteMany({});
        console.log('Old student records cleared.');

        // Inject the consolidated student list.
        // ordered: false lets valid rows insert even if a few fail (e.g. duplicate USNs).
        try {
            await Student.insertMany(allStudents, { ordered: false });
            console.log(`Successfully seeded ${allStudents.length} students across all years/sections into the database!`);
        } catch (insertError) {
            const inserted = insertError.insertedDocs ? insertError.insertedDocs.length : 0;
            console.error(`Partial insert: ${inserted}/${allStudents.length} students added.`);
            const writeErrors = insertError.writeErrors || [];
            writeErrors.forEach((e) => {
                console.error(` - Row ${e.index}: ${e.errmsg || e.err?.errmsg || e.message}`);
            });
            if (!writeErrors.length) console.error(insertError.message);
            await mongoose.disconnect();
            process.exit(1);
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();