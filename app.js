if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();

const Count = require('./models/count');

// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/my-game-1';
const dbUrl = 'mongodb://localhost:27017/my-game-1';

mongoose.connect(dbUrl, { useUnifiedTopology: true })
    .then(() => {
        console.log("MONGOOSE Connection Open !!!");
    }).catch(error => {
        console.log("Oh no MONGOOSE Error !!!");
        console.log(error);
    })

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

const views = async () => {
    const count = await Count.find(); // search in database
    return count[0].count; // return the total views
}

const viewplusplus = async () => {
    let totalViews = await views(); // get total views
    totalViews++; // increase
    await Count.updateOne({}, { count: totalViews }) // update in database
    return totalViews;
}

app.set("trust proxy", true);

app.get('/', async (req, res) => {
    res.render('index', { totalViews: await views(), ip: req.ip });
})

app.get('/game', async (req, res) => {
    await viewplusplus();
    res.render('game');
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})