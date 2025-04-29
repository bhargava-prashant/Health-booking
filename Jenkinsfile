pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = 'dockerhub-creds-id' // replace with your Jenkins credentials ID for Docker Hub
        GITHUB_CREDENTIALS = 'github-creds-id'         // replace with your Jenkins credentials ID for GitHub
        DOCKERHUB_USERNAME = 'prashantbhargava365'      // your Docker Hub username
    }

    stages {
        stage('Clone Repo') {
            steps {
                git credentialsId: "${GITHUB_CREDENTIALS}", url: 'https://github.com/bhargava-prashant/Health-booking' 
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                script {
                    def services = [
                        'doctor-service',
                        'booking-service',
                        'auth-service',
                        'client',
                        'admin-service'
                    ]

                    for (service in services) {
                        echo "Building and pushing ${service}"

                        // Build the docker image
                        sh "docker build -t ${DOCKERHUB_USERNAME}/${service}:latest ${service}"

                        // Login and Push
                        withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            sh """
                                echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                                docker push ${DOCKERHUB_USERNAME}/${service}:latest
                            """
                        }
                    }
                }
            }
        }
    }
}
