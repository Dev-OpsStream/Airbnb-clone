if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs')

const dbUrl = process.env.MONGO_URL;
const bcryptSalt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;

if (!dbUrl || !secret) {
    console.error("Environment variables MONGO_URL or SECRET are not set!");
    process.exit(1);
}

async function main() {
    mongoose.connect(process.env.MONGO_URL || "mongodb://ramraj:ram07@mongo-service.default.svc.cluster.local:27017/airbnb-db")
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });
}

main();

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, secret, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData);
        });
    });
}

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }));  

app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.get('/test', (req, res) => {
    res.json("test ok");
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});
  
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt)
        });

        res.status(201).json({ message: 'User registered successfully', user: userDoc });
    } catch (e) {
        console.error("Registration error:", e);
        res.status(500).json({ message: 'Registration failed. Please try again' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const userDoc = await User.findOne({ email });

        if (userDoc) {
            const passOk = await bcrypt.compare(password, userDoc.password);

            if (passOk) {
                jwt.sign({
                    email: userDoc.email,
                    id: userDoc._id,
                    name: userDoc.name
                }, secret, {}, (err, token) => {
                    if (err) {
                        console.error("Error signing JWT:", err);
                        return res.status(500).json({ message: "JWT generation failed" });
                    }
                    return res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
                        .json({ message: 'Login successful', token, name: userDoc.name, email: userDoc.email });
                });
            } else {
                console.log("Incorrect password for user:", email);
                return res.status(422).json({ message: "Incorrect password" });
            }
        } else {
            console.log("User not found:", email);
            return res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error("Login failed with error:", err);
        return res.status(500).json({ message: "Login failed, please try again" });
    }
});


app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, secret, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await User.findById(userData.id);
            res.json({ name, email, _id });
        });
    } else {
        res.json(null);
    }
});


app.post('/logout', (req, res) => {
    res.cookie('token', '', { httpOnly: true, secure: false }).json({ message: 'Logged out successfully' });
});


app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg'
    const destPath = path.join(__dirname, '/uploads/', newName);
    await imageDownloader.image({
        url: link,
        dest: destPath
    });
    res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads/" });

app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const renameFile = (file) => {
        return new Promise((resolve, reject) => {
            const { path: tempPath, originalname } = file;
            const ext = path.extname(originalname);
            const newPath = `${tempPath}${ext}`;

            fs.rename(tempPath, newPath, (err) => {
                if (err) {
                    return reject(err);
                }
                uploadedFiles.push(newPath);
                resolve();
            });
        });
    };

    const renamePromises = req.files.map(renameFile);

    Promise.all(renamePromises)
        .then(() => {
            res.json(uploadedFiles.map(file => path.basename(file))); // Send just the file names if needed
        })
        .catch((error) => {
            console.error('Error renaming files:', error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error processing files.' });
            }
        });
});

app.post('/places', (req, res) => {
    const { token } = req.cookies;
    const { title, address, addedPhotos, description, extraInfo, perks, checkIn, checkOut, maxGuests, price } = req.body;

    jwt.verify(token, secret, {}, async (err, userData) => {
        if (err) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        try {
            const placeDoc = await Place.create({
                owner: userData.id,
                title,
                address,
                photos: addedPhotos,
                description,
                extraInfo,
                perks,
                checkIn,
                checkOut,
                maxGuests,
                price
            });

            res.json(placeDoc);

        } catch (err) {
            res.status(500).json({ error: 'Error creating place' });
        }
    });
});

app.get('/user-places', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, userData) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { id } = userData;
        try {
            const places = await Place.find({ owner: id });
            res.json(places);
        } catch (error) {
            console.error('Error fetching places:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
});



app.get('/places/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
});

app.put('/places', async (req, res) => {
    const { token } = req.cookies;
    const { id, title, address, addedPhotos, description, extraInfo, perks, checkIn, checkOut, maxGuests, price } = req.body;
    jwt.verify(token, secret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title,
                address,
                photos: addedPhotos,
                description,
                extraInfo,
                perks,
                checkIn,
                checkOut,
                maxGuests,
                price
            })
            await placeDoc.save();
            res.json('ok');
        }
    });
});

app.get('/places', async (req, res) => {
    res.json(await Place.find());
})

app.post('/bookings', async (req, res) => {
    const userData = await getUserDataFromReq(req);
    const {
        place, checkIn, checkOut, maxGuests, name, mobile, price
    } = req.body;
    Booking.create({
        place, checkIn, checkOut, maxGuests, name, mobile, price
        , user: userData.id
    }).then((doc) => {
        res.json(doc);
    }).catch((err) => {
        throw err;
    });
});

app.get('/bookings', async (req, res) => {
    try {
        const userData = await getUserDataFromReq(req);
        if (!userData || !userData.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const bookings = await Booking.find({ user: userData.id }).populate('place');
        return res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


app.delete('/bookings/:id', async (req, res) => {
    const { id } = req.params;
    const userData = await getUserDataFromReq(req);
    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.user.toString() !== userData.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await Booking.findByIdAndDelete(id);
        res.json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Error deleting booking' });
    }
});

app.delete('/places/:id', async (req, res) => {
    const { id } = req.params;
    const userData = await getUserDataFromReq(req);
    try {
        const place = await Place.findById(id);
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        if (place.owner.toString() !== userData.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await Booking.deleteMany({ place: id });
        await Place.findByIdAndDelete(id);
        res.json({ message: 'Place and associated bookings deleted successfully' });
    } catch (error) {
        console.error('Error deleting place:', error);
        res.status(500).json({ message: 'Error deleting place and bookings' });
    }
});

app.listen(4000,"0.0.0.0", () => {
  console.log(`Server running on port 4000. CORS allowed for backend-service:4000`);
});