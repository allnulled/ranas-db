# RanasDB

Easy browser-side database management for IndexedDB.

# What is `RanasDB`?

`RanasDB`, in the end, is just an interface for the stack:
  - `IndexedDB API`: the native HTML5 API.
  - `dexie`: the popular wrapper for `IndexedDB`.
  - `dexie-relationships`: a `dexie` addon to add relationships.

# How can I use it?

1. First, you import the framework:

```js
const RanasDB = require("ranas-db");
```

Or:

```js
import RanasDB from "ranas-db";
```

2. Second, you create a new `RanasDB` instance, specifying **name of database** and **historical versions**:

```js
const db = RanasDB.create("My_first_database", [{
    users: "++id,&name,password,&email,created_at,updated_at,picture_profile,personal_data,description",
    groups: "++id,&name,administrator,description,details,tags,created_at,updated_at",
    permissions: "++id,&name,description,details,tags,created_at,updated_at",
}]);
```

For new updates over the database, you only need to add a new object to the list with the design updates you want: **without removing the previous ones, yes**. For example:

```js
// With this line, the database will be restarted in every refresh!!!!
// Drop the line if you want to keep the changes in database!!!
RanasDB.dropDatabase("My_first_database");

//
const db = RanasDB.create("My_first_database", [{
    users: "++id,&name,password,&email,created_at,updated_at,picture_profile,personal_data,description",
    groups: "++id,&name,administrator,description,details,tags,created_at,updated_at",
    permissions: "++id,&name,description,details,tags,created_at,updated_at",
},{
    permissions_of_user: "++id,id_user -> users.id,id_permission -> permissions.id",
    permissions_of_group: "++id,id_group -> groups.id,id_permission -> permissions.id",
    groups_of_user: "++id,id_user -> users.id,id_group -> groups.id",
}], {
    debug: console.log // this is for debugging CRUD methods by console
});
```

3. Third, you need to initialize the database instance. This will define versions for `dexie`:

```js
await db.initialize();
```

4. Fourth, you can starting CRUDing freely:

```js
await db.select(table, filter, joins); // (result:Array)
await db.insert(table, item);         // (id:Number)
await db.update(table, id, value);   // (success:Boolean)
await db.delete(table, id);         // (success:Boolean)
```

So, put altogether, and using `connect` instead of `create`+`initialize`, it looks like this:

```js
const RanasDB = require("ranas-db");

await RanasDB.dropDatabase("My_first_database");

const db = await RanasDB.connect("My_first_database", [{
    users: "++id,&name,password,&email,created_at,updated_at,picture_profile,personal_data,description",
    groups: "++id,&name,administrator,description,details,tags,created_at,updated_at",
    permissions: "++id,&name,description,details,tags,created_at,updated_at",
},{
    permissions_of_user: "++id,id_user -> users.id,id_permission -> permissions.id",
    permissions_of_group: "++id,id_group -> groups.id,id_permission -> permissions.id",
    groups_of_user: "++id,id_user -> users.id,id_group -> groups.id",
}], {
    debug: console.log // this is for debugging CRUD methods by console
});

const userXId = await db.insert("users", { name: "userX", password: "x", email: "userx@domain.com" });
const userYId = await db.insert("users", { name: "userY", password: "y", email: "usery@domain.com" });
const userZId = await db.insert("users", { name: "userZ", password: "z", email: "userz@domain.com" });

await db.update("users", userXId, { name: "user X modified!" });
await db.update("users", userYId, { name: "user Y modified!" });
await db.update("users", userZId, { name: "user Z modified!" });

await db.delete("users", userYId);

const allUsers = await db.select("users");

if(allUsers.length !== 2) {
    throw new Error("Users count should be 2, not " + allUsers.length);
}
```