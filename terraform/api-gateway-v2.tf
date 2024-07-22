
resource "aws_apigatewayv2_api" "main" {
	name                       = local.app_stack
	protocol_type              = "HTTP"
	route_selection_expression = "$request.method $request.path"
	cors_configuration {
		allow_origins  = ["*"]
		allow_methods  = ["POST"]
		allow_headers  = ["*"]
		expose_headers = ["*"]
	}
}

resource "aws_cloudwatch_log_group" "accesslogs" {
	name              = "/aws/apigateway/${local.app_stack}-accesslogs"
	retention_in_days = 7
}

resource "aws_apigatewayv2_stage" "main" {
	api_id      = aws_apigatewayv2_api.main.id
	name        = "main"
	auto_deploy = true
	access_log_settings {
		destination_arn = aws_cloudwatch_log_group.accesslogs.arn
		format          = "$context.identity.sourceIp - $context.identity.caller - $context.identity.user [$context.requestTime] \"$context.httpMethod $context.routeKey $context.protocol\" $context.status $context.responseLength $context.requestId $context.integrationErrorMessage $context.error.message "
	}
}



resource "aws_apigatewayv2_api_mapping" "main" {
	api_id          = aws_apigatewayv2_api.main.id
	domain_name     = local.apigw_domain
	stage           = aws_apigatewayv2_stage.main.id
	api_mapping_key = terraform.workspace
}

resource "aws_apigatewayv2_deployment" "main" {
	depends_on = [
		aws_apigatewayv2_route.threads-api-oauth-proxy,
	]
	api_id = aws_apigatewayv2_api.main.id
	lifecycle {
		create_before_destroy = true
	}
}
