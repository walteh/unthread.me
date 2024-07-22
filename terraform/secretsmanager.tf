resource "aws_secretsmanager_secret" "threads_api_secret" {
	name_prefix = "${local.app_stack}-threads-api-secret"
}
