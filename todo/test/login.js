var assert = require('assert'),
    Browser = require('zombie'),
    app = require('../app'),
    couchdb = require('../lib/couchdb'),
    dbName = 'users',
    db = couchdb.use(dbName),
    fixtures = require('./fixtures');

function ensureUserExists(next) {
    db.get(fixtures.user.email, function (err, user) {
        if (err && err.status_code === 404) {
            db.insert(fixtures.user, fixtures.user.email, next);
        }
        if (err) throw err;
        next();
    })
}

module.exports = function (next) {
    return function (done) {
        ensureUserExists(function (err) {
            if (err) throw err;
            Browser.visit("http://localhost:3000/session/new", function (err, browser) {
                if (err) throw err;
                browser
                    .fill('E-mail', fixtures.user.email)
                    .fill('Password', fixtures.user.password)
                    .pressButton('Log In', function (err) {
                        if (err) throw err;
                        assert.equal(browser.location.pathname, '/todos');
                        next(browser, done)
                    });
            });
        });
    };
};
