const PropertyTenant = require('../models/PropertyTenantModel');
const Property = require('../models/PropertyModel');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const AddTenant = async (req,res,next) => {
    try{
        const property_id = req.body.property_id;
        const user = await User.findById(req.body.tenant_id);
        console.log(req.body.property_id);
        const property = await Property.findById(property_id);
        if(user){
            if(property){
                const Add_Tenant = new PropertyTenant({
                    property_id: property._id,
                    userid: user._id,
                    date:req.body.date
                });
                const savedTenant = await Add_Tenant.save();
                res.send({
                    message: "Your Data Saved Successfully",
                    status: 200,
                    data: savedTenant
                })
            }else{
                res.send({
                    message: "Property Not Found",
                    status: 404
                });
            }
        }else{
            res.send({
                message: "Permission Denied",
                status: 422
            })
        }
    }catch(err){
        res.send({
            message: "Data Not Saved",
            status: 404
        })
    }
}

module.exports = {
    AddTenant
}


