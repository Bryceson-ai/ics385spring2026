{
  "info": {
    "_postman_id": "9f5f8b3d-88f5-43a3-9864-8ef4e8ff0b43",
    "name": "Week11 CRUD Routes",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "GET /properties",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/properties?format=json&island=Maui&minRating=3",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["properties"],
          "query": [
            { "key": "format", "value": "json" },
            { "key": "island", "value": "Maui" },
            { "key": "minRating", "value": "3" }
          ]
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "type": "text/javascript",
            "exec": [
              "pm.test('Status is 200', function () {",
              "  pm.response.to.have.status(200);",
              "});",
              "",
              "const data = pm.response.json();",
              "pm.test('Response is an array', function () {",
              "  pm.expect(Array.isArray(data)).to.eql(true);",
              "});",
              "",
              "if (Array.isArray(data) && data.length > 0 && data[0]._id) {",
              "  pm.collectionVariables.set('propertyId', data[0]._id);",
              "}"
            ]
          }
        }
      ],
      "response": []
    },
    {
      "name": "GET /properties/:id",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/properties/{{propertyId}}",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["properties", "{{propertyId}}"]
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "type": "text/javascript",
            "exec": [
              "pm.test('Status is 200', function () {",
              "  pm.response.to.have.status(200);",
              "});",
              "",
              "const data = pm.response.json();",
              "pm.test('Property has id', function () {",
              "  pm.expect(data).to.have.property('_id');",
              "});"
            ]
          }
        }
      ],
      "response": []
    },
    {
      "name": "POST /properties/:id/reviews",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"guestName\": \"Bryce Student\",\n  \"rating\": 5,\n  \"comment\": \"Excellent stay with ocean views and friendly staff.\"\n}"
        },
        "url": {
          "raw": "http://localhost:3000/properties/{{propertyId}}/reviews",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["properties", "{{propertyId}}", "reviews"]
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "type": "text/javascript",
            "exec": [
              "pm.test('Status is 201', function () {",
              "  pm.response.to.have.status(201);",
              "});",
              "",
              "const data = pm.response.json();",
              "pm.test('Review added message present', function () {",
              "  pm.expect(data).to.have.property('message');",
              "});"
            ]
          }
        }
      ],
      "response": []
    }
  ],
  "variable": [
    {
      "key": "propertyId",
      "value": "REPLACE_WITH_REAL_PROPERTY_ID"
    }
  ]
}
