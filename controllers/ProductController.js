var Product = require('../models/Product');

exports.add_product = (req,res)=>{
    Product.findOne({product_id : req.body.product_id}, (err,product)=>{
        if(err)
        {
            return res.json({
                code : 1004,
                message : "Product_id' value is invailid"
            })
        }
        if(product)
        {
            return res.json({
                code : 1019,
                message : 'Product existed.'
            })
        }
        else
        {
            var newProduct = new Product(req.body);
            newProduct.save((err,prd)=>{
                if(err)
                {
                    return res.json({
                        code : 1000,
                        message : 'DB is full.'
                    })
                }
                else{
                    return res.json({
                        code : 200,
                        message : 'OK',
                        data : {
                            product_id : prd.product_id,
                            url : '/product/' + prd.product_id
                        }
                    })
                }
            })
        }
    })
}