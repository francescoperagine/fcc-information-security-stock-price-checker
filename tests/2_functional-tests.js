const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

// Viewing one stock: GET request to /api/stock-prices/
// Viewing one stock and liking it: GET request to /api/stock-prices/
// Viewing the same stock and liking it again: GET request to /api/stock-prices/
// Viewing two stocks: GET request to /api/stock-prices/
// Viewing two stocks and liking them: GET request to /api/stock-prices/

suite('Functional Tests', function() {
    suite('GET /api/stock-prices', () => {
        test('Viewing one stock: GET request to /api/stock-prices/', (done) => {
            chai.request(server)
                .get('/api/stock-prices')
                .query({ stock: 'goog' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'stockData');
                    assert.property(res.body.stockData, 'stock');
                    assert.property(res.body.stockData, 'price');
                    assert.property(res.body.stockData, 'likes');
                    done();
                })
        })
        
        test('Viewing one stock and liking it: GET request to /api/stock-prices/', (done) => {
            chai.request(server)
                .get('/api/stock-prices')
                .query({ stock: 'goog', like: true })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'stockData');
                    assert.property(res.body.stockData, 'stock');
                    assert.property(res.body.stockData, 'price');
                    assert.property(res.body.stockData, 'likes');
                    assert.equal(res.body.stockData.likes, 1);
                    done();
                })
        })
    
        test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', (done) => {
            chai.request(server)
                .get('/api/stock-prices')
                .query({ stock: 'goog', like: true })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'stockData');
                    assert.property(res.body.stockData, 'stock');
                    assert.property(res.body.stockData, 'price');
                    assert.property(res.body.stockData, 'likes');
                    assert.equal(res.body.stockData.likes, 1);
                    done();
                })
        })

        test('Viewing two stocks: GET request to /api/stock-prices/', (done) => {
            chai.request(server)
                .get('/api/stock-prices')
                .query({ stock: ['goog', 'msft'] })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'stockData');
                    assert.isArray(res.body.stockData);
                    assert.property(res.body.stockData[0], 'stock');
                    assert.property(res.body.stockData[0], 'price');
                    assert.property(res.body.stockData[0], 'rel_likes');
                    assert.property(res.body.stockData[1], 'stock');
                    assert.property(res.body.stockData[1], 'price');
                    assert.property(res.body.stockData[1], 'rel_likes');
                    done();
                })
        })

        test('Viewing two stocks and liking them: GET request to /api/stock-prices/', (done) => {
            chai.request(server)
                .get('/api/stock-prices')
                .query({ stock: ['goog', 'msft'], like: true })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'stockData');
                    assert.isArray(res.body.stockData);
                    assert.property(res.body.stockData[0], 'stock');
                    assert.property(res.body.stockData[0], 'price');
                    assert.property(res.body.stockData[0], 'rel_likes');
                    assert.property(res.body.stockData[1], 'stock');
                    assert.property(res.body.stockData[1], 'price');
                    assert.property(res.body.stockData[1], 'rel_likes');
                    done();
                })
        })
    })
});