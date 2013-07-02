/**
 * Copyright 2013 Red Hat, Inc.
 *
 * This software is licensed to you under the GNU General Public
 * License as published by the Free Software Foundation; either version
 * 2 of the License (GPLv2) or (at your option) any later version.
 * There is NO WARRANTY for this software, express or implied,
 * including the implied warranties of MERCHANTABILITY,
 * NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
 * have received a copy of GPLv2 along with this software; if not, see
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
 */

/**
 * @ngdoc service
 * @name  Bastion.widgets.service:Nutupane
 *
 * @requires $location
 * @requires $http
 * @requires CurrentOrganization
 *
 * @description
 *   Defines the Nutupane factory for adding common functionality to the Nutupane master-detail
 *   pattern.
 *
 * @example
 *   <pre>
       angular.module('example').controller('ExampleController',
           ['Nutupane', function(Nutupane)) {
               var nutupane                = new Nutupane();
               $scope.table                = nutupane.table;
           }]
       );
    </pre>
 */
angular.module('Bastion.widgets').factory('Nutupane',
    ['$location', '$timeout', 'CurrentOrganization',
    function($location, $timeout, CurrentOrganization) {
        var Nutupane = function(resource) {
            var self = this;

            self.sort = {
                by: 'name',
                order: 'ASC'
            };

            self.table = {
                resource: resource,
                searchString: $location.search().search,
                loadingMore: false
            };

            self.get = function(callback) {
                var params = {
                    'organization_id':  CurrentOrganization,
                    'search':           $location.search().search || "",
                    'sort_by':          self.sort.by,
                    'sort_order':       self.sort.order,
                    'paged':            true,
                    'offset':           self.table.resource.offset
                };

                self.table.working = true;

                return self.table.resource.get(params, function() {
                    self.table.working = false;

                    if (callback) {
                        callback();
                    }
                });
            };

            self.table.search = function(searchTerm) {
                $location.search('search', searchTerm);
                self.table.resource.offset = 0;
                self.table.closeItem();

                if (!self.table.working) {
                    self.get();
                }
            };

            // Must be overridden
            self.table.closeItem = function() {
                throw "NotImplementedError";
            };

            self.table.nextPage = function() {
                var table = self.table;

                if (table.loadingMore || table.working || table.resource.subtotal === table.resource.offset) {
                    return;
                }

                table.loadingMore = true;

                self.get(function() {
                    table.loadingMore = false;
                });
            };

            self.table.sort = function(column) {
                if (column.id === self.sort.by) {
                    self.sort.order = (self.sort.order === 'ASC') ? 'DESC' : 'ASC';
                } else {
                    self.sort.order = 'ASC';
                    self.sort.by = column.id;
                }

                column.active = true;

                self.table.offset = 0;
                self.get();
            };

            $timeout(self.get, 0);
        };

        return Nutupane;
    }]
);
