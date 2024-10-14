// Firebase configuration
const firebaseConfig = {
        apiKey: "AIzaSyDSHecktNa1HtDfIQiQuYYLW0N5DPLdozk",
        authDomain: "refeed-b0591.firebaseapp.com",
        projectId: "refeed-b0591",
        storageBucket: "refeed-b0591.appspot.com",
        messagingSenderId: "324722929292",
        appId: "1:324722929292:web:ea3afbbc29b0e0632d15a9",
        measurementId: "G-7LX1N3PKX8"
};

// Initialize Firestore
const db = firebase.firestore();

// Fetch and display restaurants
function fetchRestaurants() {
    db.collection("restaurants").where("rating", ">=", 2.5).get().then((querySnapshot) => {
        let restaurantList = '';
        querySnapshot.forEach((doc) => {
            const restaurant = doc.data();
            restaurantList += `<div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${restaurant.name} (Rating: ${restaurant.rating})</h5>
                    <button class="btn btn-primary" onclick="orderFood('${doc.id}')">Order Food</button>
                </div>
            </div>`;
        });
        document.getElementById('restaurantList').innerHTML = restaurantList;
    });
}

window.onload = fetchRestaurants;

// Order function
document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const restaurantName = document.getElementById('restaurantName').value;
    const foodItem = document.getElementById('foodItem').value;
    const quantity = document.getElementById('quantity').value;

    // Store order in Firestore (create an "orders" collection)
    db.collection("orders").add({
        restaurantName: restaurantName,
        foodItem: foodItem,
        quantity: quantity,
        userId: firebase.auth().currentUser.uid
    }).then(() => {
        alert('Order placed successfully!');
        // Redirect to another page or clear form
    }).catch((error) => {
        alert(error.message);
    });
});

// Rating function
document.getElementById('ratingForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const restaurantId = document.getElementById('restaurantId').value;
    const rating = parseInt(document.getElementById('rating').value);

    // Update restaurant rating in Firestore
    const restaurantRef = db.collection("restaurants").doc(restaurantId);
    restaurantRef.get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            const newRating = (data.rating + rating) / 2; // Simple average calculation
            restaurantRef.update({ rating: newRating });
            alert('Rating submitted successfully!');
        } else {
            alert('Restaurant not found!');
        }
    }).catch((error) => {
        alert(error.message);
    });
});



// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Login function
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Redirect to the main page or order page after successful login
            window.location.href = 'index.html';
        })
        .catch((error) => {
            alert(error.message);
        });
});
