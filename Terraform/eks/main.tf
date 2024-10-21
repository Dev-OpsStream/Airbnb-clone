module "vpc" {
  source = "../vpc" 
}

# Security group for the EKS control plane
resource "aws_security_group" "control_plane_security_group" {
  name        = "control_plane_security_group"
  description = "Security group for EKS control plane"
  vpc_id      = module.vpc.vpc_id
}

# Security group for worker nodes
resource "aws_security_group" "worker_node_security_group" {
  name        = "worker_node_security_group"
  description = "Security group for worker nodes"
  vpc_id      = module.vpc.vpc_id
}

# Security group for SSH access to worker nodes
resource "aws_security_group" "ssh_login_security_group" {
  name        = "ssh_login_security_group"
  description = "Security group for SSH access to worker nodes"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_cidr_block] # CIDR block for SSH access
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EKS Cluster creation
resource "aws_eks_cluster" "eks_cluster" {
  name     = var.cluster_name
  role_arn = aws_iam_role.eks_control_plane_role.arn
  version  = var.eks_version

  vpc_config {
    subnet_ids = [
      module.vpc.private_subnet1_id,
      module.vpc.private_subnet2_id
    ]
    security_group_ids = [aws_security_group.control_plane_security_group.id]
  }

  depends_on = [aws_iam_role.eks_control_plane_role]
}

# Worker node group
resource "aws_eks_node_group" "worker_node_group" {
  cluster_name    = aws_eks_cluster.eks_cluster.name
  node_group_name = "${var.cluster_name}-worker-nodes"
  node_role_arn   = aws_iam_role.worker_node_role.arn
  subnet_ids      = module.vpc.private_subnets

  scaling_config {
    desired_size = var.desired_size
    max_size     = var.max_size
    min_size     = var.min_size
  }

  remote_access {
    ec2_ssh_key               = var.ssh_key_name
    source_security_group_ids = [aws_security_group.ssh_login_security_group.id]
  }

  instance_types = [var.worker_node_instance_type]
  capacity_type  = "ON_DEMAND"
  disk_size      = var.worker_node_storage

  labels = {
    role = "worker"
  }
}

# IAM Role for EKS Control Plane
resource "aws_iam_role" "eks_control_plane_role" {
  name = "eks_control_plane_role"

  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "sts:AssumeRole",
        "Effect": "Allow",
        "Principal": {
          "Service": "eks.amazonaws.com"
        }
      }
    ]
  })
}

# IAM Role for EKS Worker Nodes
resource "aws_iam_role" "worker_node_role" {
  name = "worker_node_role"

  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "sts:AssumeRole",
        "Effect": "Allow",
        "Principal": {
          "Service": "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# Attach required policies to worker node role
resource "aws_iam_role_policy_attachment" "worker_node_AmazonEKSWorkerNodePolicy" {
  role       = aws_iam_role.worker_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

resource "aws_iam_role_policy_attachment" "worker_node_AmazonEKS_CNI_Policy" {
  role       = aws_iam_role.worker_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
}

resource "aws_iam_role_policy_attachment" "worker_node_AmazonEC2ContainerRegistryReadOnly" {
  role       = aws_iam_role.worker_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}