const express = require ('express');
const app = express();
const PORT = 8080;
const {engine} = require('express-handlebars');
const productos = require ('./routes/productos');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('handlebars', engine());
app.set('view engine','handlebars');
app.set('views','./views');

app.get('/',(req,res) => {

    res.render('datos');
})
app.use('/api/',productos);

// app.get('/',(req,res)=>{
//     res.sendFile(__dirname + '/public/index.html');
// })

app.listen(PORT, () => {
    console.log(`Server runnning on port ${PORT}`);
});