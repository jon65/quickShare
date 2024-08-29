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

##first create a vpc block
resource "aws_vpc" "two-tier-vpc" {
    cidr_block = "10.0.0.0/16"
    tags = {
        Name = "two-tier-vpc"
    }
}

#public subnet
resource "aws_sbunet" "two-tier-pub-sub-1" {
    vpc_id = aws_vpc.two-tier-vpc.id
    cidr_block = "10.0.0.0/28"
    availability_zone = "ap-southeast-1a"
    map_public_ip_on_launch = "true"

    tags = {
        Name = "two-tier-pub-sub-1"
    }
}

resource "aws_subnet" "two-tier-pub-sub-2" {
    vpc_id = aws_vpc.two-tier-vpc.id
    cidr_block = "10.0.64.0/18"
    availability_zone = "ap-southeast-1b"
    map_public_ip_on_launch = "true"

    tags = {
        Name = "two-tier-pub-sub-2"
    }
}

#private subnet
resource "aws_subnet" "two-tier-pvt-pub-1" {
    vpc_id = aws_vpc.two-tier-vpc.id
    cidr_block = "10.0.128.0/18"
    availability_zone = "ap-southeast-1a"
    map_public_ip_on_launch = false
    tags = {
        Name = "two-tier-pvt-sub-1"
    }
}

resource "aws_subnet" "two-tier-pvt-sub-2" {
  vpc_id                  = aws_vpc.two-tier-vpc.id
  cidr_block              = "10.0.192.0/18"
  availability_zone       = "ap-southeast-1b"
  map_public_ip_on_launch = false
  tags = {
    Name = "two-tier-pvt-sub-2"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "two-tier-igw" {
  tags = {
    Name = "two-tier-igw"
  }
  vpc_id = aws_vpc.two-tier-vpc.id
}

# Route Table
# it creates a route table associated with a VPC 
# route -> 
# route that directs all traffic from network ip -> internet gateway
# This route effectively says: "Any traffic leaving this subnet that is destined for any IPv4 address should be routed through the Internet Gateway."
resource "aws_route_table" "two-tier-rt" {
  tags = {
    Name = "two-tier-rt"
  }
  vpc_id = aws_vpc.two-tier-vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.two-tier-igw.id
  }
}
# To actually allow traffic from the internet to reach instances in the VPC, you need to configure the Security Groups and Network Access Control Lists (NACLs) for the instances and subnet, respectively.
# Security Groups should have inbound rules that permit traffic from the internet, such as allowing HTTP (port 80) or SSH (port 22) traffic.

# Route Table Association
resource "aws_route_table_association" "two-tier-rt-as-1" {
  subnet_id      = aws_subnet.two-tier-pub-sub-1.id
  route_table_id = aws_route_table.two-tier-rt.id
}

resource "aws_route_table_association" "two-tier-rt-as-2" {
  subnet_id      = aws_subnet.two-tier-pub-sub-2.id
  route_table_id = aws_route_table.two-tier-rt.id
}

# Create Load balancer
resource "aws_lb" "two-tier-lb" {
  name               = "two-tier-lb"
  internal           = false #sets lb to be publicly accessible
  load_balancer_type = "application"
  security_groups    = [aws_security_group.two-tier-alb-sg.id] #load balancer associated with these security groups
  subnets            = [aws_subnet.two-tier-pub-sub-1.id, aws_subnet.two-tier-pub-sub-2.id]

  tags = {
    Environment = "two-tier-lb"
  }
}

#  https://achinthabandaranaike.medium.com/how-to-deploy-a-two-tier-architecture-in-aws-using-terraform-a4fd0f2e19ae
resource "aws_lb_target_group" "two-tier-lb-tg" {
  name     = "two-tier-lb-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.two-tier-vpc.id
}

# Create Load Balancer listener
resource "aws_lb_listener" "two-tier-lb-listner" {
  load_balancer_arn = aws_lb.two-tier-lb.arn
  port              = "80"
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.two-tier-lb-tg.arn
  }
}

# Create Target group
resource "aws_lb_target_group" "two-tier-loadb_target" {
  name       = "target"
  depends_on = [aws_vpc.two-tier-vpc]
  port       = "80"
  protocol   = "HTTP"
  vpc_id     = aws_vpc.two-tier-vpc.id
  
}

resource "aws_lb_target_group_attachment" "two-tier-tg-attch-1" {
  target_group_arn = aws_lb_target_group.two-tier-loadb_target.arn
  target_id        = aws_instance.two-tier-web-server-1.id
  port             = 80
}
resource "aws_lb_target_group_attachment" "two-tier-tg-attch-2" {
  target_group_arn = aws_lb_target_group.two-tier-loadb_target.arn
  target_id        = aws_instance.two-tier-web-server-2.id
  port             = 80
}

# Subnet group database
resource "aws_db_subnet_group" "two-tier-db-sub" {
  name       = "two-tier-db-sub"
  subnet_ids = [aws_subnet.two-tier-pvt-sub-1.id, aws_subnet.two-tier-pvt-sub-2.id]
}
