define(['angular', 'coreModule/directives/admin-page/admin-page-test', 'angularMocks'], function(angular, adminPage) {

    describe('adminPage', function() {

        beforeEach(module('coreModule'));

        let $directive;

        beforeEach(inject(function(_$directive_) {
            $directive = _$directive_;
        }));

        it('should pass', function() {
            let boolean = true;
            expect(boolean.toEqual(true));
        });
    });
});