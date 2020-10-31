/**
 * Team members: 
 * Jacob Azevedo Jr. - jacobazevedojr@gmail.com
 * Stephanie Lim - hynglim@gmail.com
 * Tony Ha - tony.ha@student.csulb.edu
 * William Duong - wxduong@gmail.com
 * 
 * Program Description: Routing of web pages and input handling.
 */

// BUILT IN MODULES OFFERED BY NODEJS
const express = require('express');
const router = express.Router();

// IMPORT EXTRA FUNCTIONS FROM 'scratch.js' (LIKE C-HEADER FILES)
const repo = require('./scratch');
const handlers = require('./handlers');

// STORE USER INPUT FROM WEB-BROWSER/'CLI' AS GLOBAL VARIABLE
global.userInput;

// HANDLER FOR 'execute' BUTTON ON LANDING PAGE
router.post('/executeCMD', (req, resp) => {
    // 'body-parser' SEARCHES THROUGH PAGE FOR CORRESPONDING ELEMENT NAME
    userInput = req.body.input_field_cmd.split(' ');
    let fArray = new Map();
    // JstLabels is the labels tracker, commands that could utilize labels could use the built-in JS Map functions
    // let jstLabels = new Map();

    switch (userInput[0])
    {
        case 'create':
            handlers.create_repo(fArray);
            resp.render('responsePage', {dispType: 'cr-console', okFiles: fArray, userCMD: userInput});
            break;
        case 'rebuild':
            handlers.check_out(resp);
            break;
        case 'log':
            // TODO Modify log function to show associated labels
            let results = handlers.log();
            resp.render('responsePage', {dispType: 'lg-console', log: results});
            break;
        case 'update':
            let update = handlers.boolUpdate();
            if(update){
                handlers.update(fArray);
                resp.render('responsePage', {dispType: 'cr-console', okFiles: fArray, userCMD: userInput});
                break;
            }
            else{
                resp.render('responsePage', {dispType: 'path-error'});
                break;
            }
        // user input arguments: 1 = JSTWepo's path, 2 = manifest file name, 3 = label
        case 'label':
            // User scenario: After several tedious typing of the manifest path to use this VCS program. User decides it is much better if he/she
            // have a shortened reference to any particular snapshot that reside in the repo.
            jstLabels = handlers.generateLabelsMap(userInput[1]);
            // Debugging: Check generated map
            console.log('JSTLabels size: ' + jstLabels.size);
            for (let [key, value] of jstLabels) {
                console.log(key + ' : ' + value);
            }
            console.log();
            // End of Debugging section
            handlers.createLabel(jstLabels);
            // TODO implement ejs for the web page
            resp.render('responsePage', { dispType: 'syn-error', userCMD: userInput });
            break;
        default:
            resp.render('responsePage', { dispType: 'syn-error', userCMD: userInput });
    }
})

// BASIC HANDLER FOR DEFAULT PAGE
router.get('/', (req, resp) => {
    resp.render('responsePage', {dispType: 'blank'});
})

module.exports = router;
