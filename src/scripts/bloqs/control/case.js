/*global require */
'use strict';

var _ = require('lodash'),
    utils = require('./../../utils'),
    StatementInputBloq = require('./../statementInputBloq');

var bloq = _.merge(_.clone(StatementInputBloq, true), {
    name: 'case',
    content: [
        [{
            alias: 'text',
            value: 'si es igual a'
        }, {
            bloqInputId: 'VAR',
            alias: 'bloqInput',
            acceptType: 'all'
        }, {
            alias: 'text',
            value: 'ejecutar:'
        }
        ]
    ],
    code: 'case {VAR}:{{STATEMENTS}break;}'
});

utils.generateBloqInputConnectors(bloq);

module.exports = bloq;