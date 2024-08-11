terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "~> 4.16"
        }
    }

    required_version = ">= 1.2.0"
}

provider "aws" {
    region = "ap-southeast-1"
}


#for amazon linux
resource "aws_instance" "qkshare-backend" {
    ami = ""
    instance_type = "t2.micro"

    user_data = <<EOF
    #!/bin/bash
    sudo yum update -y
    sudo amazon-linux-extras install docker
    #sudo service docker start
    sudo usermod -a -G docker appadmin
    docker info
    sudo chmod 666 /var/run/docker.sock

    sudo apt-get install nginx
    sudo yum install -y git
    EOF

    tags = {
        Name = "backend-quickshare-terraform"
    }
}



