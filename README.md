Fitness Tracker Demo
====================

Fitness Tracker Demo is a Polymer-based client-side demo application, which
uses elements from the [Polymer Catalog](https://elements.polymer-project.org/), [Vaadin Grid](http://vaadin.com/components) and [Vaadin Charts](http://vaadin.com/charts). Icons used in this demo are provided by [Icons8](https://icons8.com/).

![](screenshot.png)

Backend
-------

The client-side application uses static JSON files as its "backend". These files are located
in ```app/data``` directory. In the same directory you will also find a Node script
that can be used to generate more example data. It could also be easily modified
to a Node-based REST API.

Development
-----------

Clone this repository and run the following command(s) to start the application
for development.

```npm install && bower install && gulp```


Deployment
----------

Clone this repository and run the following command(s) to package the application
for deployment.

```npm install && bower install && gulp dist```

This will result in a distributable application in the ```dist``` subdirectory.
