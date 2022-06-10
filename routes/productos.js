const fs = require('fs');
const router = require('express').Router();

class Contenedor {
    static id = 0;
    productos = [];
    constructor(fileName) {
        this.fileName = fileName
    }
    async save(producto) {
        try {
            const productList = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'));

            if (productList.length <= 0) {
                Contenedor.id = 1;
            } else {
                this.productos = productList;
                Contenedor.id++;
                Contenedor.id = productList.length + 1;
            }

            producto.id = Contenedor.id;

            this.productos.push(producto);

        } catch (err) {
            console.log(err);
        }
        try {
            await fs.promises.writeFile(this.fileName, JSON.stringify(this.productos, null, 2));
        } catch (err) {
            console.log(err);
        }
        return Contenedor.id;
    }
    async getById(id) {

        try {
            const products = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'));
            const result = products.find(e => e.id === id);

            if (result === undefined) {
                const e = 'El ID ingresado no corresponde a un producto';
                return e;
            } else {
                console.log(result);
                return result;
            }
        } catch (err) {
            console.log(err);
        }
    }
    async getAll() {
        try {
            const productList = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'));
            console.log(productList);
            return productList;
        } catch (err) {
            console.log(err);
        }
    }
    async deleteById(id) {
        try {
            const products = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'));
            const deleteId = products.find(e => e.id === id);
            const result = products.filter(e => e.id != deleteId.id)
            Contenedor.productos = result;
            await fs.promises.writeFile(this.fileName, JSON.stringify(Contenedor.productos, null, 2));
        } catch (err) {
            console.log(err);
        }
    }
    async deleteAll() {
        Contenedor.productos = [];
        await fs.promises.writeFile(this.fileName, JSON.stringify(Contenedor.productos, null, 2));
    }
    async getRandom() {
        const products = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'));
        const randomElement = products[Math.floor(Math.random() * products.length)];
        console.log(randomElement);
        return randomElement;
    }
    async modify(product, idChange) {
        try {
            const productList = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'));
            const result = productList.find(e => e.id === idChange);
            console.log(result);
            if (result === undefined) {
                console.log('El ID ingresado no corresponde a un producto');
            } else {
                product.id = idChange;
                const index = productList.indexOf(result);
                console.log(index);
                productList.splice(index, 1, product);
                this.productos = productList;
                try {
                    await fs.promises.writeFile(this.fileName, JSON.stringify(this.productos, null, 2));
                } catch (err) {
                    console.log(err);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
}

const productos = new Contenedor('products.txt');

router.get('/productos', async (req, res) => {
    let list  = await productos.getAll();
    console.log(list);
    res.render('getProducts',{list});
});
router.get('/productos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    let product = await productos.getById(id);
    res.status(200).send(product);
});
router.post('/', async (req, res) => {
    const {
        nombre,
        precio,
        foto
    } = req.body;
    let product = ({
        nombre,
        precio,
        foto
    });
    await productos.save(product);
    res.render('datos',product)
})
router.put('/productos/:id', async (req, res) => {
    const idChange = parseInt(req.params.id);
    const {
        nombre,
        precio,
        foto,
    } = req.body;
    let product = ({
        nombre,
        precio,
        foto,
    });
    await productos.modify(product, idChange);
    res.status(200).send("Se modificó el producto");
})
router.delete('/productos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    await productos.deleteById(id);
    res.status(200).send('Se elimino correctamente')
})

module.exports = router;