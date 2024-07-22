locals {
	env          = terraform.workspace
	app          = "api"
	app_stack    = "${local.app}-${local.env}"
	apigw_domain = "api.unthread.me"

	tags = {
		env   = local.env
		stack = local.app_stack
		app   = local.app
		repo  = "github.com/walteh/unthread.me"
	}
}

data "aws_iam_policy_document" "lambda_assume" {
	statement {
		effect  = "Allow"
		actions = ["sts:AssumeRole"]
		principals {
			type        = "Service"
			identifiers = ["lambda.amazonaws.com"]
		}
	}
}
