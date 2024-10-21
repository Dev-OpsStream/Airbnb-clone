resource "aws_instance" "my_ec2_instance" {
  ami           = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_name
  subnet_id     = var.subnet_id

   user_data = <<-EOF
              #!/bin/bash
              # Update the package list
              sudo yum update -y || sudo apt-get update -y

              # Install epel-release (for Amazon Linux)
              sudo amazon-linux-extras install epel -y || sudo apt-get install -y software-properties-common

              # Install Ansible
              sudo yum install ansible -y || sudo apt-add-repository --yes --update ppa:ansible/ansible && sudo apt-get install -y ansible

              # Optionally, check Ansible version
              ansible --version
              EOF

  vpc_security_group_ids = var.vpc_security_group_ids

  tags = {
    Name = var.instance_name
  }

  # Block to add elastic IP
  associate_public_ip_address = true

  # Additional block to handle instance termination
  lifecycle {
    prevent_destroy = false
  }
}

# Optional: Elastic IP resource (for assigning a static public IP)
resource "aws_eip" "elastic_ip" {
  instance = aws_instance.my_ec2_instance.id
  depends_on = [aws_instance.my_ec2_instance]
}
