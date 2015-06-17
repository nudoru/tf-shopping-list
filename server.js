var express = require('express');

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.update = function(paramID, itemName, itemID) {
    paramID = parseInt(paramID);

    var itemIdx = this.items.map(function (i) { return i.id; }).indexOf(paramID), item;

    if(itemIdx >= 0) {
      this.items[itemIdx].name = itemName;
      this.items[itemIdx].id = paramID;
      item = this.items[itemIdx];
    } else {
      item = {name: itemName, id: paramID};
      this.items.push(item);
    }

    return item;
};

Storage.prototype.delete = function(id) {
    id = parseInt(id);

    var item = this.items.filter(function(i) { return i.id === id; })[0];

    if(!item) {
      console.log('No item id: '+id);
      return false;
    }

    var itemIdx = this.items.map(function (i) { return i.id; }).indexOf(id);
    this.items.splice(itemIdx, 1);
    return item;
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var app = express();
app.use(express.static('public'));

// Get items
app.get('/items', function(req, res) {
    res.json(storage.items);
});

// Add items
app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

// Update
app.put('/items/:id', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    var item = storage.update(req.params.id, req.body.name, req.body.id);
    res.status(200).json(item);
});

// Delete items
app.delete('/items/:id', jsonParser, function(req, res) {
    var item = storage.delete(req.params.id);

    if(item) {
      res.status(200).json(item);
    } else {
      res.status(500).send({ error: 'No item with id: '+req.params.id });
    }

});

app.listen(process.env.PORT || 8080);

exports.app = app;
exports.storage = storage;