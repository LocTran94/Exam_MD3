const connection = require('../model/connection');
connection.connected();

class ProductService {
    findAll() {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query('select * from product1 p join category c on p.idCategory = c.idCategory', (err, products) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(products)
                }
            })
        })
    }

    save(product1) {
        console.log(product1)
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`insert into product1( nameProduct,price, color, idCategory)
                           values ( '${product1.name}' ,${product1.price},'${product1.description}',${product1.idCategory}
                                  )`, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('Tạo Thành công')
                }
            })
        })
    }

    remove(id) {

        let connect = connection.getConnection();
        let sql = `delete
                   from product1
                   where idProduct = ${id}`;
        return new Promise((resolve, reject) => {
            connect.query(sql, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('Thành công')
                }
            })
        })
    }

    edit(product, idProduct){


        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`UPDATE post SET nameProduct = '${product.name}',idPost = ${product.price} ,mota = '${product.description}' WHERE idProduct = ${idProduct}`,(err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    }


    findByName(name) {

        let connect = connection.getConnection();
        let sql = `select *
                   from product1 p
                            join category c on c.idCategory = p.idCategory
                   where nameProduct like '%${name}%'`;
        return new Promise((resolve, reject) => {
            connect.query(sql, (err, list) => {
                if (err) {
                    reject(err)
                } else {
                    console.log('Success');
                    resolve(list);
                }
            })
        })
    }

    findByPrice(price) {

        let connect = connection.getConnection();
        let sql = `select *
                   from product1 p
                            join category c on c.idCategory = p.idCategory
                   where price like ${price}`;
        return new Promise((resolve, reject) => {
            connect.query(sql, (err, list) => {
                if (err) {
                    reject(err)
                } else {
                    console.log('Success');
                    resolve(list);
                }
            })
        })
    }


}

const productService = new ProductService();
module.exports = productService;