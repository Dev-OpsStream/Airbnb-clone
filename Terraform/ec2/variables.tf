# variables.tf

variable "aws_region" {
  description = "The AWS region where resources will be created"
  default     = "ap-south-1"
}

variable "instance_type" {
  description = "The type of instance to create"
  default     = "t2.micro"
}

variable "ami_id" {
  description = "The AMI ID to use for the instance"
  default     = "ami-04a37924ffe27da53"  # Example: Amazon Linux 2 in us-east-1
}

variable "key_name" {
  description = "The name of the SSH key pair to use"
  default     = "MyKey"
}

variable "instance_name" {
  description = "The name of the EC2 instance"
  default     = "my-ec2-instance"
}

variable "vpc_security_group_ids" {
  description = "List of security group IDs for the instance"
  type        = list(string)
  default     = ["sg-00c36b9f8f3ad93ea"]
}

variable "subnet_id" {
  description = "The ID of the subnet where the instance will be created"
  default     = "subnet-0cd91ccd64d803b77"
}
