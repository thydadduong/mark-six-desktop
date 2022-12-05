#!/bin/sh
if [ "$APP_MODE" == "prod" ]
then
    # Start server
    echo "Starting server"
    yarn start
else
    echo "In development mode"
fi
