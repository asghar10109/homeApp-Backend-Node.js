const Maintenance = require('../models/MaintenanceModel');
const Property = require('../models/PropertyModel');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const CreateMaintenance = async (req,res,next) => {
    try{
        const property_id = req.body.propertyid;
        const Id = req.id;
        console.log('PropertyId'+req.body.propertyid);
        console.log('UserID'+Id);
        const user = await User.findById(Id);
        const property = await Property.findById(property_id);
        if(user?.usertype == 'tenant'){
            if(property){
                const Add_Maintenance = new Maintenance({
                    propertyid: property._id,
                    userid: user._id,
                    title: req.body.title,
                    description:req.body.description
                });
                const savedMaintenance = await Add_Maintenance.save();
                res.send({
                    message: "Your Data Saved Successfully",
                    status: 200,
                    data: savedMaintenance
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

const GetAllMaintenance = async (req,res,next) => {
    const Id = req.id;
    const data = await Maintenance.find({userid: Id});
    res.send({
        message: `${data.length} Record Found of Teant`,
        status:200,
        data: data
    })
}

const GetSpecficTenant = async (req,res,next) => {
    const tenantid = req.params.id;
    const Id = req.id;
    
    const PropertyData = await Maintenance.find({propertyid : tenantid , userid : Id}).populate('userid')
    
   
     PropertyData.map(data => {
      return  res.send({
            message: `Record Found for ${data.userid.username}`,
            status:200,
            data: data
        })
     })
}

module.exports = {
    CreateMaintenance,
    GetAllMaintenance,
    GetSpecficTenant
}
