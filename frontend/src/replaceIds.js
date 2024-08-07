/*
 * XXX: Looks like this was just for testing/hacking and isn't used anywhere.
 */
const uuid = require('uuid');
const uuid4 = uuid.v4;

const DATA = JSON.parse(`{
  "type": "group",
  "id": "99ab8a8b-4567-489a-bcde-f17c26c2c7ff",
  "children1": {
    "888b88ba-4567-489a-bcde-f17c26c5061e": {
      "type": "group",
      "properties": {
        "conjunction": "AND"
      },
      "children1": {
        "9b9bbab9-89ab-4cde-b012-317c26c2c7fe": {
          "type": "rule",
          "properties": {
            "field": "entityType",
            "operator": "multiselect_equals",
            "value": [
              [
                "Topic"
              ]
            ],
            "valueSrc": [
              "value"
            ],
            "valueType": [
              "multiselect"
            ],
            "valueError": [
              null
            ]
          }
        },
        "a89a9a89-0123-4456-b89a-b17c26c3151e": {
          "type": "rule",
          "properties": {
            "field": "analyticsCat",
            "operator": "multiselect_equals",
            "value": [
              [
                "AMedia"
              ]
            ],
            "valueSrc": [
              "value"
            ],
            "valueError": [
              null
            ],
            "valueType": [
              "multiselect"
            ]
          }
        }
      }
    },
    "aa8aa8ab-cdef-4012-b456-717c26c5721e": {
      "type": "rule",
      "properties": {
        "field": "isEntity",
        "operator": "multiselect_not_equals",
        "value": [
          [
            "_Topic_television"
          ]
        ],
        "valueSrc": [
          "value"
        ],
        "valueError": [
          null
        ],
        "valueType": [
          "multiselect"
        ]
      }
    }
  },
  "properties": {
    "conjunction": "AND",
    "not": false
  }
}`);

const hexPat = count => `[a-f0-9]{${count}}`;
const uuidPat = [8, 4, 4, 4, 12].map(n => hexPat(n)).join('-');
const keyPat = String.raw`^\s+"(` + uuidPat + ')": {$';
const valPat = String.raw`^\s+"id": "(` + uuidPat + ')",$';
const idPat = `${keyPat}|${valPat}`;

const replaceIds = (tree, newIdFn) => {
  // 1. collect all the uuids using regex
  // 2. create map old => new
  // 3. string-replace all mappings one by one
  // 4. parse back replaced string and return result
  const strTree = JSON.stringify(tree, null, 2);
  return Array.from(
    new Set(
      Array.from(strTree.matchAll(new RegExp(idPat, 'gm')), m => m[1] || m[2]),
    ),
  )
    .map(oldId => [oldId, newIdFn()])
    .reduce((acc, [oldId, newId]) => acc.replace(oldId, newId), strTree);
};

const replaceIdsWithUUID = tree => JSON.parse(replaceIds(tree, uuid4));
const neutralizeIds = tree =>
  replaceIds(tree, () => 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

process.stdout.write(JSON.stringify(replaceIdsWithUUID(DATA), null, 2));
process.stdout.write(neutralizeIds(DATA));
