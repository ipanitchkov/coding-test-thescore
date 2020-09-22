#!/bin/bash
clear
echo Importing players from a file...
curl -H "Content-type: application/json" --data-binary @rushing.json http://localhost:3000/api/v1/players/import
echo Importing players from a file completed