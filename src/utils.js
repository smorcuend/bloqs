var utils = utils || {};
var connectionThreshold = 20; // px
utils.moveBloq = function(bloq, location) {
    "use strict";
    bloq.x(location.x);
    bloq.y(location.y);
};
utils.moveBloq2 = function(bloq, delta) {
    "use strict";
    bloq.x(bloq.x() + delta.x);
    bloq.y(bloq.y() + delta.y);
    bloq.connections = utils.updateConnectors(bloq, delta);
};

function getRandomColor() {
    "use strict";
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
utils.addInput = function(bloq, posx, posy, type) {
    "use strict";
    var index = 0;
    if (bloq.connections.inputs !== undefined) {
        index = bloq.connections.inputs.length;
    } else {
        bloq.connections.inputs = [{}];
    }
    bloq.connections.inputs[index] = {
        connectionPosition: {
            x: posx,
            y: posy
        },
        connectorArea: {
            x1: posx - connectionThreshold,
            x2: posx + connectionThreshold,
            y1: posy,
            y2: posy + connectionThreshold
        },
        type: type,
        inline: true,
        movedDown: false,
        UI: canvas.group().rect(connectionThreshold * 2, connectionThreshold).attr({
            fill: getRandomColor()
        }).move(posx - connectionThreshold, posy)
    };
    bloq.inputsNumber = bloq.connections.inputs.length;
};
utils.createConnectors = function(bloq, bloqData) {
    "use strict";
    console.log('createConnectors');
    bloq.connections = {};
    if (bloqData.inputs) {
        bloq.connections.inputs = [{}];
        for (var i in bloqData.inputs) {
            i = parseInt(i, 10);
            bloq.connections.inputs[i] = {
                connectionPosition: {},
                connectorArea: {},
                type: ''
            };
            bloq.connections.inputs[i].connectionPosition = {
                x: bloq.x() + bloq.size.width,
                y: bloq.y() + i * connectionThreshold
            };
            bloq.connections.inputs[i].connectorArea = {
                x1: bloq.x() + bloq.size.width - connectionThreshold,
                x2: bloq.x() + bloq.size.width + connectionThreshold,
                y1: bloq.y() + i * connectionThreshold,
                y2: bloq.y() + i * connectionThreshold + connectionThreshold
            };
            bloq.connections.inputs[i].type = bloqData.inputs[i];
            bloq.connections.inputs[i].movedDown = false;
            //Update bloq's size
            utils.resizeBloq(bloq, {
                x: 0,
                y: connectionThreshold
            });
            bloq.connections.inputs[i].UI = canvas.group().rect(connectionThreshold * 2, connectionThreshold).attr({
                fill: getRandomColor()
            }).move(bloq.x() + bloq.size.width - connectionThreshold, bloq.y() + i * connectionThreshold);
        }
    }
    if (bloqData.output) {
        bloq.connections.output = {
            connectionPosition: {},
            connectorArea: {},
            type: bloqData.output
        };
        bloq.connections.output.connectionPosition = {
            x: bloq.x(),
            y: bloq.y()
        };
        bloq.connections.output.connectorArea = {
            x1: bloq.x() - connectionThreshold,
            x2: bloq.x() + connectionThreshold,
            y1: bloq.y(),
            y2: bloq.y() + connectionThreshold
        };
        bloq.connections.output.UI = canvas.group().rect(connectionThreshold * 2, connectionThreshold).attr({
            fill: '#FFCC33'
        }).move(bloq.x() - connectionThreshold, bloq.y());
    }
    if (bloqData.up) {
        bloq.connections.up = {
            connectionPosition: {},
            connectorArea: {}
        };
        bloq.connections.up.connectionPosition = {
            x: bloq.x(),
            y: bloq.y()
        };
        bloq.connections.up.connectorArea = {
            x1: bloq.x(),
            x2: bloq.x() + connectionThreshold,
            y1: bloq.y() - connectionThreshold,
            y2: bloq.y() + connectionThreshold
        };
        bloq.connections.up.UI = canvas.group().rect(connectionThreshold, connectionThreshold * 2).attr({
            fill: '#000'
        }).move(bloq.x(), bloq.y() - connectionThreshold);
    }
    if (bloqData.down) {
        bloq.connections.down = {
            connectionPosition: {},
            connectorArea: {}
        };
        bloq.connections.down.connectionPosition = {
            x: bloq.x(),
            y: bloq.y() + bloq.size.height
        };
        bloq.connections.down.connectorArea = {
            x1: bloq.x(),
            x2: bloq.x() + connectionThreshold,
            y1: bloq.y() + bloq.size.height - connectionThreshold,
            y2: bloq.y() + bloq.size.height + connectionThreshold
        };
        bloq.connections.down.UI = canvas.group().rect(connectionThreshold, connectionThreshold * 2).attr({
            fill: '#000'
        }).move(bloq.x(), bloq.y() + bloq.size.height - connectionThreshold);
    }
    return bloq.connections;
};
/**
 * Updates de position of the connectors of a bloq (used after modifying the bloq's position)
 * @param bloq
 */
utils.updateConnectors = function(bloq, delta) {
    "use strict";
    for (var type in bloq.connections) {
        if (bloq.connections[type] && type === 'inputs') {
            for (var i in bloq.connections[type]) {
                bloq.connections[type][i].connectionPosition.x += delta.x;
                bloq.connections[type][i].connectionPosition.y += delta.y;
                bloq.connections[type][i].connectorArea.x1 += delta.x;
                bloq.connections[type][i].connectorArea.x2 += delta.x;
                bloq.connections[type][i].connectorArea.y1 += delta.y;
                bloq.connections[type][i].connectorArea.y2 += delta.y;
                bloq.connections[type][i].UI.move(bloq.connections[type][i].UI.x() + delta.x, bloq.connections[type][i].UI.y() + delta.y);
            }
        } else if (bloq.connections[type]) {
            bloq.connections[type].connectionPosition.x += delta.x;
            bloq.connections[type].connectionPosition.y += delta.y;
            bloq.connections[type].connectorArea.x1 += delta.x;
            bloq.connections[type].connectorArea.x2 += delta.x;
            bloq.connections[type].connectorArea.y1 += delta.y;
            bloq.connections[type].connectorArea.y2 += delta.y;
            bloq.connections[type].UI.move(bloq.connections[type].UI.x() + delta.x, bloq.connections[type].UI.y() + delta.y);
        }
    }
    return bloq.connections;
};
utils.updateConnector = function(connector, delta) {
    "use strict";
    connector.connectionPosition.x += delta.x;
    connector.connectionPosition.y += delta.y;
    connector.connectorArea.x1 += delta.x;
    connector.connectorArea.x2 += delta.x;
    connector.connectorArea.y1 += delta.y;
    connector.connectorArea.y2 += delta.y;
    connector.UI.move(connector.UI.x() + delta.x, connector.UI.y() + delta.y);
    return connector;
};
utils.oppositeConnection = {
    inputs: 'output',
    output: 'inputs',
    up: 'down',
    down: 'up'
};
utils.manageConnections = function(type, bloq1Connection, bloq2Connection, bloq1, bloq2, inputID) {
    "use strict";
    if (bloq2Connection !== undefined && bloq1Connection !== undefined) {
        if (bloq1.itsOver(bloq1Connection.connectorArea, bloq2Connection.connectorArea)) {
            if (bloq1Connection.type === bloq2Connection.type) { // if the type is the same --> connect
                var deltaParent = {
                    x: bloq1Connection.connectorArea.x1 - bloq2Connection.connectorArea.x1,
                    y: bloq1Connection.connectorArea.y1 - bloq2Connection.connectorArea.y1
                };
                var deltaChild = {
                    x: bloq2Connection.connectorArea.x1 - bloq1Connection.connectorArea.x1,
                    y: bloq2Connection.connectorArea.y1 - bloq1Connection.connectorArea.y1
                };
                if (type === 'inputs' || type === 'down') { // parent is bloq1
                    //move bloq
                    utils.moveBloq(bloq2, bloq1.getConnectionPosition(type, bloq2, inputID));
                    bloq2.connections = utils.updateConnectors(bloq2, deltaParent);
                    bloq1.updateBloqs(bloq1, bloq2, utils.oppositeConnection[type], inputID);
                    bloq1Connection.bloq = bloq2;
                    //move bloq's children
                    utils.moveChildren(bloq2, deltaParent);
                } else { //parent is bloq2
                    //move bloq
                    utils.moveBloq(bloq1, bloq2.getConnectionPosition(utils.oppositeConnection[type], bloq1, inputID));
                    bloq1.connections = utils.updateConnectors(bloq1, deltaChild);
                    bloq1.updateBloqs(bloq2, bloq1, type, inputID);
                    bloq2Connection.bloq = bloq1;
                    //move bloq's children
                    utils.moveChildren(bloq1, deltaChild);
                }
                bloq1.delta.lastx = 0;
                bloq1.delta.lasty = 0;
                return true;
            } else { //reject
                utils.rejectBloq(bloq1);
                bloq1.delta.lastx = 0;
                bloq1.delta.lasty = 0;
            }
        } else {
        }
    }
    return false;
};
utils.rejectBloq = function(bloq) {
    "use strict";
    var rejectionLocation = {
        x: 50,
        y: 0
    };
    utils.moveBloq2(bloq, {
        x: rejectionLocation.x,
        y: rejectionLocation.y
    });
};
utils.moveChildren = function(bloq, delta) {
    "use strict";
    for (var i in bloq.relations.children) {
        var child = bloq.relations.children[i].bloq;
        utils.moveBloq2(child, delta);
        if (child.relations !== undefined && child.relations.children !== undefined) {
            utils.moveChildren(child, delta);
        }
    }
};
/**
 * Resize a bloq and update its down connector, if any
 * @param bloq
 * @param delta
 */
utils.resizeBloq = function (bloq, delta) {
    "use strict";
    // bloq.transform('matrix', '1.5,0,0,1,0,0');
    // bloq.transform('matrix', '1.5,0,0,1,0,0');


    console.log('bloq.size before', bloq.size);
    bloq.size.width += delta.x;
    bloq.size.height += delta.y;

    console.log('bloq.size after', bloq.size);

    bloq.body.size(bloq.size.width, bloq.size.height);
    // bloq.border.size(bloq.size.width, bloq.size.height);
    // //bloq.selection.size(bloq.size.width, bloq.size.height);

    //update down connector:
    if (bloq.connections.down !== undefined) {
        utils.updateConnector(bloq.connections.down, {
            x: 0,
            y: delta.y
        });
    }
};
utils.moveConnector = function(bloq, connection, delta) {
    "use strict";
    console.log('move connector');
    //Move connector 
    connection = utils.updateConnector(connection, delta);
    //If there is a bloq connected, move the bloq also
    if (connection.bloq !== undefined) {
        var bloqConnected = connection.bloq;
        utils.moveBloq2(bloqConnected, delta);
    }
    //Update bloq's size
    utils.resizeBloq(bloq, delta);
};
utils.bloqOnTop = function(bloq) {
    "use strict";
    bloq.node.parentNode.appendChild(bloq.node);
    var child = {};
    for (var i in bloq.relations.children) {
        child = bloq.relations.children[i].bloq;
        child.node.parentNode.appendChild(child.node);
    }
};
utils.pushElements = function(bloq, UIElement, delta) {
    "use strict";
    var elements = UIElement.elementsToPush;
    for (var j in elements) {
        elements[j].bloq.x(elements[j].bloq.x() + delta.x);
        elements[j].bloq.y(elements[j].bloq.y() + delta.y);
        var connector = elements[j].connector;
        if (connector !== undefined) {
            utils.moveConnector(bloq, connector, delta);
        }
    }
};
utils.appendUserInput = function(bloq, inputText, type, posx, posy, id) {
    var text = bloq.foreignObject(100, 100).attr({
        id: 'fobj',
        color: '#FFCC33'
    });
    text.appendChild("input", {
        id: id,
        value: inputText,
        color: '#FFCC33',
    }).move(posx, posy);
    bloq.UIElements.push({
        element: text,
        elementsToPush: undefined
    });
    var code;
    if (type === 'number') {
        code = document.getElementById(id).value;
    } else {
        code = '"' + document.getElementById(id).value + '"';
    }
    bloq.relations.inputChildren[id] = {
        id: id,
        bloq: 'userInput',
        code: code
    };
    document.getElementById(id).addEventListener("mousedown", function(e) {
        e.stopPropagation();
    }, false);
    //Check that the input of the user is the one spected
    document.getElementById(id).addEventListener("change", function() {
        if (type === 'number') {
            if (isNaN(parseFloat(document.getElementById(id).value))) {
                //If type is number and input is not a number, remove user input. 
                //ToDo : UX warning!
                document.getElementById(id).value = '';
            } else {
                bloq.relations.inputChildren[id].code = document.getElementById(id).value;
            }
        } else {
            bloq.relations.inputChildren[id].code = '"' + document.getElementById(id).value + '"';
        }
    }, false);
};
utils.appendDropdownInput = function(bloq, dropdown_text, type, posx, posy, id) {
    var dropdown = bloq.foreignObject(100, 100).attr({
        id: id,
        color: '#FFCC33'
    });
    var newList = document.createElement("select");
    for (var i in dropdown_text) {
        var newListData = new Option(dropdown_text[i].label, dropdown_text[i].value);
        //Here we append that text node to our drop down list.
        newList.appendChild(newListData);
    }
    //Append the list to dropdown foreignobject:
    dropdown.appendChild(newList).move(posx, posy);
    bloq.UIElements.push({
        element: dropdown,
        elementsToPush: undefined
    });

    bloq.relations.inputChildren[id] = {
        id: id,
        bloq: 'userInput',
        code: newList.value
    };
    newList.onchange = function(){
        bloq.relations.inputChildren[id].code = newList.value;
    }
};
utils.appendBloqInput = function(bloq, inputText, type, posx, posy) {
    //draw white (ToDo: UX) rectangle
    var bloqInput = bloq.rect(bloq.bloqInput.width, bloq.bloqInput.height).attr({
        fill: '#fff'
    }).move(posx, posy);
    utils.addInput(bloq, bloq.x() + posx, bloq.y() + posy, type); //bloq.x()+posx + width, bloq.x()+posy + i * connectionThreshold);
    bloq.UIElements.push({
        element: bloqInput,
        elementsToPush: undefined,
        id: bloq.connections.inputs.length - 1,
        connector: bloq.connections.inputs[bloq.connections.inputs.length - 1]
    });
};
utils.createBloqUI = function(bloq, bloqData) {
    console.log('createBloqUI');
    var margin = 10;
    var posx = margin;
    var width = 0;
    var posy = margin;
    var inputID = 0;
    bloq.UIElements = [{}];
    for (var j in bloqData.text) {
        for (var i in bloqData.text[j]) {
            if (typeof(bloqData.text[j][i]) === typeof({})) {
                if (bloqData.text[j][i].input === 'userInput') {
                    utils.appendUserInput(bloq, bloqData.text[j][i].label, bloqData.text[j][i].type, posx, posy, inputID);
                    inputID += 1;
                    posx += 110;
                } else if (bloqData.text[j][i].input === 'bloqInput') {
                    utils.appendBloqInput(bloq, bloqData.text[j][i].label, bloqData.text[j][i].type, posx, posy);
                    inputID += 1;
                    posx += 110;
                } else if (bloqData.text[j][i].input === 'dropdown') {
                    utils.appendDropdownInput(bloq, bloqData.text[j][i].data, bloqData.text[j][i].type, posx, posy, inputID)
                    inputID += 1;
                    posx += 110;
                }
            } else {
                var text = bloq.text(bloqData.text[j][i]).font({
                    family: 'Helvetica',
                    fill: '#fff',
                    size: 14
                }).move(posx, posy);
                posx += bloqData.text[j][i].length * 5 + 30;
                bloq.UIElements.push({
                    element: text,
                    elementsToPush: undefined
                });
            }
        }
        if (posx > width) {
            width = posx;
        }
        posx = margin;
        posy += 40;
    }
    bloq.UIElements.shift();
    //Add the elements that must be pushed
    for (var i in bloq.UIElements) {
        bloq.UIElements[i].elementsToPush = [{}];
        for (var j in bloq.UIElements) {
            if (j > i) {
                bloq.UIElements[i].elementsToPush.push({
                    bloq: bloq.UIElements[j].element,
                    connector: bloq.UIElements[j].connector
                });
            }
        }
        bloq.UIElements[i].elementsToPush.shift();
    }

    console.log('size:',  bloq.size.width,width,bloq.size.height, posy, bloq.size.width - width, bloq.size.height - posy, bloq);
    //Update bloq's size
    utils.resizeBloq(bloq, {
        x: width - bloq.size.width ,
        y: posy - bloq.size.height 
    });
};


utils.getBloqPath = function(bloq, bloqData){
    var path = "m 0,8 A 8,8 0 0,1 8,0 H 15 l 6,4 3,0 6,-4 H 217.11582946777344 v 5 c 0,10 -8,-8 -8,7.5 s 8,-2.5 8,7.5 v 60 v 25 H 30 l -6,4 -3,0 -6,-4 H 8 a 8,8 0 0,1 -8,-8 z";
    // console.log('path.length()',path.length=300);

    if(bloqData.down){
        // if it has a down connection, it has to have an up one
        // lets see if it has inputs
        if(bloqData.hasOwnProperty('inputs') && bloqData.inputs.length > 0){
            // deal with the inputs
        } else {
            // this bloq has no inputs, only top and down
            path = 'M4.000,0.000 C4.000,0.000 321.000,0.000 321.000,0.000 C323.209,0.000 325.000,1.791 325.000,4.000 C325.000,4.000 325.000,46.000 325.000,46.000 C325.000,48.209 323.209,50.000 321.000,50.000 C321.000,50.000 4.000,50.000 4.000,50.000 C1.791,50.000 -0.000,48.209 -0.000,46.000 C-0.000,46.000 -0.000,4.000 -0.000,4.000 C-0.000,1.791 1.791,0.000 4.000,0.000 Z';
        }
        // deal with inner bottoms
        // deal with inner inputs
    } else if ((!bloqData.hasOwnProperty('down') || bloqData.down == false) && (!bloqData.hasOwnProperty('up') || bloqData.up == false)){
        // bloq without up or down connections
        // this means that we have at least an output
        if(bloqData.hasOwnProperty('inputs') && bloqData.inputs.length > 0){
            // deal with the inputs
            path = 'm 0,0 H 88.04196166992188 v 5 c 0,10 -8,-8 -8,7.5 s 8,-2.5 8,7.5 v 5 H 0 V 20 c 0,-10 -8,8 -8,-7.5 s 8,2.5 8,-7.5 z';
        } else {
            // this bloq has no inputs
            // absolute coordinates for path
            path = 'M256,50 C256,50 12,50 12,50 C9.791,50 8,48.209 8,46 C8,46 8,33 8,33 C3.582,33 0,29.418 0,25 C0,20.582 3.582,17 8,17 C8,17 8,4 8,4 C8,1.791 9.791,0 12,0 C12,0 256,0 256,0 C258.209,0 260,1.791 260,4 C260,4 260,46 260,46 C260,48.209 258.209,50 256,50 Z';
        }
    } else if (bloqData.up && !bloqData.hasOwnProperty('down')){
        // bloq with only top
    }
    return path;
};
