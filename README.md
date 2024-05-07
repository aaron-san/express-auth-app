## Project Setup

Generate an Express template with EJS engine support:

```shell
express -e express-auth-app
```

See express CLI options:

```shell
express -h
```

## app.use(passport.session())

Passport is authentication middleware for Node.
It doesn't dictate how to authenticate, it's only boilerplate code.
You can use Passport to authenticate users stored in a Mongo database.
Passport supports authentication providers like Facebook, Google, X, and more.
Middleware that will restore login state from a session.

Web applications typically use sessions to maintain login state between requests. For example, a user will authenticate by entering credentials into a form which is submitted to the server. If the credentials are valid, a login session is established by setting a cookie containing a session identifier in the user's web browser. The web browser will send this cookie in subsequent requests to the server, allowing a session to be maintained.

If sessions are being utilized, and a login session has been established, this middleware will populate req.user with the current user.

Note that sessions are not strictly required for Passport to operate. However, as a general rule, most web applications will make use of sessions. An exception to this rule would be an API server, which expects each HTTP request to provide credentials in an Authorization header.

## Pages / Views

- Landing page
- Log in
- Log out
- Profile page
- Sign up
- Edit profile

## MongoDB

Enter Mongo shell:

```shell
mongo
```

In mongo shell:

"show dbs"
"use <db>"
"db.<collection>.find()"

Even if I drop a database, mongoose and mongodb will recreate it automatically
"use users"
"db.dropDatabase()"
