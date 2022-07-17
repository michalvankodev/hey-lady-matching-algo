# Hey lady interview solution

Attemp by [michalvankodev](https://github.com/michalvankodev) at the [interview assignment](https://github.com/mmmenglish/interview) for Hey Lady.

## Installation

There shouldn't be any other dependencies or 3rd party services to install this application.
Application uses [sqlite](https://www.sqlite.org/index.html) database which is an in-file database with restrictive feature set.

1. Clone this repository
2. `npm i` Install dependencies
3. `npx prisma migrate reset` to reset the database and seed with random data
4. `npm run dev`

## Matching algorithm

The algorith can be found in `src/server/lib/score-users.ts`

It is a basic scoring algorithm with weights.
**My focus was mostly on the simplicity of the solution** as there weren't a chance to talk with product owner on how the feature will be used.
I had many ideas of how it could be also expanded and what other data could be coming into the system but for the sake of the time required to implement it I just went with the stuff I have been able to find in the [Figma designs](https://www.figma.com/file/bS6vpOUn5G31ZbqGhEV40w/Hey-Lady!-UI-Deliverables-(Copy)?node-id=0%3A1)

Other data that could've been included:

- Location
- Common followers
- Activity time

# Bootstrap

Technology stack is bootstrapped with the [create-t3-app](https://github.com/t3-oss/create-t3-app)
This is an app bootstrapped according to the [init.tips](https://init.tips) stack, also known as the T3-Stack.
