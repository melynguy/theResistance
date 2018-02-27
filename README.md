# The Resistance

This repo contains code for a command-line application to manage political resistance actions.

##### Application Architecture #####
> In order to determine how my application would be architected, it went through many, many iterations. I first began coding the basic structure where I simply looked through ui.ts as well as the specs to see what functions there were and coded for those first in one class.
Then in order to achieve the principle of eperation and Concerns (Cohesion/Coupling) as well as the single responsibility principle I divided certain functions along with seperate concerns like getters and setters into a difference class that would specialize in a certain aspect of the program.
Also, since this application is for a resistance after all, I had to consider encapsulation and determine what fields in each class I wanted to make private (which was ofcourse everything, if not all). This also helped in the Law of Demeter where I (at least to the best of my knowledge last time I checked) never call a method on an object I recieve from another call (instead each class has getters/setters for information from each class if needed).
