'use strict';
// import * as functions from 'firebase-functions';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


 
// Listens for new messages added to /messages/{chatGroup}/{pushId} and send notification to user
exports.sendMessegeNotification = functions.database.ref('/messages/{chatGroup}/{pushId}')
    .onCreate((snapshot, context) => { 

      // Grab the current value of what was written to the Realtime Database.
      const messageObj = snapshot.val(); 
      //fetch user id which we have to send notification
      admin.database().ref('users/' + messageObj.from).once('value', (snapshot2) => {
        const user_info = snapshot2.val();
        // check user details in firebase console
        console.log('user_info', user_info);


          // This registration token comes from the client FCM SDKs.
          var registrationToken = user_info.FCMToken;

          //Create message object for notificatio
          var message = {
            data: { 
              score: '850',
              time: '2:45'
            },
            notification: {
              title: "Message from: " + messageObj.by,
              body: messageObj.message
            } 
          };

          // Send a message to the device corresponding to the provided
          // registration token.
          admin.messaging().sendToDevice(registrationToken, message)
          .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
          })
          .catch((error) => {
            console.log('Error sending message:', error);
          });
     }); 
}); 
	