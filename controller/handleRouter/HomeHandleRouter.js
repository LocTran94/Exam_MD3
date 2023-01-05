const fs = require('fs');
const productService = require('../../service/productService');
const categoryService = require('../../service/categoryService');
const qs = require('qs');


class HomeHandleRouter {
    static getHomeHtml(homeHtml, product) {
        let tbody = '';
        product.map((product, index) => {
            tbody += `
                    <tr>
                    <td>${index + 1}</td>
                    <td>${product.nameProduct}</td>
                    <td>${product.price}</td>
                    <td>${product.color}</td>
                    <td>${product.idCategory}</td>
                    <td><a href="/edit/${product.idProduct}"><button style="background-color: green; color: white">sua</button></a></td>
                    <td><a href="/delete/${product.idProduct}"><button style="background-color: red; color: white">Xoa</button></a></td>
                </tr>
                    `
        })
        homeHtml = homeHtml.replace('{products}', tbody);
        return homeHtml;
    }

    showHome(req, res) {

        if (req.method === 'GET') {
            fs.readFile('./views/home.html', 'utf-8', async (err, homeHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    let product = await productService.findAll();
                    homeHtml = HomeHandleRouter.getHomeHtml( homeHtml , product)
                    res.writeHead(200, 'text/html');
                    res.write(homeHtml);
                    res.end();
                }
            })
        } else {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    let search = qs.parse(data);
                    fs.readFile('./views/home.html', "utf-8", async (err, indexHtml) => {
                        if (err) {
                            console.log(err)
                        } else {
                            let list = await productService.findByName(search.search);


                            indexHtml = HomeHandleRouter.getHomeHtml(indexHtml,list)
                            res.writeHead(200, {'location': '/home'});
                            res.write(indexHtml);
                            res.end();
                        }
                    })

                }
            })
        }



    }

    createProduct(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/create.html', 'utf-8', async (err, createHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    res.writeHead(200, 'text/html');
                    let categories = await categoryService.findAll();
                    let options = ''
                    categories.map(category => {
                        options += `
                        <option value=${category.idCategory}>${category.mota}</option>
                        `
                    })
                    createHtml = createHtml.replace('{categories}', options)
                    console.log(categories)
                    res.write(createHtml);
                    res.end();
                }
            })
        } else {
            let data = ''
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    const product = qs.parse(data);
                    console.log(product)
                    const mess = await productService.save(product);
                    console.log(mess)
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }

    async deleteProduct(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/delete.html', 'utf-8', (err, deleteHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    res.writeHead(200, 'text/html');
                    deleteHtml = deleteHtml.replace('{id}', id);
                    res.write(deleteHtml);
                    res.end();
                }
            })
        } else {
            await productService.remove(id)
            res.writeHead(301, {'location': '/home'});
            res.end();
        }
    }

    edit(req, res, idProduct) {
        if (req.method === 'GET') {
            fs.readFile('./views/err/edit.html', 'utf-8', async (err, editHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    let categories = await categoryService.findAll();
                    console.log(categories)
                    let options = ''
                    categories.map(category => {
                        options += `
                        <option value=${category.idCategory}>${category.mota}</option>
                        `
                    })
                    editHtml = editHtml.replace('{categories}', options);
                    editHtml = editHtml.replace('{idProduct}', idProduct);
                    res.writeHead(200, 'text/html');
                    res.write(editHtml);
                    res.end();
                }
            })
        } else {
            let data = '';
            req.on('data', chuck => {
                data += chuck;
            })
            req.on('end', async (err) => {
                if (err) {
                    console.log(err)
                } else {

                    let product = qs.parse(data);
                    await productService.edit(product, idProduct)
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }



}

module.exports = new HomeHandleRouter();