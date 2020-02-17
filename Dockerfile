# Use an official Ubuntu as a parent image
FROM ubuntu:18.04

# Switch to root
USER root

# Install additional software
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y --no-install-recommends \
  apt-utils \
  apt-transport-https \
  ca-certificates \
  nano \
  wget \
  curl \
  zip \
  build-essential \
  git \
  gnupg \
  openssh-client
RUN apt-get -y clean
RUN rm -rf /var/lib/apt/lists/*

# Create user and switch to it
RUN useradd -m -s /bin/bash user
USER user
WORKDIR /home/user

# Change default shell to bash
SHELL ["/bin/bash", "-i", "-c"]

# Install nvm and node
RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash \
  && source "/home/user/.nvm/nvm.sh"
RUN nvm install 12.15.0
RUN npm install -g npm@latest
RUN nvm use 12.15.0

## Create new workdir
USER root
RUN mkdir /var/www
RUN chown -R user:user /var/www
USER user

# Install the project
RUN mkdir /var/www/api
COPY --chown=user:user . /var/www/api
WORKDIR /var/www/api
RUN npm install

# add an empty .env file, all environment variables will be present in the docker-compose file
RUN touch .env

# Run the project
ENTRYPOINT npm start
