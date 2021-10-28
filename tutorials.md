## Add header
- Login to appropriate account
- Extract the value of `accessToken` in response of login request
- Add Authorization header in tab `HTTP Headers` on graphql page.
```
{
  "Authorization": "Bearer access_token_here"
}
```
## Create admin user
```
mutation {
  createUser(createUserInput: {
    username: "hongtt"
    password: "123456"
  }) {
    id
    username
    password
    createdAt
    updatedAt
  }
}
```
## Admin login
```
mutation {
  login (loginInput: {
    username: "hongtt"
    password: "123456"
  })
 {
    username
    accessToken
    expiredIn
  }
}
```
## Event (create, update, delete, read)
#### Prerequisites
Admin login
#### Create
- gcsBucket is the path to the folder on cloud storage that contains photos of that event. For example: `test1/`
- Create a new folder on cloud storage for your new event https://console.cloud.google.com/storage/browser/face-finder-storage;tab=objects?forceOnBucketsSortingFiltering=false&authuser=1&hl=EN&project=face-finder-318218&prefix=&forceOnObjectsSortingFiltering=false
- Add photos to the event's folder
```
mutation {
  createEvent(createEventInput: {
    name: "event test"
    startTime: "2021-07-28T00:00:00Z"
    endTime: "2021-07-30T08:00:00Z"
    gcsBucket: "test/"
  }) {
    id
    startTime
    endTime
    name
    createdAt
    updatedAt
  }
}
```
- After an event is created, a background job will be triggered to classify photos in the event's gallery (detect who (consumers in system) is present in photos)

#### Update
```
mutation {
  updateEvent(updateEventInput: {
    id: 1
    gcsBucket: "test"
  }) {
    gcsBucket
  }
}
```
#### Delete
```
mutation {
  removeEvent(id: 1) {
    name
  }
}
```
#### Read
```
query {
  events {
   id
   gcsBucket
  }
}
```
## Partners
#### Prerequisites
Admin login
#### Create
```
mutation {
  createPartner(createPartnerInput: {
    name: "partner 1"
    email: "abc@coook.com"
  }) {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```
#### Sponsor event
```
mutation {
   sponsorEvent(partnerId: 1, eventId: 1)
   {
     id
     event {
       name
       startTime
       endTime
     }
   }
 }
```
#### Remove sponsorship 
Get `id` of sponsorship in the response of sponsor request
```
mutation {
   removeEventPartner(id: 2) 
 }
```
## Questions
#### Prerequisites
Admin login
#### Create
```
mutation {
   createQuestion(createQuestionInput: {
     content: "How tall are you?"
   }) {
     content
     createdAt
     updatedAt
   }
 }
```
#### Partner's question
Admin add/remove questions which partners want to ask consumers
```
mutation {
   specifyPartnerQuestion(partnerId: 1, questionId: 2) {
     id
     partner {
       name
     }
     question{
       content
     }
   }
 }
mutation {
   removePartnerQuestion(id: 4)
}
```
## Consumer
#### Prerequisites
Consumer create an account/login:
- If an existing consumer, validate the selfie input 
- If a new consumer, upload selfie input to Compreface server; create an account for the new consumer; trigger a background job to classify photos in all events for this new consumer. 
```
curl -X POST \
   https://facefinder.dev.pga.com/graphql \
   -H 'cache-control: no-cache' \
   -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
   -H 'postman-token: 7c13262b-fd56-4e9f-3ae8-c2ea012681cb' \
   -F 'operations={ "query": "mutation ($selfie: Upload!) { verifyConsumer(email: \"jisoo@gmail.com\", selfie: $selfie) { email accessToken expiresIn } }", "variables": { "selfie": null } }' \
   -F 'map={ "0": ["variables.selfie"]}' \
   -F '0=@download (12).jpeg'
```
#### Get my (consumer) photos in a specific event
- Consumer create an account or verify his account
- Get his photos in an event
    - `similarity`: the percentage of similarity of the face in the photo and the face that consumer inputs
    - `box*`: the coordinator of the face box in the photo
    - `photo.filename`: the relative path to that photo on cloud storage 
```
query {
   myPhotosInEvent(eventId: 2) {
     id
      consumer{
       email
     }
     photo {
       filename
     }
     similarity 
     boxXMax
     boxXMin
     boxYMax
     boxYMin
   }
 }
```
#### Get events that he attended
```
query {
   myEvents {
     id
     name
   } 
 }
```
#### Consent partners
```
mutation {
   consentPartner(partnerId: 1) {
     partner {
       id
     }
     consumer {
       id
     }
   }
 }
```
#### Remove consent
```
mutation {
   removeConsentPartner(id: 1)
}
```
#### Get questions of partner
```
query {
   partners {
     id
     name
       partnerQuestions {
       question {
         id
         content
         consumerAnswers {
           consumer {
             id
             email
           }
           answer
         }
       }
     }
   }
 }
```
#### Answer questions (results of the previous request) of partner
```
mutation {
   answerQuestion(answer: "23 years old", questionId: 2) {
     consumer {
       email
     }
     question {
       content
     }
     answer
   }
 }
```
## Admin reads consumers as well as his photos in system
Admin login
```
query {
   consumers{
     id
     email
     consumerPhotos {
         photo {
             filename
             event {
                 name
             }
         }
     }
   }
 }
```
## Admin read list of consents
Admin login
```
query {
   partnersConsent {
     partner {
       id
       name
     }
     consumer {
       id
       email
     }
     question {
       id
       content
     }
     answer
   }
 }
```
## Admin gets photos of consumer C in event E
Admin login
```
query {
   consumerPhotosInEvent(eventId: 1, consumerId: 1) {
     filename
   }
 }
```
## Admin triggers emails of photos after event
```
mutation {
   triggerEmailAfterEvent(eventId: 1)
 }
```
## Background jobs
- New photo of event -> dectect faces on photo
- New event -> detect faces on photos in event's gallery
- New consumer -> classify photos of all events to get new consumer's face
