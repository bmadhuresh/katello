module Katello
  class PackageGroup < Katello::Model
    include Concerns::PulpDatabaseUnit

    CONTENT_TYPE = "package_group".freeze

    has_many :repository_package_groups, :class_name => "Katello::RepositoryPackageGroup", :dependent => :destroy, :inverse_of => :package_group
    has_many :repositories, :through => :repository_package_groups, :class_name => "Katello::Repository"
    has_many :roots, :through => :repositories, :class_name => "Katello::RootRepository"

    scoped_search :on => :name, :complete_value => true
    scoped_search :on => :pulp_id, :rename => :id, :complete_value => true

    def self.repository_association_class
      RepositoryPackageGroup
    end

    def repository
      self.repositories.first
    end

    def update_from_json(json)
      self.update_attributes!(json.slice('name', 'description'))
    end

    def self.list_by_filter_clauses(clauses)
      package_names = []
      pulp_package_groups = Katello.pulp_server.extensions.package_group.search(Katello::PackageGroup::CONTENT_TYPE, :filters => clauses)
      groupings = [:default_package_names, :conditional_package_names, :optional_package_names, :mandatory_package_names]
      if pulp_package_groups.any?
        pulp_package_groups.flat_map { |group| groupings.each { |grouping| package_names << group[grouping] } }
        package_names.flatten!
      else
        []
      end
    end

    def package_names
      group = Pulp::PackageGroup.new(self.pulp_id)
      group.default_package_names + group.conditional_package_names + group.optional_package_names + group.mandatory_package_names
    end
  end
end
