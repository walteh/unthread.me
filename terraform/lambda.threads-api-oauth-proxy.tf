
data "archive_file" "threads-api-oauth-proxy-lambda-zip" {
	type        = "zip"
	source_dir  = "${path.module}/lambdas/threads-api-oauth-proxy"
	output_path = "${path.module}/.terraform/lambdas-threads-api-oauth-proxy.zip"
}


resource "aws_lambda_function" "threads-api-oauth-proxy" {
	depends_on = [

	]

	function_name    = "${local.app_stack}-threads-api-oauth-proxy"
	role             = aws_iam_role.threads-api-oauth-proxy.arn
	memory_size      = 128
	timeout          = 120
	publish          = true
	architectures    = ["arm64"]
	runtime          = "python3.12"
	filename         = data.archive_file.threads-api-oauth-proxy-lambda-zip.output_path
	handler          = "handler.lambda_handler" 
	source_code_hash = data.archive_file.threads-api-oauth-proxy-lambda-zip.output_base64sha256


	environment {
		variables = {
			THREADS_API_SECRET_NAME = aws_secretsmanager_secret.threads_api_secret.name
		}
	}
}



resource "aws_iam_role" "threads-api-oauth-proxy" {
	name               = "${local.app_stack}-threads-api-oauth-proxy-ExecutionRole"
	assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
	inline_policy {
		name   = "${local.app_stack}-threads-api-oauth-proxy-ExecutionRolePolicy"
		policy = data.aws_iam_policy_document.threads-api-oauth-proxy-lambda-inline.json
	}

	managed_policy_arns = [
		"arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
	]
}


data "aws_iam_policy_document" "threads-api-oauth-proxy-lambda-inline" {
	statement {
		effect    = "Allow"
		actions   = ["secretsmanager:GetSecretValue"]
		resources = [aws_secretsmanager_secret.threads_api_secret.arn]
	}
}



/*/////////////////////////
		API Gateway
////////////////////////*/

resource "aws_apigatewayv2_route" "threads-api-oauth-proxy" {
	api_id             = aws_apigatewayv2_api.main.id
	route_key          = "POST /threads-api-oauth-proxy"
	authorization_type = "NONE"
	target             = "integrations/${aws_apigatewayv2_integration.threads-api-oauth-proxy-lambda.id}"
}

resource "aws_lambda_permission" "threads-api-oauth-proxy" {
	statement_id  = "${local.app_stack}-threads-api-oauth-proxy-AllowExecutionFromApiGatewayRoute"
	action        = "lambda:InvokeFunction"
	function_name = aws_lambda_function.threads-api-oauth-proxy.function_name
	principal     = "apigateway.amazonaws.com"
	# source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*/main"
	source_arn = "${aws_apigatewayv2_api.main.execution_arn}/*/POST/threads-api-oauth-proxy"
}

resource "aws_apigatewayv2_integration" "threads-api-oauth-proxy-lambda" {
	api_id                 = aws_apigatewayv2_api.main.id
	integration_type       = "AWS_PROXY"
	integration_method     = "POST"
	integration_uri        = aws_lambda_function.threads-api-oauth-proxy.invoke_arn
	payload_format_version = "2.0"
}
