# The Play-By-Forum Frontend (Under VueJS)

This is the fronted for a forums framework geared toward play-by-post tabletop games. It is designed to work over REST with a backend server to handle database calls and user authentication, which is not included here. This project is built under the VueJS component framework, and therefore requires npm. The instructions for installing and building the project are below.



## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



This web application communicates with a backend that it searches for on its same domain with the port 3000, and expects to authenticate with it using cookies. Since it makes all of its calls using ajax run from client-side, the backend must also have its port exposed to the client. For this same reason, running this site under https does not protect authentication data; it will only supress browser warnings. The backend connection must be running under https in order for the data to be encrypted properly, but the frontend has to be edited to try an https connection at this point. 
