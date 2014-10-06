/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */
describe('ProductSvc Test', function () {

    var productUrl = 'http://dummy.product.url';
    var productRoute = '/products';
    var productsRestUrl = 'https://yaas-test.apigee.net/test/product/v1/products';

    var $scope, $rootScope, $httpBackend, productSvc;
    var acceptLang = "de";
    var mockedGlobalData = {acceptLanguages: acceptLang};


    var prodList = [
        {name: 'Shirt'},
        {name: 'Hat'}
    ];

    beforeEach(module('restangular'));
    beforeEach(angular.mock.module('ds.products', function ($provide) {
        $provide.value('GlobalData', mockedGlobalData);
    }));


    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        inject(function (_$httpBackend_, _$rootScope_, _ProductSvc_) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();
            $httpBackend = _$httpBackend_;
            productSvc = _ProductSvc_;
        });
    });

    describe('query', function(){

        it('issues GET that returns product array', function () {
            $httpBackend.expectGET(productsRestUrl).respond(prodList);

            var products = productSvc.query();

            $httpBackend.flush();
            expect(products.$object.length).toBeDefined();
            expect(products.$object.length).toEqual(prodList.length);
            for (var i = 0, prod; i < products.$object.length; i++) {
                prod = products.$object[i];
                expect(prod.name).toEqualData(prodList[i].name);
            };
        });

        it('sets accept-language header', function(){

            $httpBackend.expectGET(productsRestUrl, {"accept-language":acceptLang,"Accept":"application/json, text/plain, */*"}).respond(prodList);

            productSvc.query();
            $httpBackend.flush();

        });
    });





});
