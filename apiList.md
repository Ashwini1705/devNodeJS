authRouter

- POST /login
- POST /logout
- POST /signup

profileRouter

- GET profile/view
- PATCH profile/edit
- PATCH profile/password

connectionRequestRouter

- POST /request/send/ignore/:userID
- POST /request/send/intrested/:userID
- POST /request/view/accepted/:reqID
- POST /request/view/rejected/:reqID

userRouter

- GET /user/connections
- GET /user/requests
- GET /user/feed

/feed?page=1&limit=10 => 1-10 =>skip(0) limit(10)
/feed?page=2&limit=20 => 11-20 =>skip(10) limit(10)
/feed?page=3&limit=30 => 21-30 =>skip(20) limit(10)

skip = (page-1)\*limit
