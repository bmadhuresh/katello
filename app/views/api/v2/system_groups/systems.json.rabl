object false

extends "api/v2/common/metadata"

child @collection[:results] => :results do
  attributes :name
  attributes :id, :uuid
  attributes :content_view, :content_view_id

  child :environment => :environment do
    extends 'api/v2/environments/show'
  end
end

