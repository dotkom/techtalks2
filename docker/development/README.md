# Tech talks docker-compose for development

## Intention

Avoid having to setup anything to work on it. Just `docker-compose up` from this folder and you are golden. 

## Requirements

 * Docker
 * docker-compose if that is something you have to install seperately
 * Linux containers enabled, if you are on windows

You might get issues due to windows line endings. If so, try changing git to always use unix line endings.

## Files

 * `docker-compose.yml` - the docker-compose file
 * `sql` - perisistent content from the sql container

## Containers

 * `mysql` - sql server. Is not exposed to the host, only to other containers
 * `adminer` - lightweight administration panel for administering mysql. Do not use in production, please
 * `server` - the server
 * `webui` - the react frontend process.