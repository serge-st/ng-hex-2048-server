pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/serge-st/ng-hex-2048-server.git'
            }
        }
        stage('Build') {
            steps {
                sh 'pnpm build:cicd'
            }
        }
    }
}