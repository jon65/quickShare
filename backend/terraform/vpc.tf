#create vpc
resource "aws_vpc" "two-tier-vpc" {
    cidr_block = "10.0.0.0/16"
    tags = {
        Name = "two-tier-vpc"
    }
}

#public subnets
resource "aws_subnet" "two-tier-pub-sub-1" {
    vpc_id = aws_vpc.two-tier-vpc.id
    cidr_block = "10.0.0.0/18"
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
resource "aws_subnet" "two-tier-pvt-sub-1" {
    vpc_id = aws_vpc.two-tier-vpc.id
    cidr_block = "10.0.128.0/18"
    availability_zone = "ap-southeast-1a"
    map_public_ip_on_launch = "false"

    tags = {
        Name = "two-tier-pvt-sub-1"
    }
}

resource "aws_subnet" "two-tier-pvt-sub-2" {
    vpc_id = aws_vpc.two-tier-vpc.id
    cidr_block = "10.0.192.0/18"
    availability_zone = "ap-southeast-1b"
    map_public_ip_on_launch = "false"

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

#configure routing
# each vpc needs a route table to control where network traffic is directed
# each subnet must be associated with a route table
# Route Table
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

resource "aws_route_table_association" "two-tier-rt-as-1" {
  subnet_id      = aws_subnet.two-tier-pub-sub-1.id
  route_table_id = aws_route_table.two-tier-rt.id
}

resource "aws_route_table_association" "two-tier-rt-as-2" {
  subnet_id      = aws_subnet.two-tier-pub-sub-2.id
  route_table_id = aws_route_table.two-tier-rt.id
}

#create load balancer
resource "aws_lb" "two-tier-lb" {
  name               = "two-tier-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.two-tier-alb-sg.id]
  subnets            = [aws_subnet.two-tier-pub-sub-1.id, aws_subnet.two-tier-pub-sub-2.id]

  tags = {
    Environment = "two-tier-lb"
  }
}

resource "aws_lb_target_group" "two-tier-lb-tg" {
  name     = "two-tier-lb-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.two-tier-vpc.id

  depends_on = [aws_vpc.two-tier-vpc]
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

#attach resources to target group
resource "aws_lb_target_group_attachment" "two-tier-tg-attach-1" {
    target_group_arn = aws_lb_target_group.two-tier-lb-tg.arn
    target_id = aws_instance.
    port = 80
}

resource "aws_lb_target_group_attachment" "two-tier-tg-attch-2" {
  target_group_arn = aws_lb_target_group.two-tier-loadb_target.arn
  target_id        = aws_instance.two-tier-web-server-2.id
  port             = 80
}







#configure load balancer
# step 1 configure target group - can select ec2 
# https://achinthabandaranaike.medium.com/how-to-deploy-a-two-tier-architecture-in-aws-using-terraform-a4fd0f2e19ae
# https://towardsaws.com/how-to-deploy-two-tier-aws-architecture-with-terraform-59db7b11dd47

