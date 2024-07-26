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
        stage('Test') {
            steps {
                sh 'pnpm lint'
                sh 'pnpm test'
                sh 'pnpm test:e2e'
            }
        }
        stage('Deploy') {
            steps {
                script {
                    sourceDir = "./*"
                    destDir = "/opt/services/ng-hex-2048-server"
                }
                sh "cp -ap ${sourceDir} ${destDir}"
            }
        }
    }
}