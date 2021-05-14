const express = require('express');
const path = require('path');

const app = express();

//enforce https;

// app.use((req, res, next) => {
//   if (process.env.NODE_ENV === 'production') {
//     if (req.headers.host === 'your-host.com')
//       return res.redirect(301, 'https://your-host.com/');
//     if (req.headers['x-forwarded-proto'] !== 'https')
//       return res.redirect('https://' + req.headers.host + req.url);
//     else
//       return next();
//   } else
//     return next();
// });

app.use(express.static(__dirname + '/dist/rm11-ui'));

app.get('/*', function (req, res) {

  res.sendFile(path.join(__dirname + '/dist/rm11-ui/index.html'));
});

app.listen(process.env.PORT || 4500);

console.log('App listening on', process.env.PORT || 4500);
