const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const campGroundModel = require("../models/campGrounds");
mongoose
      .connect("mongodb://127.0.0.1:27017/campgrounds")
      .then(() => {
            console.log("connected to mongodb");
      })
      .catch((e) => {
            console.log(e);
      });

let count = 0;
const seedDb = async () => {
      await campGroundModel.deleteMany({}).then((data) => {
            console.log(data);
      });

      for (let i = 0; i < 500; i++) {
            let random1000 = Math.floor(Math.random() * 1000);
            let randomPlace = Math.floor(Math.random() * places.length);
            let randomDescriptor = Math.floor(
                  Math.random() * descriptors.length
            );
            let randomPrice = Math.floor(Math.random() * 20) + 10;
            let campGround = new campGroundModel({
                  location:
                        cities[random1000].city +
                        " " +
                        cities[random1000].state,
                  title:
                        places[randomPlace] +
                        " " +
                        descriptors[randomDescriptor],
                  image: [
                        {
                              url: "https://res.cloudinary.com/diwrxz82u/image/upload/v1686140721/yelpCamp/mfjp3nxucmeaaqsnzjsz.jpg",
                              fileName: "yelpCamp/mfjp3nxucmeaaqsnzjsz",
                        },
                        {
                              url: "https://res.cloudinary.com/diwrxz82u/image/upload/v1686138462/yelpCamp/t3dwsaemgjauze4ksk5g.jpg",
                              fileName: "yelpCamp/t3dwsaemgjauze4ksk5g",
                        },
                  ],
                  description:
                        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam doloremque blanditiis delectus, vero amet odio perferendis consectetur porro. Corrupti magni maxime illum perferendis animi saepe earum. Illo aperiam optio repellat.",
                  price: randomPrice,
                  author: "647adf0ea3e291061900ec1c",
                  geometry: {
                        type: "Point",
                        coordinates: [
                              cities[random1000].longitude,
                              cities[random1000].latitude,
                        ],
                  },
            });
            campGround.save().then(() => {
                  console.log(++count);
            });
      }
};

seedDb();
