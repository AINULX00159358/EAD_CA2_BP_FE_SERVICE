eval $(minikube docker-env)
docker build --no-cache --tag eadca2/bpfeapplication:v1 .
docker images
helm package helm/.
