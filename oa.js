const express = require('express')
const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

app.use('/', express.static('./oa'));

app.get('/api/getMarchesOnline', function (req, res) {
    var mysql = require('mysql2');
    var c = mysql.createConnection('mysql://root:Islem$08@172.23.210.221/gestionao2');
    c.query('select * from marchesonline order by title', function (e, r) {
        c.close();
        res.type('json');
        res.end(JSON.stringify(r));
    });
});

app.get('/api/getCEREMA/:id', function (req, res) {
    var mysql = require('mysql2');
    var c = mysql.createConnection('mysql://root:Islem$08@172.23.210.221/gestionao2');
    c.query('select * from cerema where parent=' + req.params.id + '', function (e, r) {
        c.close();
        res.type('json');
        res.end(JSON.stringify(r));
    });
});

app.post('/api/update', function (req, res) {
    res.type('json');
    var mysql = require('mysql2');
    var c = mysql.createConnection('mysql://root:Islem$08@172.23.210.221/gestionao2?multipleStatements=true');
    if (!req.body.items) return res.status(400).end('BAD_REQUEST');

    var o = JSON.parse(req.body.items);
    var INSERT = [];
    for (var el in o) {
        var tab = o[el];
        for (var j = 0; j < tab.length; j++) {
            var value = tab[j];
            INSERT.push('insert ignore into cerema_mol (id,mid) VALUES(' + el + ',' + value + ');');
        }
    };
    c.query(INSERT.join(''), function (e, r) {
        c.close();
        return res.end('{}');
    })

});

app.post('/api/rm', function (req, res) {
    res.type('json');
    var mysql = require('mysql2');
    var c = mysql.createConnection('mysql://root:Islem$08@172.23.210.221/gestionao2?multipleStatements=true');
    if (!req.body.id) return res.status(400).end('BAD_REQUEST');
    if (!req.body.a) return res.status(400).end('BAD_REQUEST');

    var id = req.body.id;
    var a = req.body.a;

    var INSERT = [];

    INSERT.push('delete from cerema_mol where id="' + id + '" and mid="' + a + '";');

    c.query(INSERT.join(''), function (e, r) {
        c.close();
        return res.end('{}');
    })

});

app.get('/api/mid', function (req, res) {
    var mysql = require('mysql2');
    var c = mysql.createConnection('mysql://root:Islem$08@172.23.210.221/gestionao2');
    c.query('select cerema_mol.id,mid,title from cerema_mol join marchesonline on marchesonline.`id`=cerema_mol.mid', function (e, r) {
        res.type('json');
        res.end(JSON.stringify(r));
    });
});

app.listen(3010, function () {
    console.log('OA listening on port 3010!')
})