if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const mongoose = require('mongoose');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/my-game-1';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Database Connected !!!");
    })
    .catch(error => {
        console.log("Oh no MONGOOSE Error !!!");
        console.log(error);
    });

const Count = require('../models/count');

const main = async () => {
    await Count.deleteMany({});
    const newCount = new Count({ count: 0 });
    await newCount.save();
}

main().then(() => {
    mongoose.connection.close();
    console.log('Seeded successfully !!!');
});