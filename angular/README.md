# todo-angular
Event sourcing based todo app with a local JSON database. I'm bored.

## Running instructions
You'll need the following things installed:
- [Angular CLI](https://angular.io/cli)
- [npm](https://www.npmjs.com)
- [NodeJS](https://nodejs.org/en/)

Open database folder and run ```npm install```. When required packages are downloaded, run ```npm run db``` to start JSON database server. It will use port 5000.

To change port number edit ```database/package.json``` under "scripts" section, and change ```DbUrl``` property in in ```todo-client/src/app/app.constants.ts```.

Open todo-client folder and run ```npm install```. When required packages are downloaded, run ```ng s -o``` to start the Angular app. It will run on the default development port 4200.

***

## Description
Though not fully finished, basic CRUD operations are working. This app is inspired by Git workflow.

You have two branches on which you can add/edit/remove Todos. Each action is tracked, and must be commited to be saved. Switching to a different branch without commiting changes first, will result in losing them.

When changes are commited, they are only commited locally. For full persistence, you need to "Push" them (analogous to pushing on a remote repository).

Since this is a simple database (no transactions), there is a possibility of error during HTTP request, and thus data corruption. The app should warn you if it fails to project events to the todo list.

## Unfinished business (Todo list :stuck_out_tongue:)
- Reverting back to a commit/change
- Branch manipulations (create/rename/delete)
- Merging branches