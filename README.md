# RanasDB

Easy browser-side database management for IndexedDB.

# What is `RanasDB`?

`RanasDB`, in the end, is just an interface for the stack:
  - `IndexedDB API`: the native HTML5 API.
  - `dexie`: the popular wrapper for `IndexedDB`.
  - `dexie-relationships`: a `dexie` addon to add relationships.

# How to use `ranas-db`?

This piece of code demonstrates how you can use `ranas-db` in 7 easy steps:

```js

// 1. Import the package:
const RanasDB = require("ranas-db");

// 2. (Optionally) Delete previous data and schema:
await RanasDB.dropDatabaseIfExists("My_first_database");

// 3. Connect (= create + initialize) to your database, and define all versions:
const db = await RanasDB.connect("My_first_database", [
    [
        {
            users: "++id,&name,password,&email,created_at,updated_at,picture_profile,personal_data,description",
            groups: "++id,&name,administrator,description,details,tags,created_at,updated_at",
            permissions: "++id,&name,description,details,tags,created_at,updated_at",
        },
        function() {}
    ], [
        {
            permissions_of_user: "++id,id_user -> users.id,id_permission -> permissions.id",
            permissions_of_group: "++id,id_group -> groups.id,id_permission -> permissions.id",
            groups_of_user: "++id,id_user -> users.id,id_group -> groups.id",
        },
        function() {}
    ]
], {
    debug: console.log // this is for debugging CRUD methods by console
});

// 4. Insert data:
const userXId = await db.insert("users", { name: "userX", password: "x", email: "userx@domain.com" });
const userYId = await db.insert("users", { name: "userY", password: "y", email: "usery@domain.com" });
const userZId = await db.insert("users", { name: "userZ", password: "z", email: "userz@domain.com" });

// 5. Update data:
await db.update("users", userXId, { name: "user X modified!" });
await db.update("users", userYId, { name: "user Y modified!" });
await db.update("users", userZId, { name: "user Z modified!" });

// 6. Delete data:
await db.delete("users", userYId);

// 7. Select data:
const allUsers = await db.select("users");

if(allUsers.length !== 2) {
    throw new Error("Users count should be 2, not " + allUsers.length);
}
```

# Why?

To make `IndexedDB` work, easier (so, `dexie`), with references (that is, `dexie-relationships`), and a simple but flexible enough API.

# License

No. **#NoLicense**.

# Changes

See changes on CHANGELOG.md file.
