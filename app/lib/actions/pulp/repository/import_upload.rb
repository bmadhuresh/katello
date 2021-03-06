module Actions
  module Pulp
    module Repository
      class ImportUpload < Pulp::AbstractAsyncTask
        input_format do
          param :pulp_id
          param :unit_type_id
          param :upload_id
          param :unit_key
          param :unit_metadata
        end

        def invoke_external_task
          output[:pulp_tasks] = [pulp_resources.content.import_into_repo(input[:pulp_id],
                                                   input[:unit_type_id],
                                                   input[:upload_id],
                                                   input[:unit_key],
                                                   unit_metadata: input[:unit_metadata] || {})]
        end
      end
    end
  end
end
