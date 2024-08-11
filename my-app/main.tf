provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "s3qk" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_website_configuration" "s3_config" {
  bucket = aws_s3_bucket.s3qk.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "allow_public_traffic" {
  bucket = aws_s3_bucket.s3qk.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

data "aws_iam_policy_document" "s3qk_policy" {
  statement {
    sid    = "PublicReadGetObject"
    effect = "Allow"
    actions = [
      "s3:GetObject",
    ]
    resources = [
      "arn:aws:s3:::${var.bucket_name}/*",
    ]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.s3qk.id
  policy = data.aws_iam_policy_document.s3qk_policy.json
}

output "website_endpoint" {
  value = aws_s3_bucket.s3qk.website_endpoint
}

# Use a data source to reference an existing Route 53 hosted zone
data "aws_route53_zone" "main" {
  name = var.aws_domain
}

resource "aws_route53_record" "qkShare_a" {
  zone_id = data.aws_route53_zone.main.id
  name    = var.aws_subdomain  # Correct subdomain format
  type    = "A"
  alias {
    name                   = aws_s3_bucket.s3qk.website_endpoint
    zone_id                = aws_s3_bucket.s3qk.hosted_zone_id # The hosted zone ID for S3 (S3 specific)
    evaluate_target_health = false
  }
}

