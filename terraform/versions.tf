terraform {
	required_providers {
		aws = {
			source = "hashicorp/aws"
		}
		time = {
			source = "hashicorp/time"
		}
		null = {
			source = "hashicorp/null"
		}
		archive = {
			source = "hashicorp/archive"
		}
	}
	backend "s3" {
		profile = "unthreadme"
		bucket  = "unthread.me-tfstate"
		key     = "unthread.me-api.tfstate"
		region  = "us-east-1"
		# dynamodb_table = "tfstate-locks"
	}
}



provider "aws" {
	region              = "us-east-1"
	profile             = "unthreadme"
	default_tags {
		tags = local.tags
	}
}

data "aws_caller_identity" "current" {}

data "aws_availability_zones" "available_zones" { state = "available" }
data "aws_region" "current" {}
data "aws_partition" "current" {}
