

/**
 * Function for filtering through lexJson and getting intent names
 * @param lexJson - exported JSON file from AWS LEX console
 * @param path - path for saving intent list. By default in the project root directory.
 * @return - results saved as a intentList.json
 */
function createIntentList (lexJson) {

  if (typeof(lexJson) === 'object' && lexJson.resource && lexJson.resource.intents) {
    let intents = lexJson.resource.intents;

    if (intents.length && Object.keys(intents[0])) {
      const intentNames = Object.keys(intents[0]).filter( key => ['name'].includes(key));

      if (intentNames.length) {
        try {
          const intentNames = intents.map(row => row['name']);
          return intentNames;
        }
        catch (error) {
          throw error;
        }
      } else {
        throw new Error ('Missing intent data');
      }
    } else {
      throw new Error('Missing intent data');
    }
  } else {
    throw new Error('Invalid file');
  }
}

module.exports = {createIntentList};