const Property = require('../models/PropertyModel');
const ProPertyTent = require('../models/PropertyTenantModel');
const User = require('../models/UserModel');
const mailgun = require("mailgun-js");
const { get } = require('mongoose');

const PropertyCreate = async (req, res, next) => {
    try {
        const Id = req.id
        const user = await User.findById(Id);
        if (user?.usertype === 'landlord') {

            const newProperty = new Property({
                username: req.body.username,
                userid: user._id,
                location: req.body.location,
                rent: req.body.rent,
                date: req.body.date,
                description: req.body.description,
                bedroom: req.body.bedroom,
                bathroom: req.body.bathroom,
                area: req.body.area,
                images: req.body.images,
            });
            const savedProperty = await newProperty.save();
            res.send({
                message: "Your Data Saved Successfully",
                status: 200,
                data: savedProperty
            })
        } else {
            res.send({
                message: "Permission Denied",
                status: 422
            })
        }

    } catch (err) {
        res.send({
            message: "Data Not Saved",
            status: 404
        })
    }
}

const SendAttachment = async (req, res, next) => {
    try {
        const property_id = req.body.property_id;
        const filename = req.file.path;
        const files = `${filename}`.replace("public", "");
        const DataAdd = {
            attachment: files,
        }
        const addAttachment = Property.findByIdAndUpdate(property_id, DataAdd).then(function (data, err) {
            if (data) {
                res.json({ message: "Attachment Successfully Uploaded", status: 200 });
            }
            else {
                res.json({ message: "Attachment Not Uploaded", status: 404 });
            }
        });
    } catch (err) {
        res.send({
            message: "Attachment Not Added",
            status: 404,
        })
    }
}

const PropertyUpdate = async (req, res, next) => {
    try {
        const property_id = req?.body?.propertyid;
        const Datatoupdate = {
            username: req?.body?.username,
            location: req?.body?.location,
            rent: req?.body?.rent,
            date: req?.body?.date,
            description: req?.body?.description,
            bedroom: req?.body?.bedroom,
            bathroom: req?.body?.bathroom,
            area: req?.body?.area,
            images: req?.body?.images
        }
        const UpdatedData = await Property.findByIdAndUpdate(property_id, Datatoupdate).then(function (data, err) {
            if (data) {
                res.json({ message: "Property Successfully Updated", status: 200 });
            }
            else {
                res.json({ message: "Property Not Updated", status: 404 });
            }
        });
        next();
    } catch (err) {
        res.send({
            message: `User Not Updated ${err}`,
            status: 404
        })
    }
}

const GetProperties = async (req, res, next) => {
    try {
        const Id = req.id;
        const userProperties = await Property.find({ userid: Id });
        if (userProperties) {
            res.send({
                status: 200,
                data: userProperties
            });
        } else {
            res.send({
                message: "Data Not Found",
                status: 404
            })
        }
    } catch (err) {
        res.json({
            message: err,
            status: 503
        })
    }
}

const Properties_Details = async (req, res, next) => {
    const Id = req.params.pid;
    
    const Pro_Details = await Property.find({ _id: Id });
    const prop_data = Pro_Details.map(data => data._id.toString())
    
    const Property_details = await ProPertyTent
    .find({property_id : prop_data})
    .populate({path:'userid' , select:'_id username image'} )
    .populate({path:'property_id' , select:' description location -_id bedroom bathroom area rent'});

    const totals = Property_details.map(data => data?.userid)
    console.log(totals)

    res.send({
        total:`Total No of Users ${totals.length}`,
        message:"Data Fetch Successfully",
        status:200,
        data: Property_details
    })


}
module.exports = {
    PropertyCreate,
    PropertyUpdate,
    GetProperties,
    SendAttachment,
    Properties_Details
}


