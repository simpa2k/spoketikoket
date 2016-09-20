define(function() {

	return [
		'modules/coreModule/controllers/MainController',
		'modules/coreModule/controllers/HomeController',
		'modules/coreModule/controllers/AdminContactpersonsController',
		'modules/coreModule/controllers/AdminDescriptionController',
		'modules/coreModule/controllers/AdminGigsController',
		'modules/coreModule/controllers/AdminImagesController',
		'modules/coreModule/controllers/AdminEmbeddeditemsController',
		'modules/coreModule/controllers/AdminMembersController',
		'modules/coreModule/services/append-credentials-service',
		'modules/coreModule/services/contactpersons-service',
		'modules/coreModule/services/description-service',
		'modules/coreModule/services/gigs-service',
		'modules/coreModule/services/images-service',
		'modules/coreModule/services/embeddeditems-service',
		'modules/coreModule/services/members-service',
		'modules/coreModule/services/send-object-service',
		'modules/coreModule/services/users-service',
		'modules/coreModule/services/venues-service',
		'modules/coreModule/directives/sticky-navbar/sticky-navbar',
		'modules/coreModule/directives/gig'
	]

});
