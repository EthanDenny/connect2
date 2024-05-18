/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "jqz1zb86y95753i",
    "created": "2024-05-18 00:59:55.749Z",
    "updated": "2024-05-18 00:59:55.749Z",
    "name": "edges",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "cl8d18tx",
        "name": "parent",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "ty1dhzrx959f82n",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "3m76o76n",
        "name": "child",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "ty1dhzrx959f82n",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("jqz1zb86y95753i");

  return dao.deleteCollection(collection);
})
