var express = require('express');
var router = express.Router();
var Model = require('./model.js');

var createModel = function(req, res){
	var model = new Model(req.body);
	model.save(function(err, m){
		if (err){
			console.log(err);
			return res.status(403).send(err.message);
		}
		res.send(m);
	});
};

var retrieveModels = function(req, res){
	Model.find({}, function(err, models){
		if (err){
			console.log(err);
			models = [];
		}
		res.send(models);
	});
};

var updateModel = function(req, res){
	Model.findByIdAndUpdate(req.params.id, req.body, function(err, model){
		if (err){
			console.log(err);
			return res.status(403).send(err.message);
		}

		res.send(model);
	});
};

var deleteModel = function(req, res){	
	Model.findByIdAndRemove(req.params.id, function(err, model){
		if (err){
			console.log(err);
			return res.status(403).send(err.message);
		}

		res.send(model);
	});	
};

//CRUD
router.post('/models', 			createModel);
router.get('/models', 			retrieveModels);
router.put('/models/:id', 		updateModel);
router.patch('/models/:id', 	updateModel);
router.delete('/models/:id', 	deleteModel);

module.exports = router;