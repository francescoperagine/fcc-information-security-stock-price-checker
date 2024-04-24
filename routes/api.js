'use strict';

const mongoose = require("mongoose");
const axios = require("axios");

let stockSchema = new mongoose.Schema({
  stock: String,
  likes: Number,
  ips: [String],
});

let StockModel = mongoose.model("Stock", stockSchema);

module.exports = function (app) {

  const getPrice = async (stock) => {
    try {
      const response = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`);
      let { symbol, latestPrice } = response.data;
      return { stock: symbol, price: latestPrice };
    } catch (error) {
      console.log(error);
      return null;  // Return null to indicate the failure
    }
  };
  
  const setStock = async (stock, like, ip) => {
    let data = await StockModel.findOne({ stock }).exec();
    if (!data) {
      data = new StockModel({
        stock,
        likes: like ? 1 : 0,
        ips: like ? [ip] : [],
      });
      await data.save();
    } else {
      if (like && !data.ips.includes(ip)) {
        data.likes++;
        data.ips.push(ip);
        await data.save();
      }
    }
    return data;
  }

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const like = req.query.like;
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      let response = {};

      try {
        if (Array.isArray(req.query.stock) && req.query.stock.length === 2) {
          let [stock1, stock2] = req.query.stock;
          let [price1, price2] = await Promise.all([getPrice(stock1), getPrice(stock2)]);
          if (!price1 || !price2) {
            return res.status(404).json({ error: "Stock data not found" });
          }
          let [data1, data2] = await Promise.all([setStock(stock1, like, clientIp), setStock(stock2, like, clientIp)]);

          let rel_likes1 = data1.likes - data2.likes;
          let rel_likes2 = data2.likes - data1.likes;

          response['stockData'] = [
            { stock: price1.stock, price: price1.price, rel_likes: rel_likes1 },
            { stock: price2.stock, price: price2.price, rel_likes: rel_likes2 }
          ];
        } else {
          let stock = req.query.stock;
          let price = await getPrice(stock);
          if (!price) {
            return res.status(404).json({ error: "Stock data not found" });
          }
          let data = await setStock(stock, like, clientIp);

          response['stockData'] = {
            stock: price.stock,
            price: price.price,
            likes: data.likes
          };
        }
        res.json(response);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });
};
