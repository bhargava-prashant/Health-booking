pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'prashantbhargava365'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/bhargava-prashant/Health-booking', branch: 'main', credentialsId: 'github-creds-id'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds-id', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh 'echo "$PASSWORD" | docker login -u "$USERNAME" --password-stdin'
                }
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                script {
                    def services = ['client', 'admin-service', 'doctor-service', 'booking-service', 'auth-service']
                    
                    for (svc in services) {
                        echo "Building ${svc}..."
                        sh "docker build -t ${DOCKERHUB_USERNAME}/${svc}:latest ${svc}"
                        
                        echo "Pushing ${svc} to Docker Hub..."
                        sh "docker push ${DOCKERHUB_USERNAME}/${svc}:latest"
                    }
                }
            }
        }

        stage('Run Updated Containers') {
            steps {
                script {
                    echo 'Removing old containers...'
                    def services = ['client', 'admin-service', 'doctor-service', 'booking-service', 'auth-service']
                    
                    for (svc in services) {
                        sh "docker rm -f ${svc} || true"
                    }

                    echo 'Starting new containers...'
                    for (svc in services) {
                        sh "docker run -d --name ${svc} ${DOCKERHUB_USERNAME}/${svc}:latest"
                    }
                }
            }
        }
    }
}
