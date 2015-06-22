Backbone.emulateHTTP = true;

(function(){
	var Model = Backbone.Model.extend({
		idAttribute: "_id",
		defaults: {
			name: '',
			time: Date.now(),
			dscr: '',
			image: '',
		},
	});

	var Models = Backbone.Collection.extend({
		model: Model,
		url: '/models',	
	});

	//item view
	var ModelView = Backbone.View.extend({
		tagName: 'tr',
		template: _.template($('#model-template').html()),
		
		events: {
			'dblclick':  	'edit',			
		},

		initialize: function(){
			this.listenTo(this.model, 'destroy', 	this.remove);
			this.listenTo(this.model, 'change', 	this.render);
		},

		render: function(){
			var m = this.model.toJSON();
			this.$el.html(this.template(m));
			return this;
		},

		edit: function(){
			app.switchToAddView(this.model);
		},
	});

	//app view
	var MainView = Backbone.View.extend({
		el: $('#mainView'),
		
		events: {
			"click #mainViewAdd":   	function(){this.switchToAddView();},
		},

		//app start
		initialize: function(){
			this.listenTo(models, 'reset', this.renderCollection);
			this.listenTo(models, 'add',   this.renderModel);

			models.fetch({error: function(c,r,o){
					alert('fetch models fail.');
				},
				reset: true});			
		},

		renderCollection: function(){
			var t = $("<p></p>");

			models.each(function(m){
				var view = new ModelView({model: m});
				t.append(view.render().el);
			});

			this.$('#mainViewList').append(t.children());
		},

		renderModel: function(model){
			var view = new ModelView({model: model});
			this.$('#mainViewList').prepend(view.render().el);
		},

		switchToAddView: function(model){
			this.$el.hide();
			addView.show(model);
		},

		switchToMainView: function($el){
			$el.hide();
			this.$el.show();
		},
	});

	var AddView = Backbone.View.extend({
		el: $('#addView'),

		events: {
			"click #addViewBtnCancel": 
				function(){app.switchToMainView(this.$el); return false;},
			'click #addViewBtnSave':  	'create',
			'click #addViewBtnDelete':  'deleteModel',
		},

		initialize: function(){
			this.$el.hide();
		},

		show: function(model){
			if (model){
				$("#addViewInName").val(model.get('name'));
				$("#addViewInDscr").val(model.get('dscr'));
				$("#addViewInImage").val(model.get('image'));
				$("#addViewBtnSave").data('id', model.id);
				$("#addViewBtnDelete").show();
			} else {
				$("#addViewInName").val('');
				$("#addViewInDscr").val('');
				$("#addViewInImage").val('');
				$("#addViewBtnSave").data('id', '');
				$("#addViewBtnDelete").hide();
			}		

			this.$el.show();
		},

		create: function(){
			if(!document.forms.addModel.checkValidity()){
				return;
			}

			var data = {
				name: $("#addViewInName").val(),
				dscr: $("#addViewInDscr").val(),
				image: $("#addViewInImage").val(),
			};

			var id = $("#addViewBtnSave").data('id');
			
			if (id){
				models.get(id).save(data, {
					error: function(){
						alert('服务器异常，请刷新！');
					},
					wait: true,
					patch: true,
				});
			} else {
				models.create(data, {
					wait: true,
					error: function(){
						alert("服务器异常，请刷新！");
					},
				});			
			}

			app.switchToMainView(this.$el);

			return false;
		},

		deleteModel: function(){
			var ret = confirm("Are you sure to delete?");
			if (ret) {
			var id = $("#addViewBtnSave").data('id');
				models.get(id).destroy({
					wait: true,
					error: function(m, r, o){
						alert("destroy fail");
					},				
				});

				app.switchToMainView(this.$el);			
			}

			return false;
		},
	});

	var models = new Models();
	var app = new MainView();
	var addView = new AddView();

})();