terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "amrutam-telemedicine-vpc"
    Environment = var.environment
  }
}

# AWS RDS PostgreSQL Cluster
resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "amrutam-rds-subnet-group"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]
}

resource "aws_db_instance" "postgres" {
  identifier             = "amrutam-db-${var.environment}"
  allocated_storage      = 100
  max_allocated_storage  = 500
  engine                 = "postgres"
  engine_version         = "16.1"
  instance_class         = "db.r6g.xlarge"
  db_name                = "amrutam_telemedicine"
  username               = "db_admin"
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  multi_az               = true
  storage_encrypted      = true
  skip_final_snapshot    = false
  deletion_protection    = true
}

# AWS ElastiCache Redis Cluster
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "amrutam-redis-${var.environment}"
  engine               = "redis"
  node_type            = "cache.r6g.large"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
}

# AWS ECS Task Definition & Fargate Service
resource "aws_ecs_cluster" "main" {
  name = "amrutam-ecs-cluster-${var.environment}"
}
