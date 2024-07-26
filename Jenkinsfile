pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'pnpm build:cicd'
            }
        }
        stage('Lint') {
            steps {
                sh 'pnpm lint'
            }
        }
        stage('Test Unit') {
            steps {
                sh 'pnpm test'
            }
        }
        stage('Test E2E') {
            steps {
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