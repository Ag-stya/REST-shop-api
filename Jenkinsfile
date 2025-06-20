pipeline {
    agent any

    environment {
        TRIVY_REPORT = "trivy-fs-report.txt"
        SONAR_HOME = tool "Sonar"
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo '🔄 Cloning code from GitHub...'
                git url: 'https://github.com/Ag-stya/REST-shop-api.git', branch: 'main'
            }
        }

        stage('SonarQube Quality Analysis') {
            steps {
                echo '🔍 Running SonarQube scan...'
                withSonarQubeEnv("Sonar") {
                    sh "$SONAR_HOME/bin/sonar-scanner -Dsonar.projectName=RESTapi -Dsonar.projectKey=RESTapi -Dsonar.sources=."
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing Node dependencies...'
                sh 'npm install'
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                echo '🛡️ Running OWASP Dependency Check...'
                dependencyCheck additionalArguments: "--scan ./", odcInstallation: "dc"
                dependencyCheckPublisher pattern: "**/dependency-check-report.xml"
            }
        }

        stage('Sonar Quality Gate') {
            steps {
                timeout(time: 5, unit: "MINUTES") {
                    waitForQualityGate abortPipeline: false
                }
            }
        }
        stage('Debug Trivy') {
            steps {
                echo '🔎 Verifying Trivy binary and version in Jenkins...'
                sh 'which trivy'
                sh 'trivy --version'
                sh 'trivy fs --help'
            }
        }
            
            
              


        stage('Trivy File System Scan') {
            steps {
                echo '🔍 Running Trivy Scan...'
                sh '/usr/bin/trivy fs . --format table --output trivy-fs-report.txt'
            }
        }

        stage("Deploy using Docker Compose") {
            steps {
                script {
                    if (fileExists('docker-compose.yml')) {
                        echo '🚀 Deploying using Docker Compose...'
                        sh 'docker-compose up -d'
                    } else {
                        echo '⚠️ Skipping deployment — docker-compose.yml not found.'
                    }
                }
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up workspace...'
            cleanWs()
        }
    }
}
