pipeline {
    agent any

    stages {
        stage('Run Updated Containers') {
            steps {
                script {
                    echo 'Running updated containers...'
                    
                    // Remove existing containers
                    sh 'docker rm -f client || true'
                    sh 'docker rm -f admin-service || true'
                    sh 'docker rm -f doctor-service || true'
                    sh 'docker rm -f booking-service || true'
                    sh 'docker rm -f auth-service || true'

                    // Run updated containers
                    sh 'docker run -d --name client prashantbhargava365/client:latest'
                    sh 'docker run -d --name admin-service prashantbhargava365/admin-service:latest'
                    sh 'docker run -d --name doctor-service prashantbhargava365/doctor-service:latest'
                    sh 'docker run -d --name booking-service prashantbhargava365/booking-service:latest'
                    sh 'docker run -d --name auth-service prashantbhargava365/auth-service:latest'
                }
            }
        }
    }
}
