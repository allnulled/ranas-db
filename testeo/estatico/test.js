QUnit.module("RanasDB Test", function() {
    const commonData = {
        db: undefined,
    };
    const testsFns = [
        () => QUnit.test("Preparación básica", async function(assert) {
            try {
                const done = assert.async();
                await RanasDB.Dexie.delete("BD_001");
                commonData.db = RanasDB.create("BD_001", [{
                    Sistema_de_ficheros: "++id, &subruta, tipo, padre -> Sistema_de_ficheros.id",
                    Sistema_de_hooks: "++id, hook, prioridad, configuraciones, contenido, publicador, autor, fecha, descripcion, url, detalles",
                }]);
                await commonData.db.initialize();
                assert.ok(true, "Preparacion de tests correcta");
                done();
            } catch (error) {
                console.error(error);
                assert.equal(false, true);
            }
        }),
        () => QUnit.test("~.create(...)", async function(assert) {
            try {
                const done = assert.async();
                assert.equal("function", typeof RanasDB, "Existe RanasDB como función");
                assert.equal("object", typeof commonData.db, "Existe 1 instancia de RanasDB (db) como objeto");
                assert.equal("function", typeof commonData.db.initialize, "La db puede initialize como función");
                assert.equal("function", typeof commonData.db.select, "La db puede select como función");
                assert.equal("function", typeof commonData.db.insert, "La db puede insert como función");
                assert.equal("function", typeof commonData.db.update, "La db puede update como función");
                assert.equal("function", typeof commonData.db.delete, "La db puede delete como función");
                done();
            } catch (error) {
                console.error(error);
                assert.equal(false, true);
            }
        }),
        () => QUnit.test("~#insert(...)", async function(assert) {
            try {
                const done = assert.async();
                await commonData.db.initialize();
                const result = await commonData.db.insert("Sistema_de_ficheros", { subruta: "/TODO.md", tipo: "F", padre: null });
                assert.equal("number", typeof result);
                done();
            } catch (error) {
                console.error(error);
                assert.equal(false, true);
            }
        }),
        () => QUnit.test("~#select(...)", async function(assert) {
            try {
                const done = assert.async();
                await commonData.db.initialize();
                const id1 = await commonData.db.insert("Sistema_de_ficheros", { subruta: "/docs", tipo: "D", padre: null });
                const id2 = await commonData.db.insert("Sistema_de_ficheros", { subruta: "/src", tipo: "D", padre: null });
                const id3 = await commonData.db.insert("Sistema_de_ficheros", { subruta: "/README.md", tipo: "F", padre: id1 });
                const id4 = await commonData.db.insert("Sistema_de_ficheros", { subruta: "/index.js", tipo: "F", padre: id2 });
                const id5 = await commonData.db.insert("Sistema_de_ficheros", { subruta: "/package.json", tipo: "F", padre: null });
                const resultado = await commonData.db.select("Sistema_de_ficheros");
                assert.equal(6, resultado.length, "Los registros insertados permanecen");
                commonData.insertedIds = [id1, id2, id3, id4, id5];
                done();
            } catch (error) {
                console.error(error);
                assert.equal(false, true);
            }
        }),
        () => QUnit.test("~#update(...)", async function(assert) {
            try {
                const done = assert.async();
                await commonData.db.initialize();
                const [ id1, id2, id3 ] = commonData.insertedIds;
                await commonData.db.update("Sistema_de_ficheros", id1, { subruta: "/documentation" });
                await commonData.db.update("Sistema_de_ficheros", id2, { subruta: "/source" });
                await commonData.db.update("Sistema_de_ficheros", id3, { subruta: "/NOTES.md" });
                const resultado = await commonData.db.select("Sistema_de_ficheros");
                assert.equal(6, resultado.length, "Los registros insertados permanecen");
                assert.equal(1, resultado.filter(it => it.subruta === "/documentation").length, "Los registros actualizados cambiaron (1)");
                assert.equal(1, resultado.filter(it => it.subruta === "/source").length, "Los registros actualizados cambiaron (2)");
                assert.equal(1, resultado.filter(it => it.subruta === "/NOTES.md").length, "Los registros actualizados cambiaron (3)");
                done();
            } catch (error) {
                console.error(error);
                assert.equal(false, true);
            }
        }),
        () => QUnit.test("~#delete(...)", async function(assert) {
            try {
                const done = assert.async();
                await commonData.db.initialize();
                const [ id1, id2, id3, id4, id5 ] = commonData.insertedIds;
                await commonData.db.delete("Sistema_de_ficheros", id1);
                await commonData.db.delete("Sistema_de_ficheros", id2);
                await commonData.db.delete("Sistema_de_ficheros", id3);
                const resultado = await commonData.db.select("Sistema_de_ficheros");
                assert.equal(3, resultado.length, "Los registros eliminados no aparecen");
                await commonData.db.delete("Sistema_de_ficheros", id4);
                await commonData.db.delete("Sistema_de_ficheros", id5);
                const resultado2 = await commonData.db.select("Sistema_de_ficheros");
                assert.equal(1, resultado2.length, "Los registros eliminados no aparecen");
                done();
            } catch (error) {
                console.error(error);
                assert.equal(false, true);
            }
        }),
        () => QUnit.test("Ejemplo del README", async function(assert) {
            try {
                const done = assert.async();
                await RanasDB.Dexie.delete("My_first_database");
                const db = RanasDB.create("My_first_database", [{
                    users: "++id,&name,password,&email,created_at,updated_at,picture_profile,personal_data,description",
                    groups: "++id,&name,administrator,description,details,tags,created_at,updated_at",
                    permissions: "++id,&name,description,details,tags,created_at,updated_at",
                }, {
                    permissions_of_user: "++id,id_user -> users.id,id_permission -> permissions.id",
                    permissions_of_group: "++id,id_group -> groups.id,id_permission -> permissions.id",
                    groups_of_user: "++id,id_user -> users.id,id_group -> groups.id",
                }]);
                await db.initialize();
                const userId1 = await db.insert("users", { name: "user1", password: "x", email: "user1@domain.com", });
                const userId2 = await db.insert("users", { name: "user2", password: "x", email: "user2@domain.com", });
                const userId3 = await db.insert("users", { name: "user3", password: "x", email: "user3@domain.com", });
                const userId4 = await db.insert("users", { name: "user4", password: "x", email: "user4@domain.com", });
                const allUsers = await db.select("users");
                const userId1mod = await db.update("users", userId1, { name: "user1mod" });
                const userId2mod = await db.update("users", userId2, { name: "user2mod" });
                const userId3mod = await db.update("users", userId3, { name: "user3mod" });
                const userId4mod = await db.update("users", userId4, { name: "user4mod" });
                const userId4del = await db.delete("users", userId4, { name: "user4mod" });
                const allUsers2 = await db.select("users");
                assert.equal(true, Array.isArray(allUsers), "El select retorna un array (1)");
                assert.equal(4, allUsers.length, "El select retorna todos los elementos (1)");
                assert.equal(true, Array.isArray(allUsers2), "El select retorna un array (2)");
                assert.equal(3, allUsers2.length, "El select retorna todos los elementos (2)");
                assert.equal("user1", allUsers[0].name, "El update permite modificar valores");
                assert.equal("user1mod", allUsers2[0].name, "El update permite modificar valores");
                done();
            } catch (error) {
                console.error(error);
                assert.equal(false, true);
            }
        }),
        () => QUnit.test("Ejemplo 2 del README", async function(assert) {
            try {
                console.log(RanasDB);
                const done = assert.async();
                await new Promise(ok => {
                    setTimeout(() => ok(), 1000 * 3);
                });
                await RanasDB.dropDatabaseIfExists("My_first_database");
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
                assert.equal(true, Array.isArray(allUsers), "Los registros parece que se pueden seleccionar");
                assert.equal(2, allUsers.length, "Los registros parece que se pueden insertar y borrar");
                assert.equal("user X modified!", allUsers[0].name, "Los registros parece que se pueden actualizar");
                if(allUsers.length !== 2) {
                    throw new Error("Users count should be 2, not " + allUsers.length);
                }
                done();
            } catch (error) {
                console.error(error);
                assert.equal(false, true);
            }
        })
    ];
    (async () => {
        for(let index = 0; index < testsFns.length; index++) {
            let testFn = testsFns[index];
            testFn();
            // await new Promise((ok, fail) => { setTimeout(ok, 1000) });
        }
    })();
});