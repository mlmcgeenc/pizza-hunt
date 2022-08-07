// create a variuable to hold the database connection
let db;
// establish a connection to IndexedDb database called 'pizza_hint' and set it to version 1
const request = indexedDB.open('pizza_hunt', 1);

// this event will emit if the database version changes (nonexistant to v1, v1 to v2, ect)
request.onupgradeneeded = function (event) {
	// save a reference to the database
	const db = event.target.result;
	// create an object store (table) called 'new_pizza', set it to have an auto incrementing primary key
	db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon a successful
request.onsuccess = function (event) {
	// when db is created with its object store (from onupgradeneeded event above) or simply established a conection, save a reference to db in global variable
	db = event.target.result;

	// check if app is onlein, if yes run uploadPizza() functiont o send all local db data to api
	if (navigator.online) {
		uploadPizza();
	}
};

request.onerror = function (event) {
	console.log(event.target.errorCode);
};

// this fucntion will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
	// open a new transaction with the database with read and write permissions
	const transaction = db.transaction(['new_pizza'], 'readwrite');

	// access the object store for 'new_pizza'
	const pizzaObjectStore = transaction.objectStore('new_pizza');

	// add record to your store with add method
	pizzaObjectStore.add(record);
}

function uploadPizza() {
	// open a transaction on the db
	const transaction = db.transaction(['new_pizza'], 'readwrite');

	// access your object store
	const pizzaObjectStore = transaction.objectStore('new_pizza');

	// get all records from store and set to a variable
	const getAll = pizzaObjectStore.getAll();
	// on a successful .getAll() execution the following function will run
	getAll.onsuccess = function () {
		// if there was data in indexedDB's store send it to the api server
		if (getAll.result.length > 0) {
			fetch('/api/pizzas', {
				method: 'POST',
				body: JSON.stringify(getAll.result),
				headers: {
					Accept: 'apppliaction/json, text/plain, */*',
					'Content-Type': 'application/json',
				},
			})
				.then((response) => response.json())
				.then((serverResponse) => {
					if (serverResponse.message) {
						throw new Error(serverResponse);
					}
					// open one more transaction
					const transaction = db.transaction(['new_pizza'], 'readwrite');
					// access the new_pizza object store
					const pizzaObjectStore = transaction.objectStore('new_pizza');
					// clear all items in your store
					pizzaObjectStore.clear();

					alert('All saved pizza has been submitted!');
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};
}

// listen for app coming back online
window.addEventListener('online', uploadPizza);
