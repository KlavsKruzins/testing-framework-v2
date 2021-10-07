const AWS = require('aws-sdk');
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
class LexTester {

  constructor(access_token,access_key,key_id) {
    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: key_id,
      secretAccessKey: access_key,
      sessionToken: access_token
    });
    this.LexRuntime = new AWS.LexRuntime();
  }

/**
 * 
 * @param {string} inputText text to that would be sent to Bot 
 * @param {number|string} index unique identifier of user
 * @param {string} botName 
 * @param {string} botAlias 
 */
  postText = async (inputText, index, botName, botAlias) => (
  new Promise((resolve) => {
    this.LexRuntime.postText({
      botAlias,
      botName,
      inputText: inputText,
      userId: 'TestUser_' + index
    }, (error, data) => {
      if (error) {
        console.log('ERROR : ', index, error);
        resolve({ intentName: null });
      } else {
        console.log('TESTING : ', index, inputText, data.intentName);
        resolve(data);
      }
    });
}));
summarize = (results) => {
  const matches = results.reduce((acc, item) => (acc + (item.Match ? 1 : 0)), 0);
  const nulls = results.reduce((acc, item) => (acc + (item.NoAnswer ? 1 : 0)), 0);
  const len = results.length;
  const wrongs = len - matches - nulls;

  return [
    ...results,
    {
      Question: '',
      ExpectedIntent: '',
      ResultIntent: 'Correct Answers:',
      Match: `${matches} of ${len}`, 
      NoAnswer: `${(100 * matches / len).toFixed(2)} %`,
    },
    {
      Question: '',
      ExpectedIntent: '',
      ResultIntent: 'Wrong Answers:',
      Match: `${wrongs} of ${len}`, 
      NoAnswer: `${(100 * wrongs / len).toFixed(2)} %`,
    },
    {
      Question: '',
      ExpectedIntent: '',
      ResultIntent: 'No Answers:',
      Match: `${nulls} of ${len}`, 
      NoAnswer: `${(100 * nulls / len).toFixed(2)} %`,
    },
  ];
};

toLowerCase = (data, key) => data[key] ? data[key].toLowerCase() : data[key];

/**
 * 
 * @param {array} tests Array of test objects that contains Question and ExpectedIntent properties
 * @param {string} botName 
 * @param {string} botAlias 
 */
processTests = async (tests, botName, botAlias) => {
    const timeout = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
    const resolve = async (test, index) => {
      await timeout(Math.floor(Math.random() * 25000));
      return this.postText(test.Question, index, botName, botAlias)
        .then((result) => ({ 
          ...test,
          ResultIntent: result.intentName,
          Match: this.toLowerCase(result, 'intentName') === this.toLowerCase(test, 'ExpectedIntent') ? 1 : null,
          NoAnswer: result.intentName === null ? 1 : null,
        }));
    };
    return Promise.all(tests.map(resolve)).then(this.summarize);
  };



}

module.exports = { LexTester };

